'use client'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Link from 'next/link'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { fetchMemberById, updateMyProfile } from '@/services/membersService'
import { cohortLabel } from '@/utils/cohort'
import { IconLinkedIn, IconGitHub } from '@/components/ui/SocialIcons'

function Avatar({ member }) {
  const initial = (member?.firstName?.[0] ?? '?').toUpperCase()
  return (
    <div className="w-full aspect-square rounded-full overflow-hidden bg-bg-layer1 flex items-center justify-center">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={`${member.firstName} ${member.lastName}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-montserrat font-bold text-5xl text-text-secondary">{initial}</span>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const isStudent = status !== 'graduate'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${isStudent ? 'bg-[#F0F4FF] text-[#1A6FBF]' : 'bg-[#F3F3F3] text-[#555555]'}`}>
      {isStudent ? 'Student' : 'Graduate'}
    </span>
  )
}

function ExecutiveBadge() {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded bg-success-bg text-success">Executive</span>
  )
}

function VisibilityToggle({ visible, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!visible)}
      className={`text-[11px] flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
        visible ? 'border-border text-text-secondary hover:border-border-strong' : 'border-border text-text-hint bg-bg-layer1'
      }`}
    >
      {visible ? '👁 Visible' : '🔒 Hidden'}
    </button>
  )
}

function StatusToggle({ value, onChange }) {
  const isStudent = value !== 'graduate'
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${isStudent ? 'text-[#1A6FBF] font-medium' : 'text-text-hint'}`}>Student</span>
      <button
        type="button"
        onClick={() => onChange(isStudent ? 'graduate' : 'student')}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isStudent ? 'bg-[#1A6FBF]' : 'bg-text-secondary'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isStudent ? 'translate-x-0.5' : 'translate-x-5'}`} />
      </button>
      <span className={`text-sm ${!isStudent ? 'text-text-secondary font-medium' : 'text-text-hint'}`}>Graduate</span>
    </div>
  )
}

// Read view — shown to other members, or as "Preview" for own profile
function ReadSidebar({ member, isOwn, isExec, onEdit }) {
  const fullName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
  const v = member.profileVisibility ?? {}

  return (
    <aside className="flex flex-col gap-4">
      <Avatar member={member} />

      <div>
        <h1 className="font-montserrat font-bold text-2xl text-text-primary leading-tight">{fullName}</h1>
        {member.nickname && (
          <p className="text-text-hint text-base mt-0.5">{member.nickname}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={member.status} />
        {isExec && <ExecutiveBadge />}
      </div>

      {v.bio !== false && member.bio && (
        <p className="text-sm text-text-secondary leading-relaxed">{member.bio}</p>
      )}

      <div className="flex flex-col gap-1 text-sm text-text-secondary">
        {member.school && <span>{member.school}</span>}
        {member.cohort && <span>{cohortLabel(member.cohort)}</span>}
      </div>

      {((v.linkedin !== false && member.linkedinUrl) || (v.github !== false && member.githubUrl)) && (
        <div className="flex flex-col gap-2 pt-1">
          {v.linkedin !== false && member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-[#0A66C2] transition-colors">
              <IconLinkedIn className="size-4 shrink-0" />
              <span className="truncate">LinkedIn</span>
            </a>
          )}
          {v.github !== false && member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <IconGitHub className="size-4 shrink-0" />
              <span className="truncate">GitHub</span>
            </a>
          )}
        </div>
      )}

      {isOwn && (
        <>
          <div className="flex flex-col gap-1 text-xs text-text-hint">
            {v.bio === false && member.bio && <span>🔒 Bio hidden from others</span>}
            {v.linkedin === false && member.linkedinUrl && <span>🔒 LinkedIn hidden from others</span>}
            {v.github === false && member.githubUrl && <span>🔒 GitHub hidden from others</span>}
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

// Edit view — own profile only
function EditSidebar({ member, onCancel, onPreview, onSave, saving }) {
  const fullName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
  const defaultVisibility = member.profileVisibility ?? { bio: true, linkedin: true, github: true }

  const [form, setForm] = useState({
    nickname: member.nickname ?? '',
    bio: member.bio ?? '',
    linkedin: member.linkedinUrl ?? '',
    github: member.githubUrl ?? '',
    status: member.status ?? 'student',
  })
  const [visibility, setVisibility] = useState({
    bio: defaultVisibility.bio !== false,
    linkedin: defaultVisibility.linkedin !== false,
    github: defaultVisibility.github !== false,
  })

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const setVis = (key) => (val) => setVisibility(v => ({ ...v, [key]: val }))

  const handleSave = () => onSave({
    nickname: form.nickname || null,
    bio: form.bio || null,
    linkedin: form.linkedin || null,
    github: form.github || null,
    status: form.status,
    profile_visibility: visibility,
  })

  return (
    <aside className="flex flex-col gap-5">
      <Avatar member={member} />

      <div>
        <p className="font-montserrat font-bold text-2xl text-text-primary leading-tight">{fullName}</p>
        <p className="text-xs text-text-hint mt-0.5">Name is managed by admin</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-hint uppercase tracking-wide">Nickname</label>
        <input type="text" value={form.nickname} onChange={setField('nickname')}
          placeholder="Add a nickname..."
          className="w-full px-3 py-1.5 rounded border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-accent" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-hint uppercase tracking-wide">Status</label>
        <StatusToggle value={form.status} onChange={(v) => setForm(f => ({ ...f, status: v }))} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-hint uppercase tracking-wide">Bio</label>
          <VisibilityToggle visible={visibility.bio} onChange={setVis('bio')} />
        </div>
        <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value.slice(0, 300) }))}
          placeholder="Tell others about yourself..."
          rows={4}
          className="w-full px-3 py-1.5 rounded border border-border bg-bg-base text-sm text-text-primary resize-none focus:outline-none focus:border-accent" />
        <p className="text-xs text-text-hint text-right">{form.bio.length} / 300</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-hint uppercase tracking-wide">LinkedIn</label>
          <VisibilityToggle visible={visibility.linkedin} onChange={setVis('linkedin')} />
        </div>
        <input type="url" value={form.linkedin} onChange={setField('linkedin')}
          placeholder="https://linkedin.com/in/..."
          className="w-full px-3 py-1.5 rounded border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-accent" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-hint uppercase tracking-wide">GitHub</label>
          <VisibilityToggle visible={visibility.github} onChange={setVis('github')} />
        </div>
        <input type="url" value={form.github} onChange={setField('github')}
          placeholder="https://github.com/..."
          className="w-full px-3 py-1.5 rounded border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-accent" />
      </div>

      {/* Action buttons */}
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
  // 'edit' | 'preview' | 'read'
  const [mode, setMode] = useState('read')
  const [saving, setSaving] = useState(false)
  const initializedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchMemberById(id)
        if (!cancelled) setMember(data)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  // Auto-enter edit mode once we confirm own profile
  useEffect(() => {
    if (!initializedRef.current && member && user && user.id === id) {
      setMode('edit')
      initializedRef.current = true
    }
  }, [member, user, id])

  const isOwn = user?.id === id
  const isExec = member?.role === 'executive' || member?.role === 'admin'

  const handleSave = async (fields) => {
    setSaving(true)
    try {
      await updateMyProfile(fields)
      const updated = await fetchMemberById(id)
      setMember(updated)
      setMode('edit')
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-start">
                <div className="w-full md:w-64 lg:w-72 md:flex-shrink-0">
                  {isOwn && mode === 'edit' ? (
                    <EditSidebar
                      member={member}
                      onPreview={() => setMode('preview')}
                      onCancel={() => setMode('edit')}
                      onSave={handleSave}
                      saving={saving}
                    />
                  ) : (
                    <ReadSidebar
                      member={member}
                      isOwn={isOwn && mode === 'preview'}
                      isExec={isExec}
                      onEdit={() => setMode('edit')}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-8">
                  {isOwn && mode === 'preview' && (
                    <div className="px-3 py-2 rounded bg-bg-layer1 border border-border text-sm text-text-secondary">
                      👁 This is how others see your profile
                    </div>
                  )}
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
            )}
          </div>
        </div>
      </main>
    </RoleGuard>
  )
}
