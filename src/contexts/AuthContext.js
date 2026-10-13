'use client'

import { createContext, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getSession, fetchProfile, switchGoogleAccount as authSwitchAccount, signOut as authSignOut } from '@/services/authService'
import { withTimeout } from '@/utils/withTimeout'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authAction, setAuthAction] = useState(null)
  const [authActionError, setAuthActionError] = useState('')
  const actionLock = useRef(false)
  const userIdRef = useRef(null)
  const revision = useRef(0)

  function acceptProfile(next) {
    if (next?.id !== userIdRef.current) return
    revision.current += 1
    setProfile(next)
    setProfileError('')
  }

  async function refreshProfile() {
    const id = userIdRef.current
    if (!id) return null
    const version = ++revision.current
    try {
      const next = await withTimeout(fetchProfile(id))
      if (version === revision.current && id === userIdRef.current) {
        setProfile(next)
        setProfileError('')
      }
      return next
    } catch (err) {
      if (version === revision.current) setProfileError(err.message || 'Could not load your profile. Please retry.')
      throw err
    }
  }

  useEffect(() => {
    let cancelled = false
    let sessionVersion = 0
    let timer
    sessionStorage.removeItem('oauth_pending')

    function applySession(session) {
      if (cancelled) return
      const id = session?.user?.id ?? null
      if (id !== userIdRef.current) {
        revision.current += 1
        setProfile(null)
        setProfileError('')
      }
      userIdRef.current = id
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token ?? null)
      clearTimeout(timer)
      if (!id) {
        setLoading(false)
        return
      }
      // Never await a Supabase request inside its auth event callback.
      timer = setTimeout(() => {
        refreshProfile().catch(() => {}).finally(() => {
          if (!cancelled) setLoading(false)
        })
      }, 0)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      sessionVersion += 1
      applySession(session)
    })
    const initialVersion = sessionVersion
    withTimeout(getSession()).then(session => {
      if (sessionVersion === initialVersion) applySession(session)
    }).catch(err => {
      if (!cancelled && sessionVersion === initialVersion) {
        setProfileError(err.message)
        setLoading(false)
      }
    })

    function handlePageShow(event) {
      if (!event.persisted) return
      if (sessionStorage.getItem('oauth_pending')) {
        window.location.reload()
        return
      }
      withTimeout(getSession()).then(applySession).catch(err => {
        if (!cancelled) setProfileError(err.message)
      })
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      cancelled = true
      revision.current += 1
      clearTimeout(timer)
      subscription.unsubscribe()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  async function runAuthAction(action) {
    if (actionLock.current) return false
    actionLock.current = true
    setAuthAction(action)
    setAuthActionError('')
    try {
      if (action === 'switch') await authSwitchAccount()
      else {
        await authSignOut()
        userIdRef.current = null
        revision.current += 1
        setUser(null)
        setProfile(null)
        setProfileError('')
        setAccessToken(null)
        window.location.assign('/')
      }
      return true
    } catch (error) {
      setAuthActionError(error?.message || 'Could not complete the account action. Please retry.')
      return false
    } finally {
      actionLock.current = false
      setAuthAction(null)
    }
  }
  const signOut = () => runAuthAction('signOut')
  const switchAccount = () => runAuthAction('switch')

  return (
    <AuthContext.Provider value={{ user, profile, profileError, accessToken, loading, signOut, switchAccount, authAction, authActionError, refreshProfile, acceptProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
