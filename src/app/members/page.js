'use client'
import RoleGuard from '@/components/auth/RoleGuard'
import MemberCard from '@/components/members/MemberCard'
import { useEffect, useState, useMemo } from 'react'
import { fetchMembers } from '@/services/membersService'
import { cohortLabel } from '@/utils/cohort'
import { compareNumberLike, compareText } from '@/utils/memberSort'

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name(↑)' },
  { value: 'name-desc', label: 'Name(↓)' },
  { value: 'school-asc', label: 'School(↑)' },
  { value: 'school-desc', label: 'School(↓)' },
  { value: 'cohort-asc', label: 'Cohort(↑)' },
  { value: 'cohort-desc', label: 'Cohort(↓)' },
  { value: 'company-asc', label: 'Company(↑)' },
  { value: 'company-desc', label: 'Company(↓)' },
  { value: 'role-asc', label: 'Role(↑)' },
  { value: 'role-desc', label: 'Role(↓)' },
]

function memberName(member) {
  return [member.firstName, member.lastName].filter(Boolean).join(' ')
}

function formatRole(role) {
  if (role === 'executive' || role === 'admin') return 'Executive'
  return 'Member'
}

function hasCompany(member) {
  return Boolean(member.company?.trim())
}

function matchesStatus(memberStatus, filter) {
  if (!filter) return true
  if (filter === 'student') return memberStatus === 'student'
  return memberStatus === 'graduate' || memberStatus === 'graduated'
}

function compareBySort(a, b, sortValue) {
  const [key, dir] = sortValue.split('-')

  if (key === 'company') {
    const aHas = hasCompany(a)
    const bHas = hasCompany(b)
    if (aHas !== bHas) return aHas ? -1 : 1
    if (!aHas) return compareText(memberName(a), memberName(b))
    const companyCmp = compareText(a.company, b.company)
    if (companyCmp !== 0) return dir === 'asc' ? companyCmp : -companyCmp
    return compareText(memberName(a), memberName(b))
  }

  let result = 0
  switch (key) {
    case 'school':
      result = compareText(a.school, b.school)
      break
    case 'cohort':
      result = compareNumberLike(a.cohort, b.cohort)
      break
    case 'role':
      result = compareText(formatRole(a.role), formatRole(b.role))
      break
    case 'name':
    default:
      result = compareText(memberName(a), memberName(b))
      break
  }

  if (result === 0 && key !== 'name') {
    result = compareText(memberName(a), memberName(b))
  }

  return dir === 'asc' ? result : -result
}

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cohort, setCohort] = useState('')
  const [school, setSchool] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [sort, setSort] = useState('name-asc')

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    let cancelled = false

    async function load() {
      try {
        const data = await fetchMembers({ signal: controller.signal })
        if (!cancelled) setMembers(data)
      } catch (err) {
        if (cancelled) return
        if (!cancelled) {
          setError(
            err?.name === 'AbortError'
              ? new Error('Request timed out. Refresh the page and try again.')
              : err
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
  }, [])

  const cohortOptions = useMemo(() => {
    const nums = [...new Set(members.map(m => m.cohort).filter(Boolean))]
    return nums.sort((a, b) => Number(a) - Number(b))
  }, [members])

  const companyOptions = useMemo(() => {
    const names = [...new Set(members.map(m => m.company?.trim()).filter(Boolean))]
    return names.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [members])

  const filteredMembers = useMemo(() => {
    const filtered = members.filter((m) => {
      if (cohort && m.cohort !== cohort) return false
      if (school && m.school !== school) return false
      if (!matchesStatus(m.status, status)) return false
      if (role) {
        const isExec = m.role === 'executive' || m.role === 'admin'
        if (role === 'executive' && !isExec) return false
        if (role === 'member' && m.role !== 'member') return false
      }
      if (company === '__none__') {
        if (hasCompany(m)) return false
      } else if (company && m.company?.trim() !== company) {
        return false
      }
      return true
    })

    return [...filtered].sort((a, b) => compareBySort(a, b, sort))
  }, [members, cohort, school, status, role, company, sort])

  const selectClass = 'border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border'

  return (
    <RoleGuard>
      <main className="min-h-screen">
        <section className="bg-bg-base py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-montserrat text-4xl font-bold text-text-primary">
              Members
            </h1>
            <p className="mt-2 text-base text-text-secondary">
              Active and alumni codeXperts community
            </p>
          </div>
        </section>

        <section className="bg-bg-base border-b border-border py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-row gap-3 flex-wrap">
            <select className={selectClass} value={cohort} onChange={(e) => setCohort(e.target.value)}>
              <option value="">All Cohorts</option>
              {cohortOptions.map(n => (
                <option key={n} value={n}>{cohortLabel(n)}</option>
              ))}
            </select>

            <select className={selectClass} value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">All Schools</option>
              <option value="Seneca College">Seneca College</option>
              <option value="York University">York University</option>
            </select>

            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="student">Student</option>
              <option value="graduate">Graduate</option>
            </select>

            <select className={selectClass} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="member">Member</option>
              <option value="executive">Executive</option>
            </select>

            <select className={selectClass} value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="">All Companies</option>
              <option value="__none__">No company</option>
              {companyOptions.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort members">
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="bg-bg-base py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {loading && <p className="text-text-secondary">Loading members…</p>}
            {error && <p className="text-accent">Couldn&apos;t load members. Try refreshing.</p>}

            {!loading && !error && filteredMembers.length === 0 && (
              <p className="text-text-secondary">No members yet.</p>
            )}
            {!loading && !error && filteredMembers.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </RoleGuard>
  )
}
