'use client';

import UpcomingEvents from '@/components/UpcomingEvents';
import PastEventsId from '@/components/PastEventsId';


export default function EventsPage() {

  return (
    <main className="min-h-screen w-full bg-white font-inter">

      <div className="bg-[#F9F9F9] px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-4 md:mb-6">
            <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 inset-ring inset-ring-gray-500/10">
              Calendar of Innovation
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 font-montserrat">Events</h1>
          <p className="mt-3 text-gray-600 max-w-2xl text-base leading-7">
            Where theory meets application. Explore our upcoming challenges, technical
            workshops, and community-led sessions at the Digital Atelier.
          </p>
        </div>
      </div>

      <UpcomingEvents/>

      <PastEventsId />

      <section className="w-full bg-gray-100 py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat">
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
              className="bg-red-700 hover:bg-red-900 text-white font-semibold px-8 py-3 rounded-sm transition-colors duration-200"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

    </main>
  )
}