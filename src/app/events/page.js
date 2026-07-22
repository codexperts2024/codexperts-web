'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import { isEventUpcoming } from '@/lib/events'
import {
  fetchEvents,
  createEvent,
  fetchEventCategories,
} from '@/services/eventService'
import UpcomingEvents from '@/components/UpcomingEvents'
import PastEventsId from '@/components/PastEventsId'
import {
  PageHeader,
  EventForm,
  EMPTY_EVENT_FORM,
  formToPayload,
} from './_shared'

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

export default function EventsPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const isAdmin = canAccessAdminRoutes(profile?.role)

  const [events, setEvents] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchEvents(), fetchEventCategories()])
      .then(([list, cats]) => {
        setEvents(list)
        setCategoryOptions(cats)
      })
      .catch((err) => setError(err.message || 'Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  function openNew() {
    setForm(EMPTY_EVENT_FORM)
    setShowForm(true)
    setError('')
  }

  function cancelForm() {
    setShowForm(false)
    setForm(EMPTY_EVENT_FORM)
  }

  async function handlePublish() {
    if (!form.title.trim() || !form.date || !user?.id) return
    setSubmitting(true)
    setError('')
    try {
      const created = await createEvent(formToPayload(form), user.id)
      setEvents((prev) => [created, ...prev])
      if (created.category) {
        setCategoryOptions((prev) => [...new Set([...prev, created.category])])
      }
      cancelForm()
      router.push(`/events/${created.id}`)
    } catch (err) {
      setError(err.message || 'Failed to publish event')
    } finally {
      setSubmitting(false)
    }
  }

  const upcoming = sortUpcoming(events.filter(isEventUpcoming))
  const past = sortPast(events.filter((e) => !isEventUpcoming(e)))

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-bg-base">
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-bg-base font-inter">
      <PageHeader isAdmin={isAdmin} onNew={openNew} />

      {showForm && (
        <div className="bg-bg-surface py-8 px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto">
            <EventForm
              form={form}
              onChange={setForm}
              onSubmit={handlePublish}
              onCancel={cancelForm}
              submitting={submitting}
              categoryOptions={categoryOptions}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 sm:px-6 py-4">
          <p className="max-w-6xl mx-auto text-sm font-inter text-error">{error}</p>
        </div>
      )}

      {!showForm && (
        <>
          <UpcomingEvents events={upcoming} />
          <PastEventsId events={past} />
        </>
      )}
    </main>
  )
}
