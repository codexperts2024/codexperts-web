'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, List, Trash2, Plus, Download, PenLine, Check, Minus,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { fetchProblems, deleteProblem } from '@/services/problemsService'
import { fetchUserSubmissions } from '@/services/submissionsService'
import { ROLES } from '@/utils/constants'

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

function PostView({ problems, currentIdx, navigateTo, setView, profile, onDelete, schoolFilter, setSchoolFilter }) {
  const router = useRouter()
  const problem = problems[currentIdx]
  const isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.EXECUTIVE
  const isOldest = currentIdx === problems.length - 1
  const isNewest = currentIdx === 0

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-text-secondary font-inter">No problems found.</p>
      </div>
    )
  }

  return (
    <>
      {/* Page header */}
      <div className="bg-bg-surface py-8 border-b border-border">
        <div className="max-w-[800px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-montserrat font-bold text-4xl text-text-primary">Problems</h1>
            <SchoolFilter value={schoolFilter} onChange={setSchoolFilter} />
          </div>
          {isAdmin && (
            <button
              disabled
              title="Coming soon"
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter text-white transition-colors opacity-40 cursor-not-allowed"
              style={{ background: '#C0392B' }}
            >
              <Plus size={14} />
              New
            </button>
          )}
        </div>
      </div>

      {/* Problem content */}
      <div className="flex-1 bg-bg-base py-12">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="font-montserrat font-semibold text-2xl text-text-primary mb-3">
            {problem.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-text-secondary font-inter text-sm mb-4">
            {problem.week != null && (
              <span>Week {problem.week}</span>
            )}
            {problem.due_date && (
              <span className="before:content-['📅'] before:mr-1">
                Due: {formatDue(problem.due_date)}
              </span>
            )}
            {problem.school && (
              <span className="text-text-hint">· {problem.school}</span>
            )}
          </div>

          <hr className="border-border mb-6" />

          {/* Markdown body */}
          <div className="font-inter text-base text-text-primary leading-[1.7] prose max-w-none mb-8
            prose-headings:font-montserrat prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-code:font-mono prose-code:text-sm prose-code:bg-bg-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-bg-elevated prose-pre:p-4 prose-pre:rounded-lg prose-pre:font-mono prose-pre:text-sm">
            <ReactMarkdown>{problem.description || '_No content._'}</ReactMarkdown>
          </div>

          {/* Solution button */}
          <button
            onClick={() => router.push(`/solutions?problem=${problem.id}`)}
            className="w-full py-3 rounded-md text-white font-inter font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ background: '#C0392B' }}
            onMouseEnter={e => e.currentTarget.style.background = '#A93226'}
            onMouseLeave={e => e.currentTarget.style.background = '#C0392B'}
          >
            <PenLine size={14} />
            Go to My Solution →
          </button>
        </div>
      </div>

      {/* Navigation row */}
      <div className="border-t border-border py-8 bg-bg-base">
        <div className="max-w-[800px] mx-auto px-6 flex items-center justify-between">
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
            <button
              onClick={() => downloadMd(problem)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter border border-border-strong text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors"
              title="Download .md"
            >
              <Download size={14} />
              .md
            </button>
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
              <button
                onClick={() => onDelete(problem.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors text-accent hover:text-accent-hover"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function ListView({ problems, navigateTo, setView, profile, schoolFilter, setSchoolFilter, userSubmissions }) {
  const isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.EXECUTIVE

  return (
    <>
      {/* Page header */}
      <div className="bg-bg-surface py-8 border-b border-border">
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-montserrat font-bold text-4xl text-text-primary">Problems</h1>
            <SchoolFilter value={schoolFilter} onChange={setSchoolFilter} />
          </div>
          {isAdmin && (
            <button
              disabled
              title="Coming soon"
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter text-white transition-colors opacity-40 cursor-not-allowed"
              style={{ background: '#C0392B' }}
            >
              <Plus size={14} />
              New
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-bg-base py-12">
        <div className="max-w-[900px] mx-auto px-6">
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
                          ? <Check size={15} style={{ color: '#2E7D5E', margin: '0 auto' }} />
                          : <Minus size={15} className="text-text-hint mx-auto" />
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
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
  const { profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState('post')
  const [problems, setProblems] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [schoolFilter, setSchoolFilter] = useState('All Schools')
  const [userSubmissions, setUserSubmissions] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Restore index from URL on first load only
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
      // Submissions are non-critical; fail silently
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

  async function handleDelete(id) {
    if (!confirm('Delete this problem? This cannot be undone.')) return
    try {
      await deleteProblem(id)
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

  const sharedProps = { problems, profile, schoolFilter, setSchoolFilter, userSubmissions }

  return view === 'post' ? (
    <PostView
      {...sharedProps}
      currentIdx={currentIdx}
      navigateTo={navigateTo}
      setView={setView}
      onDelete={handleDelete}
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
