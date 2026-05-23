import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Button from '@/components/ui/Button'
import JoinUsButton from '@/components/ui/JoinUsButton'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <section>
        <Image
          src="/hero.jpg"
          alt="group photo of codeXperts"
          width={1920}
          height={1080}
          className="object-cover object-[0%_60%] w-screen h-[50vh] md:h-[70vh]"
          priority
        />
      </section>

      <section className="flex justify-evenly items-center m-4 md:m-10 my-8 md:my-16 py-5 bg-white">
          <div 
          className="elfsight-app-6ad46684-1265-4d5d-bcce-41c3310eff1e w-full overflow-hidden" 
          data-elfsight-app-lazy 
        />        

      </section>
      <section className="flex flex-col md:flex-row my-8 md:my-16 justify-center items-center md:items-start container mx-auto p-5 gap-8 md:gap-0">
        <div className="flex-[2] w-full text-center md:text-left">
          <p className="text-4xl md:text-5xl font-semibold mb-4">Who We Are</p>
          <div className="w-12 h-1 bg-red-700 mx-auto md:mx-0"></div>
        </div>
        <div className="flex flex-col gap-6 md:gap-10 w-full md:w-[40rem]">
          <p className="text-gray-700 text-center md:text-left">
            codeXperts is a premier student-led technical collective dedicated to bridging the gap between theoretical computer science and professional software engineering. We believe that mastery comes from doing from the messy reality of version control, system design, and collaborative debugging.</p>
          <p className="text-gray-700 text-center md:text-left">
            Our digital atelier serves as a launching pad for the next generation of architects, developers, and researchers. Whether you're committing your first line of code or optimizing distributed systems, you'll find a community that values technical rigor and creative expression.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 justify-center md:justify-start">
            <JoinUsButton className="w-full sm:w-auto bg-brand-primary hover:bg-brand-hover px-8 py-4 flex items-center justify-center gap-2 shadow-xl" />

            <Link href="/about" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2">
                About Us <span>→</span>
              </Button>
            </Link>

          </div>
        </div>
      </section>
      <Script src="https://elfsightcdn.com/platform.js" />
    </main>
  )
}
