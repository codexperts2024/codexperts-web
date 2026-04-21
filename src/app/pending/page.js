'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function PendingPage() {
  const { user, signOut } = useAuth()

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md text-center animate-fade-up">

        {/* Animated clock icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center animate-pulse-slow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-accent">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>

        <h1 className="font-montserrat font-bold text-2xl text-text-primary">Application received</h1>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
          Thanks for signing up{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Your application is under review. We'll approve you shortly.
        </p>

        {/* Status pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span className="text-xs font-medium text-warning">Pending approval</span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={signOut}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover active:scale-[0.98] transition-all duration-150"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:bg-bg-surface transition-colors"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-xs text-text-hint">
          Questions? Reach us at{' '}
          <a href="mailto:codexperts2024@gmail.com" className="text-accent hover:underline">
            codexperts2024@gmail.com
          </a>
        </p>
      </div>
    </main>
  )
}
