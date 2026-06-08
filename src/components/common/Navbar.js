'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { socialLinks } from '@/config/socialLinks'
import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle } from '@/services/authService'
import { IconLinkedIn, IconGitHub } from '@/components/ui/SocialIcons'

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Events', href: '/events' },
]

const memberOnlyLinks = [
  { label: 'Problems', href: '/problems' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Members', href: '/members' },
]

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}


function IconDiscord() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}


function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
    </svg>
  )
}

const ROLE_LABEL = { pending: 'P', member: 'M', executive: 'E', admin: 'A' }
const ROLE_COLOR = {
  pending:   'bg-bg-layer1 text-text-secondary',
  member:    'bg-link-bg text-link',
  executive: 'bg-purple-100 text-purple-700',
  admin:     'bg-accent-bg text-accent',
}

function UserChip({ user, profile }) {
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = profile?.nickname
    ? profile.nickname[0].toUpperCase()
    : profile?.first_name
      ? profile.first_name[0].toUpperCase()
      : '?'
  const role = profile?.role

  return (
    <div className="flex items-center gap-1.5">
      {avatarUrl ? (
        <img src={avatarUrl} alt={initial} className="w-7 h-7 rounded-full object-cover" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center">
          {initial}
        </div>
      )}
      {role && ROLE_LABEL[role] && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOR[role]}`}>
          {ROLE_LABEL[role]}
        </span>
      )}
    </div>
  )
}

function SocialDropdown({ icon, items }) {
  return (
    <div className="relative group">
      <button className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">{icon}</button>
      <div className="absolute right-0 top-full pt-2 z-50 hidden group-hover:block">
        <div className="bg-bg-surface rounded-lg shadow-lg border border-border min-w-[130px] py-1.5">
          {items.map(({ school, url }) => (
            <a key={school} href={url} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-layer1 transition-colors">
              {school}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function NavLink({ href, label, pathname }) {
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`relative px-1 py-1 text-sm transition-colors ${
        active ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    function handlePageShow(e) {
      if (e.persisted) setLoggingIn(false)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const role = profile?.role ?? null
  const isMember = role === 'member' || role === 'executive' || role === 'admin'
  const isAdmin = role === 'admin'

  const allLinks = isMember ? [...publicLinks, ...memberOnlyLinks] : publicLinks

  async function handleLogIn() {
    if (loggingIn) return
    setLoggingIn(true)
    try {
      await signInWithGoogle(`${window.location.origin}/auth/callback`)
    } catch {
      setLoggingIn(false)
    }
  }

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const socialIconsRow = (
    <div className="flex items-center gap-0.5">
      <SocialDropdown icon={<IconInstagram />} items={socialLinks.instagram} />
      <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer"
        className="p-1.5 text-[#0A66C2] hover:opacity-80 transition-opacity">
        <IconLinkedIn />
      </a>
      <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer"
        className="p-1.5 text-text-primary hover:opacity-70 transition-opacity">
        <IconGitHub />
      </a>
      {isMember && <SocialDropdown icon={<IconDiscord />} items={socialLinks.discord} />}
      <button onClick={scrollToContact}
        className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">
        <IconEmail />
      </button>
    </div>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-surface border-b border-border shadow-sm">

      <div className="relative w-full px-4 sm:px-6 h-14 flex items-center">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img src="/codeXpertsLogo.svg" alt="codeXperts" className="h-8 w-auto" />
        </Link>

        {/* Desktop: center nav links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-4">
          {allLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} pathname={pathname} />
          ))}
        </div>

        {/* Desktop: right side — social icons + auth */}
        <div className="ml-auto hidden lg:flex items-center gap-1 shrink-0">
          {socialIconsRow}
          <div className="w-px h-5 bg-border mx-1" />
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={`/members/${user.id}`}><UserChip user={user} profile={profile} /></Link>
              <button onClick={signOut}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors">
                Log out
              </button>
            </div>
          ) : (
            <button onClick={handleLogIn} disabled={loggingIn}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loggingIn ? 'Redirecting…' : 'Log In'}
            </button>
          )}
          {isAdmin && (
            <Link href="/admin" title="Admin"
              className="ml-1 p-1.5 text-text-secondary hover:text-text-primary transition-colors">⚙</Link>
          )}
        </div>

        {/* Mobile: hamburger only */}
        <div className="ml-auto lg:hidden">
          <button
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-bg-surface px-6 py-4 flex flex-col gap-1 relative z-50">
          {allLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                pathname === href
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-layer1'
              }`}>
              {label}
            </Link>
          ))}

          <div className="my-2 h-px bg-border" />

          {user ? (
            <>
              <Link href={`/members/${user.id}`} onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-layer1 rounded-md transition-colors">
                My Profile
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-layer1 rounded-md transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={() => { signOut(); setMobileOpen(false) }}
                className="w-full mt-1 px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors text-center">
                Log out
              </button>
            </>
          ) : (
            <button onClick={() => { setMobileOpen(false); handleLogIn() }} disabled={loggingIn}
              className="w-full px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors text-center disabled:opacity-60 disabled:cursor-not-allowed">
              {loggingIn ? 'Redirecting…' : 'Log In'}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
