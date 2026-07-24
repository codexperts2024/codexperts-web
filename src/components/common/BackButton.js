'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function BackButton() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/' || pathname.startsWith('/auth')) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-inter text-text-secondary hover:text-text-primary transition-colors"
      >
        ← Back
      </button>
    </div>
  )
}
