'use client';
import PastEventsCards from './PastEventsCards';
import Link from 'next/link';
import { clubEvents } from './eventsArr';

function pastEvent(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
  eventEndDate.setHours(0, 0, 0, 0);
  return eventEndDate < today;
}

export default function PastEventsId() {

    const pastEvents = clubEvents.filter(event => pastEvent(event));
    const firstPastEvent = pastEvents[0];

    return (
        <section className="w-full bg-[#F9F9F9] py-12 px-6 md:px-8">
            <div className="mx-auto max-w-7xl">

            <div className="mb-12 flex items-start justify-between">
                <div>
                <h2 className="text-4xl font-bold text-[#222] font-montserrat">Past Events</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Archived technical sessions and community highlights.
                </p>
                </div>

             {firstPastEvent && (
                <Link
                href={`/events/${firstPastEvent.id}`}
                className="hidden md:block text-sm font-semibold tracking-[0.1em] text-red-700 transition hover:text-red-900">
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
    )
}