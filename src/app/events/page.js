export default function EventsPage() {

  const clubEvents = [

    {id: 1, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: '', cta: 'Gallery', image:''},
    {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: '', cta: 'Gallery', image:''}

  ]

  return (
    <main className="min-h-screen">

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        <span className="inline-flex items-center rounded-md bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 inset-ring inset-ring-gray-500/10">
          Calendar of Innovation
        </span>

        <h1 className="text-5xl font-bold text-gray-900">Events</h1>
        <p className="mt-3 text-gray-600 max-w-9/10 text-base leading-7">
          Where theory meets application. Explore our upcoming challenges, technical
          workshops, and community-led sessions at the Digital Atelier.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
        <p className="mt-3 text-gray-600 max-w-9/10 text-sm leading-7">
          Archived technical sessions and community highlights.
        </p>

        <section className="bg-[#efefef] py-20 px-6 md:px-12">

          <div className="mx-auto max-w-7xl">

            <div className="mb-12 flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-bold text-[#222]">Past Events</h2>
              
                <p className="mt-2 text-sm text-gray-700">
                  Archived techinal sessions and community highlights.
                </p>
              </div>

              <button className="hidden md:block text-sm font-semibold tracking-[0.1em] text-red-600 transition hover:text-red-800">
                VIEW ARCHIVE →
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {clubEvents.map((event) => (

                <div key= {event.id} className="group overflow-hidden bg-[#f8f8f8] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
                  <div className="relative h-54 overflow-hidden bg-black">
                    {/* <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-400 group"/> */}
                  
                    <div className="absolute inset-0 bg-black/35"/>

                    <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase text-white">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex min-h-[280px] flex-col justify-between p-8">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      }
                    </p>

                    <h3 className="mb-4 text-2xl font-semibold leading-tight text-zinc-900">
                      {event.title}
                    </h3>

                    <p className="text-sm mb-8 leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    <button className="mt-10 w-fit text-sm font-semibold uppercase tracking-[0.1em] text-red-600 transition hover:text-red-700">
                      {event.cta}
                    </button>

                  </div>

                </div>
              ))}
            </div>

          </div> 

        </section>

      </div>
      
      {/* <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">Events</h1>
        <p className="mt-3 text-gray-400 text-lg">Hackathons · Workshops · Socials</p>
      </div> */}
    </main>
  )
}
