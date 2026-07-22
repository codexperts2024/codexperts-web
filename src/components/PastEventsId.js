'use client'

import { useState } from 'react'
import PastEventsCards from './PastEventsCards'

const INITIAL_COUNT = 6

export default function PastEventsId({ events = [] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visible = events.slice(0, visibleCount)
  const hasMore = events.length > visibleCount

  return (
    <section className="w-full bg-bg-base py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-text-primary font-montserrat mb-8">Past Events</h2>

        {events.length === 0 ? (
          <p className="text-center text-text-hint font-inter py-12">No past events yet.</p>
        ) : (
          <>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((event) => (
                <PastEventsCards key={event.id} event={event} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + INITIAL_COUNT)}
                  className="px-5 py-2.5 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-surface transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
