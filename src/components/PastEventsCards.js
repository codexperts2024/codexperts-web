'use client';
import Link from 'next/link';
import { clubEvents } from './eventsArr';

// const clubEvents = [
//     {id: 1, category: 'Coding Competition', title: 'CodeXperts Coding Competition', date: '2026-03-21', description: 'Programmers of all levels joined to solve algorithms for grand prizes.', eDescription:
//         'This intensive laboratory session was a deep-dive into the architectural nuances of systems programming using Rust. Participants explored the intricacies of memory safety without a garbage collector, focusing on ownership, borrowing, and lifetimes.\n\nThe workshop moved beyond basic syntax, challenging students to implement low-level optimizations and safe concurrency patterns. It was designed for those looking to bridge the gap between high-level logic and metal-level performance, providing a rigorous technical framework for building reliable software systems.',
//          cta: 'Learn More', image: '', location:'Room 402', school:'Seneca College'},
//     {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', eDescription: '', cta: 'Gallery', image: './images/event1.jpg', location:'Room S1077', school:'Seneca @ York'},
//     {id: 3, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', eDescription: '', cta: 'Gallery', image:'', location:"Professor's House", school:''}
// ];

export default function PastEventsCards({event}) {
    return (
        <Link href={`/events/past/${event.id}`} className="block group">
            <div className="group rounded-t-lg overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-[0_4px_12px_rgba(0,0,0,0.10) rounded-t-lg">
                <div className="relative h-[200px] overflow-hidden bg-black rounded-t-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"/>
                    <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase text-white rounded">
                        {event.category}
                    </span>
                  </div>

                <div className="flex min-h-[280px] flex-col justify-between p-8">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                  <h3 className="mb-4 text-2xl font-semibold leading-tight text-zinc-900 font-montserrat">
                    {event.title}
                  </h3>

                  <p className="text-sm mb-8 leading-relaxed text-gray-600">
                    {event.description}
                  </p>

                  <button className="mt-auto w-fit text-sm font-semibold uppercase tracking-[0.1em] text-red-700 transition hover:text-red-900 border-b border-red-700">
                    {event.cta}
                  </button>
                </div>
              </div>

        </Link>
    )
}