'use client';

import PastEventsCards from './PastEventsCards';
import Link from 'next/link';
import { clubEvents } from './eventsArr';
import { isEventUpcoming } from '@/lib/events';

export default function PastEventsId() {
  const pastEvents = clubEvents.filter((event) => !isEventUpcoming(event));
  const firstPastEvent = pastEvents[0];

  return (
    <section className="w-full bg-bg-base py-12 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold text-text-primary font-montserrat">Past Events</h2>
            <p className="mt-2 text-sm text-gray-600">
              Archived technical sessions and community highlights.
            </p>
          </div>

          {firstPastEvent && (
            <Link
              href={`/events/${firstPastEvent.id}`}
              className="hidden md:block text-sm font-semibold tracking-[0.1em] text-red-700 transition hover:text-red-900"
            >
              VIEW ARCHIVE →
            </Link>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <PastEventsCards key={event.id} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
}
