'use client'

import Link from 'next/link'
import Image from 'next/image'

function formatCardDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function PastEventsCards({ event }) {
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className="overflow-hidden bg-bg-surface border border-border rounded-lg transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
        <div className="relative h-[200px] overflow-hidden bg-bg-layer1">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-bg-layer2" />
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-inter text-text-hint">
            {formatCardDate(event.date)}
          </p>
          <h3 className="mt-1 text-[15px] font-medium font-inter text-text-primary leading-snug">
            {event.title}
          </h3>
          {event.campus && (
            <span className="inline-block mt-2 text-xs font-inter px-2 py-0.5 rounded bg-accent-bg text-accent">
              {event.campus}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
