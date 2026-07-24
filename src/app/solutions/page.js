'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Minus } from 'lucide-react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { fetchProblems } from '@/services/problemsService'
import { fetchUserSubmissions } from '@/services/submissionsService'

function formatDue(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function SolutionsListContent() {
  const router = useRouter()
  const { profile } = useAuth()
  const [problems, setProblems] = useState([])
  const [userSubmissions, setUserSubmissions] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [problemRows, submitted] = await Promise.all([
          fetchProblems(undefined, { signal: controller.signal }),
          profile?.id
            ? fetchUserSubmissions(profile.id, { signal: controller.signal })
            : Promise.resolve(new Set()),
        ])
        if (cancelled) return
        setProblems(problemRows)
        setUserSubmissions(submitted)
      } catch (err) {
        if (cancelled) return
        if (!cancelled) {
          setError(
            err?.name === 'AbortError'
              ? 'Request timed out. Refresh the page and try again.'
              : (err.message || 'Failed to load problems')
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
  }, [profile?.id])

  return (
    <main className="min-h-screen bg-bg-base">
      <div className="bg-bg-surface">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-10 md:pt-12 pb-8">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-3 text-text-primary">
            Solutions
          </h1>
          <p className="font-inter text-text-secondary">
            Pick a problem to solve or review
          </p>
        </div>
      </div>

      <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12 pb-16">
        {loading && (
          <p className="font-inter text-sm text-text-secondary">Loading problems…</p>
        )}
        {error && (
          <p className="font-inter text-sm text-accent mb-4">{error}</p>
        )}
        {!loading && !error && problems.length === 0 && (
          <p className="font-inter text-text-secondary text-center py-16">
            No problems found.
          </p>
        )}
        {!loading && problems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[520px]">
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
                {problems.map((p) => {
                  const solved = userSubmissions.has(p.id)
                  return (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/solutions/${p.id}`)}
                      className="border-b border-border cursor-pointer transition-colors hover:bg-bg-surface"
                    >
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4">
                        {p.week != null ? p.week : '—'}
                      </td>
                      <td className="font-inter text-sm text-text-primary py-3.5 pr-4 font-medium">
                        {p.title}
                      </td>
                      <td className="font-inter text-sm text-text-secondary py-3.5 pr-4">—</td>
                      <td className="font-inter text-sm text-text-secondary py-3.5 pr-4">
                        {formatDue(p.due_date) ?? '—'}
                      </td>
                      <td className="text-center py-3.5">
                        {solved
                          ? <Check size={15} className="text-success mx-auto" />
                          : <Minus size={15} className="text-text-hint mx-auto" />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default function SolutionsPage() {
  return (
    <RoleGuard>
      <SolutionsListContent />
    </RoleGuard>
  )
}
