'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default function JoinPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base px-4">

      {/* Card — fade + slide up on mount */}
      <div className="w-full max-w-md animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-montserrat font-bold text-2xl text-accent tracking-tight">
            codeXperts
          </Link>
          <h1 className="mt-4 text-2xl font-montserrat font-bold text-text-primary">Join the club</h1>
          <p className="mt-2 text-sm text-text-secondary">Sign in with your school Google account to apply for membership.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-white text-text-primary text-sm font-medium hover:bg-bg-surface active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
            ) : (
              <IconGoogle />
            )}
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {error && (
            <p className="mt-4 text-xs text-center text-red-500">{error}</p>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-hint">what happens next</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Steps */}
          <ol className="space-y-3">
            {[
              'Sign in with your Google account',
              'Your application is reviewed by the team',
              'Once approved, you get full member access',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 text-center text-xs text-text-hint">
          Already a member?{' '}
          <Link href="/" className="text-accent hover:underline">Go home</Link>
        </p>
      </div>
    </main>
  )
}
