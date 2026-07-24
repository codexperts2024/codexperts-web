'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, ChevronDown, ChevronUp, Columns2, Loader2, Rows2 } from 'lucide-react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { ProblemBody } from '@/app/problems/_shared'
import { fetchProblemById, normalizeSampleTests } from '@/services/problemsService'
import {
  fetchCommunitySubmissions,
  fetchOwnSubmission,
} from '@/services/submissionsService'
import {
  LANGUAGE_DOCS,
  SOLUTION_LANGUAGES,
  evaluateSolution,
  executeCode,
  executeSamples,
  languageLabel,
  submitSolution,
} from '@/services/solutionService'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const STARTER = {
  python: 'a, b = map(int, input().split())\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n    }\n}\n',
  c: '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf("%d %d", &a, &b) != 2) return 1;\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if (!(cin >> a >> b)) return 1;\n    return 0;\n}\n',
  javascript: 'const fs = require("fs");\nconst [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n',
  typescript: 'const fs = require("fs");\nconst [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n',
}

const PROBLEM_SIZE_MIN = 22
const PROBLEM_SIZE_MAX = 78
const STACK_PROBLEM_VH_MIN = 18
const STACK_PROBLEM_VH_MAX = 45

function clampProblemSize(value, layout = 'split') {
  if (layout === 'stack') {
    return Math.min(STACK_PROBLEM_VH_MAX, Math.max(STACK_PROBLEM_VH_MIN, value))
  }
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
  const [customInput, setCustomInput] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
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
  const [problemSize, setProblemSize] = useState(36) // split: width %, stack: problem vh
  const workspaceRef = useRef(null)
  const draggingRef = useRef(false)

  const monacoLanguage = useMemo(
    () => SOLUTION_LANGUAGES.find((l) => l.value === language)?.monaco || 'python',
    [language],
  )

  const samplesAllPassed = Boolean(
    output
    && !output.pending
    && output.samples
    && Number(output.samples.total) > 0
    && Number(output.samples.passed) === Number(output.samples.total),
  )

  const evaluateDisabledReason = !accessToken
    ? 'Sign in to evaluate'
    : !samplesAllPassed
      ? 'All sample tests must pass before Evaluate'
      : ''

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
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
        const row = await fetchProblemById(problemId, { signal: controller.signal })
        if (cancelled) return
        setProblem(row)

        if (profile?.id) {
          const own = await fetchOwnSubmission(profile.id, problemId, {
            signal: controller.signal,
          })
          if (cancelled) return
          if (own?.code) {
            setCode(own.code)
            if (own.language) setLanguage(own.language)
          }
        }
      } catch (err) {
        if (cancelled) return
        if (!cancelled) {
          setError(
            err?.name === 'AbortError'
              ? 'Request timed out. Refresh the page and try again.'
              : (err.message || 'Failed to load problem')
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
  }, [problemId, profile?.id])

  const loadCommunity = useCallback(async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    setCommunityLoading(true)
    try {
      const rows = await fetchCommunitySubmissions(problemId, { signal: controller.signal })
      setCommunity(rows)
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setError(err.message || 'Failed to load community solutions')
      } else {
        setError('Request timed out. Refresh the page and try again.')
      }
    } finally {
      clearTimeout(timer)
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
        setProblemSize(clampProblemSize(next, 'split'))
      } else {
        // Stack: problem height as vh so the rest of the page can scroll naturally.
        const next = ((event.clientY - rect.top) / window.innerHeight) * 100
        setProblemSize(clampProblemSize(next, 'stack'))
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
    setEvaluation(null)
    setOutput(null)
    setCode((prev) => {
      const isStarter = Object.values(STARTER).includes(prev)
      if (!prev.trim() || isStarter) return STARTER[next] || ''
      return prev
    })
  }

  async function handleRun() {
    setStatusMessage('')
    setError('')
    setEvaluation(null)
    setRunning(true)
    setOutput({ pending: true })
    try {
      const samples = normalizeSampleTests(problem?.sample_tests)
      const hasCustom = customInput.trim() !== ''
      let sampleBlock = null
      let customBlock = null

      if (samples.length > 0) {
        const result = await executeSamples({
          accessToken,
          problemId,
          language,
          code,
        })
        sampleBlock = {
          passed: Number(result.passed) || 0,
          total: Number(result.total) || 0,
          results: result.results || [],
        }
      }

      if (hasCustom) {
        const result = await executeCode({
          accessToken,
          language,
          code,
          stdin: customInput,
        })
        customBlock = {
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          runtime: result.runtime,
          exitCode: result.exit_code,
        }
      }

      if (!sampleBlock && !customBlock) {
        const result = await executeCode({
          accessToken,
          language,
          code,
          stdin: '',
        })
        setOutput({
          pending: false,
          mode: 'raw',
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          runtime: result.runtime,
          exitCode: result.exit_code,
        })
        return
      }

      setOutput({
        pending: false,
        mode: sampleBlock ? 'samples' : 'custom',
        samples: sampleBlock,
        custom: customBlock,
        passed: sampleBlock?.passed,
        total: sampleBlock?.total,
        results: sampleBlock?.results,
      })
    } catch (err) {
      const message = err.message || 'Run failed'
      setOutput(null)
      if (/daily .+ limit/i.test(message)) {
        window.alert(message)
        setError('')
      } else {
        setError(message)
      }
    } finally {
      setRunning(false)
    }
  }

  async function handleEvaluate() {
    setStatusMessage('')
    setError('')
    if (!samplesAllPassed) {
      setError('All sample tests must pass before Evaluate')
      return
    }
    setEvaluating(true)
    setEvaluation(null)
    try {
      const result = await evaluateSolution({
        accessToken,
        problemId,
        language,
        code,
        samplesPassed: true,
      })
      setEvaluation(result)
    } catch (err) {
      const message = err.message || 'Evaluate failed'
      if (/daily .+ limit/i.test(message)) {
        window.alert(message)
        setError('')
      } else {
        setError(message)
      }
    } finally {
      setEvaluating(false)
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

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 pb-24">
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
                    onClick={() => {
                      setLayout('stack')
                      setProblemSize((size) => clampProblemSize(size, 'stack'))
                    }}
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
                    onClick={() => {
                      setLayout('split')
                      setProblemSize((size) => clampProblemSize(size, 'split'))
                    }}
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
              className={
                problemOpen && layout === 'split'
                  ? 'min-h-[560px] h-[calc(100vh-260px)] overflow-hidden flex flex-row'
                  : 'flex flex-col'
              }
            >
              {problemOpen && (
                <>
                  <aside
                    className="border border-border rounded-md bg-white flex flex-col min-h-0 min-w-0 overflow-hidden"
                    style={
                      layout === 'split'
                        ? { width: `${problemSize}%`, flexShrink: 0 }
                        : {
                          height: `${clampProblemSize(problemSize, 'stack')}vh`,
                          flexShrink: 0,
                        }
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

              <div
                className={
                  layout === 'split'
                    ? 'flex-1 min-w-0 min-h-0 flex flex-col gap-3 overflow-y-auto'
                    : 'w-full flex flex-col gap-3'
                }
              >
                <div
                  className={
                    layout === 'split'
                      ? 'border border-border rounded-md overflow-hidden bg-white flex-1 min-h-[200px]'
                      : 'border border-border rounded-md overflow-hidden bg-white h-[360px] shrink-0'
                  }
                >
                  <MonacoEditor
                    height="100%"
                    language={monacoLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => {
                      const next = value ?? ''
                      if (next !== code) {
                        setEvaluation(null)
                        setOutput(null)
                      }
                      setCode(next)
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <label className="block shrink-0 space-y-1">
                  <span className="font-inter text-xs text-text-secondary">
                    Custom input
                  </span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    spellCheck={false}
                    placeholder="Optional stdin for a raw run"
                    className="w-full border border-border rounded-md px-3 py-2 font-mono text-sm text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
                  />
                </label>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={running || !accessToken}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-60"
                  >
                    {running && <Loader2 size={16} className="animate-spin" />}
                    {running ? 'Running…' : 'Run'}
                  </button>
                  <span className="relative inline-flex group">
                    <button
                      type="button"
                      onClick={handleEvaluate}
                      disabled={evaluating || !accessToken || !samplesAllPassed}
                      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium border border-border-strong text-text-primary hover:bg-bg-surface disabled:opacity-60 disabled:cursor-not-allowed${
                        evaluateDisabledReason ? ' pointer-events-none' : ''
                      }`}
                    >
                      {evaluating && <Loader2 size={16} className="animate-spin" />}
                      {evaluating ? 'Evaluating…' : 'Evaluate'}
                    </button>
                    {evaluateDisabledReason && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 max-w-[min(280px,70vw)] rounded-md bg-bg-elevated px-2.5 py-1.5 font-inter text-xs text-bg-base opacity-0 group-hover:opacity-100"
                      >
                        {evaluateDisabledReason}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !accessToken}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium border border-border-strong text-text-primary hover:bg-bg-surface disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                  {LANGUAGE_DOCS[language] && (
                    <a
                      href={LANGUAGE_DOCS[language].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-inter text-sm font-medium border border-border-strong text-text-secondary hover:bg-bg-surface"
                    >
                      <BookOpen size={16} />
                      Docs
                    </a>
                  )}
                </div>

                {evaluation && (
                  <div className="bg-bg-surface rounded-md p-4 shrink-0 space-y-4 border border-border">
                    <p className="font-inter text-sm font-medium text-text-primary">Evaluation</p>
                    {(evaluation.forbidden_hints || []).length > 0 && (
                      <div className="space-y-2">
                        <p className="font-inter text-xs font-medium text-text-secondary uppercase tracking-wide">
                          Style hints (not failures)
                        </p>
                        {evaluation.forbidden_hints.map((hint) => (
                          <div
                            key={`${hint.rule}-${hint.line}`}
                            className="rounded-md border border-border bg-bg-base p-3"
                          >
                            <p className="font-inter text-sm text-text-primary">
                              {hint.rule}
                              {hint.line != null ? ` (line ${hint.line})` : ''}
                            </p>
                            <p className="font-inter text-xs text-text-secondary mt-1">
                              {hint.hint}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="font-inter text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                        Big O (estimate)
                      </p>
                      <p className="font-inter text-sm font-medium text-text-primary">
                        {evaluation.big_o}
                      </p>
                      {evaluation.big_o_reason && (
                        <p className="font-inter text-xs text-text-secondary mt-1">
                          {evaluation.big_o_reason}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-inter text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                        Duplication
                      </p>
                      {(evaluation.duplicates || []).length === 0 ? (
                        <p className="font-inter text-sm text-text-secondary">None noted.</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {evaluation.duplicates.map((note) => (
                            <li key={note} className="font-inter text-sm text-text-primary">
                              {note}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {output && (
                  <div className="bg-bg-surface rounded-md p-4 shrink-0 space-y-4">
                    {output.pending && (
                      <>
                        <p className="font-inter text-sm font-medium text-text-primary mb-2">Output</p>
                        <pre className="font-mono text-[13px] text-text-primary">{'> Running...\n'}</pre>
                      </>
                    )}
                    {!output.pending && output.samples && (
                      <div className="space-y-3">
                        <p className="font-inter text-sm font-medium text-text-primary">
                          Samples
                          {' '}
                          {output.samples.passed}
                          /
                          {output.samples.total}
                          {' '}
                          passed
                        </p>
                        {(output.samples.results || []).map((row) => {
                          const stdin = (row.stdin ?? '').trim() || '(empty)'
                          const got = (row.stdout ?? '').trim() || '(empty)'
                          const expected = (row.expected_stdout ?? '').trim() || '(empty)'
                          return (
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
                              <pre className="font-mono text-[12px] text-text-secondary whitespace-pre-wrap break-words">
                                {`in:  ${stdin}\nout: ${got}`}
                                {!row.passed ? `\nexp: ${expected}` : ''}
                                {!row.passed && row.stderr ? `\nerr: ${row.stderr}` : ''}
                              </pre>
                              {typeof row.runtime === 'number' && (
                                <p className="font-inter text-xs text-text-hint">
                                  {row.runtime}
                                  s
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {!output.pending && output.custom && (
                      <div className="space-y-2">
                        <p className="font-inter text-sm font-medium text-text-primary">
                          Custom output
                        </p>
                        <p className="font-inter text-xs text-text-secondary">
                          Experimental run only (no Pass/Fail).
                        </p>
                        <pre className="font-mono text-[13px] text-text-primary whitespace-pre-wrap break-words bg-bg-base border border-border rounded-md p-3">
                          {output.custom.stdout ? `${output.custom.stdout}` : ''}
                          {output.custom.stderr ? `\n${output.custom.stderr}` : ''}
                          {typeof output.custom.runtime === 'number'
                            ? `\nRuntime: ${output.custom.runtime}s`
                            : ''}
                          {!output.custom.stdout && !output.custom.stderr ? '(empty)' : ''}
                        </pre>
                      </div>
                    )}
                    {!output.pending && output.mode === 'raw' && (
                      <>
                        <p className="font-inter text-sm font-medium text-text-primary mb-2">Output</p>
                        <pre className="font-mono text-[13px] text-text-primary whitespace-pre-wrap break-words">
                          {output.stdout ? `${output.stdout}` : ''}
                          {output.stderr ? `\n${output.stderr}` : ''}
                          {typeof output.runtime === 'number'
                            ? `\nRuntime: ${output.runtime}s`
                            : ''}
                        </pre>
                        {output.stderr && (
                          <p className="font-inter text-xs text-text-secondary mt-2">
                            Use the error message and Docs to fix syntax or runtime issues.
                          </p>
                        )}
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
