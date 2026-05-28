'use client'
import RoleGuard from '@/components/auth/RoleGuard'
import React, { useEffect, useState } from 'react'
import { fetchMemberById } from '@/services/membersService' //TODO: verify 'badges' column exists in supabase and add fetchMemberBadges()
import { cohortLabel } from '@/utils/cohort'
import { useAuth } from '@/hooks/useAuth'

function Avatar({ member }) {
    const initial = (member?.firstName?.[0] ?? '?').toUpperCase()
    return (
    <div className="relative w-24 h-24 rounded-full flex-shrink-0 group">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={`${member.firstName} ${member.lastName}`}
          className="w-full h-full rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent transition-all"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-bg-elevated flex items-center justify-center font-montserrat font-bold text-2xl text-text-secondary ring-2 ring-transparent group-hover:ring-accent transition-all">
          {initial}
        </div>
      )}
    </div>
  )
}

function ExecutiveBadge() {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#EAF4F0] text-success">
      Executive
    </span>
  )
}

function StatusBadge({ status }) {
  const isStudent = status === 'student'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${isStudent ? 'bg-[#F0F4FF] text-link' : 'bg-bg-elevated text-text-secondary'}`}>
      {isStudent ? 'Student' : 'Graduate'}
    </span>
  )
}

// function BadgeCard({ badge }) {
//   return (
//     <div
//       className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-base border border-border relative"
//       style={{ opacity: badge.unlocked ? 1 : 0.35 }}
//     >
//       <span className="text-2xl">{badge.icon}</span>
//       <span className="text-xs text-center font-medium text-text-secondary">{badge.label}</span>
//       {!badge.unlocked && (
//         <span className="absolute top-2 right-2 text-xs text-text-hint">🔒</span>
//       )}
//     </div>
//   )
// }

export default function ProfilePage({ params }) {
    const { id } = React.use(params)
    const { user } = useAuth()
    const [member, setMember] = useState(null)
    const [badges, setBadges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const fullName = `${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim()
    const displayName = member?.nickname ? `${fullName} (${member.nickname})` : fullName

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                // TODO: add fetchMemberBadges() later
                const memberData = await fetchMemberById(id)
                if (!cancelled) setMember(memberData)
            }
            catch (err) {
                if (!cancelled) setError(err)
            }
            finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [id])

    const isOwn = user?.id === id
    const isExec = member?.role?.toLowerCase() === 'executive' || member?.role?.toLowerCase() === 'admin'
    const visibility = member?.profile_visibility ?? {}

    return (
        <RoleGuard>
            <main className="min-h-screen bg-bg-base">
                {/*HEADER SECTION*/}
                <section className="bg-bg-surface border-b border-border py-8 px-6">
                    <div className="max-w-[1200px] mx-auto">
                        {loading && <p className="text-text-secondary">Loading profile…</p>}
                        {error && <p className="text-accent">Couldn't load profile. Try refreshing.</p>}
                        {!loading && !error && member && (
                            <div className="flex items-start gap-6">
                                <Avatar member={member} />
                                <div className="flex-1 min-w-0">
                                    {/* Name + badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="font-montserrat font-bold text-3xl text-text-primary">
                                        {displayName}
                                        </h1>
                                        <StatusBadge status={member.status} />
                                        {isExec && <ExecutiveBadge />}
                                    </div>
                
                                    {/* School · Cohort */}
                                    <p className="text-sm text-text-secondary mb-3">
                                        {member.school}{member.cohort ? ` · ${cohortLabel(member.cohort)}` : ''}
                                    </p>
                    
                                    {/* Social icons */}
                                    <div className="flex items-center gap-3">
                                        {visibility.linkedin !== false && member.linkedinUrl && (
                                        <a
                                            href={member.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${displayName} on LinkedIn`}
                                            className="text-text-secondary hover:text-link transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7 1.7.8 1.7 1.7-.7 1.7-1.7 1.7zM20 19h-3v-5.6c0-1.4-.5-2.3-1.8-2.3-1 0-1.6.7-1.8 1.3-.1.2-.1.5-.1.8V19h-3V8h3v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1V19z" />
                                            </svg>
                                        </a>
                                        )}
                                        {visibility.github !== false && member.githubUrl && (
                                        <a
                                            href={member.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${displayName} on GitHub`}
                                            className="text-text-secondary hover:text-text-primary transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.7.9 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
                                            </svg>
                                        </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/*BIO*/}
                <section>
                    About goes here
                </section>

                {/*ACTIVITY HEATMAP*/}
                <section>
                    <p>Coming soon</p>
                </section>

                {/*ACHIEVEMENT BADGES*/}
                <section>
                    Badges go here
                </section>
                
            </main>
        </RoleGuard>
    )
}