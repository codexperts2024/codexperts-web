'use client'

import { useState } from 'react'
import Image from 'next/image'
import HeroImageEditor from '@/components/home/HeroImageEditor'
import { getOptimizedUrl } from '@/services/cloudinaryService'

export default function HomeHero({ initialUrl }) {
  const [heroUrl, setHeroUrl] = useState(initialUrl)

  return (
    <section className="w-full bg-bg-base pt-4 md:pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-bg-layer1">
          <Image
            src={getOptimizedUrl(heroUrl) || '/hero.jpg'}
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
  )
}
