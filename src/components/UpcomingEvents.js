'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatEventDate } from '@/lib/events'

export default function UpcomingEvents({ events = [] }) {
  if (events.length === 0) {
    return (
      <section className="w-full bg-bg-surface py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold font-montserrat text-text-primary mb-8">Upcoming</h2>
          <p className="text-center text-text-hint font-inter py-12">
            No upcoming events at the moment. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-bg-surface py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold font-montserrat text-text-primary mb-8">Upcoming</h2>

        <div className="flex flex-col gap-10">
          {events.map((event) => (
            <article key={event.id} className="w-full">
              <Link
                href={`/events/${event.id}`}
                className="block w-full rounded-lg overflow-hidden bg-bg-layer1 cursor-pointer"
              >
                {event.coverImageUrl ? (
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    width={1600}
                    height={900}
                    className="w-full h-auto max-h-[420px] object-contain object-center mx-auto"
                    sizes="(max-width: 1280px) 100vw, 1152px"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-[240px] bg-bg-layer2" />
                )}
              </Link>

              <div className="mt-5">
                {event.category && (
                  <p className="text-xs font-inter uppercase tracking-wider text-text-hint mb-2">
                    {event.category}
                  </p>
                )}
                <Link href={`/events/${event.id}`}>
                  <h3 className="text-xl font-semibold font-montserrat text-text-primary hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                </Link>
                <p className="mt-2 text-sm font-inter text-text-secondary">
                  {formatEventDate(event.date, event.endDate)}
                  {event.location ? ` · ${event.location}` : ''}
                </p>
                {event.description && (
                  <p className="mt-3 text-base font-inter text-text-secondary leading-7 line-clamp-2 max-w-3xl">
                    {event.description}
                  </p>
                )}
                <Link
                  href={`/events/${event.id}`}
                  className="inline-block mt-5 bg-accent hover:bg-accent-hover text-bg-base font-inter text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
