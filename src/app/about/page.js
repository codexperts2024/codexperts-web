'use client'

import { useState, useEffect } from 'react'
import { getCurrentExecutives } from '@/services/executiveService'
import AboutCTA from '@/components/common/AboutCTA'
import { IconLinkedIn, IconGitHub } from '@/components/ui/SocialIcons'
import { createLoadGuard } from '@/utils/loadGuard'

const TITLE_ORDER = ['President', 'Vice President', 'Treasurer']
const SCHOOLS = [
  { key: 'Seneca College',  label: 'Seneca Polytechnic' },
  { key: 'York University', label: 'York University' },
]


const MemberCard = ({ executive }) => {
  const name = executive
    ? `${executive.firstName} ${executive.lastName}${executive.nickname ? ` (${executive.nickname})` : ''}`
    : 'TBD'
  const title = executive?.title ?? 'TBD'
  const avatarUrl = executive?.avatarUrl
  const linkedinUrl = executive?.linkedinUrl
  const githubUrl = executive?.githubUrl

  return (
    <div className="flex flex-col justify-center items-center my-4 md:my-10 w-[45%] sm:w-[30%] md:w-auto">
      <div className="size-16 bg-bg-layer1 rounded-xl mb-3 md:mb-5 flex justify-center items-center overflow-hidden">
        {avatarUrl && (
          <img src={avatarUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-xl" />
        )}
      </div>
      <p className="mb-1 md:mb-2 text-center text-sm md:text-base text-text-primary">{name}</p>
      <span className="inline-block px-2 md:px-2.5 py-0.5 rounded-full bg-success-bg text-success text-[10px] md:text-xs font-medium w-fit mb-2 md:mb-3">
        {title}
      </span>
      <div className="flex items-center gap-2">
        {linkedinUrl ? (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:opacity-80 transition-opacity">
            <IconLinkedIn />
          </a>
        ) : (
          <span className="text-text-hint cursor-default"><IconLinkedIn /></span>
        )}
        {githubUrl ? (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-primary hover:opacity-70 transition-opacity">
            <IconGitHub />
          </a>
        ) : (
          <span className="text-text-hint cursor-default"><IconGitHub /></span>
        )}
      </div>
    </div>
  )
}

const AboutPage = () => {
  const [executivesBySchool, setExecutivesBySchool] = useState({})

  useEffect(() => {
    const guard = createLoadGuard()

    async function load() {
      try {
        const data = await getCurrentExecutives({ signal: guard.signal })
        if (guard.isCancelled()) return
        const grouped = {}
        for (const school of SCHOOLS) {
          const schoolExecs = data.filter((e) => e.school === school.key)
          grouped[school.key] = TITLE_ORDER.map((title) =>
            schoolExecs.find((e) => e.title === title) ?? null
          )
        }
        setExecutivesBySchool(grouped)
      } catch {
        // Keep empty TBD placeholders on timeout/error
      }
    }

    load()
    return () => guard.cleanup()
  }, [])

  return (
    <main className="min-h-screen bg-bg-base">

      {/* Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-8 md:pb-12">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4 text-text-primary">About codeXperts</h1>
        <p className="text-text-secondary">More than a club — a community of coders going beyond the classroom.</p>
      </div>

      {/* Why We Exist */}
      <section className="w-full bg-bg-base py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-accent shrink-0 md:w-56 text-center md:text-left">Why We Exist</h2>
          <div className="flex flex-col gap-5">
            <p className="text-center md:text-left text-text-secondary leading-relaxed">
              codeXperts was founded on the principle that programming is an art form best practiced in collaboration. While university lectures provide the theory, our &quot;Digital Atelier&quot; provides the space to build, break, and refine real-world systems.
            </p>
            <p className="text-center md:text-left text-text-secondary leading-relaxed">
              We focus on high-level technical rigor paired with student-led mentorship. Whether it&apos;s optimizing an algorithm or architecting a distributed system, we believe in pushing the boundaries of what student coders can achieve together.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-6">
          <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 flex-1">
            <span className="text-3xl -ml-1.5 -mb-1">💡</span>
            <p className="font-montserrat font-semibold text-xl text-text-primary">Algorithmic Thinking</p>
            <p className="text-text-secondary">Mastering the logic behind the code. We tackle complex problem sets that challenge conventional solutions.</p>
          </div>
          <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 flex-1">
            <span className="text-3xl -ml-1.5 -mb-1">🤝</span>
            <p className="font-montserrat font-semibold text-xl text-text-primary">Student Networking</p>
            <p className="text-text-secondary">Building a lifetime network of peers. We facilitate connections between ambitious developers and future leaders.</p>
          </div>
          <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 flex-1">
            <span className="text-3xl -ml-1.5 -mb-1">🏫</span>
            <p className="font-montserrat font-semibold text-xl text-text-primary">Inter-School Exchange</p>
            <p className="text-text-secondary">Broadening horizons through competition and collaboration with technical clubs from other universities.</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full bg-bg-base py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-text-primary mb-10 md:mb-14 text-center md:text-left">Our Story</h2>

          <div className="relative border-l-2 border-border ml-3 md:ml-0 space-y-10 md:space-y-12 pb-8 w-full md:w-[80%] lg:w-[60%]">

            <div className="relative pl-6 md:pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full border-4 border-bg-surface" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
                <span className="font-montserrat font-bold text-accent whitespace-nowrap">2024 Fall</span>
                <div>
                  <h3 className="font-montserrat font-semibold text-text-primary">The Foundation</h3>
                  <p className="text-text-secondary mt-1 md:mt-2">codeXperts founded at Seneca College by Prof. Yoon and students passionate about going beyond the classroom.</p>
                </div>
              </div>
            </div>

            <div className="relative pl-6 md:pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full border-4 border-bg-surface" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
                <span className="font-montserrat font-bold text-accent whitespace-nowrap">2026 Winter</span>
                <div>
                  <h3 className="font-montserrat font-semibold text-text-primary">First Event</h3>
                  <p className="text-text-secondary mt-1 md:mt-2">First official event: Coding Competition hosted at Seneca College.</p>
                </div>
              </div>
            </div>

            <div className="relative pl-6 md:pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full border-4 border-bg-surface" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
                <span className="font-montserrat font-bold text-accent whitespace-nowrap">2026 Fall</span>
                <div>
                  <h3 className="font-montserrat font-semibold text-text-primary">York University</h3>
                  <p className="text-text-secondary mt-1 md:mt-2">codeXperts officially launched as a York University recognized club. Inter-campus collaboration begins.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Team */}
      <div id="team" className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-6 md:pb-8 scroll-mt-20">
        <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-3 text-text-primary">Our Team</h2>
        <p className="text-text-secondary">The people behind codeXperts</p>
      </div>

      {SCHOOLS.map((school) => (
        <section key={school.key} className="w-full bg-bg-base py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="font-montserrat font-semibold text-xl text-text-primary text-center md:text-left mb-6 md:mb-0">
              {school.label}
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:justify-evenly items-center">
              {(executivesBySchool[school.key] ?? TITLE_ORDER.map(() => null)).map((exec, i) => (
                <MemberCard key={TITLE_ORDER[i]} executive={exec} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <AboutCTA />

    </main>
  )
}

export default AboutPage
