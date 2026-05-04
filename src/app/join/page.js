'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/services/authService'

export default function JoinPage() {
  const router = useRouter()

  useEffect(() => {
    signInWithGoogle(`${window.location.origin}/auth/callback`)
      .catch(() => router.replace('/'))
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base">
      <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </main>
  )
}
