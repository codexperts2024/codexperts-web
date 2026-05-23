import JoinButton from '@/components/common/JoinButton'

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

const MemberCard = ({ name, role }) => {
  return (
    <div className="flex flex-col justify-center items-center my-4 md:my-10 w-[45%] sm:w-[30%] md:w-auto">
      <div className="size-16 bg-gray-200 rounded-xl mb-3 md:mb-5 flex justify-center items-center"></div>
      <p className="mb-1 md:mb-2 text-center text-sm md:text-base">{name}</p>
      <span className="inline-block px-2 md:px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] md:text-xs font-medium text-emerald-700 w-fit mb-1 md:mb-2">{role}</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    </div>
  )
}

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-bg-surface">
      <div className="w-full md:w-[35rem] p-6 md:p-10 mx-auto md:mx-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">About codeXperts</h1>
        <p className="text-gray-500">
          More than a club — a community of coders going beyond the classroom.</p>
      </div>

      <section className="bg-white w-full">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start container mx-auto px-6 md:px-10 py-10 md:py-16 gap-6 md:gap-0">
          <h2 className="text-[#C0392B] font-[550] text-2xl md:text-3xl flex-[1] text-center md:text-left w-full">Why We Exist</h2>
          <div className="flex flex-col gap-6 md:gap-10 flex-[2]">
            <p className="text-center md:text-left text-gray-700">
              codeXperts was founded on the principle that programming is an art form best practiced in collaboration. While university lectures provide the theory, our "Digital Atelier" provides the space to build, break, and refine real-world systems.</p>
            <p className="text-center md:text-left text-gray-700">
              We focus on high-level technical rigor paired with student-led mentorship. Whether it's optimizing an algorithm or architecting a distributed system, we believe in pushing the boundaries of what student coders can achieve together.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row flex-wrap justify-center md:justify-evenly items-center my-10 md:my-16 gap-6 px-4 md:px-0">
        <div className="border bg-white w-full sm:w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">💡</span>
          <p className="text-xl font-bold">Algorithmic Thinking</p>
          <p className="text-gray-500">Mastering the logic behind the code. We tackle complex problem sets that challenge conventional solutions.</p>
        </div>

        <div className="border bg-white w-full sm:w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">🤝</span>
          <p className="text-xl font-bold">Student Networking</p>
          <p className="text-gray-500">Building a lifetime network of peers. We facilitate connections between ambitious developers and future leaders.</p>
        </div>

        <div className="border bg-white w-full sm:w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">🏫</span>
          <p className="text-xl font-bold">Inter-School Exchange</p>
          <p className="text-gray-500">Broadening horizons through competition and collaboration with technical clubs from other universities.</p>
        </div>
      </section>

      <section className="mx-auto p-6 md:p-8 bg-white w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center md:text-left">Our Story</h2>

        <div className="relative border-l-2 border-gray-200 ml-3 md:mx-auto lg:mx-0 space-y-10 md:space-y-12 pb-8 w-full md:w-[80%] lg:w-[60%]">

          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2024 Fall</span>
              <div>
                <h3 className="font-bold text-gray-900">The Foundation</h3>
                <p className="text-gray-500 mt-1 md:mt-2">codeXperts founded at Seneca College by Prof. Yoon and students passionate about going beyond the classroom.</p>
              </div>
            </div>
          </div>

          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2026 Winter</span>
              <div>
                <h3 className="font-bold text-gray-900">First Event</h3>
                <p className="text-gray-500 mt-1 md:mt-2">First official event: Coding Competition hosted at Seneca College.</p>
              </div>
            </div>
          </div>

          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2026 Fall</span>
              <div>
                <h3 className="font-bold text-gray-900">York University</h3>
                <p className="text-gray-500 mt-1 md:mt-2">codeXperts officially launched as a York University recognized club. Inter-campus collaboration begins.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="w-full md:w-[35rem] p-6 md:p-10 mx-auto md:mx-0 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-semibold mb-4">Our Team</h2>
        <p className="text-gray-500">
          The people behind codeXperts</p>
      </section>

      <section className="bg-white w-full py-10 md:py-16 px-6 md:px-10">
        <p className="text-xl font-bold text-center md:text-left mb-6 md:mb-0">Seneca Polytechnic</p>
        <div className="flex flex-wrap justify-center gap-6 md:justify-evenly items-center">
          {senecaMembers.map((member) => (
            <MemberCard key={member.key} name={member.name} role={member.role} />
          ))}
        </div>
      </section>

      <section className="bg-white w-full py-10 md:py-16 px-6 md:px-10">
        <p className="text-xl font-bold text-center md:text-left mb-6 md:mb-0">York University</p>
        <div className="flex flex-wrap justify-center gap-6 md:justify-evenly items-center">
          {yorkMembers.map((member) => (
            <MemberCard key={member.key} name={member.name} role={member.role} />
          ))}
        </div>
      </section>

      <section className="py-10 md:py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-6 md:gap-0">
        <div className="flex-[2] text-center md:text-left">
          <p className="text-2xl md:text-3xl font-semibold mb-2">Ready to contribute?</p>
          <p className="text-gray-500">
            Join our community or meet the minds behind the code.</p>
        </div>
        <div className="flex-[0.5] w-full md:w-auto flex justify-center md:justify-end">
          <JoinButton className="w-full sm:w-auto justify-center bg-brand-primary hover:bg-brand-hover px-8 py-4 flex items-center gap-2 shadow-xl" />
        </div>
      </section>

    </main>
  )
}

export default AboutPage
