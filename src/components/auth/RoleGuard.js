'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { ROLES, STATUS } from '@/utils/constants'

function isMemberOnlyPath(pathname) {
  return (
    pathname === '/problems' ||
    pathname.startsWith('/problems/') ||
    pathname === '/members' ||
    pathname.startsWith('/members/')
  )
}

function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function canAccessMemberRoutes(profile) {
  return profile?.role === ROLES.MEMBER || profile?.role === ROLES.ADMIN
}

const RoleGuard = ({ children }) => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/join')
      return
    }

    if (profile?.status === STATUS.PENDING) return

    if (isMemberOnlyPath(pathname) && !canAccessMemberRoutes(profile)) {
      router.replace('/')
      return
    }

    if (isAdminPath(pathname) && profile?.role !== ROLES.ADMIN) {
      router.replace('/')
    }
  }, [loading, user, profile, pathname, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (profile?.status === STATUS.PENDING) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-5xl font-bold text-gray-900">Account pending</h1>
          <p className="mt-3 text-gray-400 text-lg">
            Your account is waiting for admin approval.
          </p>
          <p className="mt-4 text-gray-500 text-base">
            After you sign up, an admin reviews your request. Once approved, you
            can use member areas like Problems and Members.
          </p>
        </div>
      </main>
    )
  }

  if (isMemberOnlyPath(pathname) && !canAccessMemberRoutes(profile)) {
    return null
  }

  if (isAdminPath(pathname) && profile?.role !== ROLES.ADMIN) {
    return null
  }

  return <>{children}</>
}

export default RoleGuard
