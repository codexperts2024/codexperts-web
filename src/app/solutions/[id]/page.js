'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Columns2, Loader2, Rows2 } from 'lucide-react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { ProblemBody } from '@/app/problems/_shared'
import { fetchProblemById } from '@/services/problemsService'
import {
  fetchCommunitySubmissions,
  fetchOwnSubmission,
} from '@/services/submissionsService'
import {
  SOLUTION_LANGUAGES,
  executeCode,
  executeSamples,
  languageLabel,
  submitSolution,
} from '@/services/solutionService'
import { normalizeSampleTests } from '@/services/problemsService'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const STARTER = {
  python: 'def solution():\n    pass\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  c: '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n',
  javascript: 'function solution() {\n  \n}\n',
  typescript: 'function solution(): void {\n  \n}\n',
}

const PROBLEM_SIZE_MIN = 22
const PROBLEM_SIZE_MAX = 78

function clampProblemSize(value) {
  return Math.min(PROBLEM_SIZE_MAX, Math.max(PROBLEM_SIZE_MIN, value))
}

function formatDue(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatSubmitted(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function memberInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?'
}

function SolutionWorkspace() {
  const params = useParams()
  const problemId = Number(params?.id)
  const { profile, accessToken } = useAuth()

  const [problem, setProblem] = useState(null)
  const [tab, setTab] = useState('mine')
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(STARTER.python)
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [community, setCommunity] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [communityLoading, setCommunityLoading] = useState(false)
  const [problemOpen, setProblemOpen] = useState(true)
  const [layout, setLayout] = useState('split') // 'split' | 'stack'
  const [problemSize, setProblemSize] = useState(48) // percent of workspace
  const workspaceRef = useRef(null)
  const draggingRef = useRef(false)

  const monacoLanguage = useMemo(
    () => SOLUTION_LANGUAGES.find((l) => l.value === language)?.monaco || 'python',
    [language],
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!Number.isFinite(problemId) || problemId <= 0) {
        setError('Invalid problem id')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const row = await fetchProblemById(problemId)
        if (cancelled) return
        setProblem(row)

        if (profile?.id) {
          const own = await fetchOwnSubmission(profile.id, problemId)
          if (cancelled) return
          if (own?.code) {
            setCode(own.code)
            if (own.language) setLanguage(own.language)
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load problem')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [problemId, profile?.id])

  const loadCommunity = useCallback(async () => {
    setCommunityLoading(true)
    try {
      const rows = await fetchCommunitySubmissions(problemId)
      setCommunity(rows)
    } catch (err) {
      setError(err.message || 'Failed to load community solutions')
    } finally {
      setCommunityLoading(false)
    }
  }, [problemId])

  useEffect(() => {
    if (tab === 'community') {
      loadCommunity()
    }
  }, [tab, loadCommunity])

  useEffect(() => {
    function onPointerMove(event) {
      if (!draggingRef.current || !workspaceRef.current) return
      const rect = workspaceRef.current.getBoundingClientRect()
      if (layout === 'split') {
        const next = ((event.clientX - rect.left) / rect.width) * 100
        setProblemSize(clampProblemSize(next))
      } else {
        const next = ((event.clientY - rect.top) / rect.height) * 100
        setProblemSize(clampProblemSize(next))
      }
    }

    function onPointerUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [layout])

  function startResize(event) {
    event.preventDefault()
    draggingRef.current = true
    document.body.style.cursor = layout === 'split' ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
  }
  function handleLanguageChange(next) {
    setLanguage(next)
    setCode((prev) => {
      const isStarter = Object.values(STARTER).includes(prev)
      if (!prev.trim() || isStarter) return STARTER[next] || ''
      return prev
    })
  }

  async function handleRun() {
    setStatusMessage('')
    setError('')
    setRunning(true)
    setOutput({ pending: true })
    try {
      const samples = normalizeSampleTests(problem?.sample_tests)
      if (samples.length > 0) {
        const result = await executeSamples({
          accessToken,
          problemId,
          language,
          code,
        })
        setOutput({
          pending: false,
          mode: 'samples',
          passed: result.passed,
          total: result.total,
          results: result.results || [],
        })
      } else {
        const result = await executeCode({
          accessToken,
          language,
          code,
        })
        setOutput({
          pending: false,
          mode: 'raw',
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          runtime: result.runtime,
          exitCode: result.exit_code,
        })
      }
    } catch (err) {
      setOutput(null)
      setError(err.message || 'Run failed')
    } finally {
      setRunning(false)
    }
  }

  async function handleSubmit() {
    setStatusMessage('')
    setError('')
    setSubmitting(true)
    try {
      const result = await submitSolution({
        accessToken,
        problemId,
        language,
        code,
      })
      setStatusMessage(result.message || 'Solution submitted!')
      if (tab === 'community') {
        await loadCommunity()
      }
    } catch (err) {
      setError(err.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-base">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="font-inter text-sm text-text-secondary">Loading workspace…</p>
        </div>
      </main>
    )
  }

  if (!problem) {
    return (
      <main className="min-h-screen bg-bg-base">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="font-inter text-sm text-accent">{error || 'Problem not found'}</p>
          <Link href="/solutions" className="font-inter text-sm text-text-secondary underline mt-4 inline-block">
            Back to Solutions
          </Link>
        </div>
      </main>
    )
  }

  const titleBits = [
    problem.week != null ? `Week ${problem.week}` : null,
    problem.title,
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-bg-base">
      <div className="bg-bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <p className="font-inter text-sm text-text-secondary mb-2">
            <Link href="/solutions" className="hover:text-text-primary">Solutions</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{titleBits.join(' — ')}</span>
          </p>
          <div className="font-inter text-sm text-text-secondary flex flex-wrap gap-x-2 gap-y-1">
            <span>Due {formatDue(problem.due_date) ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-6 border-b border-border">
          <button
            type="button"
            onClick={() => setTab('mine')}
            className={`font-inter text-sm pb-3 -mb-px border-b-2 transition-colors ${
              tab === 'mine'
                ? 'border-accent font-bold text-text-primary'
                : 'border-transparent text-text-secondary'
            }`}
          >
            My Solution
          </button>
          <button
            type="button"
            onClick={() => setTab('community')}
            className={`font-inter text-sm pb-3 -mb-px border-b-2 transition-colors ${
              tab === 'community'
                ? 'border-accent font-bold text-text-primary'
                : 'border-transparent text-text-secondary'
            }`}
          >
            Community Solutions
          </button>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 pb-16">
        {error && (
          <p className="font-inter text-sm text-accent mb-4">{error}</p>
        )}
        {statusMessage && (
          <p className="font-inter text-sm text-success mb-4">{statusMessage}</p>
        )}

        {tab === 'mine' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setProblemOpen((open) => !open)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-inter text-sm text-text-primary hover:bg-bg-surface"
                >
                  {problemOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {problemOpen ? 'Hide problem' : 'Show problem'}
                </button>
                <div className="inline-flex rounded-md border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLayout('stack')}
                    title="Stack vertically"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-inter text-sm ${
                      layout === 'stack'
                        ? 'bg-bg-surface text-text-primary'
                        : 'text-text-secondary hover:bg-bg-surface'
                    }`}
                  >
                    <Rows2 size={16} />
                    Stack
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('split')}
                    title="Side by side"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-inter text-sm border-l border-border ${
                      layout === 'split'
                        ? 'bg-bg-surface text-text-primary'
                        : 'text-text-secondary hover:bg-bg-surface'
                    }`}
                  >
                    <Columns2 size={16} />
                    Split
                  </button>
                </div>
              </div>
              <label className="font-inter text-sm text-text-secondary flex items-center gap-2">
                Language
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="border border-border rounded-md px-3 py-1.5 bg-bg-base text-text-primary"
                >
                  {SOLUTION_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div
              ref={workspaceRef}
              className={`min-h-[560px] h-[calc(100vh-260px)] ${
                problemOpen && layout === 'split'
                  ? 'flex flex-row'
                  : 'flex flex-col'
              }`}
            >
              {problemOpen && (
                <>
                  <aside
                    className="border border-border rounded-md bg-white flex flex-col min-h-0 min-w-0 overflow-hidden"
                    style={
                      layout === 'split'
                        ? { width: `${problemSize}%`, flexShrink: 0 }
                        : { height: `${problemSize}%`, flexShrink: 0 }
                    }
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-surface shrink-0">
                      <p className="font-inter text-sm font-medium text-text-primary">Problem</p>
                      <button
                        type="button"
                        onClick={() => setProblemOpen(false)}
                        className="font-inter text-xs text-text-secondary hover:text-text-primary"
                      >
                        Collapse
                      </button>
                    </div>
                    <div
                      className={`flex-1 min-h-0 ${
                        problem.content_type === 'document' ? 'overflow-hidden' : 'overflow-y-auto'
                      }`}
                    >
                      <ProblemBody problem={problem} accessToken={accessToken} fill />
                    </div>
                  </aside>

                  <div
                    role="separator"
                    aria-orientation={layout === 'split' ? 'vertical' : 'horizontal'}
                    aria-label="Resize problem panel"
                    onPointerDown={startResize}
                    className={
                      layout === 'split'
                        ? 'w-2 shrink-0 cursor-col-resize flex items-stretch justify-center group'
                        : 'h-2 shrink-0 cursor-row-resize flex items-center justify-center group'
                    }
                  >
                    <span
                      className={
                        layout === 'split'
                          ? 'w-0.5 rounded-full bg-border-strong group-hover:bg-accent group-active:bg-accent h-12'
                          : 'h-0.5 rounded-full bg-border-strong group-hover:bg-accent group-active:bg-accent w-12'
                      }
                    />
                  </div>
                </>
              )}

              <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-3">
                <div className="border border-border rounded-md overflow-hidden bg-white flex-1 min-h-[200px]">
                  <MonacoEditor
                    height="100%"
                    language={monacoLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value ?? '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={running || !accessToken}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-60"
                  >
                    {running && <Loader2 size={16} className="animate-spin" />}
                    {running ? 'Running…' : 'Run'}
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Evaluate is deferred to a later release"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 font-inter text-sm font-medium border border-border-strong text-text-hint cursor-not-allowed"
                  >
                    Evaluate
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !accessToken}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium border border-border-strong text-text-primary hover:bg-bg-surface disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                </div>

                {output && (
                  <div className="bg-bg-surface rounded-md p-4 shrink-0 max-h-64 overflow-y-auto">
                    {output.pending && (
                      <>
                        <p className="font-inter text-sm font-medium text-text-primary mb-2">Output</p>
                        <pre className="font-mono text-[13px] text-text-primary">{'> Running...\n'}</pre>
                      </>
                    )}
                    {!output.pending && output.mode === 'samples' && (
                      <div className="space-y-3">
                        <p className="font-inter text-sm font-medium text-text-primary">
                          Samples
                          {' '}
                          {output.passed}
                          /
                          {output.total}
                          {' '}
                          passed
                        </p>
                        {(output.results || []).map((row) => (
                          <div key={row.index} className="border border-border rounded-md bg-bg-base p-3 space-y-1">
                            <p className={`font-inter text-sm font-medium ${
                              row.passed ? 'text-success' : 'text-accent'
                            }`}
                            >
                              Sample
                              {' '}
                              {row.index}
                              {': '}
                              {row.passed ? 'Pass' : 'Fail'}
                            </p>
                            {!row.passed && (
                              <pre className="font-mono text-[12px] text-text-primary whitespace-pre-wrap break-words">
                                {`expected:\n${row.expected_stdout || '(empty)'}\n\ngot:\n${row.stdout || '(empty)'}`}
                                {row.stderr ? `\n\nstderr:\n${row.stderr}` : ''}
                              </pre>
                            )}
                            {row.passed && typeof row.runtime === 'number' && (
                              <p className="font-inter text-xs text-text-secondary">
                                Runtime:
                                {' '}
                                {row.runtime}
                                s
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!output.pending && output.mode !== 'samples' && (
                      <>
                        <p className="font-inter text-sm font-medium text-text-primary mb-2">Output</p>
                        <pre className="font-mono text-[13px] text-text-primary whitespace-pre-wrap break-words">
                          {output.stdout ? `${output.stdout}` : ''}
                          {output.stderr ? `\n${output.stderr}` : ''}
                          {typeof output.runtime === 'number'
                            ? `\nRuntime: ${output.runtime}s`
                            : ''}
                        </pre>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'community' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setProblemOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-inter text-sm text-text-primary hover:bg-bg-surface"
              >
                {problemOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {problemOpen ? 'Hide problem' : 'Show problem'}
              </button>
            </div>

            {problemOpen && (
              <aside className="border border-border rounded-md bg-white max-h-[40vh] overflow-y-auto">
                <div className="px-4 py-3 border-b border-border bg-bg-surface sticky top-0">
                  <p className="font-inter text-sm font-medium text-text-primary">Problem</p>
                </div>
                <div className="px-4 py-4">
                  <ProblemBody problem={problem} accessToken={accessToken} />
                </div>
              </aside>
            )}

            <div className="space-y-2">
            {communityLoading && (
              <p className="font-inter text-sm text-text-secondary">Loading submissions…</p>
            )}
            {!communityLoading && community.length === 0 && (
              <p className="font-inter text-sm text-text-secondary py-8 text-center">
                No community solutions yet.
              </p>
            )}
            {community.map((row) => {
              const open = expandedId === row.id
              return (
                <div key={row.id} className="border border-border rounded-md overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : row.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg-surface"
                  >
                    {row.avatarUrl ? (
                      <img
                        src={row.avatarUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-bg-layer1 text-text-secondary text-xs font-inter flex items-center justify-center">
                        {memberInitials(row.name)}
                      </span>
                    )}
                    <span className="font-inter text-sm font-medium text-text-primary flex-1">
                      {row.name}
                    </span>
                    <span className="font-inter text-sm text-text-secondary">
                      {languageLabel(row.language)}
                    </span>
                    <span className="font-inter text-sm text-text-hint">
                      {formatSubmitted(row.submittedAt)}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-border">
                      <MonacoEditor
                        height="300px"
                        language={
                          SOLUTION_LANGUAGES.find((l) => l.value === row.language)?.monaco
                          || 'plaintext'
                        }
                        theme="vs-dark"
                        value={row.code || ''}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          domReadOnly: true,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default function SolutionWorkspacePage() {
  return (
    <RoleGuard>
      <SolutionWorkspace />
    </RoleGuard>
  )
}
