
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { clubEvents } from '@/components/eventsArr';

// const clubEvents = [
//     {id: 1, category: 'Coding Competition', title: 'CodeXperts Coding Competition', date: '2026-03-21', description: 'Programmers of all levels joined to solve algorithms for grand prizes.', eDescription:
//         'This intensive laboratory session was a deep-dive into the architectural nuances of systems programming using Rust. Participants explored the intricacies of memory safety without a garbage collector, focusing on ownership, borrowing, and lifetimes.\n\nThe workshop moved beyond basic syntax, challenging students to implement low-level optimizations and safe concurrency patterns. It was designed for those looking to bridge the gap between high-level logic and metal-level performance, providing a rigorous technical framework for building reliable software systems.',
//          cta: 'Learn More', image: '', location:'Room 402', school:'Seneca College'},
//     {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', eDescription: '', cta: 'Gallery', image: './images/event1.jpg', location:'Room S1077', school:'Seneca @ York'},
//     {id: 3, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', eDescription: '', cta: 'Gallery', image:'', location:"Professor's House", school:''}
// ];

// Generate static params for all event IDs
export async function generateStaticParams() {
  return clubEvents.map((event) => ({
    id: event.id.toString(),
  }));
}

function getPastEvent(id) {
  return clubEvents.find((e) => e.id === id);
}

export default async function PastEventInfo({ params }) {
  const { id } = await params;
  const eventId = parseInt(id);

  const event = clubEvents.find(e => e.id === eventId);

  if (!event) {
    notFound();
  }

  const currentIndex = clubEvents.findIndex(e => e.id === eventId);
  const previous = currentIndex > 0 ? clubEvents[currentIndex - 1] : null;
  const next = currentIndex < clubEvents.length - 1 ? clubEvents[currentIndex + 1] : null;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < clubEvents.length - 1;
  
  const descriptions = event.eDescription && event.eDescription.trim() !== ''
    ? event.eDescription.split('\n\n')
    : ['No detailed description available for this event.'];

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
          <Link href="/events" className="hover:text-gray-800 transition">
            Events
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">
            {event.title}
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="relative w-full h-96 bg-gradient-to-r from-red-700 to-red-900 overflow-hidden">
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">

        <div className="mb-4 md:mb-6">
          <span className="inline-flex items-center rounded-md bg-gray-200 px-5 py-2 text-xs text-gray-500 inset-ring inset-ring-gray-500/10 tracking-widest">
            PAST EVENT
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-montserrat mt-4">
          {event.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-sm text-gray-500 font-inter">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                </svg>
                <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    </span>
              </div>

              {event.location && event.location.trim() !== '' && (
                <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
                </div>
                )}

              {event.school && event.school.trim() !== '' && (
                <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.78552 9.5 12.7855 14l9-4.5-9-4.5-8.99998 4.5Zm0 0V17m3-6v6.2222c0 .3483 2 1.7778 5.99998 1.7778 4 0 6-1.3738 6-1.7778V11"/>
                </svg>
                <span>{event.school}</span>
                </div>
            )}
            </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="md:col-span-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-montserrat">
                  About this Event
                </h2>
              </div>

              <div className="md:col-span-2">
                <div className="bg-[#efefef] rounded-xl p-5 md:p-6 text-gray-600 leading-relaxed space-y-3 font-inter text-sm md:text-base">
                  {descriptions.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
    <div className="flex items-center justify-between mt-10 pt-20 border-t border-gray-100">
       <Link
            href={hasPrevious ? `/events/past/${previous.id}` : '#'}
            className={`border px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm ${
              hasPrevious
                ? 'border-gray-300 hover:bg-gray-100 text-gray-800 cursor-pointer'
                : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
            </svg>
            Previous Event
          </Link>

          <Link
            href={hasNext ? `/events/past/${next.id}` : '#'}
            className={`border px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm ${
              hasNext
                ? 'border-gray-300 hover:bg-gray-100 text-gray-800 cursor-pointer'
                : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
            }`}
          >
            Next Event
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M19 12l-4 4m4-4-4-4" />
            </svg>
          </Link>
        </div>
  </div>

    </div>
  )
}
