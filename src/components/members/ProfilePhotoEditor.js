'use client'

import { useState } from 'react'
import { uploadImage } from '@/services/cloudinaryService'

export default function ProfilePhotoEditor({ onSaved }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function changePhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024 || !file.size) {
      setMessage('Choose a JPG, PNG or WebP image up to 5 MB.')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const { url } = await uploadImage(file, 'profiles')
      onSaved(url)
      setMessage('Profile photo saved.')
    } catch (error) {
      setMessage(error.message || 'Could not save your photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-text-secondary">
      <label className="flex flex-col gap-2">
        {uploading ? 'Saving photo…' : 'Change profile photo'}
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={changePhoto} />
      </label>
      <p className="text-xs">JPG, PNG or WebP, up to 5 MB. Your photo saves immediately.</p>
      {message && <p role="status">{message}</p>}
    </div>
  )
}
