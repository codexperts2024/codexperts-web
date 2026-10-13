'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { isApprovedRole } from '@/utils/constants'
import { isDraftApplication } from '@/utils/application'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user, profile, profileError, loading, refreshProfile } = useAuth()
  const { openModal } = useJoinModal()
  useEffect(() => {
    if (loading || profileError) return
    if (!user) { router.replace('/'); return }
    sessionStorage.removeItem('join_modal_dismissed')
    if (isApprovedRole(profile?.role)) {
      const target = localStorage.getItem('auth_redirect') || '/'
      localStorage.removeItem('auth_redirect')
      router.replace(target.startsWith('/') && !target.startsWith('//') ? target : '/')
    } else if (isDraftApplication(profile)) {
      openModal()
      router.replace('/')
    } else {
      router.replace('/pending')
    }
  }, [loading, user, profile, profileError, router, openModal])
  return <main className="min-h-screen flex items-center justify-center bg-bg-base">
    {profileError ? <div role="alert" className="text-center">
      <p>Could not load your application. Please try again.</p>
      <button onClick={() => user ? refreshProfile().catch(() => {}) : window.location.reload()}>Retry</button>
      <button onClick={() => { openModal(); router.replace('/') }}>Open signup form</button>
    </div> : <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />}
  </main>
}
