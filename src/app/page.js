'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Button from '@/components/ui/Button'
import JoinUsButton from '@/components/ui/JoinUsButton'
import HeroImageEditor from '@/components/home/HeroImageEditor'
import { getOptimizedUrl } from '@/services/cloudinaryService'
import { getSiteSetting } from '@/services/siteSettingsService'
import { createLoadGuard } from '@/utils/loadGuard'

const FALLBACK_HERO = '/hero.jpg'

export default function HomePage() {
  const [heroUrl, setHeroUrl] = useState(null)

  useEffect(() => {
    const guard = createLoadGuard()

    async function load() {
      try {
        const url = await getSiteSetting('hero_image_url', { signal: guard.signal })
        if (!guard.isCancelled() && url) setHeroUrl(url)
      } catch {
        // Keep fallback hero on timeout/error
      }
    }

    load()
    return () => guard.cleanup()
  }, [])

  const src = getOptimizedUrl(heroUrl) ?? FALLBACK_HERO

  return (
    <main className="min-h-screen bg-bg-base">

      {/* Hero — fixed aspect ratio with page gutters so crop stays consistent */}
      <section className="w-full bg-bg-base pt-4 md:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative w-full aspect-[16/7] overflow-hidden bg-bg-layer1">
            <Image
              src={src}
              alt="group photo of codeXperts"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover object-center"
              priority
            />
            <HeroImageEditor onUpdate={setHeroUrl} />
          </div>
        </div>
      </section>

      {/* Social Feed — full width bg-bg-base, inner container matches footer */}
      <section className="w-full bg-bg-base py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="elfsight-app-6ad46684-1265-4d5d-bcce-41c3310eff1e w-full overflow-hidden"
            data-elfsight-app-lazy
          />
        </div>
      </section>

      {/* Who We Are — full width bg-bg-base, inner container matches footer */}
      <section className="w-full bg-bg-base py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          <div className="w-full md:w-64 shrink-0 text-center md:text-left">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-4 text-text-primary">Who We Are</h2>
            <div className="w-12 h-1 bg-accent mx-auto md:mx-0"></div>
          </div>
          <div className="flex flex-col gap-5 flex-1">
            <p className="text-text-secondary leading-relaxed text-center md:text-left">
              codeXperts is a premier student-led technical collective built on a simple truth: academic coursework alone is not enough to survive the modern production environment. We bridge this gap by cultivating the essential skills that industry demands.            </p>
            <p className="text-text-secondary leading-relaxed text-center md:text-left">
              Through algorithm training and continuous presentation cycles, our members sharpen both their computational logic and their technical communication. Beyond the code, codeXperts serves as a vibrant networking hub and incubator, where developers connect, collaborate, and build production-ready team projects.
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
