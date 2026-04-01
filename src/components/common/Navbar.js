'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { socialLinks } from '@/config/socialLinks'

const navLinks = [
  { label: 'Home', href: '/', public: true },
  { label: 'About Us', href: '/about', public: true },
  { label: 'Schedule', href: '/schedule', public: true },
  { label: 'Events', href: '/events', public: true },
  { label: 'Join Us', href: '/join', public: true },   // hidden after login
  { label: 'Problems', href: '/problems', public: false }, // member only
  { label: 'Members', href: '/members', public: false },   // member only
]

function SocialIcon({ letter, href, colorClass, children }) {
  const base = `w-8 h-8 rounded-md ${colorClass} flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {letter}
      </a>
    )
  }

  return (
    <div className="relative group">
      <div className={base}>{letter}</div>
      <div className="absolute right-0 top-full pt-1 z-50 hidden group-hover:block">
        <div className="bg-white rounded-md shadow-lg border border-gray-100 min-w-[110px] py-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-gray-900 shrink-0 tracking-tight">
          codeXperts
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2 shrink-0">

          {/* LinkedIn — single link */}
          <SocialIcon letter="L" href={socialLinks.linkedin.url} colorClass="bg-blue-700" />

          {/* Email — single link */}
          <SocialIcon letter="E" href={socialLinks.email.url} colorClass="bg-gray-500" />

          {/* Instagram — public, hover dropdown */}
          <SocialIcon letter="I" colorClass="bg-pink-600">
            {socialLinks.instagram.map(({ campus, url }) => (
              <a
                key={campus}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {campus}
              </a>
            ))}
          </SocialIcon>

          {/* Discord — member only, hover dropdown */}
          <SocialIcon letter="D" colorClass="bg-indigo-600">
            {socialLinks.discord.map(({ campus, url }) => (
              <a
                key={campus}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {campus}
              </a>
            ))}
          </SocialIcon>

          {/* Admin — icon only */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center text-white text-sm"
            title="Admin"
          >
            ⚙
          </Link>
        </div>

      </div>
    </nav>
  )
}
