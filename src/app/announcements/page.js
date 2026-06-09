'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminRoutes } from '@/utils/constants'
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/services/announcementService'
import { formatDate, PageHeader, PostContent, NavRow, PostForm } from './_shared'

const ITEMS_PER_PAGE = 20

function ListView({ announcements, isAdmin, onNew, showForm, form, onFormChange, onPublish, onCancelForm, publishing }) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const visible = announcements.slice(start, start + ITEMS_PER_PAGE)

  return (
    <>
      <PageHeader isAdmin={isAdmin} onNew={onNew} />

      {showForm && (
        <div className="bg-white py-8 px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto">
            <PostForm
              form={form}
              onChange={onFormChange}
              onSubmit={onPublish}
              onCancel={onCancelForm}
              submitting={publishing}
            />
          </div>
        </div>
      )}

      <div className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto">
          {announcements.length === 0 ? (
            <p className="text-center text-text-hint font-inter py-16">No announcements yet.</p>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-xs font-medium text-text-hint font-inter w-12">#</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-text-hint font-inter">Title</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-text-hint font-inter w-28">Date</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-text-hint font-inter w-28">Author</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item, i) => {
                    const rowNum = announcements.length - (start + i)
                    return (
                      <tr
                        key={item.id}
                        onClick={() => router.push(`/announcements/${item.id}`)}
                        className="border-b border-border hover:bg-[#F9F9F9] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3 text-sm text-text-hint font-inter">{rowNum}</td>
                        <td className="py-3 px-3 text-sm text-text-primary font-inter">{item.title}</td>
                        <td className="py-3 px-3 text-sm text-text-hint font-inter whitespace-nowrap">{formatDate(item.createdAt)}</td>
                        <td className="py-3 px-3 text-sm text-text-secondary font-inter">{item.authorName}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 font-inter text-sm text-text-secondary">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-border-strong rounded-md disabled:text-border-strong disabled:border-border hover:bg-[#F9F9F9] transition-colors"
                  >
                    ← Prev
                  </button>
                  <span>Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-border-strong rounded-md disabled:text-border-strong disabled:border-border hover:bg-[#F9F9F9] transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

function AnnouncementsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const isAdmin = canAccessAdminRoutes(profile?.role)

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  const view = searchParams.get('view')

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .finally(() => setLoading(false))
  }, [])

  function openNew() { setEditMode(false); setForm({ title: '', content: '' }); setShowForm(true) }
  function openEdit(post) { setEditMode(true); setForm({ title: post.title, content: post.content }); setShowForm(true) }
  function cancelForm() { setShowForm(false); setEditMode(false); setForm({ title: '', content: '' }) }

  async function handlePublish() {
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const post = await createAnnouncement(form.title.trim(), form.content, user.id)
      setAnnouncements(prev => [post, ...prev])
      cancelForm()
      router.push(`/announcements/${post.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(id) {
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const updated = await updateAnnouncement(id, form.title.trim(), form.content)
      setAnnouncements(prev => prev.map(a => a.id === id ? updated : a))
      cancelForm()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    await deleteAnnouncement(id)
    const remaining = announcements.filter(a => a.id !== id)
    setAnnouncements(remaining)
    if (remaining.length > 0) {
      router.push(`/announcements/${remaining[0].id}`)
    } else {
      router.push('/announcements')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
      </div>
    )
  }

  if (view === 'list') {
    return (
      <ListView
        announcements={announcements}
        isAdmin={isAdmin}
        onNew={openNew}
        showForm={showForm}
        form={form}
        onFormChange={setForm}
        onPublish={handlePublish}
        onCancelForm={cancelForm}
        publishing={submitting}
      />
    )
  }

  const post = announcements[0] ?? null

  return (
    <>
      <PageHeader isAdmin={isAdmin} onNew={openNew} />

      {showForm && (
        <div className="bg-white py-8 px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto">
            <PostForm
              form={form}
              onChange={setForm}
              onSubmit={editMode ? () => handleUpdate(post.id) : handlePublish}
              onCancel={cancelForm}
              submitting={submitting}
              editMode={editMode}
            />
          </div>
        </div>
      )}

      {post ? (
        <>
          {!showForm && <PostContent post={post} />}
          <NavRow
            prevDisabled={announcements.length <= 1}
            nextDisabled
            onPrev={() => router.push(`/announcements/${announcements[1].id}`)}
            onNext={() => {}}
            onList={() => router.push('/announcements?view=list')}
            onDelete={() => handleDelete(post.id)}
            onEdit={() => openEdit(post)}
            isAdmin={isAdmin}
          />
        </>
      ) : (
        <div className="bg-white py-20 px-4 text-center">
          <p className="text-text-hint font-inter">No announcements yet.</p>
        </div>
      )}
    </>
  )
}

export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
          </div>
        }
      >
        <AnnouncementsContent />
      </Suspense>
    </main>
  )
}
