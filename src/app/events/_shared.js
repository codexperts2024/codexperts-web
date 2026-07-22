'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Markdown from 'react-markdown'

import { IconEdit, IconTrash, IconNew } from '@/components/ui/Icons'
import { uploadImage } from '@/services/cloudinaryService'
import {
  toDatetimeLocalValue,
  fromDatetimeLocalValue,
} from '@/lib/events'

const MarkdownCodeEditor = dynamic(() => import('../announcements/_editor'), { ssr: false })

export const EVENT_CAMPUS_OPTIONS = ['Seneca Polytechnic', 'York University']

export const DEFAULT_EVENT_CATEGORIES = [
  'Competition',
  'Workshop',
  'Meetup',
  'Social',
  'Hackathon',
]

const CATEGORY_STORAGE_KEY = 'codexperts_event_categories'
const CATEGORY_DELETED_KEY = 'codexperts_event_categories_deleted'

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

function parseDateTimeParts(value) {
  if (!value) return { date: '', hour: '', minute: '' }
  const [datePart, timePart = ''] = value.split('T')
  const [hour = '', rawMinute = ''] = timePart.split(':')
  if (!datePart) return { date: '', hour: '', minute: '' }
  const minuteNum = Math.round(Number(rawMinute || 0) / 5) * 5
  const minute = String(Math.min(minuteNum, 55)).padStart(2, '0')
  return {
    date: datePart,
    hour: hour ? hour.padStart(2, '0') : '12',
    minute: MINUTE_OPTIONS.includes(minute) ? minute : '00',
  }
}

function joinDateTimeParts(date, hour, minute) {
  if (!date) return ''
  const h = hour || '12'
  const m = minute || '00'
  return `${date}T${h}:${m}`
}

export const EMPTY_EVENT_FORM = {
  title: '',
  category: '',
  description: '',
  body: '',
  date: '',
  endDate: '',
  location: '',
  campus: '',
  registrationUrl: '',
  ctaLabel: 'Register',
  coverImageUrl: '',
  galleryUrls: [],
}

export function eventToForm(event) {
  return {
    title: event.title ?? '',
    category: event.category ?? '',
    description: event.description ?? '',
    body: event.body ?? '',
    date: toDatetimeLocalValue(event.date),
    endDate: toDatetimeLocalValue(event.endDate),
    location: event.location ?? '',
    campus: event.campus ?? '',
    registrationUrl: event.registrationUrl ?? '',
    ctaLabel: event.ctaLabel || 'Register',
    coverImageUrl: event.coverImageUrl ?? '',
    galleryUrls: event.galleryUrls ?? [],
  }
}

/** Convert form datetime-local fields to ISO strings for the API */
export function formToPayload(form) {
  return {
    ...form,
    date: fromDatetimeLocalValue(form.date),
    endDate: fromDatetimeLocalValue(form.endDate),
  }
}

export { formatEventDate } from '@/lib/events'

function loadStoredCategories() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function loadDeletedCategories() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CATEGORY_DELETED_KEY)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function saveStoredCategories(categories) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
}

function saveDeletedCategories(categories) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CATEGORY_DELETED_KEY, JSON.stringify(categories))
}

const inputClass =
  'w-full border border-border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-bg-surface focus:outline-none focus:border-border-strong'

function DateTimeFields({ label, value, onChange, required = false }) {
  const { date, hour, minute } = parseDateTimeParts(value)

  function update({ nextDate = date, nextHour = hour, nextMinute = minute }) {
    if (!nextDate) {
      onChange('')
      return
    }
    onChange(joinDateTimeParts(nextDate, nextHour || '12', nextMinute || '00'))
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-inter text-text-hint">{label}</span>
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_0.8fr_0.8fr] gap-2">
        <input
          type="date"
          value={date}
          required={required}
          onChange={(e) => update({ nextDate: e.target.value })}
          className={inputClass}
        />
        <select
          value={hour}
          onChange={(e) => update({ nextHour: e.target.value })}
          className={inputClass}
          aria-label="Hour"
          disabled={!date}
        >
          <option value="">HH</option>
          {HOUR_OPTIONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <select
          value={minute}
          onChange={(e) => update({ nextMinute: e.target.value })}
          className={inputClass}
          aria-label="Minute"
          disabled={!date}
        >
          <option value="">MM</option>
          {MINUTE_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <span className="text-xs font-inter text-text-hint">Date · Hour · Minute (24h, 5-min steps)</span>
    </label>
  )
}

const mdComponents = {
  h1: ({ children }) => <h1 className="font-montserrat font-bold text-2xl text-text-primary mt-6 mb-3">{children}</h1>,
  h2: ({ children }) => <h2 className="font-montserrat font-semibold text-xl text-text-primary mt-5 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="font-montserrat font-medium text-lg text-text-primary mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-text-primary font-inter text-base leading-[1.7] mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-text-primary font-inter">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-text-primary font-inter">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => <a href={href} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded-md my-4" />,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 italic text-text-secondary my-4">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes('language-'))
    return isBlock
      ? <code className="block bg-bg-layer1 rounded p-4 font-mono text-sm overflow-x-auto my-4">{children}</code>
      : <code className="bg-bg-layer1 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
  },
  hr: () => <hr className="border-border my-6" />,
}

export function PageHeader({ isAdmin, onNew }) {
  return (
    <div className="bg-bg-base py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-4xl text-text-primary">Events</h1>
          <p className="mt-3 text-text-secondary font-inter text-base leading-7 max-w-2xl">
            Competitions, workshops, and meetups
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={onNew}
            title="New Event"
            className="bg-accent text-bg-base p-3 rounded-md hover:bg-accent-hover transition-colors shrink-0"
          >
            <IconNew className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

function EditorTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-border bg-bg-input px-3 pt-2 rounded-t-md gap-1">
      {['Write', 'Preview'].map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`px-4 py-1.5 text-sm font-inter rounded-t-md transition-colors ${
            activeTab === tab
              ? 'bg-bg-surface border border-b-0 border-border text-text-primary font-medium -mb-px pb-2'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function EventForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitting,
  editMode = false,
  categoryOptions = [],
}) {
  const [tab, setTab] = useState('Write')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [categories, setCategories] = useState(() => [
    ...new Set([...DEFAULT_EVENT_CATEGORIES, ...categoryOptions]),
  ])
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const stored = loadStoredCategories()
    const deleted = new Set(loadDeletedCategories())
    const defaults = DEFAULT_EVENT_CATEGORIES.filter((c) => !deleted.has(c))
    setCategories([
      ...new Set([...defaults, ...categoryOptions.filter((c) => !deleted.has(c)), ...stored]),
    ].sort((a, b) => a.localeCompare(b)))
  }, [categoryOptions])

  function handleAddCategory() {
    const value = newCategory.trim()
    if (!value) return
    const deleted = loadDeletedCategories().filter((c) => c !== value)
    saveDeletedCategories(deleted)
    const next = [...new Set([...categories, value])].sort((a, b) => a.localeCompare(b))
    setCategories(next)
    const custom = next.filter((c) => !DEFAULT_EVENT_CATEGORIES.includes(c))
    saveStoredCategories(custom)
    onChange((prev) => ({ ...prev, category: value }))
    setNewCategory('')
    setAddingCategory(false)
  }

  function handleDeleteCategory() {
    const value = form.category?.trim()
    if (!value) return
    const next = categories.filter((c) => c !== value)
    setCategories(next)
    const custom = next.filter((c) => !DEFAULT_EVENT_CATEGORIES.includes(c))
    saveStoredCategories(custom)
    if (DEFAULT_EVENT_CATEGORIES.includes(value)) {
      saveDeletedCategories([...new Set([...loadDeletedCategories(), value])])
    }
    onChange((prev) => ({ ...prev, category: '' }))
  }

  async function handleCoverChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadError('')
    setUploadingCover(true)
    try {
      const { url } = await uploadImage(file, 'events')
      onChange((prev) => ({ ...prev, coverImageUrl: url }))
    } catch (err) {
      setUploadError(err.message || 'Cover upload failed')
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleGalleryChange(e) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return
    setUploadError('')
    setUploadingGallery(true)
    try {
      const urls = []
      for (const file of files) {
        const { url } = await uploadImage(file, 'events')
        urls.push(url)
      }
      onChange((prev) => ({ ...prev, galleryUrls: [...(prev.galleryUrls ?? []), ...urls] }))
    } catch (err) {
      setUploadError(err.message || 'Gallery upload failed')
    } finally {
      setUploadingGallery(false)
    }
  }

  function removeGalleryUrl(index) {
    onChange((prev) => ({
      ...prev,
      galleryUrls: (prev.galleryUrls ?? []).filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
        className={inputClass}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-inter text-text-hint">Category</span>
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={(e) => onChange((prev) => ({ ...prev, category: e.target.value }))}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setAddingCategory((v) => !v)}
              title="Add category"
              className="shrink-0 px-3 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-base transition-colors"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleDeleteCategory}
              title="Delete selected category"
              disabled={!form.category}
              className="shrink-0 px-3 py-2 border border-border-strong rounded-md text-sm font-inter text-accent hover:bg-accent-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              −
            </button>
          </div>
          {addingCategory && (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory() } }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="shrink-0 px-3 py-2 bg-accent text-bg-base rounded-md text-sm font-inter hover:bg-accent-hover transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-inter text-text-hint">Campus</span>
          <select
            value={form.campus}
            onChange={(e) => onChange((prev) => ({ ...prev, campus: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select campus</option>
            {EVENT_CAMPUS_OPTIONS.map((campus) => (
              <option key={campus} value={campus}>{campus}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateTimeFields
          label="Event date & time"
          value={form.date}
          required
          onChange={(next) => onChange((prev) => ({ ...prev, date: next }))}
        />
        <DateTimeFields
          label="End date & time (optional)"
          value={form.endDate}
          onChange={(next) => onChange((prev) => ({ ...prev, endDate: next }))}
        />
      </div>

      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => onChange((prev) => ({ ...prev, location: e.target.value }))}
        className={inputClass}
      />

      <textarea
        placeholder="Short description (shown on list cards, 2 lines max)"
        value={form.description}
        onChange={(e) => onChange((prev) => ({ ...prev, description: e.target.value }))}
        rows={2}
        className={`${inputClass} resize-y`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-inter text-text-hint">Registration URL (optional)</span>
          <input
            type="url"
            placeholder="https://..."
            value={form.registrationUrl}
            onChange={(e) => onChange((prev) => ({ ...prev, registrationUrl: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-inter text-text-hint">Registration button text</span>
          <input
            type="text"
            placeholder="Register"
            value={form.ctaLabel}
            onChange={(e) => onChange((prev) => ({ ...prev, ctaLabel: e.target.value }))}
            className={inputClass}
          />
          <span className="text-xs font-inter text-text-hint">
            Shown only when a registration URL is set
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-inter text-text-hint">Cover image</span>
        {form.coverImageUrl ? (
          <div className="relative w-full h-48 rounded-md overflow-hidden bg-bg-layer1">
            <Image src={form.coverImageUrl} alt="Cover preview" fill className="object-cover object-center" sizes="800px" unoptimized />
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, coverImageUrl: '' }))}
              className="absolute top-2 right-2 px-2 py-1 text-xs font-inter bg-bg-elevated text-bg-base rounded-md"
            >
              Remove
            </button>
          </div>
        ) : null}
        <label className="inline-flex items-center gap-2 text-sm font-inter text-text-secondary cursor-pointer">
          <span className="px-3 py-2 border border-border-strong rounded-md hover:bg-bg-base transition-colors">
            {uploadingCover ? 'Uploading...' : 'Upload cover'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} disabled={uploadingCover} />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-inter text-text-hint">Gallery photos</span>
        {(form.galleryUrls ?? []).length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {form.galleryUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative aspect-square rounded-md overflow-hidden bg-bg-layer1">
                <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" sizes="120px" unoptimized />
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg-elevated text-bg-base text-xs"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex items-center gap-2 text-sm font-inter text-text-secondary cursor-pointer">
          <span className="px-3 py-2 border border-border-strong rounded-md hover:bg-bg-base transition-colors">
            {uploadingGallery ? 'Uploading...' : 'Add gallery photos'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryChange}
            disabled={uploadingGallery}
          />
        </label>
      </div>

      {uploadError && (
        <p className="text-sm font-inter text-error">{uploadError}</p>
      )}

      <div className="border border-border rounded-md overflow-hidden">
        <EditorTabs activeTab={tab} onTabChange={setTab} />
        {tab === 'Write' ? (
          <div className="bg-bg-surface">
            <MarkdownCodeEditor
              value={form.body}
              onChange={(val) => onChange((prev) => ({ ...prev, body: val ?? '' }))}
            />
          </div>
        ) : (
          <div className="min-h-[360px] bg-bg-surface px-6 py-4">
            {form.body.trim() ? (
              <Markdown components={mdComponents}>{form.body}</Markdown>
            ) : (
              <p className="text-text-hint font-inter text-sm italic">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-base transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!form.title.trim() || !form.date || submitting || uploadingCover || uploadingGallery}
          className="px-5 py-2 bg-accent text-bg-base rounded-md text-sm font-medium font-inter hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Save' : 'Publish')}
        </button>
      </div>
    </div>
  )
}

export function DeleteModal({ onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-elevated/40 px-4">
      <div className="bg-bg-surface rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="font-inter text-base text-text-primary mb-6">
          Delete this event? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-base transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-accent text-bg-base rounded-md text-sm font-medium font-inter hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EventBody({ body }) {
  if (!body?.trim()) {
    return <p className="text-text-secondary font-inter">No detailed description available for this event.</p>
  }
  return <Markdown components={mdComponents}>{body}</Markdown>
}

export function AdminActions({ onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onDelete()
    setDeleting(false)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="p-1.5 text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-base"
        >
          <IconEdit className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          title="Delete"
          className="p-1.5 text-accent hover:text-accent-hover transition-colors rounded-md hover:bg-accent-bg"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </div>
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}
    </>
  )
}
