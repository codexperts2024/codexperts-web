'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { ROLES, canAccessMemberRoutes, canAccessAdminRoutes } from '@/utils/constants'

function checkPath(pathname, actualPathname) {
  return (
    pathname === actualPathname ||
    pathname.startsWith(`${actualPathname}/`)
  )
}

function isMemberOnlyPath(pathname) {
  return (
    checkPath(pathname, '/problems') ||
    checkPath(pathname, '/solutions') ||
    checkPath(pathname, '/members')
  )
}

function isAdminPath(pathname) {
  return checkPath(pathname, '/admin')
}

function getAccessError(pathname, profile) {
  if (isMemberOnlyPath(pathname) && !canAccessMemberRoutes(profile?.role)) return 'member'
  if (isAdminPath(pathname) && !canAccessAdminRoutes(profile?.role)) return 'admin'
  return null
}

const RoleGuard = ({ children }) => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const accessError = getAccessError(pathname, profile)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/')
      return
    }

    if (profile?.role === ROLES.PENDING) return

    if (accessError) {
      router.replace('/')
    }
  }, [loading, user, profile, accessError, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isOwnProfilePath = pathname === `/members/${user?.id}`

  if (profile?.role === ROLES.PENDING && !isOwnProfilePath) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="font-montserrat font-bold text-5xl text-text-primary">Account pending</h1>
          <p className="mt-3 text-text-hint text-lg">
            Your account is waiting for admin approval.
          </p>
          <p className="mt-4 text-text-secondary text-base">
            After you sign up, an admin reviews your request. Once approved, you
            can use member areas like Problems and Members.
          </p>
          <Link
            href={`/members/${user.id}`}
            className="mt-6 inline-block px-5 py-2.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Edit My Profile
          </Link>
        </div>
      </main>
    )
  }

  if (accessError) {
    return null
  }

  return <>{children}</>
}

export default RoleGuard
