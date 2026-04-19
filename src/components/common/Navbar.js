'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { socialLinks } from '@/config/socialLinks'
import { useAuth } from '@/hooks/useAuth'

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Updates',
    dropdown: [
      { label: 'Announcements', href: '/announcements' },
      { label: 'Schedule', href: '/schedule' },
    ],
  },
  { label: 'Events', href: '/events' },
]

const memberOnlyLinks = [
  {
    label: 'Practice',
    dropdown: [
      { label: 'Problems', href: '/problems' },
      { label: 'Solutions', href: '/solutions' },
    ],
  },
  { label: 'Members', href: '/members' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
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

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mt-0.5 transition-transform duration-200 group-hover:rotate-180">
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── Desktop sub-components ───────────────────────────────────────────────────

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

function NavDropdown({ label, items, pathname }) {
  const isActive = items.some(({ href }) => pathname === href)
  return (
    <div className="relative group">
      <button className={`flex items-center gap-0.5 px-1 py-1 text-sm transition-colors ${
        isActive ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
      }`}>
        {label}
        <IconChevron />
      </button>
      <div className="absolute left-0 top-full pt-2 z-50 hidden group-hover:block">
        <div className="bg-white rounded-lg shadow-lg border border-border min-w-[160px] py-1.5">
          {items.map(({ label: l, href }) => (
            <Link key={href} href={href}
              className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function SocialDropdown({ icon, items }) {
  return (
    <div className="relative group">
      <button className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">{icon}</button>
      <div className="absolute right-0 top-full pt-2 z-50 hidden group-hover:block">
        <div className="bg-white rounded-lg shadow-lg border border-border min-w-[130px] py-1.5">
          {items.map(({ campus, url }) => (
            <a key={campus} href={url} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
              {campus}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = profile?.role ?? (user ? 'member' : 'public')
  const isMember = role === 'member' || role === 'admin'
  const isAdmin = role === 'admin'

  const centerLinks = isMember ? [...publicLinks, ...memberOnlyLinks] : publicLinks

  function renderDesktopLink(item) {
    if (item.dropdown) return <NavDropdown key={item.label} label={item.label} items={item.dropdown} pathname={pathname} />
    return <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border shadow-sm">

      {/* ── Main bar ── */}
      <div className="relative w-full px-6 h-14 flex items-center">

        {/* Logo */}
        <Link href="/" className="shrink-0 font-montserrat font-bold text-xl text-accent tracking-tight">
          codeXperts
        </Link>

        {/* Desktop center links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-5">
          {!loading && centerLinks.map(renderDesktopLink)}
        </div>

        {/* Desktop right — social + auth */}
        <div className="ml-auto hidden lg:flex items-center gap-1 shrink-0">
          <SocialDropdown icon={<IconInstagram />} items={socialLinks.instagram} />
          <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">
            <IconLinkedIn />
          </a>
          {isMember && <SocialDropdown icon={<IconDiscord />} items={socialLinks.discord} />}
          <a href={socialLinks.email.url}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">
            <IconEmail />
          </a>

          <div className="w-px h-5 bg-border mx-1" />

          {!loading && (user ? (
            <button onClick={signOut}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors">
              Log out
            </button>
          ) : (
            <>
              <Link href="/login"
                className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                Log In
              </Link>
              <Link href="/join"
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors">
                Join Us
              </Link>
            </>
          ))}

          {isAdmin && (
            <Link href="/admin" title="Admin"
              className="ml-1 p-1.5 text-text-secondary hover:text-text-primary transition-colors">⚙</Link>
          )}
        </div>

        {/* Mobile — hamburger only */}
        <button
          className="ml-auto lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
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

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-1">

          {/* Nav links */}
          {!loading && centerLinks.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.label} className="py-1">
                  <p className="px-2 py-1 text-xs font-semibold text-text-hint uppercase tracking-wider">{item.label}</p>
                  {item.dropdown.map(({ label, href }) => (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                        pathname === href
                          ? 'text-text-primary font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                      }`}>
                      {label}
                    </Link>
                  ))}
                </div>
              )
            }
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-text-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}>
                {item.label}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-2 h-px bg-border" />

          {/* Social links */}
          <div className="flex items-center gap-4 px-2 py-1">
            {socialLinks.instagram.map(({ campus, url }) => (
              <a key={campus} href={url} target="_blank" rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                IG · {campus}
              </a>
            ))}
          </div>
          <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer"
            className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
            LinkedIn
          </a>
          {isMember && socialLinks.discord.map(({ campus, url }) => (
            <a key={campus} href={url} target="_blank" rel="noopener noreferrer"
              className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
              Discord · {campus}
            </a>
          ))}
          <a href={socialLinks.email.url}
            className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
            Email us
          </a>

          {/* Divider */}
          <div className="my-2 h-px bg-border" />

          {/* Auth */}
          {!loading && (user ? (
            <button onClick={() => { signOut(); setMobileOpen(false) }}
              className="w-full px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors text-center">
              Log out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="w-full px-4 py-2.5 rounded-md text-sm font-medium border border-border text-text-primary hover:bg-bg-surface transition-colors text-center">
                Log In
              </Link>
              <Link href="/join" onClick={() => setMobileOpen(false)}
                className="w-full px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors text-center">
                Join Us
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
