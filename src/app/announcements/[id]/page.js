'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import { formatRequestError } from '@/utils/requestErrors'
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/services/announcementService'
import { PageHeader, PostContent, NavRow, PostForm } from '../_shared'

export default function AnnouncementPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const isAdmin = canAccessAdminRoutes(profile?.role)

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .finally(() => setLoading(false))
  }, [])

  const numId = Number(id)
  const idx = announcements.findIndex(a => a.id === numId)
  const post = idx !== -1 ? announcements[idx] : null

  function openNew() {
    setEditMode(false)
    setForm({ title: '', content: '' })
    setFormError('')
    setActionError('')
    setShowForm(true)
  }
  function openEdit() {
    setEditMode(true)
    setForm({ title: post.title, content: post.content })
    setFormError('')
    setActionError('')
    setShowForm(true)
  }
  function cancelForm() {
    setShowForm(false)
    setEditMode(false)
    setForm({ title: '', content: '' })
    setFormError('')
  }

  async function handlePublish() {
    if (!form.title.trim()) return
    if (!user || !isAdmin) {
      setFormError('You do not have permission to do that.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const created = await createAnnouncement(form.title.trim(), form.content, user.id)
      setAnnouncements(prev => [created, ...prev])
      cancelForm()
      router.push(`/announcements/${created.id}`)
    } catch (err) {
      setFormError(formatRequestError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate() {
    if (!form.title.trim()) return
    if (!user || !isAdmin) {
      setFormError('You do not have permission to do that.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const updated = await updateAnnouncement(numId, form.title.trim(), form.content)
      setAnnouncements(prev => prev.map(a => a.id === numId ? updated : a))
      cancelForm()
    } catch (err) {
      setFormError(formatRequestError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!user || !isAdmin) {
      setActionError('You do not have permission to do that.')
      throw new Error('Forbidden')
    }
    setActionError('')
    try {
      await deleteAnnouncement(numId)
      const remaining = announcements.filter(a => a.id !== numId)
      setAnnouncements(remaining)
      if (remaining.length > 0) {
        router.push(`/announcements/${remaining[0].id}`)
      } else {
        router.push('/announcements')
      }
    } catch (err) {
      setActionError(formatRequestError(err))
      throw err
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-base flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-bg-base">
        <div className="bg-bg-surface py-8 px-4 sm:px-6">
          <div className="max-w-[900px] mx-auto">
            <h1 className="font-montserrat font-bold text-4xl text-text-primary">Announcements</h1>
          </div>
        </div>
        <div className="bg-bg-base py-20 px-4 text-center">
          <p className="text-text-hint font-inter">Announcement not found.</p>
          <button
            onClick={() => router.push('/announcements')}
            className="mt-4 text-sm font-inter text-link hover:underline"
          >
            Back to Announcements
          </button>
        </div>
      </main>
    )
  }

  const isNewest = idx === 0
  const isOldest = idx === announcements.length - 1

  return (
    <main className="min-h-screen bg-bg-base">
      <PageHeader isAdmin={isAdmin} onNew={openNew} />

      {actionError && !showForm && (
        <div className="bg-bg-base px-4 sm:px-6 pt-4">
          <div className="max-w-[800px] mx-auto">
            <p className="text-sm text-error font-inter">{actionError}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-bg-base py-8 px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto">
            <PostForm
              form={form}
              onChange={setForm}
              onSubmit={editMode ? handleUpdate : handlePublish}
              onCancel={cancelForm}
              submitting={submitting}
              editMode={editMode}
              error={formError}
            />
          </div>
        </div>
      )}

      {!showForm && <PostContent post={post} />}

      <NavRow
        prevDisabled={isOldest}
        nextDisabled={isNewest}
        onPrev={() => router.push(`/announcements/${announcements[idx + 1].id}`)}
        onNext={() => router.push(`/announcements/${announcements[idx - 1].id}`)}
        onList={() => router.push('/announcements?view=list')}
        onDelete={handleDelete}
        onEdit={openEdit}
        isAdmin={isAdmin}
      />
    </main>
  )
}
