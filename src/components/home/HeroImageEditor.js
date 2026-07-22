'use client'

import { useRef, useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import { uploadImage } from '@/services/cloudinaryService'
import { supabase } from '@/lib/supabase'
import { IconEdit } from '@/components/ui/Icons'
import { HERO_ASPECT } from '@/lib/heroImage'

async function getCroppedBlob(imageSrc, pixelCrop) {
  const res = await fetch(imageSrc)
  const blob = await res.blob()
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  canvas.getContext('2d').drawImage(
    bitmap,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  )
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
}

export default function HeroImageEditor({ onUpdate }) {
  const { profile } = useAuth()
  const inputRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), [])

  if (!canAccessAdminRoutes(profile?.role)) return null

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleUpload() {
    if (!croppedAreaPixels || !imageSrc) return
    setError(null)
    setUploading(true)
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels)
      const file = new File([blob], 'hero.jpg', { type: 'image/jpeg' })
      const { url } = await uploadImage(file, 'hero')

      const { error: dbError } = await supabase
        .from('site_settings')
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq('key', 'hero_image_url')

      if (dbError) throw dbError
      onUpdate(url)
      setImageSrc(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-md transition-colors"
          title="Edit Hero Image"
        >
          <IconEdit className="w-4 h-4" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="relative flex-1">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={HERO_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="bg-black/90 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-xs font-inter">Zoom</span>
              <input
                type="range"
                min={1} max={3} step={0.05}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-32 accent-white"
              />
            </div>
            {error && <span className="text-red-400 text-xs font-inter flex-1 text-center">{error}</span>}
            <div className="flex gap-2">
              <button
                onClick={() => { setImageSrc(null); setError(null) }}
                className="px-4 py-2 text-sm font-inter text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 text-sm font-inter bg-white text-black rounded-md hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
