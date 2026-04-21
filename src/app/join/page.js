'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/services/authService'

// No standalone /join page — triggers OAuth directly and redirects to /auth/callback.
// Will be replaced by a modal overlay in issue #20.
export default function JoinPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTo = `${window.location.origin}/auth/callback`
    signInWithGoogle(redirectTo).catch(() => router.replace('/'))
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base">
      <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </main>
  )
}
