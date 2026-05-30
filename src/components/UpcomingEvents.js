'use client';
import { useRouter } from 'next/navigation';
import { upcomingEvents } from './eventsArr';

function isUpcomingEvent(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
  eventEndDate.setHours(0, 0, 0, 0);
  return eventEndDate >= today;
}

// export function getUpcomingEvent(id) {
//   return upcomingEvents.find(event => event.id === id);
// }


export default function UpcomingEvent() {

     const upcomingEvents = clubEvents.filter(event => isUpcomingEvent(event));
  
    const featuredEvent = upcomingEvents[0];

    if (!featuredEvent) {
      return null; 
    }


    return (
      <section className="w-full bg-[#efefef] pt-8 pb-20 md:pt-2 md:pb-24">
        <div className="px-6 md:px-8">
        <div className=" max-w-7xl mx-auto">
          <section className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold font-montserrat">Upcoming</h2>
              <div className="w-20 h-px bg-gray-300" />
            </div>

            <div className="relative overflow-hidden rounded-lg bg-black min-h-[420px]">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg> */}
                </div>
              </div>

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
                  {featuredEvent.title.split(' ').slice(0, 2).join(' ')}
                  <br />
                  {featuredEvent.title.split(' ').slice(2).join(' ')}
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

    )
}