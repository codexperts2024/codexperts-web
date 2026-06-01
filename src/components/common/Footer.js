'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { socialLinks } from '@/config/socialLinks'
import { SCHOOLS } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const publicSitemapLinks = [
  { label: 'Home', href: '/', scrollTop: true },
  { label: 'About Us', href: '/about' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Events', href: '/events' },
]

const memberSitemapLinks = [
  { label: 'Problems', href: '/problems' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Members', href: '/members' },
]

const selectClass =
  'w-full h-9 bg-bg-input border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary font-inter focus:outline-none focus:border-accent transition-colors'

export default function Footer() {
  const { user, profile } = useAuth()
  const role = profile?.role
  const isMember = role === 'member' || role === 'executive' || role === 'admin'
  const sitemapLinks = isMember ? [...publicSitemapLinks, ...memberSitemapLinks] : publicSitemapLinks
  const [form, setForm] = useState({ email: '', name: '', school: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }))
    }
  }, [user?.email])

  function validate() {
    const next = {}
    if (!form.email) next.email = 'Required'
    if (!form.name) next.name = 'Required'
    if (!form.school) next.school = 'Required'
    if (!form.message) next.message = 'Required'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) { setErrors(next); return }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm((prev) => ({ email: prev.email, name: '', school: '', message: '' }))
      setTimeout(() => setStatus(null), 4000)
    } catch {
      setStatus('error')
    }
  }

  function update(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <footer className="bg-bg-surface border-t border-border-strong mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ── Left: Sitemap + Club Signup ── */}
        <div className="space-y-8">
          <div>
            <h3 className="font-montserrat font-semibold text-text-primary text-sm uppercase tracking-widest mb-4">
              Site Map
            </h3>
            <ul className="space-y-2">
              {sitemapLinks.map(({ label, href, scrollTop }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={scrollTop ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-text-primary text-sm uppercase tracking-widest mb-4">
              Official Club Sign Up
            </h3>
            <ul className="space-y-2">
              {socialLinks.clubSignup.map(({ school, url }) => (
                <li key={school}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline transition-colors"
                    >
                      {school}
                    </a>
                  ) : (
                    <span className="text-sm text-text-hint">
                      {school} <span className="text-xs">(Coming Soon)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: Contact Form ── */}
        <div id="contact" className="flex flex-col">
          <h3 className="font-montserrat font-semibold text-text-primary text-sm uppercase tracking-widest mb-4">
            Get in Touch (codeXperts2024@gmail.com)
          </h3>

          {status === 'sent' ? (
            <p className="text-sm text-accent">Message sent! We&apos;ll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 flex-1">
              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={update('email')}
                  readOnly={!!user?.email}
                  className={user?.email ? 'opacity-60 cursor-not-allowed' : ''}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Name + School */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={update('name')}
                    className="h-9"
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <select
                    className={selectClass}
                    value={form.school}
                    onChange={update('school')}
                  >
                    <option value="" disabled>School</option>
                    {SCHOOLS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.school && <p className="text-xs text-red-400 mt-1">{errors.school}</p>}
                </div>
              </div>

              {/* Message — grows to fill remaining height */}
              <div className="flex flex-col flex-1">
                <textarea
                  placeholder="Message"
                  value={form.message}
                  onChange={update('message')}
                  className={`${selectClass} flex-1 resize-none min-h-[80px]`}
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-400">Failed to send. Please try again.</p>
              )}

              <Button type="submit" disabled={status === 'sending'} className="w-full">
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-border-strong">
        <p className="text-center text-xs text-text-hint py-4">
          &copy; {new Date().getFullYear()} codeXperts Club. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
