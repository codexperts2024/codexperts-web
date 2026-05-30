import Link from 'next/link';
import Image from 'next/image';
import { clubEvents } from '@/components/eventsArr';
import Gallery from '@/components/gallery';

function getEventById(id) {
  return clubEvents.find(event => event.id === id);
}

// function getAllEvents() {
//   return [...clubEvents].sort((a, b) => {
//     const dateA = a.endDate ? new Date(a.endDate) : new Date(a.date);
//     const dateB = b.endDate ? new Date(b.endDate) : new Date(b.date);
//     return dateA - dateB;
//   });
// }

function isEventUpcoming(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
  eventEndDate.setHours(0, 0, 0, 0);
  return eventEndDate >= today;
}

function getPastEvents() {
    return clubEvents
    .filter(event => !isEventUpcoming(event))
    .sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date(a.date);
      const dateB = b.endDate ? new Date(b.endDate) : new Date(b.date);
      // Sort in descending order (newest/most recent first)
      return dateB - dateA;
    });
}

function getUpcomingEvents() {
  return clubEvents
    .filter(event => isEventUpcoming(event))
    .sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date(a.date);
      const dateB = b.endDate ? new Date(b.endDate) : new Date(b.date);
      // Sort in ascending order (soonest/closest first)
      return dateA - dateB;
    });
}

function getAdjacentEvents(currentEventId, isPast) {
  const eventsArr = isPast ? getPastEvents() : getUpcomingEvents();
  const currentIndex = eventsArr.findIndex(event => event.id === currentEventId);

  if (eventsArr.length === 0 || currentIndex === -1) {
    return {
      previous: null,
      next: null
    };
  }
  
  return {
    previous: currentIndex > 0 ? eventsArr[currentIndex - 1] : null,
    next: currentIndex < eventsArr.length - 1 ? eventsArr[currentIndex + 1] : null
  };
}

export async function generateStaticParams() {
  return clubEvents.map((event) => ({
    id: event.id.toString(),
  }));
}


export default async function EventPage({ params }) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  const event = getEventById(eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen w-full bg-[#F9F9F9] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold font-montserrat text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500 font-inter">
            The event you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }
  
  const isPast = !isEventUpcoming(event);
  const isUpcoming = isEventUpcoming(event);
  
  const { previous, next } = getAdjacentEvents(event.id, isPast);
  const hasPrevious = previous !== null;
  const hasNext = next !== null;
  
  const descriptions = event.infoDescription && event.infoDescription.trim() !== ''
    ? event.infoDescription.split('\n\n')
    : ['No detailed description available for this event.'];
  
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9]">
      {/* Breadcrumb*/}
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

      <div className="w-full h-[400px] relative">
        <div className={`relative w-full h-96 overflow-hidden ${
          isUpcoming ? 'bg-gradient-to-r from-red-700 to-red-900' : 'bg-gradient-to-r from-gray-700 to-gray-900'
        }`}>
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {isUpcoming && (
        <>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
              
              {/* Larger Column */}
              <div className="lg:col-span-2">
                {/* <div className="mb-4 md:mb-6">
                  <span className="inline-flex items-center rounded-md bg-red-100 px-5 py-2 text-xs tracking-widest font-semibold text-red-700">
                    UPCOMING EVENT
                  </span>
                </div> */}
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-montserrat">
                  {event.title.split(' ').slice(0, 2).join(' ')}
                  <br />
                  {event.title.split(' ').slice(2).join(' ')}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-sm text-gray-500 font-inter">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {event.endDate
                        ? `${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${new Date(event.endDate).getDate()}, ${new Date(event.endDate).getFullYear()}`
                        : new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      }
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.school && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <span>{event.school}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-12">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                    About this Event
                  </h2>
                  <div className="bg-[#efefef] rounded-xl p-5 md:p-6 text-gray-600 leading-relaxed space-y-3 font-inter text-sm md:text-base">
                    {descriptions.map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-7 flex flex-col sm:flex-row items-center justify-between gap-4 mt-14">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-red-700 uppercase">Registration Open</p>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">Secure your spot in the lab</h3>
                  </div>
                  <Link
                    href={event.registration || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-md transition font-inter text-sm inline-block"
                  >
                    {event.cta}
                  </Link>
                </div>
              </div>
              
              {/* Smaller Column */}
              {event.tracks && event.tracks.length > 0 && (
                <div className="space-y-5">
                  <div className="bg-[#efefef] rounded-xl p-5">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 ml-2 mb-4 font-montserrat">
                      Competition Tracks
                    </h3>
                    {event.tracks.map((track, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mt-2 ml-4">
                          <span className="w-2 h-2 rounded-full bg-red-800 shrink-0"></span>
                          <p className="font-semibold text-gray-800 font-inter text-sm md:text-base">
                            {track.name}
                          </p>
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm ml-8 font-inter">
                          {track.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
            <div className="flex items-center justify-between mt-10 pt-20 border-t border-gray-100">
              <Link
                href={hasPrevious ? `/events/${previous.id}` : '#'}
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
                href={hasNext ? `/events/${next.id}` : '#'}
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
        </>
      )}

      {isPast && (
        <>
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

            {event.gallery && event.gallery.length > 0 && (
              <Gallery gallery={event.gallery} eventTitle={event.title} />
            )}
          </div>
          
          {/* Navigation - At the bottom for past events */}
          <div className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
            <div className="flex items-center justify-between mt-10 pt-20 border-t border-gray-100">
              <Link
                href={hasPrevious ? `/events/${previous.id}` : '#'}
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
                href={hasNext ? `/events/${next.id}` : '#'}
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
        </>
      )}
    </div>
  );
}