import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] ">
      <div className="w-[35rem] p-10">
        <p className="text-5xl font-semibold mb-4">About codeXperts</p>
        <p className="text-gray-500">
          More than a club — a community of coders going beyond the classroom.</p>
      </div>

      <section className="bg-white w-full">
        <div className="flex justify-center align-center container mx-auto px-10 py-16">
          <p className="text-[#C0392B] font-[550] text-3xl flex-[1] ">Why We Exist</p>
          <div className="flex flex-col gap-10 flex-[2]">
            <p className="">
              codeXperts was founded on the principle that programming is an art form best practiced in collaboration. While university lectures provide the theory, our "Digital Atelier" provides the space to build, break, and refine real-world systems.</p>
            <p className="">
              We focus on high-level technical rigor paired with student-led mentorship. Whether it's optimizing an algorithm or architecting a distributed system, we believe in pushing the boundaries of what student coders can achieve together.</p>
          </div>
        </div>
      </section>

      <section className="flex justify-evenly align-center my-16">
        <div className="border bg-white w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">💡</span>
          <p className="text-xl font-bold">Algorithmic Thinking</p>
          <p className="text-gray-500">Mastering the logic behind the code. We tackle complex problem sets that challenge conventional solutions.</p>
        </div>

        <div className="border bg-white w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">🤝</span>
          <p className="text-xl font-bold">Student Networking</p>
          <p className="text-gray-500">Building a lifetime network of peers. We facilitate connections between ambitious developers and future leaders.</p>
        </div>

        <div className="border bg-white w-80 p-5 flex flex-col gap-4">
          <span className="text-3xl -ml-1.5 -mb-1">🏫</span>
          <p className="text-xl font-bold">Inter-School Exchange</p>
          <p className="text-gray-500">Broadening horizons through competition and collaboration with technical clubs from other universities.</p>
        </div>
      </section>

      <section className="mx-auto p-8 bg-white w-[100%]">
        <h2 className="text-3xl font-bold mb-12">Our Story</h2>

        <div className="relative border-l-2 border-gray-200 ml-3 space-y-12 pb-8 w-[60%]">

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2024 Fall</span>
              <div>
                <h3 className="font-bold text-gray-900">The Foundation</h3>
                <p className="text-gray-500 mt-2">Started as a small study group of three CS students looking to build high-performance tools outside of their coursework.</p>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2026 Winter</span>
              <div>
                <h3 className="font-bold text-gray-900">Scaling Up</h3>
                <p className="text-gray-500 mt-2">The group grew to 50 members and hosted its first regional hackathon, focusing on systems programming and low-level optimization.</p>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-red-800 rounded-full border-4 border-white"></div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
              <span className="text-red-800 font-bold whitespace-nowrap">2026 Fall</span>
              <div>
                <h3 className="font-bold text-gray-900">The Digital Atelier</h3>
                <p className="text-gray-500 mt-2">Officially rebranding and launching our dedicated lab space, providing a permanent home for technical innovation and research.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="w-[35rem] p-10">
        <p className="text-5xl font-semibold mb-4">Our Team</p>
        <p className="text-gray-500">
          The people behind codeXperts</p>
      </section>

      <section className="bg-white w-full py-16 px-10">
        <p className="text-xl font-bold">Seneca Polytechnic</p>
        <div className="flex justify-evenly items-center">
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-white w-full py-16 px-10">
        <p className="text-xl font-bold">York University</p>
        <div className="flex justify-evenly items-center">
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div className="size-16 bg-gray-200 rounded-xl mb-5 flex justify-center items-center">T1</div>
            <p className="mb-2">Paul Kim</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 w-fit mb-2">President</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-600 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
        </div>
      </section>

      <section className="py-16 px-20 flex items-center">
        <div className="flex-[2]">
          <p className="text-2xl font-semibold mb-2">Ready to contribute?</p>
          <p className="text-gray-500">
            Join our community or meet the minds behind the code.</p>
        </div>
        <div className="flex-[0.5]">
          <Link href="/join">
              <Button
                className="bg-[#C0392B] hover:bg-[#E87A6E] px-8 py-4 flex items-center gap-2 shadow-xl"
              >
                Join Us <span>→</span>
              </Button>
            </Link>
        </div>
      </section>

    </main>
  )
}
