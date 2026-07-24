'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import { isEventUpcoming, formatEventDate } from '@/lib/events'
import Gallery from '@/components/gallery'
import {
  fetchEventById,
  fetchEventNavItems,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventCategories,
} from '@/services/eventService'
import {
  PageHeader,
  EventForm,
  EventBody,
  AdminActions,
  EMPTY_EVENT_FORM,
  eventToForm,
  formToPayload,
} from '../_shared'

function sortUpcoming(events) {
  return [...events].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date(a.date)
    const dateB = b.endDate ? new Date(b.endDate) : new Date(b.date)
    return dateA - dateB
  })
}

function sortPast(events) {
  return [...events].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date(a.date)
    const dateB = b.endDate ? new Date(b.endDate) : new Date(b.date)
    return dateB - dateA
  })
}

function getAdjacent(events, currentId) {
  const index = events.findIndex((e) => e.id === currentId)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: index > 0 ? events[index - 1] : null,
    next: index < events.length - 1 ? events[index + 1] : null,
  }
}

export default function EventDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, profile } = useAuth()
  const isAdmin = canAccessAdminRoutes(profile?.role)

  const [event, setEvent] = useState(null)
  const [navEvents, setNavEvents] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)
      setError('')
      try {
        const [detail, nav, cats] = await Promise.all([
          fetchEventById(id, { signal: controller.signal }),
          fetchEventNavItems({ signal: controller.signal }),
          fetchEventCategories(),
        ])
        if (cancelled) return
        setEvent(detail)
        setNavEvents(nav)
        setCategoryOptions(cats)
      } catch (err) {
        if (cancelled) return
        if (!cancelled) {
          setNotFound(true)
          setError(
            err?.name === 'AbortError'
              ? 'Request timed out. Refresh the page and try again.'
              : (err?.message || 'Failed to load event')
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

  function openNew() {
    setEditMode(false)
    setForm(EMPTY_EVENT_FORM)
    setShowForm(true)
    setError('')
  }

  function openEdit() {
    if (!event) return
    setEditMode(true)
    setForm(eventToForm(event))
    setShowForm(true)
    setError('')
  }

  function cancelForm() {
    setShowForm(false)
    setEditMode(false)
    setForm(EMPTY_EVENT_FORM)
  }

  async function handlePublish() {
    if (!form.title.trim() || !form.date || !user?.id) return
    setSubmitting(true)
    setError('')
    try {
      const created = await createEvent(formToPayload(form), user.id)
      cancelForm()
      router.push(`/events/${created.id}`)
    } catch (err) {
      setError(err.message || 'Failed to publish event')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate() {
    if (!form.title.trim() || !form.date || !event) return
    setSubmitting(true)
    setError('')
    try {
      const updated = await updateEvent(event.id, formToPayload(form))
      setEvent(updated)
      setNavEvents((prev) =>
        prev.map((e) =>
          e.id === updated.id
            ? { id: updated.id, date: updated.date, endDate: updated.endDate }
            : e
        )
      )
      if (updated.category) {
        setCategoryOptions((prev) => [...new Set([...prev, updated.category])])
      }
      cancelForm()
    } catch (err) {
      setError(err.message || 'Failed to update event')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!event) return
    await deleteEvent(event.id)
    router.push('/events')
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-bg-base">
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
        </div>
      </main>
    )
  }

  if (notFound || !event) {
    return (
      <main className="min-h-screen w-full bg-bg-base flex items-center justify-center px-4">
        <div className="bg-bg-surface rounded-lg border border-border p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold font-montserrat text-text-primary mb-2">Event Not Found</h2>
          <p className="text-text-secondary font-inter mb-6">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-base transition-colors"
          >
            ← Back to Events
          </Link>
        </div>
      </main>
    )
  }

  const isPast = !isEventUpcoming(event)
  const siblings = isPast
    ? sortPast(navEvents.filter((e) => !isEventUpcoming(e)))
    : sortUpcoming(navEvents.filter(isEventUpcoming))
  const { previous, next } = getAdjacent(siblings, event.id)

  const btnBase = 'px-4 py-2 border rounded-md text-sm font-inter transition-colors'
  const btnActive = `${btnBase} border-border-strong text-text-secondary hover:bg-bg-base`
  const btnDisabled = `${btnBase} border-border text-border-strong cursor-not-allowed`

  return (
    <main className="min-h-screen w-full bg-bg-base">
      <PageHeader isAdmin={isAdmin} onNew={openNew} />

      {showForm && (
        <div className="bg-bg-surface py-8 px-6 md:px-8">
          <div className="max-w-[800px] mx-auto">
            <EventForm
              form={form}
              onChange={setForm}
              onSubmit={editMode ? handleUpdate : handlePublish}
              onCancel={cancelForm}
              submitting={submitting}
              editMode={editMode}
              categoryOptions={categoryOptions}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="px-6 md:px-8 py-4">
          <p className="max-w-6xl mx-auto text-sm font-inter text-error">{error}</p>
        </div>
      )}

      {!showForm && (
        <>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[13px] text-text-secondary font-inter">
                <Link href="/events" className="hover:text-text-primary transition">
                  Events
                </Link>
                <span>/</span>
                <span className="text-text-primary">{event.title}</span>
              </div>
              <Link
                href="/events"
                className="text-sm font-inter text-text-secondary hover:text-text-primary transition"
              >
                ← Back to Events
              </Link>
            </div>
          </div>

          <div className="px-4 sm:px-6">
            <div className="max-w-6xl mx-auto bg-bg-layer1 rounded-lg overflow-hidden">
              {event.coverImageUrl ? (
                <Image
                  src={event.coverImageUrl}
                  alt={event.title}
                  width={1600}
                  height={900}
                  className="w-full h-auto max-h-[560px] object-contain mx-auto"
                  sizes="(max-width: 1280px) 100vw, 1152px"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-[240px] bg-bg-layer2" />
              )}
            </div>
          </div>

          <section className="bg-bg-surface py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-text-primary">
                  {event.title}
                </h1>
                {isAdmin && (
                  <AdminActions onEdit={openEdit} onDelete={handleDelete} />
                )}
              </div>

              <p className="mt-4 text-sm font-inter text-text-secondary">
                {formatEventDate(event.date, event.endDate)}
                {event.location ? ` · ${event.location}` : ''}
                {event.campus ? ` · ${event.campus}` : ''}
              </p>

              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-accent hover:bg-accent-hover text-bg-base font-inter text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
                >
                  {event.ctaLabel || 'Register'}
                </a>
              )}

              <div className="border-t border-border my-8" />

              <h3 className="text-xl font-semibold font-montserrat text-text-primary mb-4">
                About this Event
              </h3>
              <EventBody body={event.body} />
            </div>
          </section>

          {event.galleryUrls?.length > 0 && (
            <section className="bg-bg-base py-12 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <Gallery gallery={event.galleryUrls} eventTitle={event.title} />
              </div>
            </section>
          )}

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between">
              {previous ? (
                <Link href={`/events/${previous.id}`} className={btnActive}>
                  ← Previous Event
                </Link>
              ) : (
                <span className={btnDisabled}>← Previous Event</span>
              )}
              {next ? (
                <Link href={`/events/${next.id}`} className={btnActive}>
                  Next Event →
                </Link>
              ) : (
                <span className={btnDisabled}>Next Event →</span>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
