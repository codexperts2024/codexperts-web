export default function EventsPage() {

  const clubEvents = [
    {id: 1, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', cta: 'Gallery', image:''},
    {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', cta: 'Gallery', image: './images/event1.jpg'},
    {id: 3, category: 'Coding Competition', title: 'CodeXperts Coding Competition', date: '2026-03-21', description: 'Programmers of all levels joined to solve algorithms for grand prizes.', cta: 'Learn More', image: ''}
  ]

  return (
    <main className="min-h-screen w-full bg-white">

      <div className="bg-gray-50 px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="mb-4 md:mb-6">
            <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 inset-ring inset-ring-gray-500/10">
              Calendar of Innovation
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900">Events</h1>
          <p className="mt-3 text-gray-600 max-w-2xl text-base leading-7">
            Where theory meets application. Explore our upcoming challenges, technical
            workshops, and community-led sessions at the Digital Atelier.
          </p>
        </div>
      </div>

      {/* Upcoming Event */}
      <section className="w-full bg-[#efefef] pt-8 pb-20 md:pt-2 md:pb-24">
        <div className="px-6 md:px-8">
        <div className=" max-w-7xl mx-auto">
          <section className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-semibold">Upcoming</h2>
              <div className="w-20 h-px bg-gray-300" />
            </div>

            {/* Single Featured Event Banner */}
            <div className="relative overflow-hidden rounded-lg bg-black min-h-[420px]">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-10 md:p-16 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-red-600 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded">
                    Featured Competition
                  </span>
                  <span className="text-gray-300 text-xs tracking-wider uppercase">
                    March 14-16, 2026
                  </span>
                </div>

                <h3 className="text-5xl md:text-6xl font-bold text-white leading-none mb-6">
                  Spring Coding
                  <br />
                  Competition 2026
                </h3>

                <p className="text-gray-300 leading-7 text-sm md:text-base max-w-lg mb-10">
                  Join 200+ developers for a 48-hour sprint. Solve algorithmic
                  puzzles, build innovative tools, and win exclusive prizes from
                  the Digital Atelier.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 text-sm font-medium rounded">
                    Register Now
                  </button>
                  <button className="border border-white/20 hover:bg-white hover:text-black transition text-white px-6 py-3 text-sm font-medium rounded">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </section>

      {/* Past Events Section */}
      <section className="w-full bg-gray-50 py-20 px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-bold text-[#222]">Past Events</h2>
              <p className="mt-2 text-sm text-gray-600">
                Archived technical sessions and community highlights.
              </p>
            </div>

            <button className="hidden md:block text-sm font-semibold tracking-[0.1em] text-red-700 transition hover:text-red-900">
              VIEW ARCHIVE →
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {clubEvents.map((event) => (
              <div key={event.id} className="group overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out rounded-lg">
                <div className="relative h-56 overflow-hidden bg-black rounded-t-lg">
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

                  <h3 className="mb-4 text-2xl font-semibold leading-tight text-zinc-900">
                    {event.title}
                  </h3>

                  <p className="text-sm mb-8 leading-relaxed text-gray-600">
                    {event.description || "Experience this memorable event with our community."}
                  </p>

                  <button className="mt-10 w-fit text-sm font-semibold uppercase tracking-[0.1em] text-red-700 transition hover:text-red-900 border-b border-red-700">
                    {event.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="w-full bg-gray-100 py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Never miss a{" "}
            <span className="text-red-700">Sprint.</span>
          </h2>

          <p className="mt-6 text-gray-600 text-base">
            Join our announcement list for exclusive event invitations and
            technical updates.
          </p>

          <form className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Your academic email"
              className="w-full sm:w-96 px-4 py-3 bg-white border border-gray-200 rounded-sm outline-none focus:ring-2 focus:ring-red-700 text-sm"
            />

            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-8 py-3 rounded-sm transition-colors duration-200"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
      
    </main>
  )
}