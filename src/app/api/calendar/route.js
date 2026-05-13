import { NextResponse } from 'next/server';

// Force this route to be dynamic so Next.js never caches the response
export const dynamic = 'force-dynamic';

const ICS_URL =
  'https://calendar.google.com/calendar/ical/codexperts2024%40gmail.com/public/basic.ics';

const DAY_ABBR = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

// Parse a raw DTSTART / DTEND / UNTIL / EXDATE value into a JS Date.
// Handles:
//   20260408T180000Z  — datetime UTC
//   20260408T180000   — datetime local (no tz)
//   20260408          — date-only (VALUE=DATE)
//
// IMPORTANT: date-only values must be constructed with new Date(y, m, d) so
// that they land at LOCAL midnight. Using new Date("2026-06-08") instead
// produces UTC midnight, which in western timezones (UTC-N) resolves to the
// previous calendar day and breaks EXDATE comparisons.
const parseIcsDate = (raw) => {
  if (!raw) return null;
  // Strip any TZID=... or VALUE=DATE prefix before the colon
  const clean = raw.includes(':') ? raw.split(':').pop().trim() : raw.trim();
  if (clean.length === 8) {
    // Date-only: parse as local midnight to avoid UTC-offset day-shift
    const y = parseInt(clean.slice(0, 4), 10);
    const m = parseInt(clean.slice(4, 6), 10) - 1; // 0-indexed month
    const d = parseInt(clean.slice(6, 8), 10);
    return new Date(y, m, d);
  }
  return new Date(
    `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}T` +
      `${clean.slice(9, 11)}:${clean.slice(11, 13)}:${clean.slice(13, 15)}` +
      (clean.endsWith('Z') ? 'Z' : '')
  );
};

// Unfold iCal line continuations (CRLF + space/tab)
const unfoldLines = (text) =>
  text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');

// Clean escaped characters from a summary string
const cleanText = (s) =>
  s.replace(/\\n/g, ' ').replace(/\\,/g, ',').replace(/\\/g, '');

// Strip TZID/VALUE prefix and return the bare datetime string
// e.g. "America/Toronto:20260525T180000" → "20260525T180000"
const cleanRaw = (raw) =>
  raw ? (raw.includes(':') ? raw.split(':').pop().trim() : raw.trim()) : '';

// Format a bare iCal datetime string as "h:mm AM/PM".
// Returns null for date-only strings (no time component).
// Time is extracted as a string operation — no Date object, no timezone conversion.
const formatIcsTime = (clean) => {
  if (!clean || clean.length < 15) return null;
  const h = parseInt(clean.slice(9, 11), 10);
  const m = parseInt(clean.slice(11, 13), 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
};

// Parse RRULE string into a key-value object
// e.g. "FREQ=WEEKLY;BYDAY=MO,WE;INTERVAL=2" → { FREQ:'WEEKLY', BYDAY:'MO,WE', INTERVAL:'2' }
const parseRRule = (rruleStr) => {
  const rule = {};
  rruleStr.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx !== -1) rule[part.slice(0, idx)] = part.slice(idx + 1);
  });
  return rule;
};

// Add N days to a Date (returns a new Date)
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

// Add N months to a Date (returns a new Date, preserving time-of-day)
const addMonths = (d, n) => {
  const result = new Date(d);
  result.setMonth(result.getMonth() + n);
  return result;
};

// Expand a recurring VEVENT into concrete dates that fall within [rangeStart, rangeEnd]
const expandRRule = (dtstart, rruleStr, exdates, rangeStart, rangeEnd) => {
  const rule = parseRRule(rruleStr);
  const freq = rule.FREQ;
  const interval = parseInt(rule.INTERVAL ?? '1', 10);
  const until = rule.UNTIL ? parseIcsDate(rule.UNTIL) : null;
  const count = rule.COUNT ? parseInt(rule.COUNT, 10) : Infinity;

  // Days of week for WEEKLY+BYDAY (e.g. ["MO","WE"])
  const byDays = rule.BYDAY
    ? rule.BYDAY.split(',').map((d) => d.replace(/^[+-]?\d+/, ''))
    : null;

  const occurrences = [];
  let current = new Date(dtstart);
  let totalGenerated = 0;
  const MAX_ITER = 2000; // safety cap

  for (let iter = 0; iter < MAX_ITER; iter++) {
    // Termination checks
    if (until && current > until) break;
    if (totalGenerated >= count) break;
    if (current > rangeEnd) break;

    if (freq === 'WEEKLY' && byDays) {
      // Emit all matching days within the current week
      const weekStart = new Date(current);
      for (let di = 0; di < 7; di++) {
        const candidate = addDays(weekStart, di);
        const abbr = Object.keys(DAY_ABBR).find(
          (k) => DAY_ABBR[k] === candidate.getDay()
        );
        if (byDays.includes(abbr)) {
          if (until && candidate > until) break; // candidate exceeds UNTIL — end of recurrence
          totalGenerated++;
          const isExdate = exdates.some(
            (ex) => ex.toDateString() === candidate.toDateString()
          );
          if (!isExdate && candidate >= rangeStart && candidate <= rangeEnd) {
            occurrences.push(new Date(candidate));
          }
          if (totalGenerated >= count) break;
        }
      }
      // Advance by INTERVAL weeks
      current = addDays(current, 7 * interval);
    } else {
      // DAILY / MONTHLY / YEARLY  (or WEEKLY without BYDAY)
      const isExdate = exdates.some(
        (ex) => ex.toDateString() === current.toDateString()
      );
      if (!isExdate && current >= rangeStart) {
        occurrences.push(new Date(current));
      }
      totalGenerated++;

      switch (freq) {
        case 'DAILY':
          current = addDays(current, interval);
          break;
        case 'WEEKLY':
          current = addDays(current, 7 * interval);
          break;
        case 'MONTHLY':
          current = addMonths(current, interval);
          break;
        case 'YEARLY':
          current = addMonths(current, 12 * interval);
          break;
        default:
          return occurrences; // unsupported FREQ — bail out
      }
    }
  }

  return occurrences;
};

// Parse all VEVENT blocks and return events for the requested month
const parseEvents = (icsText, year, month) => {
  const text = unfoldLines(icsText);
  const blocks = text.split('BEGIN:VEVENT').slice(1);

  const rangeStart = new Date(year, month - 1, 1, 0, 0, 0);
  const rangeEnd = new Date(year, month, 0, 23, 59, 59);

  const events = [];

  for (const block of blocks) {
    const get = (key) => {
      // Match KEY or KEY;param=value: value
      const re = new RegExp(`^${key}(?:;[^:]*)?:(.+)`, 'm');
      const m = block.match(re);
      return m ? m[1].trim() : null;
    };

    const rawStart = get('DTSTART');
    const rawEnd = get('DTEND');
    const summary = get('SUMMARY') || 'Untitled Event';
    const rrule = get('RRULE');

    if (!rawStart) continue;

    const dtstart = parseIcsDate(rawStart);
    if (!dtstart || isNaN(dtstart)) continue;

    const title = cleanText(summary);

    // Extract additional event fields
    const location = get('LOCATION') ? cleanText(get('LOCATION')) : null;
    const description = get('DESCRIPTION') ? cleanText(get('DESCRIPTION')) : null;

    // Extract start/end times directly from raw iCal strings to avoid timezone conversion.
    // All occurrences of a recurring event share the same clock time, so we derive
    // the time once from DTSTART/DTEND and reuse it for every occurrence.
    const startTime = formatIcsTime(cleanRaw(rawStart));
    const endTime = rawEnd ? formatIcsTime(cleanRaw(rawEnd)) : null;

    if (rrule) {
      // --- Recurring event ---
      const exdates = [];
      const exdateRe = /^EXDATE(?:;[^:]*)?:(.+)/gm;
      let exMatch;
      while ((exMatch = exdateRe.exec(block)) !== null) {
        exMatch[1].split(',').forEach((raw) => {
          const d = parseIcsDate(raw.trim());
          if (d && !isNaN(d)) exdates.push(d);
        });
      }

      const occurrences = expandRRule(dtstart, rrule, exdates, rangeStart, rangeEnd);
      for (const occ of occurrences) {
        events.push({ date: occ.toISOString(), title, location, description, startTime, endTime });
      }
    } else {
      // --- One-time event ---
      if (dtstart >= rangeStart && dtstart <= rangeEnd) {
        events.push({ date: dtstart.toISOString(), title, location, description, startTime, endTime });
      }
    }
  }

  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  return events;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year'), 10);
    const month = parseInt(searchParams.get('month'), 10);

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 });
    }

    const res = await fetch(ICS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch calendar: ${res.status}`);

    const icsText = await res.text();
    const events = parseEvents(icsText, year, month);

    return NextResponse.json({ events }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load calendar events' }, { status: 500 });
  }
}
