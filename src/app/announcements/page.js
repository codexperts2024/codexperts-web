export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-bg-base">

      {/* Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-8 md:pb-12">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-3 text-text-primary">Announcements</h1>
        <p className="text-text-secondary">
          The latest updates from the Digital Atelier. Tracking our progress, architectural shifts, and upcoming academic deployments.
        </p>
      </div>

      {/* Announcement list */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 flex flex-col gap-4">

        {/* Placeholder card — replace with real data when backend is ready */}
        <article className="border border-border rounded-lg p-6 flex flex-col gap-2 hover:border-border-strong transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-accent-bg text-accent">New</span>
            <time className="text-xs text-text-hint">May 31, 2026</time>
          </div>
          <h2 className="font-montserrat font-semibold text-lg text-text-primary">Welcome to codeXperts</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Our official website is live. Stay tuned for upcoming events, problems, and club updates across Seneca and York campuses.
          </p>
        </article>

        {/* Empty state — shown when no more announcements */}
        <div className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-sm text-text-hint">More announcements coming soon.</p>
        </div>

      </section>
    </main>
  )
}
