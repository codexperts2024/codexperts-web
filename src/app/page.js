import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Button from '@/components/ui/Button'
import JoinUsButton from '@/components/ui/JoinUsButton'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-base">

      {/* Hero — full width, no padding */}
      <section>
        <Image
          src="/hero.jpg"
          alt="group photo of codeXperts"
          width={1920}
          height={1080}
          className="object-cover object-[0%_60%] w-full h-[50vh] md:h-[70vh]"
          priority
        />
      </section>

      {/* Social Feed — full width bg-bg-surface, inner container matches footer */}
      <section className="w-full bg-bg-surface py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="elfsight-app-6ad46684-1265-4d5d-bcce-41c3310eff1e w-full overflow-hidden"
            data-elfsight-app-lazy
          />
        </div>
      </section>

      {/* Who We Are — full width bg-bg-surface, inner container matches footer */}
      <section className="w-full bg-bg-surface py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          <div className="w-full md:w-64 shrink-0 text-center md:text-left">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-4 text-text-primary">Who We Are</h2>
            <div className="w-12 h-1 bg-accent mx-auto md:mx-0"></div>
          </div>
          <div className="flex flex-col gap-5 flex-1">
            <p className="text-text-secondary leading-relaxed text-center md:text-left">
              codeXperts is a premier student-led technical collective dedicated to bridging the gap between theoretical computer science and professional software engineering. We believe that mastery comes from doing from the messy reality of version control, system design, and collaborative debugging.
            </p>
            <p className="text-text-secondary leading-relaxed text-center md:text-left">
              Our digital atelier serves as a launching pad for the next generation of architects, developers, and researchers. Whether you&apos;re committing your first line of code or optimizing distributed systems, you&apos;ll find a community that values technical rigor and creative expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
              <JoinUsButton className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2" />
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full px-8 py-3 flex items-center justify-center gap-2">
                  About Us <span>→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Script src="https://elfsightcdn.com/platform.js" />
    </main>
  )
}
