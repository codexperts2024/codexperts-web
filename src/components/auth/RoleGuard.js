'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { ROLES } from '@/utils/constants'

const RoleGuard = ({ children }) => {
    const { user, profile, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!user) {
        router.push('/join')
        return null
    }

    if (profile?.status === 'pending') {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900">Account Pending</h1>
                    <p className="mt-3 text-gray-400 text-lg">Your account is waiting for admin approval.</p>
                </div>
            </main>
        )
    }

    if (pathname === '/admin' && profile?.role !== ROLES.ADMIN) {
        router.push('/')
        return null
    }

    return <>{children}</>
}

export default RoleGuard