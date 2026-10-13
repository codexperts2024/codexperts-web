'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SwitchAccountButton from '@/components/auth/SwitchAccountButton'

export default function AccountMenu({ profileHref, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Account menu" aria-haspopup="true" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center rounded-md hover:opacity-80 transition-opacity">
        {children}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-bg-surface rounded-lg shadow-lg border border-border min-w-[200px] py-1.5">
          <Link href={profileHref} onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-layer1 transition-colors">
            My profile
          </Link>
          <SwitchAccountButton variant="menu" />
        </div>
      )}
    </div>
  )
}
