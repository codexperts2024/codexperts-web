'use client';
import Link from 'next/link';
import Image from 'next/image';
import { clubEvents } from './eventsArr';


export default function PastEventsCards({event}) {
    return (
        <Link href={`/events/past/${event.id}`} className="block group">
            <div className="group rounded-t-lg overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-[0_4px_12px_rgba(0,0,0,0.10) rounded-t-lg">
                <div className="relative h-[200px] overflow-hidden bg-black rounded-t-lg">
                  <Image
                    src={event.image} 
                    alt={event.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"/>
                    <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase text-white rounded">
                        {event.category}
                    </span>
                  </div>

                <div className="flex min-h-[280px] flex-col justify-between p-8">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {event.school && (
                      <span className="text-[11px] uppercase tracking-[0.1em] text-gray-400">
                        {event.school}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-4 mt-2 text-2xl font-semibold leading-tight text-zinc-900 font-montserrat">
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