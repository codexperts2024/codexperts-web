import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section>
        <img src="hero.jpg" alt="group photo of codeXperts" className="object-cover object-[0%_60%] w-screen h-[70vh] " />
      </section>
      <section className="flex justify-evenly items-center m-10 my-16">
        <div className="border w-[18rem] h-[18rem] bg-zinc-200"></div>
        <div className="border w-[18rem] h-[18rem] bg-zinc-200"></div>
        <div className="border w-[18rem] h-[18rem] bg-zinc-200"></div>
      </section>
      <section className="flex mx-7 my-16 justify-center align-center">
        <div className="flex-[2]">
          <p className="text-5xl font-semibold mb-4">Who We Are</p>
          <div className="w-12 h-1 bg-red-700"></div>
        </div>
        <div className="flex flex-col gap-10 w-[40rem] ">
          <p className="text-gray-700">
            codeXperts is a premier student-led technical collective dedicated to bridging the gap between theoretical computer science and professional software engineering. We believe that mastery comes from doing from the messy reality of version control, system design, and collaborative debugging.</p>
          <p className="text-gray-700">
            Our digital atelier serves as a launching pad for the next generation of architects, developers, and researchers. Whether you're committing your first line of code or optimizing distributed systems, you'll find a community that values technical rigor and creative expression.</p>
          <div className="flex gap-4 pt-6">
            <Link href="/join">
              <Button
                className="bg-[#C0392B] hover:bg-[#E87A6E] px-8 py-4 flex items-center gap-2 shadow-xl"
              >
                Join Us <span>→</span>
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="secondary"
                className="px-8 py-4 flex items-center gap-2">
                About Us <span>→</span>
              </Button>
            </Link>

          </div>
        </div>
      </section >
    </main >
  )
}
