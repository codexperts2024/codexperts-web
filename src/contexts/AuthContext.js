'use client'

import { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getSession, fetchProfile, signOut as authSignOut } from '@/services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // getSession, fetchProfile, supabase are stable module-level references;
  // intentionally mount-only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let initialized = false

    async function init() {
      // Clear any stale OAuth flag left from a previous abandoned flow
      // (covers the full-remount case where pageshow doesn't reload).
      sessionStorage.removeItem('oauth_pending')
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

    // When the browser restores this page from bfcache (back button after
    // Google OAuth redirect), Supabase's in-memory PKCE verifier state is
    // stale, which silently blocks any subsequent login attempt.
    // If an OAuth flow was in progress, force a full reload so Supabase
    // starts fresh. Otherwise just re-sync the session into React state.
    function handlePageShow(e) {
      if (!e.persisted) return
      if (sessionStorage.getItem('oauth_pending')) {
        sessionStorage.removeItem('oauth_pending')
        window.location.reload()
        return
      }
      ;(async () => {
        try {
          const session = await getSession()
          setUser(session?.user ?? null)
          if (!session?.user) setProfile(null)
        } catch {
          setUser(null)
          setProfile(null)
        }
      })()
    }
    window.addEventListener('pageshow', handlePageShow)

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

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('pageshow', handlePageShow)
    }
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
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
