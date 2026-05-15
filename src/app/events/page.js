export default function EventsPage() {

  const clubEvents = [
    {id: 1, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Join us for an evening of celebration and networking.', cta: 'Gallery', image:''},
    {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'A casual meetup with great food and even better company.', cta: 'Gallery', image:''},
    {id: 3, category: 'Workshop', title: 'Advanced React Patterns', date: '2026-04-15', description: 'Deep dive into advanced React concepts including compound components, render props, and custom hooks.', cta: 'Learn More', image: ''}
  ]

  return (
    <main className="min-h-screen w-full bg-white">

      {/* Hero section - Now uses max-w-7xl to match cards */}
      <div className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="mb-4 md:mb-6">
            <span className="inline-flex items-center rounded-md bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 inset-ring inset-ring-gray-500/10">
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

      {/* Past Events Section - Same max-w-7xl */}
      <section className="w-full bg-[#efefef] py-20 px-6 md:px-8">
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
              <div key={event.id} className="group overflow-hidden bg-[#f8f8f8] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out rounded-lg">
                <div className="relative h-54 overflow-hidden bg-black rounded-t-lg">
                  <div className="absolute inset-0 bg-black/35"/>
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
      
    </main>
  )
}