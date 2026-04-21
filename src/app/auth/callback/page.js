'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchProfile } from '@/services/authService'
import { ROLES } from '@/constants'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const profile = await fetchProfile(session.user.id)
      const role = profile?.role

      if (role === ROLES.MEMBER || role === ROLES.EXECUTIVE || role === ROLES.ADMIN) {
        router.replace('/')
      } else {
        // pending or brand-new user — go to pending screen
        // issue #20 will intercept new users here to show the profile completion modal
        router.replace('/pending')
      }
    }

    handleCallback()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base">
      <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </main>
  )
}
