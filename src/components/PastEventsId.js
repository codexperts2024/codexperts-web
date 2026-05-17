import PastEventsCards from './PastEventsCards';

const clubEvents = [
    {id: 1, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', cta: 'Gallery', image:'', location:"Professor's House", school:''},
    {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', cta: 'Gallery', image: './images/event1.jpg', location:'Room S1077', school:'Seneca @ York'},
    {id: 3, category: 'Coding Competition', title: 'CodeXperts Coding Competition', date: '2026-03-21', description: 'Programmers of all levels joined to solve algorithms for grand prizes.', 
         cta: 'Learn More', image: '', location:'Room 402', school:'Seneca College'}
];

export default function PastEventsId() {
    return (
        <section className="w-full bg-[#F9F9F9] py-12 px-6 md:px-8">
            <div className="mx-auto max-w-7xl">

            <div className="mb-12 flex items-start justify-between">
                <div>
                <h2 className="text-4xl font-bold text-[#222] font-montserrat">Past Events</h2>
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
                     <PastEventsCards key={event.id} event={event} />
                ))}

            </div>


            </div>

        </section>
    )
}