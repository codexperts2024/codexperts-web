'use client'

import { useAuth } from '@/hooks/useAuth'
import JoinUsButton from '@/components/ui/JoinUsButton'

export default function AboutCTA() {
  const { user, profile, loading } = useAuth()
  const isLoggedIn = !loading && !!user && !!profile?.first_name

  const heading = isLoggedIn ? 'See what\'s happening' : 'Ready to contribute?'
  const subtext = isLoggedIn
    ? 'Check out the latest announcements from codeXperts.'
    : 'Join our community or meet the minds behind the code.'

  return (
    <section className="w-full bg-bg-base py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-6 md:gap-0">
        <div className="flex-[2] text-center md:text-left">
          <p className="font-montserrat font-semibold text-2xl md:text-3xl text-text-primary mb-2">{heading}</p>
          <p className="text-text-secondary">{subtext}</p>
        </div>
        <div className="flex-[0.5] w-full md:w-auto flex justify-center md:justify-end">
          <JoinUsButton className="w-full sm:w-auto justify-center px-8 py-4 flex items-center gap-2" />
        </div>
      </div>
    </section>
  )
}
