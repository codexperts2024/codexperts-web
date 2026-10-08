'use client'

import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { isApprovedRole } from '@/utils/constants'
import Button from '@/components/ui/Button'

export default function JoinUsButton({ className }) {
  const { user, profile, loading } = useAuth()
  const { openModal } = useJoinModal()
  const router = useRouter()

  async function handleClick() {
    if (loading) return

    // Logged in + profile complete → go to announcements
    if (user && isApprovedRole(profile?.role)) {
      router.push('/announcements')
      return
    }

    // Logged in + profile incomplete → open join modal
    if (user && !isApprovedRole(profile?.role)) {
      openModal()
      return
    }

    // Not logged in → Google OAuth
    try {
      await signInWithGoogle(`${window.location.origin}/auth/callback`)
    } catch {
      // OAuth redirect failed silently
    }
  }

  const isLoggedIn = !loading && !!user && isApprovedRole(profile?.role)

  return (
    <Button onClick={handleClick} className={className}>
      {isLoggedIn ? 'Announcements' : 'Join Us'} <span>→</span>
    </Button>
  )
}
