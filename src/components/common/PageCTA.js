'use client'

import Link from 'next/link'

export default function PageCTA({ heading, href, label }) {
  return (
    <section className="w-full bg-bg-base py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-6 md:gap-0">
        <div className="flex-[2] text-center md:text-left">
          <p className="font-montserrat font-semibold text-2xl md:text-3xl text-text-primary">{heading}</p>
        </div>
        <div className="flex-[0.5] w-full md:w-auto flex justify-center md:justify-end">
          <Link
            href={href}
            className="w-full sm:w-auto justify-center px-8 py-4 flex items-center gap-2 rounded-md text-sm font-medium font-inter transition-colors bg-accent hover:bg-accent-hover text-white"
          >
            {label} <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
