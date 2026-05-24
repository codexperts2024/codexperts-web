'use client'

import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useJoinModal } from '@/contexts/JoinModalContext'
import Button from '@/components/ui/Button'

export default function JoinUsButton({ className }) {
  const { user, profile, loading } = useAuth()
  const { openModal } = useJoinModal()
  const router = useRouter()

  async function handleClick() {
    if (loading) return

    // Logged in + profile complete → go to announcements
    if (user && profile?.first_name) {
      router.push('/announcements')
      return
    }

    // Logged in + profile incomplete → open join modal
    if (user && !profile?.first_name) {
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

  const isLoggedIn = !loading && !!user && !!profile?.first_name

  return (
    <Button onClick={handleClick} className={className}>
      {isLoggedIn ? 'Announcements' : 'Join Us'} <span>→</span>
    </Button>
  )
}
