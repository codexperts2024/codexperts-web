'use client'

import { useRef, useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import { uploadImage } from '@/services/cloudinaryService'
import { updateSiteSetting } from '@/services/siteSettingsService'
import { IconEdit } from '@/components/ui/Icons'

const PORTRAIT_ASPECT = 3 / 4

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
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

export default function MentorPhotoEditor({ onUpdate }) {
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
      const file = new File([blob], 'mentor.jpg', { type: 'image/jpeg' })
      const { url } = await uploadImage(file, 'mentors')
      await updateSiteSetting('mentor_photo_url', url)
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
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute top-2 right-2 z-10 bg-bg-elevated/70 hover:bg-bg-elevated text-bg-base p-2 rounded-md transition-colors"
        title="Edit mentor photo"
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

      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-bg-elevated flex flex-col">
          <div className="relative flex-1">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={PORTRAIT_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="bg-bg-elevated px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-bg-base/70 text-xs font-inter">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-bg-base"
              />
            </div>
            {error && (
              <span className="text-error text-xs font-inter flex-1 text-center">{error}</span>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageSrc(null)}
                className="px-4 py-2 text-sm font-inter text-bg-base border border-border-strong rounded-md hover:bg-bg-base/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 text-sm font-inter bg-accent text-bg-base rounded-md hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
