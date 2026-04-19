'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/join')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const role = profile?.role
      if (role === 'member' || role === 'admin') {
        router.replace('/')
      } else {
        router.replace('/pending')
      }
    }

    handleCallback()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4 animate-fade-up">
        <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <p className="text-sm text-text-secondary">Signing you in…</p>
      </div>
    </main>
  )
}
