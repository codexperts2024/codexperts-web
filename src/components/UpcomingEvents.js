'use client';

import { clubEvents } from './eventsArr';
import { isEventUpcoming } from '@/lib/events';
import Link from 'next/link';

export default function UpcomingEvent() {
  const upcomingEvents = clubEvents.filter(isEventUpcoming);
  const featuredEvent = upcomingEvents[0];

  if (!featuredEvent) {
    return (
      <section className="w-full bg-bg-layer1 pt-8 pb-20 md:pt-2 md:pb-24">
        <div className="px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold font-montserrat">Upcoming</h2>
              <div className="w-20 h-px bg-gray-300" />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl md:text-2xl font-bold font-montserrat text-gray-800 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-gray-500 font-inter max-w-md mx-auto">
                Keep an eye out for more events! Check back for updates on future competitions, workshops, and fun events.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-bg-layer1 pt-8 pb-20 md:pt-2 md:pb-24">
      <div className="px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold font-montserrat">Upcoming</h2>
              <div className="w-20 h-px bg-gray-300" />
            </div>

            <div className="relative overflow-hidden rounded-lg bg-black min-h-[420px]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800" />

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

              <div className="relative z-10 p-10 md:p-16 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-red-600 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded">
                    {featuredEvent.category}
                  </span>
                  <span className="text-gray-300 text-xs tracking-wider uppercase">
                    {featuredEvent.endDate
                      ? `${new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${new Date(featuredEvent.endDate).getDate()}, ${new Date(featuredEvent.endDate).getFullYear()}`
                      : new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    }
                  </span>
                </div>

                <h3 className="text-5xl md:text-6xl font-bold text-white font-montserrat leading-none mb-6">
                  {featuredEvent.title}
                </h3>

                <p className="text-gray-300 leading-7 text-sm md:text-base max-w-lg mb-10">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={featuredEvent.registration || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 text-sm font-medium rounded inline-block text-center"
                  >
                    {featuredEvent.cta}
                  </Link>
                  <Link
                    href={`/events/${featuredEvent.id}`}
                    className="border border-white/20 hover:bg-white hover:text-black transition text-white px-6 py-3 text-sm font-medium rounded inline-block text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
