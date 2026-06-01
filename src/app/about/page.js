import AboutCTA from '@/components/common/AboutCTA'

const senecaMembers = [
  { key: 'seneca_president', name: 'TBD', role: 'TBD' },
  { key: 'seneca_vp',        name: 'TBD', role: 'TBD' },
  { key: 'seneca_treasurer', name: 'TBD', role: 'TBD' },
]

const yorkMembers = [
  { key: 'york_president', name: 'TBD', role: 'TBD' },
  { key: 'york_vp',        name: 'TBD', role: 'TBD' },
  { key: 'york_treasurer', name: 'TBD', role: 'TBD' },
  { key: 'york_exec_1',    name: 'TBD', role: 'TBD' },
  { key: 'york_exec_2',    name: 'TBD', role: 'TBD' },
]

const MemberCard = ({ name, role }) => (
  <div className="flex flex-col justify-center items-center my-4 md:my-10 w-[45%] sm:w-[30%] md:w-auto">
    <div className="size-16 bg-bg-layer1 rounded-xl mb-3 md:mb-5 flex justify-center items-center" />
    <p className="mb-1 md:mb-2 text-center text-sm md:text-base text-text-primary">{name}</p>
    <span className="inline-block px-2 md:px-2.5 py-0.5 rounded-full bg-success-bg text-success text-[10px] md:text-xs font-medium w-fit mb-1 md:mb-2">{role}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-text-secondary rotate-45">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  </div>
)

const AboutPage = () => {
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

      {/* Our Team header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-6 md:pb-8">
        <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-3 text-text-primary">Our Team</h2>
        <p className="text-text-secondary">The people behind codeXperts</p>
      </div>

      {/* Seneca */}
      <section className="w-full bg-bg-base py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-montserrat font-semibold text-xl text-text-primary text-center md:text-left mb-6 md:mb-0">Seneca Polytechnic</p>
          <div className="flex flex-wrap justify-center gap-6 md:justify-evenly items-center">
            {senecaMembers.map((member) => (
              <MemberCard key={member.key} name={member.name} role={member.role} />
            ))}
          </div>
        </div>
      </section>

      {/* York */}
      <section className="w-full py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-montserrat font-semibold text-xl text-text-primary text-center md:text-left mb-6 md:mb-0">York University</p>
          <div className="flex flex-wrap justify-center gap-6 md:justify-evenly items-center">
            {yorkMembers.map((member) => (
              <MemberCard key={member.key} name={member.name} role={member.role} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AboutCTA />

    </main>
  )
}

export default AboutPage
