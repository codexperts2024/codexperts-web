'use client';
import { useRouter } from 'next/navigation';
import { getUpcomingEvent, getNextUpcomingEvents } from '@/components/UpcomingEvents';


export default function UpcomingEventPage({params}) {

  const router = useRouter();
  const eventId = parseInt(params.id);
  const upcomingEvent = getUpcomingEvent(eventId);
  const { previousEvent, nextEvent, hasPrevious, hasNext } = getNextUpcomingEvents(eventId);

  if (!upcomingEvent) {
    return <div>Event not found</div>;
  }

    const previous = () => {
    if (hasPrevious) {
      router.push(`/events/upcoming/${previousEvent.id}`);
    }
  };

  const next = () => {
    if (hasNext) {
      router.push(`/events/upcoming/${nextEvent.id}`);
    }
  };

  const description = upcomingEvent.infoDescription.split('\n\n');

    return (

    <div className="min-h-screen w-full bg-[#F9F9F9]">

      {/* Content Container */}
     <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
          <a href="/events" className="hover:text-gray-800 transition">
            Events
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">
            {upcomingEvent.title}
          </span>
        </div>
      </div>

      {/* Hero Banner - FULL WIDTH - Outside any container */}
      <div className="w-full">
        <div className="relative w-full h-96 bg-gradient-to-r from-red-700 to-red-900 overflow-hidden">
        </div>
      </div>

      {/* Content Container - Reduced padding from sides */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Desktop: 2/3 + 1/3 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-montserrat mt-4">
              {upcomingEvent.title.split(' ').slice(0, 2).join(' ')}
                  <br />
                  {upcomingEvent.title.split(' ').slice(2).join(' ')}
            </h1>

            {/* Event Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-sm text-gray-500 font-inter">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                </svg>
                <span>{upcomingEvent.endDate
                    ? `${new Date(upcomingEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}–${new Date(upcomingEvent.endDate).getDate()}, ${new Date(upcomingEvent.endDate).getFullYear()}`
                    : new Date(upcomingEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  }</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{upcomingEvent.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.78552 9.5 12.7855 14l9-4.5-9-4.5-8.99998 4.5Zm0 0V17m3-6v6.2222c0 .3483 2 1.7778 5.99998 1.7778 4 0 6-1.3738 6-1.7778V11"/>
                </svg>
                <span>{upcomingEvent.school}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                About this Event
              </h2>

              <div className="bg-[#efefef] rounded-xl p-5 md:p-6 text-gray-600 leading-relaxed space-y-3 font-inter text-sm md:text-base">
                {description.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-7 flex flex-col sm:flex-row items-center justify-between gap-4 mt-14">
              <div>
                <p className="text-xs font-bold tracking-widest text-red-700 uppercase font-inter">
                  Registration Open
                </p>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1 font-montserrat">
                  Secure your spot in the lab
                </h3>
              </div>

              <button
                onClick={() => console.log('Register for event:', upcomingEvent.id)}
                className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-md transition font-inter text-sm">
                {upcomingEvent.cta}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div className="bg-[#efefef] rounded-xl p-5">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 font-montserrat">
                Competition Track
              </h3>

              {upcomingEvent.tracks.map((track, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-800 shrink-0"></span>
                      <p className="font-semibold text-gray-800 font-inter text-sm md:text-base">
                        {track.name}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm mt-1 ml-4 font-inter">
                      {track.sub}
                    </p>
                  </div>
                ))}

            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-20 border-t border-gray-100">
            <button
              onClick={previous}
              disabled={!hasPrevious}
              className= {`border px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm ${
              hasPrevious
                ? 'border-gray-300 hover:bg-gray-100 text-gray-800'
                : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
            }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Event
            </button>

            <button
              onClick={next}
              disabled={!hasNext}
              className={`border px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm ${
              hasNext
                ? 'border-gray-300 hover:bg-gray-100 text-gray-800'
                : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
            }`}>
                Next Event
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

      </div>
    </div>

    )
}