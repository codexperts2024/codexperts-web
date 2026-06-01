'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { socialLinks } from '@/config/socialLinks'

export default function PendingPage() {
  const { user, profile, loading, signOut } = useAuth()
  const clubEntry = socialLinks.clubSignup.find(({ school }) => school === profile?.school)
  const clubUrl = clubEntry?.url ?? null
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-base">
        <span className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md text-center animate-fade-up">

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

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span className="text-xs font-medium text-warning">Pending approval</span>
        </div>

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

        {profile?.school && (
          <div className="mt-8 flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border text-left">
            <p className="text-sm text-text-secondary leading-snug">
              Did you sign up for the official club at{' '}
              <span className="text-text-primary font-medium">{profile.school}</span>?
            </p>
            {clubUrl ? (
              <a
                href={clubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                Sign Up
              </a>
            ) : (
              <button
                disabled
                title="Link coming soon"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-bg-layer1 text-text-hint cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </div>
        )}

        <p className="mt-6 text-xs text-text-hint">
          Questions? Reach us at{' '}
          <a href="mailto:codexperts2024@gmail.com" className="text-accent hover:underline">
            codexperts2024@gmail.com
          </a>
        </p>
      </div>
    </main>
  )
}
