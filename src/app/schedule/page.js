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
  // First day of the month in YYYYMMDD format
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
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
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
      {/* Modal card — Layer 1 */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: '#EAEAEA',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#DBDBDB] transition-colors text-[#555555]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h4 className="font-montserrat text-lg font-semibold text-[#1A1A1A] pr-8 mb-1">
          {event.title}
        </h4>
        {/* Date */}
        <p className="font-inter text-sm text-[#555555] mb-4">{fullDate}</p>

        {/* Details — Layer 2 pills */}
        <div className="space-y-3">
          {event.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl px-4 py-3 transition-all"
              style={{
                backgroundColor: '#DBDBDB',
                boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#CFCFCF';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DBDBDB';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)';
              }}
            >
              <MapPin size={15} className="shrink-0 mt-0.5 text-[#C0392B]" />
              <span className="font-inter text-sm text-[#555555] underline underline-offset-2">
                {event.location}
              </span>
            </a>
          )}
          {event.description && (
            <div
              className="flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: '#DBDBDB',
                boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <AlignLeft size={15} className="shrink-0 mt-0.5 text-[#555555]" />
              <span className="font-inter text-sm text-[#555555]">{event.description}</span>
            </div>
          )}
          {!event.location && !event.description && (
            <p className="font-inter text-sm text-[#999999]">No additional details.</p>
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

  const fetchEvents = async (y, m) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch(`/api/calendar?year=${y}&month=${m}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      setHasError(true);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(year, month);
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
    <main className="min-h-screen bg-white">
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
      {/* Page Header */}
      <section className="bg-[#F9F9F9] py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          <h1 className="font-montserrat text-4xl font-bold text-[#1A1A1A]">Schedule</h1>
          <p className="mt-3 font-inter text-base text-[#555555]">
            Stay up to date with codeXperts meetings, events, and deadlines.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="bg-white py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Month Navigation */}
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded hover:bg-[#F3F3F3] transition-colors text-[#555555] hover:text-[#1A1A1A]"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-montserrat text-base font-semibold text-[#1A1A1A] min-w-[140px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded hover:bg-[#F3F3F3] transition-colors text-[#555555] hover:text-[#1A1A1A]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Google Calendar Embed */}
          <div className="w-full rounded overflow-hidden border border-[#E5E5E5]">
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
      <section className="bg-white pb-8">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-[#CCCCCC] text-[#555555] font-inter text-sm font-medium hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
            >
              <CalendarPlus size={16} />
              Subscribe
            </a>
            <a
              href={ICS_URL}
              download="codexperts-schedule.ics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-[#CCCCCC] text-[#555555] font-inter text-sm font-medium hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
            >
              <Download size={16} />
              Download .ics
            </a>
          </div>
        </div>
      </section>

      {/* Monthly Event List */}
      <section className="bg-[#F9F9F9] py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Layer 1 — wraps title + event list */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: '#EAEAEA',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            <h3 className="font-montserrat text-xl font-semibold text-[#1A1A1A] mb-5">
              {monthLabel} Events
            </h3>

            {isLoading && (
              <p className="font-inter text-sm text-[#999999]">Loading events...</p>
            )}

            {!isLoading && hasError && (
              <p className="font-inter text-sm text-[#999999]">
                Unable to load events. Please try again later.
              </p>
            )}

            {!isLoading && !hasError && events.length === 0 && (
              <p className="font-inter text-sm text-[#999999]">No events this month.</p>
            )}

            {!isLoading && !hasError && events.length > 0 && (
              <ul className="space-y-3">
                {events.map((event, i) => (
                  <li key={i}>
                    {/* Layer 2 — clickable pill: opens event detail modal */}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center gap-3 rounded-full px-4 py-2 transition-all text-left cursor-pointer"
                      style={{
                        backgroundColor: '#DBDBDB',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#CFCFCF';
                        e.currentTarget.style.boxShadow =
                          '0 2px 4px rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.10)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#DBDBDB';
                        e.currentTarget.style.boxShadow =
                          '0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)';
                      }}
                    >
                      <span className="font-inter text-xs font-semibold text-[#1A1A1A] shrink-0 w-12">
                        {formatEventDate(event.date)}
                      </span>
                      <span className="font-inter text-sm font-normal text-[#555555]">
                        {event.title}
                      </span>
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
