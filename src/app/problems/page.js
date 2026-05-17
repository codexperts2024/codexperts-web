'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, List, Trash2, Plus, Download, PenLine, Check, Minus,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { ROLES } from '@/utils/constants'

const SCHOOLS = ['All Schools', 'Seneca College', 'York University']

function LanguageTag({ lang }) {
  return (
    <span
      className="font-inter inline-block"
      style={{ background: '#FDECEA', color: '#C0392B', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}
    >
      {lang}
    </span>
  )
}

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

function PostView({ problems, currentIdx, setCurrentIdx, setView, profile, onDelete, schoolFilter, setSchoolFilter }) {
  const router = useRouter()
  const problem = problems[currentIdx]
  const isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.EXECUTIVE
  const isFirst = currentIdx === problems.length - 1
  const isLast = currentIdx === 0

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-text-secondary font-inter">No problems found.</p>
      </div>
    )
  }

  const langs = Array.isArray(problem.languages) ? problem.languages : []

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
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter text-white transition-colors"
              style={{ background: '#C0392B' }}
              onMouseEnter={e => e.currentTarget.style.background = '#A93226'}
              onMouseLeave={e => e.currentTarget.style.background = '#C0392B'}
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
            {langs.length > 0 && (
              <span className="flex items-center gap-1.5">
                {langs.map((l, i) => <LanguageTag key={i} lang={l} />)}
              </span>
            )}
            {problem.week != null && (
              <span className={langs.length > 0 ? 'before:content-["·"] before:mr-2' : ''}>
                Week {problem.week}
              </span>
            )}
            {problem.due_date && (
              <span className="before:content-['📅'] before:mr-1">
                Due: {formatDue(problem.due_date)}
              </span>
            )}
            {problem.school && (
              <span className="text-text-hint">· {problem.school}</span>
            )}
            {problem.posted_by && (
              <span className="text-text-hint">· Posted by: {problem.posted_by}</span>
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
            onClick={() => setCurrentIdx(i => i + 1)}
            disabled={isFirst}
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
              onClick={() => setCurrentIdx(i => i - 1)}
              disabled={isLast}
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

function ListView({ problems, setCurrentIdx, setView, profile, schoolFilter, setSchoolFilter, userSubmissions }) {
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium font-inter text-white transition-colors"
              style={{ background: '#C0392B' }}
              onMouseEnter={e => e.currentTarget.style.background = '#A93226'}
              onMouseLeave={e => e.currentTarget.style.background = '#C0392B'}
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
                  <th className="text-left font-inter text-sm font-medium text-text-secondary py-3 pr-4">Lang</th>
                  <th className="text-left font-inter text-sm font-medium text-text-secondary py-3 pr-4">Due</th>
                  <th className="text-center font-inter text-sm font-medium text-text-secondary py-3 w-10">✓</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, idx) => {
                  const solved = userSubmissions.has(p.id)
                  const langs = Array.isArray(p.languages) ? p.languages : []
                  return (
                    <tr
                      key={p.id}
                      onClick={() => { setCurrentIdx(idx); setView('post') }}
                      className="border-b border-border cursor-pointer transition-colors hover:bg-bg-surface"
                    >
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4">
                        {p.week != null ? p.week : '—'}
                      </td>
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4 font-medium">
                        {p.title}
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {langs.length > 0
                            ? langs.map((l, i) => <LanguageTag key={i} lang={l} />)
                            : <span className="text-text-hint text-sm">—</span>
                          }
                        </div>
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
  const [view, setView] = useState('post')
  const [problems, setProblems] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [schoolFilter, setSchoolFilter] = useState('All Schools')
  const [userSubmissions, setUserSubmissions] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const fetchProblems = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('problems')
      .select('*')
      .order('week', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (schoolFilter !== 'All Schools') {
      query = query.eq('school', schoolFilter)
    }

    const { data, error } = await query
    if (!error && data) setProblems(data)
    setLoading(false)
  }, [schoolFilter])

  const fetchSubmissions = useCallback(async () => {
    if (!profile?.id) return
    const { data } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('profile_id', profile.id)
    if (data) setUserSubmissions(new Set(data.map(s => s.problem_id)))
  }, [profile?.id])

  useEffect(() => { fetchProblems() }, [fetchProblems])
  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])
  useEffect(() => { setCurrentIdx(0) }, [schoolFilter])

  async function handleDelete(id) {
    if (!confirm('Delete this problem? This cannot be undone.')) return
    await supabase.from('problems').delete().eq('id', id)
    await fetchProblems()
    setCurrentIdx(0)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  const sharedProps = { problems, profile, schoolFilter, setSchoolFilter, userSubmissions }

  return view === 'post' ? (
    <PostView
      {...sharedProps}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      setView={setView}
      onDelete={handleDelete}
    />
  ) : (
    <ListView
      {...sharedProps}
      setCurrentIdx={setCurrentIdx}
      setView={setView}
    />
  )
}

export default function ProblemsPage() {
  return (
    <RoleGuard>
      <div className="min-h-screen flex flex-col bg-bg-base">
        <ProblemsContent />
      </div>
    </RoleGuard>
  )
}
