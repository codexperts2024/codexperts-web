'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { useAuth } from '@/hooks/useAuth'
import { createProfile } from '@/services/authService'
import Button from '@/components/ui/Button'

const CAMPUSES = ['Seneca College', 'York University']

function generateCohorts() {
  const terms = ['Winter', 'Summer', 'Fall']
  const termMonths = { Winter: [1, 4], Summer: [5, 8], Fall: [9, 12] }
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const cohorts = []

  for (let year = 2024; year <= currentYear + 1; year++) {
    for (const term of terms) {
      const [start] = termMonths[term]
      if (year > currentYear) break
      if (year === currentYear && start > currentMonth + 4) break
      cohorts.push(`${term} ${year}`)
    }
  }
  return cohorts.reverse()
}

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function JoinModal() {
  const { isOpen, openModal, closeModal } = useJoinModal()
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [campus, setCampus] = useState('')
  const [cohort, setCohort] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const cohorts = generateCohorts()
  const overlayRef = useRef(null)

  const needsCompletion = !loading && user && !profile

  useEffect(() => {
    if (needsCompletion && !sessionStorage.getItem('join_modal_dismissed')) {
      openModal()
    }
  }, [needsCompletion, openModal])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setCampus('')
      setCohort('')
      setPhone('')
      setErrors({})
      setSubmitting(false)
    }
  }, [isOpen])

  function handleDismiss() {
    sessionStorage.setItem('join_modal_dismissed', '1')
    closeModal()
  }

  function validate() {
    const next = {}
    if (!campus) next.campus = 'Please select a campus'
    if (!cohort) next.cohort = 'Please select a cohort'
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) next.phone = 'Enter a valid phone number: (XXX) XXX-XXXX'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !user) return
    setSubmitting(true)

    try {
      const meta = user.user_metadata
      await createProfile({
        id: user.id,
        name: meta?.full_name ?? meta?.name ?? '',
        email: user.email,
        avatarUrl: meta?.avatar_url ?? '',
        campus,
        cohort,
        phone,
      })

      sessionStorage.removeItem('join_modal_dismissed')
      await refreshProfile()
      closeModal()
      router.push('/pending')
    } catch (err) {
      setErrors({ submit: err.message })
      setSubmitting(false)
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) handleDismiss()
  }

  if (!isOpen) return null

  const inputBase = 'w-full px-3 py-2 rounded-md border text-sm font-inter bg-bg-input text-text-primary outline-none transition-colors'
  const inputFocus = 'focus:border-accent focus:ring-1 focus:ring-accent/20'
  const inputNormal = 'border-border-strong'

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-lg p-8 shadow-xl animate-fade-up">

        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-text-hint hover:text-text-secondary transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-inter font-semibold text-lg text-text-primary mb-2">Complete your profile</h2>

        {user && (
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-medium text-text-secondary">
                {(user.email?.[0] ?? '?').toUpperCase()}
              </div>
            )}
            <span className="text-sm text-text-secondary truncate">{user.email}</span>
          </div>
        )}

        {/* Campus */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Campus</label>
          <select
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className={`${inputBase} ${inputFocus} ${errors.campus ? 'border-red-400' : inputNormal}`}
          >
            <option value="">Select your campus</option>
            {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.campus && <p className="mt-1 text-xs text-red-500">{errors.campus}</p>}
        </div>

        {/* Cohort */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Cohort <span className="text-text-hint font-normal">(when did you join?)</span></label>
          <select
            value={cohort}
            onChange={e => setCohort(e.target.value)}
            className={`${inputBase} ${inputFocus} ${errors.cohort ? 'border-red-400' : inputNormal}`}
          >
            <option value="">Select cohort</option>
            {cohorts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.cohort && <p className="mt-1 text-xs text-red-500">{errors.cohort}</p>}
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder="(416) 000-0000"
            className={`${inputBase} ${inputFocus} ${errors.phone ? 'border-red-400' : inputNormal}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : null}
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>

        {errors.submit && <p className="mt-2 text-xs text-center text-red-500">{errors.submit}</p>}
      </div>
    </div>
  )
}
