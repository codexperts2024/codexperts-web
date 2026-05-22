'use client'

import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getSession, fetchProfile, signOut as authSignOut } from '@/services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // getSession, fetchProfile, supabase are stable module-level references;
  // intentionally mount-only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let initialized = false

    async function init() {
      try {
        const session = await getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          setProfile(p)
        }
      } finally {
        setLoading(false)
        initialized = true
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Skip INITIAL_SESSION — init() already handles it and setting state
        // here before init() completes causes a profile-null flash (navbar
        // buttons disappear briefly).
        if (!initialized) return
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const p = await fetchProfile(session.user.id)
            setProfile(p)
          } catch {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function refreshProfile() {
    if (user) {
      const p = await fetchProfile(user.id)
      setProfile(p)
      return p
    }
    return null
  }

  async function signOut() {
    try {
      await authSignOut()
    } catch {
      // Supabase sign-out may throw if the session is already expired;
      // always clean up client state and redirect regardless.
    }
    setUser(null)
    setProfile(null)
    sessionStorage.removeItem('join_modal_dismissed')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
