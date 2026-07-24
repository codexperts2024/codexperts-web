'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarPlus, Download, MapPin, AlignLeft, X } from 'lucide-react';

const CALENDAR_ID = 'codexperts2024@gmail.com';
const CALENDAR_TIMEZONE = 'America%2FToronto';
const ICS_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
const SUBSCRIBE_URL = `https://calendar.google.com/calendar/r?cid=${CALENDAR_ID}`;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Format a date string for display: "Apr 8"
const formatEventDate = (isoString) => {
  const d = new Date(isoString);
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const day = d.getDate();
  return `${month} ${day}`;
};

// Build the Google Calendar embed src for a given month
const buildCalendarSrc = (year, month) => {
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${year}${pad(month)}01`;
  return (
    `https://calendar.google.com/calendar/embed` +
    `?src=${encodeURIComponent(CALENDAR_ID)}` +
    `&ctz=${CALENDAR_TIMEZONE}` +
    `&mode=MONTH` +
    `&dates=${dateStr}%2F${dateStr}`
  );
};

// Event detail modal
const EventModal = ({ event, onClose }) => {
  // Lock body scroll and close on Escape key while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const d = new Date(event.date);
  const fullDate = d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.30)' }}
      onClick={onClose}
    >
      {/* Modal card — Layer 1 (#EAEAEA) */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 bg-bg-layer1"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-bg-layer2 transition-colors text-text-secondary"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h4 className="font-montserrat text-lg font-semibold text-text-primary pr-8 mb-1">
          {event.title}
        </h4>
        {/* Date */}
        <p className="font-inter text-sm text-text-secondary mb-1">{fullDate}</p>
        {/* Time — shown only for timed events (startTime + endTime both present) */}
        {event.startTime && event.endTime
          ? <p className="font-inter text-sm text-text-secondary mb-4">{event.startTime} – {event.endTime}</p>
          : <div className="mb-4" />
        }

        {/* Details — Layer 2 pills (#DBDBDB) */}
        <div className="space-y-3">
          {event.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl px-4 py-3 transition-all bg-bg-layer2"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#CFCFCF'; /* bg-bg-layer2Hover */
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = ''; // restore bg-bg-layer2
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)';
              }}
            >
              <MapPin size={15} className="shrink-0 mt-0.5 text-accent" />
              <span className="font-inter text-sm text-text-secondary underline underline-offset-2">
                {event.location}
              </span>
            </a>
          )}
          {event.description && (
            <div
              className="flex items-start gap-3 rounded-2xl px-4 py-3 bg-bg-layer2"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)' }}
            >
              <AlignLeft size={15} className="shrink-0 mt-0.5 text-text-secondary" />
              <span
                className="font-inter text-sm text-text-secondary [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mt-1 [&_strong]:font-semibold [&_b]:font-semibold"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          )}
          {!event.location && !event.description && (
            <p className="font-inter text-sm text-text-hint">No additional details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SchedulePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch(`/api/calendar?year=${year}&month=${month}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (cancelled) return;
        setEvents(data.events ?? []);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setHasError(true);
        setEvents([]);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [year, month]);

  const handleCloseModal = useCallback(() => setSelectedEvent(null), []);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const calendarSrc = buildCalendarSrc(year, month);
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  return (
    <main className="min-h-screen bg-bg-base">
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}

      {/* Page Header */}
      <section className="bg-bg-surface py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          <h1 className="font-montserrat text-4xl font-bold text-text-primary">Schedule</h1>
          <p className="mt-3 font-inter text-base text-text-secondary">
            Stay up to date with codeXperts meetings, events, and deadlines.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="bg-bg-base py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Month Navigation */}
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded hover:bg-bg-elevated transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-montserrat text-base font-semibold text-text-primary min-w-[140px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded hover:bg-bg-elevated transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Google Calendar Embed */}
          <div className="w-full rounded overflow-hidden border border-border">
            <iframe
              key={calendarSrc}
              src={calendarSrc}
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="codeXperts Schedule"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="bg-bg-base pb-8">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-border-strong text-text-secondary font-inter text-sm font-medium hover:border-text-primary hover:text-text-primary transition-colors"
            >
              <CalendarPlus size={16} />
              Subscribe
            </a>
            <a
              href={ICS_URL}
              download="codexperts-schedule.ics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-border-strong text-text-secondary font-inter text-sm font-medium hover:border-text-primary hover:text-text-primary transition-colors"
            >
              <Download size={16} />
              Download .ics
            </a>
          </div>
        </div>
      </section>

      {/* Monthly Event List */}
      <section className="bg-bg-surface py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Layer 1 (#EAEAEA) — wraps title + event list */}
          <div
            className="rounded-2xl p-6 bg-bg-layer1"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-montserrat text-xl font-semibold text-text-primary mb-5">
              {monthLabel} Events
            </h3>

            {isLoading && (
              <p className="font-inter text-sm text-text-hint">Loading events...</p>
            )}

            {!isLoading && hasError && (
              <p className="font-inter text-sm text-text-hint">
                Unable to load events. Please try again later.
              </p>
            )}

            {!isLoading && !hasError && events.length === 0 && (
              <p className="font-inter text-sm text-text-hint">No events this month.</p>
            )}

            {!isLoading && !hasError && events.length > 0 && (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={`${event.date}-${event.title}`}>
                    {/* Layer 2 (#DBDBDB) — clickable pill: opens event detail modal */}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center gap-3 rounded-full px-4 py-2 transition-all text-left cursor-pointer bg-bg-layer2"
                      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#CFCFCF'; /* bg-bg-layer2Hover */
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.10)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = ''; // restore bg-bg-layer2
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)';
                      }}
                    >
                      <span className="font-inter text-xs font-semibold text-text-primary shrink-0 w-12">
                        {formatEventDate(event.date)}
                      </span>
                      <span className="font-inter text-sm font-normal text-text-secondary flex-1 min-w-0 truncate">
                        {event.title}
                      </span>
                      {event.startTime && event.endTime && (
                        <span className="font-inter text-xs text-text-hint shrink-0 ml-1">
                          {event.startTime} – {event.endTime}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
