export default function EventsPage() {
  return (
    <main className="min-h-screen bg-bg-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-8 md:pb-12">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-3 text-text-primary">Events</h1>
        <p className="text-text-secondary">Hackathons · Workshops · Socials</p>
      </div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="border border-border rounded-lg p-10 flex flex-col items-center justify-center text-center gap-3">
          <p className="font-montserrat font-semibold text-text-primary">No events posted yet</p>
          <p className="text-sm text-text-secondary">Upcoming hackathons, workshops, and socials will appear here.</p>
        </div>
      </section>
    </main>
  )
}
