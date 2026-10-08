'use client'

import SwitchAccountButton from '@/components/auth/SwitchAccountButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { isDraftApplication } from '@/utils/application'
import { isApprovedRole } from '@/utils/constants'
import { socialLinks } from '@/config/socialLinks'

export default function PendingPage() {
  const { user, profile, loading, profileError, refreshProfile, signOut } = useAuth()
  const { openModal } = useJoinModal()
  const clubEntry = socialLinks.clubSignup.find(({ school }) => school === profile?.school)
  const clubUrl = clubEntry?.url ?? null
  const router = useRouter()
  const draft = isDraftApplication(profile)
  const rejected = profile?.application_status === 'rejected'

  useEffect(() => {
    if (!loading && isApprovedRole(profile?.role)) router.replace('/')
    if (!loading && !user) {
      router.replace('/')
    }
  }, [loading, user, profile, router])

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

        <h1 className="font-montserrat font-bold text-2xl text-text-primary">{profileError ? 'Unable to load application' : draft ? 'Complete your application' : rejected ? 'Application not approved' : 'Application received'}</h1>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
          {profileError ? 'Please retry. We have not changed your saved application.' : draft ? 'Your application has not been submitted. Complete the signup form to request membership.' : rejected ? 'Review the reason below, update your information, and submit a new application.' : 'Your application has been submitted and is awaiting review.'}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span className="text-xs font-medium text-warning">{profileError ? 'Status unavailable' : draft ? 'Not submitted' : rejected ? 'Not approved' : 'Pending approval'}</span>
        </div>

        {rejected && !profileError && (
          <div className="mt-6 rounded-lg border border-error/30 p-4 text-left" role="status">
            <h2 className="font-semibold text-sm">Reason for rejection</h2>
            <p className="mt-2 text-sm whitespace-pre-wrap break-words">
              {profile.rejection_details_error
                ? 'Could not load the decision details. Please retry.'
                : profile.rejection_reason || 'No reason was recorded for this earlier decision. Please contact the club.'}
            </p>
            <p className="mt-3 text-xs text-text-hint">
              {profile.rejected_at
                ? `Rejected on ${new Date(profile.rejected_at).toLocaleString()}`
                : profile.rejection_details_error ? '' : 'Rejection date was not recorded.'}
            </p>
            {profile.rejection_details_error && <button className="mt-2 text-sm text-accent underline"
              onClick={() => refreshProfile().catch(() => {})}>Retry decision details</button>}
          </div>
        )}

        {!draft && !profileError && profile && (
          <dl className="mt-6 text-sm text-left border border-border rounded-lg p-4 space-y-2">
            <div><dt className="text-text-hint">Name</dt><dd>{[profile.first_name, profile.last_name].filter(Boolean).join(' ')}</dd></div>
            <div><dt className="text-text-hint">School / Major</dt><dd>{profile.school} · {profile.major || 'Not provided'}</dd></div>
            <div><dt className="text-text-hint">Phone</dt><dd>{profile.phone || 'Not provided'}</dd></div>
            <div><dt className="text-text-hint">Discord participation</dt><dd>{profile.discord_joined ? 'Joined (self-reported)' : 'Not confirmed — you can join and update your application.'}</dd></div>
          </dl>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {profileError && <button onClick={() => refreshProfile().catch(() => {})}>Retry loading</button>}
          {<button
            onClick={openModal}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover active:scale-[0.98] transition-all duration-150"
          >
            {rejected ? 'Edit and reapply' : draft ? 'Complete signup' : 'Edit My Application'}
          </button>}
          <SwitchAccountButton />
          <button
            onClick={signOut}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:bg-bg-surface active:scale-[0.98] transition-all duration-150"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:bg-bg-surface transition-colors text-center"
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
