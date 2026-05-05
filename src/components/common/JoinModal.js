'use client'

import { useState, useEffect, useRef } from 'react'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { signInWithGoogle } from '@/services/authService'
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

function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".8" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" opacity=".7" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".9" />
    </svg>
  )
}

export default function JoinModal() {
  const { isOpen, closeModal } = useJoinModal()
  const [campus, setCampus] = useState('')
  const [cohort, setCohort] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const cohorts = generateCohorts()
  const overlayRef = useRef(null)

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
      setLoading(false)
    }
  }, [isOpen])

  function validate() {
    const next = {}
    if (!campus) next.campus = 'Please select a campus'
    if (!cohort) next.cohort = 'Please select a cohort'
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) next.phone = 'Enter a valid phone number: (XXX) XXX-XXXX'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)

    try {
      sessionStorage.setItem('join_campus', campus)
      sessionStorage.setItem('join_cohort', cohort)
      sessionStorage.setItem('join_phone', phone)

      await signInWithGoogle(`${window.location.origin}/auth/callback`)
    } catch (err) {
      setErrors({ submit: err.message })
      setLoading(false)
    }
  }

  async function handleLogIn() {
    closeModal()
    try {
      await signInWithGoogle(`${window.location.origin}/auth/callback`)
    } catch {
      // OAuth redirect failed
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) closeModal()
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
          onClick={closeModal}
          className="absolute top-4 right-4 text-text-hint hover:text-text-secondary transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-inter font-semibold text-lg text-text-primary mb-6">Join codeXperts</h2>

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

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <IconGoogle />
          )}
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </Button>

        {errors.submit && <p className="mt-2 text-xs text-center text-red-500">{errors.submit}</p>}

        <p className="mt-5 text-center" style={{ fontSize: 13, color: '#555555' }}>
          Already a member?{' '}
          <button
            onClick={handleLogIn}
            className="font-medium hover:underline"
            style={{ color: '#C0392B' }}
          >
            Log in →
          </button>
        </p>
      </div>
    </div>
  )
}
