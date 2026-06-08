'use client'

import { useEffect } from 'react'
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
  const isOwnProfilePath = pathname === `/members/${user?.id}`

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/')
      return
    }

    if (profile?.role === ROLES.PENDING) {
      if (!isOwnProfilePath) router.replace('/pending')
      return
    }

    if (accessError) {
      router.replace('/')
    }
  }, [loading, user, profile, accessError, router, isOwnProfilePath])

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

  if (profile?.role === ROLES.PENDING && !isOwnProfilePath) {
    return null
  }

  if (accessError) {
    return null
  }

  return <>{children}</>
}

export default RoleGuard
