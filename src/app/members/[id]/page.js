'use client'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Link from 'next/link'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { fetchMemberById, updateMyProfile } from '@/services/membersService'
import { cohortLabel } from '@/utils/cohort'
import { IconLinkedIn, IconGitHub } from '@/components/ui/SocialIcons'

const SCHOOLS = ['Seneca College', 'York University']

function Avatar({ member }) {
  const initial = (member?.firstName?.[0] ?? '?').toUpperCase()
  const src = member.avatarUrl?.replace(/=s\d+-c$/, '=s400-c') ?? member.avatarUrl
  return (
    <div className="w-full aspect-square rounded-full overflow-hidden bg-bg-layer1 flex items-center justify-center">
      {src ? (
        <img src={src} alt={`${member.firstName} ${member.lastName}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
      ) : (
        <span className="font-montserrat font-bold text-5xl text-text-secondary">{(member?.firstName?.[0] ?? '?').toUpperCase()}</span>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const isStudent = status !== 'graduate'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${isStudent ? 'bg-[#F0F4FF] text-[#1A6FBF]' : 'bg-[#FFF4EC] text-orange-500'}`}>
      {isStudent ? 'Student' : 'Graduate'}
    </span>
  )
}

function ExecutiveBadge() {
  return <span className="text-xs font-medium px-2 py-0.5 rounded bg-success-bg text-success">Executive</span>
}

function SlidingSegmented({ value, options, onChange }) {
  const idx = options.findIndex(o => o.value === value)
  const colors = ['bg-[#1A6FBF]', 'bg-orange-400']
  return (
    <div className="relative flex w-full rounded-full border border-border overflow-hidden text-xs font-medium">
      <span className={`absolute inset-y-0 w-1/2 transition-all duration-200 ${idx === 0 ? 'left-0' : 'left-1/2'} ${colors[idx] ?? 'bg-[#1A6FBF]'}`} />
      {options.map((opt, i) => (
        <button key={String(opt.value)} type="button" onClick={() => onChange(opt.value)}
          className={`relative z-10 flex-1 text-center py-1.5 transition-colors ${i > 0 ? 'border-l border-border' : ''} ${opt.value === value ? 'text-white' : 'text-text-hint'}`}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ value, onChange, colorOn = 'bg-[#1A6FBF]', colorOff = 'bg-gray-300' }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${value ? colorOn : colorOff}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function IconMonitor({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
  )
}
function IconBriefcase({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  )
}
function IconBuilding({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" /><path d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16" />
    </svg>
  )
}
function IconGradCap({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
function IconPhone({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}
function IconCalendar({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

// Read view — shown to other members, or as "Preview" for own profile
function ReadSidebar({ member, isOwn, isExec, onEdit }) {
  const fullName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
  const v = member.profileVisibility ?? {}

  const infoItems = [
    v.occupation !== false && member.occupation && { icon: <IconBriefcase className="size-4" />, text: member.occupation },
    v.company !== false && member.company && { icon: <IconBuilding className="size-4" />, text: member.company },
    member.school && { icon: <IconGradCap className="size-4" />, text: member.school },
    member.cohort && { icon: <IconCalendar className="size-4" />, text: cohortLabel(member.cohort) },
    v.phone !== false && member.phone && { icon: <IconPhone className="size-4" />, text: member.phone },
  ].filter(Boolean)

  return (
    <aside className="flex flex-col gap-4">
      <Avatar member={member} />

      <div>
        <h1 className="font-montserrat font-bold text-2xl text-text-primary leading-tight">{fullName}</h1>
        {member.nickname && <p className="text-text-hint text-base mt-0.5">{member.nickname}</p>}
      </div>

      {/* Bio before badges */}
      {v.bio !== false && (
        <p className="text-sm text-text-secondary leading-relaxed min-h-[1.25rem] whitespace-pre-wrap">
          {member.bio ?? ''}
        </p>
      )}

      {/* Status / role badges */}
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={member.status} />
        {isExec && <ExecutiveBadge />}
      </div>

      {/* Info items with icons */}
      {infoItems.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          {infoItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <span className="text-text-hint shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Social links */}
      {((v.linkedin !== false && member.linkedinUrl) || (v.github !== false && member.githubUrl)) && (
        <div className="flex flex-col gap-2">
          {v.github !== false && member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <IconGitHub className="size-4 shrink-0 text-text-primary" />
              <span className="truncate">GitHub</span>
            </a>
          )}
          {v.linkedin !== false && member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-[#0A66C2] transition-colors">
              <IconLinkedIn className="size-4 shrink-0 text-[#0A66C2]" />
              <span className="truncate">LinkedIn</span>
            </a>
          )}
        </div>
      )}

      {isOwn && (
        <>
          <div className="flex flex-col gap-1 text-xs text-text-hint">
            {v.bio === false && member.bio && <span>🔒 Bio hidden</span>}
            {v.occupation === false && member.occupation && <span>🔒 Occupation hidden</span>}
            {v.company === false && member.company && <span>🔒 Company hidden</span>}
            {v.phone === false && member.phone && <span>🔒 Phone hidden</span>}
            {v.linkedin === false && member.linkedinUrl && <span>🔒 LinkedIn hidden</span>}
            {v.github === false && member.githubUrl && <span>🔒 GitHub hidden</span>}
          </div>
          <button type="button" onClick={onEdit}
            className="w-full mt-1 px-4 py-1.5 rounded border border-border text-sm text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
            ← Edit Profile
          </button>
        </>
      )}
    </aside>
  )
}

function FieldLabel({ children }) {
  return <label className="text-xs font-medium text-text-hint tracking-wide">{children}</label>
}

function VisibilityRow({ label, vis, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Toggle value={vis} onChange={onChange} colorOn="bg-[#1A6FBF]" colorOff="bg-gray-300" />
        <span className={`text-xs font-medium w-10 ${vis ? 'text-[#1A6FBF]' : 'text-text-hint'}`}>
          {vis ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </div>
  )
}

// Edit view — controlled by parent draft state, own profile only
function EditSidebar({ member, draft, onDraftChange, onPreview, onCancel, onSave, saving, saveError }) {
  const fullName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
  const setField = (key) => (e) => onDraftChange({ ...draft, [key]: e.target.value })
  const setVis = (key) => (val) => onDraftChange({ ...draft, vis: { ...draft.vis, [key]: val } })

  const handleSave = () => onSave({
    nickname: draft.nickname || null,
    bio: draft.bio || null,
    linkedin: draft.linkedin || null,
    github: draft.github || null,
    status: draft.status,
    profile_visibility: draft.vis,
    company: draft.company || null,
    occupation: draft.occupation || null,
    phone: draft.phone || null,
    school: draft.school || null,
  })

  const inputCls = "w-full px-3 py-1.5 rounded border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-accent"

  return (
    <aside className="flex flex-col gap-5">
      <Avatar member={member} />

      <div className="flex flex-col gap-1">
        <p className="font-montserrat font-bold text-2xl text-text-primary leading-tight">{fullName}</p>
        <input type="text" value={draft.nickname} onChange={setField('nickname')}
          placeholder="Nickname"
          className={inputCls} />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Status</FieldLabel>
        <SlidingSegmented
          options={[{ value: 'student', label: 'Student' }, { value: 'graduate', label: 'Graduate' }]}
          value={draft.status}
          onChange={(v) => onDraftChange({ ...draft, status: v })}
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="Bio" vis={draft.vis.bio} onChange={setVis('bio')} />
        <textarea value={draft.bio} onChange={(e) => onDraftChange({ ...draft, bio: e.target.value.slice(0, 300) })}
          placeholder="Tell others about yourself..."
          rows={4}
          className={`${inputCls} resize-none`} />
        <p className="text-xs text-text-hint text-right">{draft.bio.length} / 300</p>
      </div>

      {/* School */}
      <div className="flex flex-col gap-1">
        <FieldLabel>School</FieldLabel>
        <select value={draft.school} onChange={setField('school')} className={inputCls}>
          <option value="">Select school...</option>
          {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="Phone" vis={draft.vis.phone} onChange={setVis('phone')} />
        <input type="tel" value={draft.phone} onChange={setField('phone')}
          placeholder="+1 (416) 000-0000"
          className={inputCls} />
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="Company" vis={draft.vis.company} onChange={setVis('company')} />
        <input type="text" value={draft.company} onChange={setField('company')}
          placeholder="e.g. Google"
          className={inputCls} />
      </div>

      {/* Occupation */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="Occupation" vis={draft.vis.occupation} onChange={setVis('occupation')} />
        <input type="text" value={draft.occupation} onChange={setField('occupation')}
          placeholder="e.g. Software Developer"
          className={inputCls} />
      </div>

      {/* GitHub */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="GitHub" vis={draft.vis.github} onChange={setVis('github')} />
        <input type="url" value={draft.github} onChange={setField('github')}
          placeholder="https://github.com/..."
          className={inputCls} />
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col gap-1">
        <VisibilityRow label="LinkedIn" vis={draft.vis.linkedin} onChange={setVis('linkedin')} />
        <input type="url" value={draft.linkedin} onChange={setField('linkedin')}
          placeholder="https://linkedin.com/in/..."
          className={inputCls} />
      </div>

      {saveError && <p className="text-xs text-accent px-1">{saveError}</p>}

      <div className="flex flex-col gap-2 pt-1">
        <button type="button" onClick={handleSave} disabled={saving}
          className="w-full px-4 py-2 rounded bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onPreview}
            className="flex-1 px-4 py-2 rounded border border-border text-sm text-text-secondary hover:border-border-strong transition-colors">
            Preview
          </button>
          <button type="button" onClick={onCancel}
            className="flex-1 px-4 py-2 rounded border border-border text-sm text-text-secondary hover:border-border-strong transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function ProfilePage({ params }) {
  const { id } = React.use(params)
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('read')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [draft, setDraft] = useState(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMemberById(id, { signal: controller.signal })
        if (!cancelled) setMember(data)
      } catch (err) {
        if (cancelled) return
        if (!cancelled) {
          setError(
            err?.name === 'AbortError'
              ? new Error('Request timed out. Refresh the page and try again.')
              : err
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [id])

  useEffect(() => {
    if (member && draft === null) {
      const pv = member.profileVisibility ?? {}
      setDraft({
        nickname: member.nickname ?? '',
        bio: member.bio ?? '',
        linkedin: member.linkedinUrl ?? '',
        github: member.githubUrl ?? '',
        status: member.status ?? 'student',
        company: member.company ?? '',
        occupation: member.occupation ?? '',
        phone: member.phone ?? '',
        school: member.school ?? '',
        vis: {
          bio: pv.bio !== false,
          linkedin: member.linkedinUrl ? pv.linkedin !== false : false,
          github: member.githubUrl ? pv.github !== false : false,
          company: member.company ? pv.company !== false : false,
          occupation: member.occupation ? pv.occupation !== false : false,
          phone: member.phone ? pv.phone === true : false,
        },
      })
    }
  }, [member, draft])

  useEffect(() => {
    if (!initializedRef.current && member && user && user.id === id) {
      setMode('edit')
      initializedRef.current = true
    }
  }, [member, user, id])

  const isOwn = user?.id === id
  const isExec = member?.role === 'executive' || member?.role === 'admin'

  const displayMember = (mode === 'preview' && draft && member)
    ? {
        ...member,
        nickname: draft.nickname || null,
        bio: draft.bio || null,
        linkedinUrl: draft.linkedin || null,
        githubUrl: draft.github || null,
        status: draft.status,
        company: draft.company || null,
        occupation: draft.occupation || null,
        phone: draft.phone || null,
        school: draft.school || null,
        profileVisibility: draft.vis,
      }
    : member

  const handleSave = async (fields) => {
    setSaving(true)
    setSaveError(null)
    try {
      await updateMyProfile(fields)
      const updated = await fetchMemberById(id)
      setMember(updated)
      setDraft(null)
      setMode('edit')
    } catch (err) {
      console.error('Failed to save profile:', err)
      setSaveError(err?.message ?? 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Cancel discards unsaved changes by resetting draft to DB state
  const handleCancel = () => {
    setDraft(null)
    setMode('read')
  }

  return (
    <RoleGuard>
      <main className="min-h-screen bg-bg-base">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-16">
          <Link href="/members" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            ← Members
          </Link>

          <div className="mt-8">
            {loading && <p className="text-text-secondary">Loading…</p>}
            {error && <p className="text-accent">Couldn't load profile. Try refreshing.</p>}

            {!loading && !error && member && (
              <>
                {isOwn && mode === 'preview' && (
                  <div className="mb-6 flex items-center justify-between px-4 py-2.5 rounded-lg bg-bg-layer1 border border-border text-sm">
                    <span className="flex items-center gap-2 text-text-secondary">
                      <IconMonitor className="size-4 shrink-0" />
                      This is how others see your profile
                    </span>
                    <button type="button" onClick={() => setMode('edit')}
                      className="text-accent font-medium hover:opacity-80 transition-opacity">
                      ← Back to Edit
                    </button>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-start">
                  <div className="w-full md:w-64 lg:w-72 md:flex-shrink-0">
                    {isOwn && mode === 'edit' && draft ? (
                      <EditSidebar
                        member={member}
                        draft={draft}
                        onDraftChange={setDraft}
                        onPreview={() => setMode('preview')}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        saving={saving}
                        saveError={saveError}
                      />
                    ) : (
                      <ReadSidebar
                        member={displayMember}
                        isOwn={isOwn && mode === 'read'}
                        isExec={isExec}
                        onEdit={() => setMode('edit')}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-8">
                    <section>
                      <h2 className="font-montserrat font-semibold text-lg text-text-primary mb-4">Activity</h2>
                      <div className="w-full rounded-lg bg-bg-layer1 border border-border flex items-center justify-center py-12">
                        <p className="text-sm text-text-hint">Coming soon</p>
                      </div>
                    </section>
                    <section>
                      <h2 className="font-montserrat font-semibold text-lg text-text-primary mb-4">Achievements</h2>
                      <div className="w-full rounded-lg bg-bg-layer1 border border-border flex items-center justify-center py-12">
                        <p className="text-sm text-text-hint">Coming soon</p>
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </RoleGuard>
  )
}
