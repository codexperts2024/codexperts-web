'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useJoinModal } from '@/contexts/JoinModalContext'
import { useAuth } from '@/hooks/useAuth'
import { createProfile } from '@/services/authService'
import Button from '@/components/ui/Button'

const SCHOOLS = ['Seneca College', 'York University']

const FIRST_COHORT = { season: 'Fall', year: 2024 }
const SKIPPED_TERMS = new Set(['Summer 2025'])
const SEASON_ORDER = ['Winter', 'Summer', 'Fall']

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1: return `${n}st`
    case 2: return `${n}nd`
    case 3: return `${n}rd`
    default: return `${n}th`
  }
}

function getCurrentTerm() {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  if (month <= 4) return { season: 'Winter', year }
  if (month <= 8) return { season: 'Summer', year }
  return { season: 'Fall', year }
}

function generateCohorts() {
  const current = getCurrentTerm()
  const cohorts = []
  let { season, year } = FIRST_COHORT

  while (true) {
    const term = `${season} ${year}`
    const isCurrent = season === current.season && year === current.year

    if (!SKIPPED_TERMS.has(term)) {
      const num = cohorts.length + 1
      cohorts.push({
        value: String(num),
        label: `${ordinal(num)} Cohort (Joined ${term}${isCurrent ? ' ← now' : ''})`,
      })
    }

    if (isCurrent) break

    const idx = SEASON_ORDER.indexOf(season)
    if (idx === 2) { season = 'Winter'; year += 1 }
    else season = SEASON_ORDER[idx + 1]
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
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [school, setSchool] = useState('')
  const [cohort, setCohort] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [company, setCompany] = useState('')
  const [occupation, setOccupation] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const cohorts = generateCohorts()
  const overlayRef = useRef(null)

  const needsCompletion = !loading && !!user && !!profile && !profile.first_name

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
    if (isOpen && user) {
      const meta = user.user_metadata
      const fullName = meta?.full_name ?? meta?.name ?? ''
      const parts = fullName.trim().split(' ')
      setFirstName(meta?.given_name ?? parts[0] ?? '')
      setLastName(meta?.family_name ?? parts.slice(1).join(' ') ?? '')
    }
  }, [isOpen, user])

  useEffect(() => {
    if (!isOpen) {
      setFirstName('')
      setLastName('')
      setNickname('')
      setSchool('')
      setCohort('')
      setPhone('')
      setStatus('')
      setCompany('')
      setOccupation('')
      setLinkedin('')
      setGithub('')
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
    if (!firstName.trim()) next.firstName = 'Please enter your first name'
    if (!lastName.trim()) next.lastName = 'Please enter your last name'
    if (!school) next.school = 'Please select a school'
    if (!cohort) next.cohort = 'Please select a cohort'
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) next.phone = 'Enter a valid phone number: (XXX) XXX-XXXX'
    if (!status) next.status = 'Please select your status'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !user) return
    setSubmitting(true)

    try {
      await createProfile({
        id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        nickname: nickname.trim(),
        email: user.email,
        avatarUrl: user.user_metadata?.avatar_url ?? '',
        school,
        cohort,
        phone,
        status,
        company,
        occupation,
        linkedin: linkedin ? `https://www.linkedin.com/in/${linkedin}` : null,
        github: github ? `https://github.com/${github}` : null,
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
      <div className="relative w-full max-w-[420px] bg-white rounded-lg shadow-xl animate-fade-up flex flex-col max-h-[90vh]">

        {/* Fixed header */}
        <div className="px-8 pt-8 pb-4 shrink-0">
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
            <div className="flex items-center gap-2.5 pb-4 border-b border-border">
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
        </div>

        {/* Scrollable form area */}
        <div className="overflow-y-auto px-8 pb-8 pt-4">

        {/* First Name / Last Name */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1.5">First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="John"
              className={`${inputBase} ${inputFocus} ${errors.firstName ? 'border-red-400' : inputNormal}`}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1.5">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Doe"
              className={`${inputBase} ${inputFocus} ${errors.lastName ? 'border-red-400' : inputNormal}`}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        {/* Nickname */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Nickname <span className="text-text-hint font-normal">(optional)</span></label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="e.g. JohnD"
            className={`${inputBase} ${inputFocus} ${inputNormal}`}
          />
        </div>

        {/* School */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">School <span className="text-red-500">*</span></label>
          <select
            value={school}
            onChange={e => setSchool(e.target.value)}
            className={`${inputBase} ${inputFocus} ${errors.school ? 'border-red-400' : inputNormal}`}
          >
            <option value="">Select your school</option>
            {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.school && <p className="mt-1 text-xs text-red-500">{errors.school}</p>}
        </div>

        {/* Cohort */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Cohort <span className="text-text-hint font-normal">(when did you join?)</span> <span className="text-red-500">*</span></label>
          <select
            value={cohort}
            onChange={e => setCohort(e.target.value)}
            className={`${inputBase} ${inputFocus} ${errors.cohort ? 'border-red-400' : inputNormal}`}
          >
            <option value="">Select cohort</option>
            {cohorts.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {errors.cohort && <p className="mt-1 text-xs text-red-500">{errors.cohort}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder="(416) 000-0000"
            className={`${inputBase} ${inputFocus} ${errors.phone ? 'border-red-400' : inputNormal}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Status <span className="text-red-500">*</span></label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={`${inputBase} ${inputFocus} ${errors.status ? 'border-red-400' : inputNormal}`}
          >
            <option value="">Select your status</option>
            <option value="student">Student</option>
            <option value="graduated">Graduated</option>
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
        </div>

        {/* Company */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Company <span className="text-text-hint font-normal">(optional)</span></label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="e.g. Google, Shopify"
            className={`${inputBase} ${inputFocus} ${inputNormal}`}
          />
        </div>

        {/* Occupation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">Occupation <span className="text-text-hint font-normal">(optional)</span></label>
          <input
            type="text"
            value={occupation}
            onChange={e => setOccupation(e.target.value)}
            placeholder="e.g. Software Developer, Student"
            className={`${inputBase} ${inputFocus} ${inputNormal}`}
          />
        </div>

        {/* LinkedIn */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1.5">LinkedIn <span className="text-text-hint font-normal">(optional)</span></label>
          <div className={`flex items-center rounded-md border bg-bg-input transition-colors ${inputNormal} focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20`}>
            <span className="pl-3 py-2 text-sm font-inter text-text-primary whitespace-nowrap select-none pointer-events-none shrink-0">
              https://www.linkedin.com/in/
            </span>
            <input
              type="text"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value.trim())}
              placeholder="username"
              className="flex-1 min-w-0 py-2 pr-3 bg-transparent outline-none text-sm font-inter text-text-primary placeholder:text-text-hint"
            />
          </div>
        </div>

        {/* GitHub */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-1.5">GitHub <span className="text-text-hint font-normal">(optional)</span></label>
          <div className={`flex items-center rounded-md border bg-bg-input transition-colors ${inputNormal} focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20`}>
            <span className="pl-3 py-2 text-sm font-inter text-text-primary whitespace-nowrap select-none pointer-events-none shrink-0">
              https://github.com/
            </span>
            <input
              type="text"
              value={github}
              onChange={e => setGithub(e.target.value.trim())}
              placeholder="username"
              className="flex-1 min-w-0 py-2 pr-3 bg-transparent outline-none text-sm font-inter text-text-primary placeholder:text-text-hint"
            />
          </div>
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
    </div>
  )
}
