'use client'

import { useEffect, useState } from 'react'
import { SCHOOLS, ROLES, EXECUTIVE_TITLES } from '@/utils/constants'
import { generateCohortOptions } from '@/utils/cohortOptions'
import { formatPhone } from '@/utils/phone'
import { memberToForm } from '@/services/adminService'

const ROLE_OPTIONS = [
  { value: ROLES.PENDING, label: 'Pending' },
  { value: ROLES.MEMBER, label: 'Member' },
  { value: ROLES.EXECUTIVE, label: 'Executive' },
  { value: ROLES.ADMIN, label: 'Admin' },
]

const TITLE_OPTIONS = [
  { value: '', label: 'None' },
  ...EXECUTIVE_TITLES.map((title) => ({ value: title, label: title })),
]

const STATUS_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'graduate', label: 'Graduate' },
]

const inputClass = 'w-full px-3 py-2 rounded-md border border-border text-sm font-inter bg-bg-input text-text-primary outline-none focus:border-border-strong transition-colors'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function MemberEditPanel({ member, saving, error, onSave, onCancel }) {
  const [form, setForm] = useState(() => memberToForm(member))
  const cohortOptions = generateCohortOptions()

  useEffect(() => {
    setForm(memberToForm(member))
  }, [member])

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  const displayName = [member.firstName, member.lastName].filter(Boolean).join(' ') || member.email
  const isPendingRole = form.role === ROLES.PENDING

  return (
    <div className="border border-border rounded-lg bg-bg-surface flex flex-col max-h-[min(90vh,40rem)] shadow-lg">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h2 id="edit-member-title" className="font-montserrat font-semibold text-lg text-text-primary">Edit member</h2>
        <p className="text-sm text-text-secondary mt-0.5 truncate">{displayName}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <Field label="First name">
            <input
              type="text"
              value={form.first_name}
              onChange={e => updateField('first_name', e.target.value)}
              className={inputClass}
              required={!isPendingRole}
            />
          </Field>

          <Field label="Last name">
            <input
              type="text"
              value={form.last_name}
              onChange={e => updateField('last_name', e.target.value)}
              className={inputClass}
              required={!isPendingRole}
            />
          </Field>

          <Field label="School">
            <select
              value={form.school}
              onChange={e => updateField('school', e.target.value)}
              className={inputClass}
              required={!isPendingRole}
            >
              <option value="">Select school</option>
              {SCHOOLS.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </Field>

          <Field label="Cohort">
            <select
              value={form.cohort}
              onChange={e => updateField('cohort', e.target.value)}
              className={inputClass}
              required={!isPendingRole}
            >
              <option value="">Select cohort</option>
              {cohortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Role">
            <select
              value={form.role}
              onChange={e => {
                const role = e.target.value
                setForm(prev => ({
                  ...prev,
                  role,
                  executive_title:
                    role === ROLES.EXECUTIVE || role === ROLES.ADMIN
                      ? prev.executive_title
                      : '',
                }))
              }}
              className={inputClass}
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {form.role === ROLES.PENDING && (
              <p className="mt-1.5 text-xs text-text-hint">
                Returns this person to the approval queue. Their Our Team position is cleared.
              </p>
            )}
          </Field>

          {(form.role === ROLES.EXECUTIVE || form.role === ROLES.ADMIN) && (
            <Field label="Our Team position">
              <select
                value={form.executive_title}
                onChange={e => updateField('executive_title', e.target.value)}
                className={inputClass}
              >
                {TITLE_OPTIONS.map(opt => (
                  <option key={opt.value || 'none'} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-text-hint">
                Shown on About → Our Team for this member&apos;s school. One person per position per school.
              </p>
            </Field>
          )}

          <Field label="Status">
            <select
              value={form.status}
              onChange={e => updateField('status', e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={e => updateField('phone', formatPhone(e.target.value))}
              placeholder="(416) 555-0100"
              className={inputClass}
            />
          </Field>

          {error && (
            <p className="text-sm text-error font-inter">{error}</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border flex gap-3 justify-end shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-layer1 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-accent text-white rounded-md text-sm font-medium font-inter hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
