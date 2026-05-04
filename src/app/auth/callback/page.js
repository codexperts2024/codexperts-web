'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, fetchProfile, createProfile } from '@/services/authService'
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

      let profile = await fetchProfile(session.user.id)

      if (!profile) {
        const campus = sessionStorage.getItem('join_campus')
        const cohort = sessionStorage.getItem('join_cohort')
        const phone = sessionStorage.getItem('join_phone')

        if (campus && cohort && phone) {
          const meta = session.user.user_metadata
          profile = await createProfile({
            id: session.user.id,
            name: meta?.full_name ?? meta?.name ?? '',
            email: session.user.email,
            avatarUrl: meta?.avatar_url ?? '',
            campus,
            cohort,
            phone,
          })

          sessionStorage.removeItem('join_campus')
          sessionStorage.removeItem('join_cohort')
          sessionStorage.removeItem('join_phone')
        }
      }

      if (isApprovedRole(profile?.role)) {
        router.replace('/')
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
