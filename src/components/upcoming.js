'use client';
// import { useRouter } from 'next/navigation';

export default function UpcomingEventPage() {


    return (

    <div className="min-h-screen w-full bg-[#F9F9F9]">
      
      {/* Content Container */}
     <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
          <a href="/events" className="hover:text-red-600 transition">
            Events
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">
            Spring Coding Competition 2026
          </span>
        </div>
      </div>

      {/* Hero Banner - FULL WIDTH - Outside any container */}
      <div className="w-full">
        <div className="relative w-full h-96 bg-gradient-to-r from-red-600 to-red-800 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Container - Reduced padding from sides */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Desktop: 2/3 + 1/3 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight font-montserrat mt-4">
              Spring Coding
              <br />
              Competition 2026
            </h1>

            {/* Event Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-sm text-gray-500 font-inter">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                </svg>
                <span>March 14–16, 2026</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Technical Lab</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.78552 9.5 12.7855 14l9-4.5-9-4.5-8.99998 4.5Zm0 0V17m3-6v6.2222c0 .3483 2 1.7778 5.99998 1.7778 4 0 6-1.3738 6-1.7778V11"/>
                </svg>
                <span>Seneca College</span>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                About this Event
              </h2>

              <div className="bg-gray-50 rounded-xl p-5 md:p-6 text-gray-600 leading-relaxed space-y-3 font-inter text-sm md:text-base">
                <p>
                  Dive into a 48-hour intensive sprint designed to push your
                  technical boundaries. The Spring Coding Competition 2026
                  brings together the brightest minds to solve complex
                  algorithmic puzzles and build innovative software tools
                  from the ground up.
                </p>
                <p>
                  Whether you are a backend specialist or a creative frontend developer, 
                  this is your laboratory to experiment, iterate, and compete for 
                  exclusive prizes and industry recognition.
                </p>
              </div>
            </div>

            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-red-600 uppercase font-inter">
                  Registration Open
                </p>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1 font-montserrat">
                  Secure your spot in the lab
                </h3>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-md transition font-inter text-sm">
                Register Now
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 font-montserrat">
                Competition Track
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                    <p className="font-semibold text-gray-800 font-inter text-sm md:text-base">
                      Algorithmic Mastery
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-1 ml-4 font-inter">
                    Optimization & Logic
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                    <p className="font-semibold text-gray-800 font-inter text-sm md:text-base">
                      Tool Innovation
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-1 ml-4 font-inter">
                    Utility & Design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Event
            </button>

            <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-md flex items-center gap-2 transition font-inter text-sm">
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