'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getOptimizedUrl } from '@/services/cloudinaryService'
import { getSiteSetting } from '@/services/siteSettingsService'
import MentorPhotoEditor from '@/components/mentor/MentorPhotoEditor'

const FALLBACK_PHOTO = '/mentor.png'

const LETTER_PARAGRAPHS = [
  'Hello, and welcome!',
  'Throughout history, humanity has progressed through defining eras: the Stone Age, the Iron Age, the Industrial Age, the Computer Age, and the Smartphone Age. Today, we stand at the beginning of a new era: the Age of Artificial Intelligence.',
  'The driving force of our generation is Information Technology. Computer science, cybersecurity, data science, artificial intelligence, and software engineering are shaping the future of every industry. Yet simply earning a degree in these fields is no longer enough. In the AI era, those who lead will not merely be the best coders; they will be the people who think faster, solve problems more creatively, and reason more logically.',
  'Consider this example. Years ago, accountants succeeded because they could perform complex calculations quickly. Today, calculators and software perform those calculations instantly. What makes a great accountant now is the ability to understand a client\'s situation, develop sound financial strategies, and create value. The calculator is only a tool.',
  'AI is no different.',
  'In the future, success will not belong to those who simply know how to write code. It will belong to those who can understand complex problems, design elegant algorithms, think critically, and use AI as a powerful tool to create innovative solutions.',
  'That is exactly what codeXperts is about.',
  'At codeXperts, we train ourselves to analyze real-world problems, design efficient algorithms, build practical solutions, and develop the mindset of true technology leaders. Our goal is not to produce programmers who simply write code, but professionals who understand technology deeply and use it to make a meaningful impact.',
  'I founded this club because I want to help students become real IT professionals: individuals who combine technical excellence with creativity, leadership, and wisdom.',
  'Our curriculum has been carefully designed around challenges inspired by real software development environments. The concepts and skills we practice reflect the standards expected by leading technology companies, and many of our senior members have gone on to work at organizations such as Google, Microsoft, Apple, and Meta. More importantly, these experiences will prepare you to solve real problems throughout your career.',
  'If you are looking for a community where you can grow, challenge yourself, build meaningful friendships, and develop into an exceptional technology professional, I warmly invite you to join codeXperts and attend our next coding session.',
  'As your mentor, I promise to support you not only in developing your technical skills, but also in your personal growth, career, and life journey.',
  'I look forward to meeting you.',
]

export default function MentorPage() {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const url = await getSiteSetting('mentor_photo_url')
        if (!cancelled) setPhotoUrl(url)
      } catch {
        if (!cancelled) setPhotoUrl(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const src = getOptimizedUrl(photoUrl) ?? FALLBACK_PHOTO

  return (
    <main className="min-h-screen bg-bg-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-6">
        <p className="text-xs font-inter uppercase tracking-wider text-text-hint mb-2">About</p>
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-text-primary">
          Our Mentor
        </h1>
        <p className="mt-3 text-text-secondary font-inter text-base leading-7 max-w-2xl">
          A welcome message from the founder of codeXperts.
        </p>
      </div>

      <section className="bg-bg-surface py-10 md:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-text-primary mb-8">
            Welcome to codeXperts
          </h2>

          <div className="relative float-none md:float-right md:ml-8 md:mb-4 w-full max-w-[220px] mx-auto md:mx-0 mb-8">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-layer1 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]">
              {!loading && (
                <Image
                  src={src}
                  alt="Professor Danny Yoon, Founder and Mentor of codeXperts"
                  fill
                  className="object-cover object-top"
                  sizes="220px"
                  priority
                  unoptimized={src.startsWith('/')}
                />
              )}
              <MentorPhotoEditor onUpdate={setPhotoUrl} />
            </div>
            <p className="mt-3 text-center md:text-left font-inter text-sm text-text-primary font-medium">
              Professor Danny Yoon
            </p>
            <p className="text-center md:text-left font-inter text-xs text-text-hint">
              Founder and Mentor, codeXperts
            </p>
          </div>

          <div className="font-inter text-base text-text-primary leading-[1.7] space-y-5">
            {LETTER_PARAGRAPHS.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="clear-both" />

          <div className="mt-10 pt-8 border-t border-border">
            <p className="font-montserrat font-semibold text-lg text-text-primary">
              Professor Danny Yoon
            </p>
            <p className="font-inter text-sm text-text-secondary mt-1">
              Founder and Mentor, codeXperts
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
