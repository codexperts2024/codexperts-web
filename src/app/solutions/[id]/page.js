'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { fetchProblemById } from '@/services/problemsService'
import {
  fetchCommunitySubmissions,
  fetchOwnSubmission,
} from '@/services/submissionsService'
import {
  SOLUTION_LANGUAGES,
  executeCode,
  languageLabel,
  submitSolution,
} from '@/services/solutionService'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const STARTER = {
  python: 'def solution():\n    pass\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  c: '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n',
  javascript: 'function solution() {\n  \n}\n',
  typescript: 'function solution(): void {\n  \n}\n',
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
      const result = await executeCode({
        accessToken,
        language,
        code,
      })
      setOutput({
        pending: false,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        runtime: result.runtime,
        exitCode: result.exit_code,
      })
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {error && (
          <p className="font-inter text-sm text-accent mb-4">{error}</p>
        )}
        {statusMessage && (
          <p className="font-inter text-sm text-success mb-4">{statusMessage}</p>
        )}

        {tab === 'mine' && (
          <div className="space-y-4">
            <div className="flex justify-end">
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

            <div className="border border-border rounded-md overflow-hidden bg-white">
              <MonacoEditor
                height="400px"
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

            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="bg-bg-surface rounded-md p-4">
                <p className="font-inter text-sm font-medium text-text-primary mb-2">Output</p>
                <pre className="font-mono text-[13px] text-text-primary whitespace-pre-wrap break-words">
                  {output.pending && '> Running...\n'}
                  {!output.pending && output.stdout ? `${output.stdout}` : ''}
                  {!output.pending && output.stderr ? `\n${output.stderr}` : ''}
                  {!output.pending && typeof output.runtime === 'number'
                    ? `\nRuntime: ${output.runtime}s`
                    : ''}
                </pre>
              </div>
            )}
          </div>
        )}

        {tab === 'community' && (
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
