'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, fetchProfile } from '@/services/authService'
import { isApprovedRole } from '@/utils/constants'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const session = await getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const profile = await fetchProfile(session.user.id)

      if (!profile) {
        router.replace('/')
        return
      }

      if (isApprovedRole(profile.role)) {
        const redirect = localStorage.getItem('auth_redirect') || '/'
        localStorage.removeItem('auth_redirect')
        router.replace(redirect)
      } else {
        router.replace('/pending')
      }
    }

    handleCallback()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base">
      <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </main>
  )
}
