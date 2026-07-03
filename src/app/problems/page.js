'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, List, Trash2, Plus, Download, PenLine, Check, Minus, Pencil,
} from 'lucide-react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import {
  fetchProblems,
  deleteProblem,
  createProblem,
  updateProblem,
  uploadProblemDocument,
  removeProblemDocument,
  CONTENT_TYPE,
} from '@/services/problemsService'
import { fetchUserSubmissions } from '@/services/submissionsService'
import { ROLES } from '@/utils/constants'
import {
  ProblemForm,
  ProblemBody,
  emptyProblemForm,
  problemToForm,
} from './_shared'
import PageContainer from '@/components/layout/PageContainer'
import { uploadImage } from '@/services/cloudinaryService'
import { uploadLocalImagesInMarkdown, buildPendingImageMap, countRelativeImageUrls } from '@/utils/markdownImport'

const SCHOOLS = ['All Schools', 'Seneca College', 'York University']

function formatDue(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function downloadMd(problem) {
  const slug = (problem.title || 'problem').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const week = problem.week ?? 'x'
  const filename = `week-${week}-${slug}.md`
  const blob = new Blob([problem.description || ''], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function PostView({
  problems, currentIdx, navigateTo, setView, profile, onDelete, onEdit, onNew,
  schoolFilter, setSchoolFilter, showForm, form, onFormChange, onPublish, onCancelForm, submitting, editMode, accessToken,
}) {
  const router = useRouter()
  const problem = problems[currentIdx]
  const isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.EXECUTIVE
  const isOldest = currentIdx === problems.length - 1
  const isNewest = currentIdx === 0
  const isMarkdown = problem?.content_type !== CONTENT_TYPE.DOCUMENT

  return (
    <>
      <div className="bg-bg-surface py-8 border-b border-border">
        <PageContainer className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-montserrat font-bold text-4xl text-text-primary">Problems</h1>
            <SchoolFilter value={schoolFilter} onChange={setSchoolFilter} />
          </div>
          {isAdmin && (
            <button
              onClick={onNew}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              <Plus size={14} />
              New
            </button>
          )}
        </PageContainer>
      </div>

      {showForm ? (
        <div className="flex-1 bg-bg-base py-12">
          <PageContainer>
            <ProblemForm
              form={form}
              onChange={onFormChange}
              onSubmit={onPublish}
              onCancel={onCancelForm}
              submitting={submitting}
              editMode={editMode}
              accessToken={accessToken}
            />
          </PageContainer>
        </div>
      ) : problem ? (
        <>
          <div className="flex-1 bg-bg-base py-12">
            <PageContainer>
              <h2 className="font-montserrat font-semibold text-2xl text-text-primary mb-3">
                {problem.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-text-secondary font-inter text-sm mb-4">
                {problem.week != null && <span>Week {problem.week}</span>}
                {problem.due_date && (
                  <span className="before:content-['📅'] before:mr-1">
                    Due: {formatDue(problem.due_date)}
                  </span>
                )}
                {problem.school && <span className="text-text-hint">· {problem.school}</span>}
                {!isMarkdown && problem.file_format && (
                  <span className="text-text-hint uppercase">· {problem.file_format}</span>
                )}
              </div>

              <hr className="border-border mb-6" />

              <ProblemBody problem={problem} accessToken={accessToken} />

              <button
                onClick={() => router.push(`/solutions?problem=${problem.id}`)}
                className="w-full py-3 rounded-md bg-accent hover:bg-accent-hover text-white font-inter font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PenLine size={14} />
                Go to My Solution →
              </button>
            </PageContainer>
          </div>

          <div className="border-t border-border py-8 bg-bg-base">
            <PageContainer className="flex items-center justify-between">
              <button
                onClick={() => navigateTo(currentIdx + 1)}
                disabled={isOldest}
                className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-border-strong text-text-secondary hover:border-text-primary hover:text-text-primary disabled:hover:border-border-strong disabled:hover:text-text-secondary"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter border border-border-strong text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors"
                >
                  <List size={14} />
                  List
                </button>
                {isMarkdown && (
                  <button
                    onClick={() => downloadMd(problem)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter border border-border-strong text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors"
                    title="Download .md"
                  >
                    <Download size={14} />
                    .md
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo(currentIdx - 1)}
                  disabled={isNewest}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-border-strong text-text-secondary hover:border-text-primary hover:text-text-primary disabled:hover:border-border-strong disabled:hover:text-text-secondary"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit(problem)}
                      title="Edit"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors text-text-secondary hover:text-text-primary"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(problem.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors text-accent hover:text-accent-hover"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </PageContainer>
          </div>
        </>
      ) : (
        <div className="flex-1 bg-bg-base flex items-center justify-center py-24">
          <div className="text-center">
            <p className="text-text-secondary font-inter mb-2">No problems found.</p>
            {isAdmin && (
              <p className="text-sm text-text-hint font-inter">
                Click <span className="font-medium text-text-secondary">New</span> to publish the first problem.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function ListView({
  problems, navigateTo, setView, profile, schoolFilter, setSchoolFilter, userSubmissions,
  onNew, showForm, form, onFormChange, onPublish, onCancelForm, submitting, editMode, accessToken,
}) {
  const isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.EXECUTIVE

  return (
    <>
      <div className="bg-bg-surface py-8 border-b border-border">
        <PageContainer className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-montserrat font-bold text-4xl text-text-primary">Problems</h1>
            <SchoolFilter value={schoolFilter} onChange={setSchoolFilter} />
          </div>
          {isAdmin && (
            <button
              onClick={onNew}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              <Plus size={14} />
              New
            </button>
          )}
        </PageContainer>
      </div>

      {showForm && (
        <div className="bg-bg-base py-12 border-b border-border">
          <PageContainer>
            <ProblemForm
              form={form}
              onChange={onFormChange}
              onSubmit={onPublish}
              onCancel={onCancelForm}
              submitting={submitting}
              editMode={editMode}
              accessToken={accessToken}
            />
          </PageContainer>
        </div>
      )}

      <div className="flex-1 bg-bg-base py-12">
        <PageContainer>
          {problems.length === 0 ? (
            <p className="text-text-secondary font-inter text-center py-16">No problems found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-inter text-sm font-medium text-text-secondary py-3 pr-4 w-16">Week</th>
                  <th className="text-left font-inter text-sm font-medium text-text-secondary py-3 pr-4">Title</th>
                  <th className="text-left font-inter text-sm font-medium text-text-secondary py-3 pr-4">Due</th>
                  <th className="text-center font-inter text-sm font-medium text-text-secondary py-3 w-10">✓</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, idx) => {
                  const solved = userSubmissions.has(p.id)
                  return (
                    <tr
                      key={p.id}
                      onClick={() => { navigateTo(idx); setView('post') }}
                      className="border-b border-border cursor-pointer transition-colors hover:bg-bg-surface"
                    >
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4">
                        {p.week != null ? p.week : '—'}
                      </td>
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4 font-medium">
                        {p.title}
                      </td>
                      <td className="font-inter text-sm text-text-secondary py-3.5 pr-4">
                        {formatDue(p.due_date) ?? '—'}
                      </td>
                      <td className="text-center py-3.5">
                        {solved
                          ? <Check size={15} className="text-success mx-auto" />
                          : <Minus size={15} className="text-text-hint mx-auto" />
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </PageContainer>
      </div>
    </>
  )
}

function SchoolFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="font-inter text-sm text-text-secondary bg-bg-input border border-border-strong rounded-md px-3 py-1.5 focus:outline-none focus:border-accent"
    >
      {SCHOOLS.map(s => <option key={s}>{s}</option>)}
    </select>
  )
}

function ProblemsContent() {
  const { profile, user, accessToken } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState('post')
  const [problems, setProblems] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [schoolFilter, setSchoolFilter] = useState('All Schools')
  const [userSubmissions, setUserSubmissions] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProblemForm())
  const [submitting, setSubmitting] = useState(false)

  const restoredFromUrl = useRef(false)
  useEffect(() => {
    if (problems.length === 0 || restoredFromUrl.current) return
    restoredFromUrl.current = true
    const id = searchParams.get('id')
    if (!id) return
    const idx = problems.findIndex(p => String(p.id) === id)
    if (idx !== -1) setCurrentIdx(idx)
  }, [problems, searchParams])

  const loadProblems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProblems(schoolFilter)
      setProblems(data)
    } catch {
      setError('Failed to load problems. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [schoolFilter])

  const loadSubmissions = useCallback(async () => {
    if (!profile?.id) return
    try {
      const solved = await fetchUserSubmissions(profile.id)
      setUserSubmissions(solved)
    } catch {
      // Non-critical
    }
  }, [profile?.id])

  useEffect(() => { loadProblems() }, [loadProblems])
  useEffect(() => { loadSubmissions() }, [loadSubmissions])
  useEffect(() => { setCurrentIdx(0) }, [schoolFilter])

  function navigateTo(idx) {
    setCurrentIdx(idx)
    const p = problems[idx]
    if (p) router.push(`/problems?id=${p.id}`, { scroll: false })
  }

  function openNew() {
    setEditMode(false)
    setEditingId(null)
    setForm(emptyProblemForm())
    setShowForm(true)
    setView('post')
  }

  function openEdit(problem) {
    setEditMode(true)
    setEditingId(problem.id)
    setForm(problemToForm(problem))
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditMode(false)
    setEditingId(null)
    setForm(emptyProblemForm())
  }

  function parseWeek(value) {
    if (!value?.trim()) return null
    const n = parseInt(value, 10)
    return Number.isNaN(n) ? null : n
  }

  async function persistDocument(problemId, pendingFile, existingPath) {
    const { path, fileFormat } = await uploadProblemDocument(pendingFile, problemId, accessToken)
    if (existingPath) await removeProblemDocument(existingPath)
    return { path, fileFormat }
  }

  async function finalizeMarkdownDescription(description, pendingImageFiles) {
    let body = description
    if (pendingImageFiles?.length) {
      const pendingImageMap = buildPendingImageMap(pendingImageFiles)
      body = await uploadLocalImagesInMarkdown(body, pendingImageMap, async (file) => {
        const { url } = await uploadImage(file, 'problems')
        return url
      })
    }
    if (countRelativeImageUrls(body) > 0) {
      throw new Error('Some images are still missing. Import the markdown folder again or upload PDF/DOCX.')
    }
    return body
  }

  async function handleCreate() {
    if (!form.title.trim()) return
    if (!accessToken) {
      alert('Session expired. Please refresh and log in again.')
      return
    }
    setSubmitting(true)
    let createdId = null
    try {
      const week = parseWeek(form.week)
      const dueDate = form.dueDate || null
      const school = form.school || null

      if (form.contentType === CONTENT_TYPE.DOCUMENT) {
        if (!form.pendingFile) {
          alert('Please upload a .docx or .pdf file.')
          return
        }
        const row = await createProblem({
          title: form.title.trim(),
          week,
          dueDate,
          school,
          contentType: CONTENT_TYPE.DOCUMENT,
          createdBy: user?.id,
        })
        createdId = row.id
        const { path, fileFormat } = await persistDocument(row.id, form.pendingFile, null)
        await updateProblem(row.id, {
          fileUrl: path,
          fileFormat,
          contentType: CONTENT_TYPE.DOCUMENT,
        })
        cancelForm()
        await loadProblems()
        router.push(`/problems?id=${row.id}`)
        return
      }

      const description = await finalizeMarkdownDescription(form.description, form.pendingImageFiles)

      await createProblem({
        title: form.title.trim(),
        description,
        week,
        dueDate,
        school,
        contentType: CONTENT_TYPE.MARKDOWN,
        createdBy: user?.id,
      })
      cancelForm()
      await loadProblems()
      setCurrentIdx(0)
    } catch (err) {
      if (createdId) {
        try { await deleteProblem(createdId) } catch { /* rollback best-effort */ }
      }
      alert(err.message ?? 'Failed to publish. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(id) {
    if (!form.title.trim()) return
    if (!accessToken) {
      alert('Session expired. Please refresh and log in again.')
      return
    }
    setSubmitting(true)
    try {
      const existing = problems.find(p => p.id === id)
      const week = parseWeek(form.week)
      const dueDate = form.dueDate || null
      const school = form.school || null

      if (form.contentType === CONTENT_TYPE.DOCUMENT) {
        let fileUrl = form.fileUrl
        let fileFormat = form.fileFormat
        if (form.pendingFile) {
          const uploaded = await persistDocument(id, form.pendingFile, existing?.file_url)
          fileUrl = uploaded.path
          fileFormat = uploaded.fileFormat
        }
        await updateProblem(id, {
          title: form.title.trim(),
          week,
          dueDate,
          school,
          contentType: CONTENT_TYPE.DOCUMENT,
          fileUrl,
          fileFormat,
          description: '',
        })
      } else {
        if (existing?.content_type === CONTENT_TYPE.DOCUMENT && existing.file_url) {
          await removeProblemDocument(existing.file_url)
        }
        const description = await finalizeMarkdownDescription(form.description, form.pendingImageFiles)
        await updateProblem(id, {
          title: form.title.trim(),
          description,
          week,
          dueDate,
          school,
          contentType: CONTENT_TYPE.MARKDOWN,
          fileFormat: null,
          fileUrl: null,
        })
      }

      cancelForm()
      await loadProblems()
    } catch (err) {
      alert(err.message ?? 'Failed to save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handlePublish() {
    if (editMode && editingId) {
      handleUpdate(editingId)
    } else {
      handleCreate()
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this problem? This cannot be undone.')) return
    try {
      await deleteProblem(id)
      cancelForm()
      await loadProblems()
      setCurrentIdx(0)
    } catch {
      alert('Failed to delete. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-text-secondary font-inter">{error}</p>
      </div>
    )
  }

  const formProps = {
    showForm,
    form,
    onFormChange: setForm,
    onPublish: handlePublish,
    onCancelForm: cancelForm,
    submitting,
    editMode,
    accessToken,
  }

  const sharedProps = {
    problems,
    profile,
    schoolFilter,
    setSchoolFilter,
    userSubmissions,
    onNew: openNew,
    ...formProps,
  }

  return view === 'post' ? (
    <PostView
      {...sharedProps}
      currentIdx={currentIdx}
      navigateTo={navigateTo}
      setView={setView}
      onDelete={handleDelete}
      onEdit={openEdit}
    />
  ) : (
    <ListView
      {...sharedProps}
      navigateTo={navigateTo}
      setView={setView}
    />
  )
}

export default function ProblemsPage() {
  return (
    <RoleGuard>
      <div className="min-h-screen flex flex-col bg-bg-base">
        <Suspense>
          <ProblemsContent />
        </Suspense>
      </div>
    </RoleGuard>
  )
}
