'use client'
import RoleGuard from '@/components/auth/RoleGuard'
import MemberCard from '@/components/members/MemberCard'
import { useEffect, useState, useMemo } from 'react'
import { fetchMembers } from '@/services/membersService'
import { cohortLabel } from '@/utils/cohort'


export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cohort, setCohort] = useState('')
  const [school, setSchool] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchMembers()
        if (!cancelled) setMembers(data)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const cohortOptions = useMemo(() => {
    const nums = [...new Set(members.map(m => m.cohort).filter(Boolean))]
    return nums.sort((a, b) => Number(a) - Number(b))
  }, [members])

  const filteredMembers = members.filter((m) => {
    if (cohort && m.cohort !== cohort) return false
    if (school && m.school !== school) return false
    if (status && m.status !== status) return false
    if (role) {
      const isExec = m.role === 'executive' || m.role === 'admin'
      if (role === 'executive' && !isExec) return false
      if (role === 'member' && m.role !== 'member') return false
    }
    return true
  })

  return (
    <RoleGuard>
      <main className="min-h-screen">
        {/*HEADER SECTION*/}
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

        {/*FILTER ROW*/}
        <section className="bg-bg-base border-b border-border py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-row gap-3 flex-wrap">
            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            value={cohort} onChange={(e) => setCohort(e.target.value)}>
              <option value="">All Cohorts</option>
              {cohortOptions.map(n => (
                <option key={n} value={n}>{cohortLabel(n)}</option>
              ))}
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">All Schools</option>
              <option value="Seneca College">Seneca College</option>
              <option value="York University">York University</option>
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="student">Student</option>
              <option value="graduated">Graduate</option>
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="member">Member</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </section>

        {/*MEMBER GRID*/}
        <section className="bg-bg-base py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {loading && <p className="text-text-secondary">Loading members…</p>}
            {error && <p className="text-accent">Couldn't load members. Try refreshing.</p>}

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
