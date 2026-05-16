# Page: Schedule `/schedule`
> Visibility: public

## Design Tokens

| Token | Value | Use |
|-------|-------|-----|
| BG Base | `#FFFFFF` | Calendar section background |
| BG Surface | `#F9F9F9` | Page header + monthly event list section |
| Layer 1 | `#EAEAEA` | Event list container card |
| Layer 2 | `#DBDBDB` | Event row pill (normal) |
| Layer 2 hover | `#CFCFCF` | Event row pill (hover) |
| Accent | `#C0392B` | MapPin icon in event detail modal |
| Text Primary | `#1A1A1A` | H1, H3, event date label |
| Text Secondary | `#555555` | Subtitle, event title, modal fields |
| Text Hint | `#999999` | Empty state / loading / error messages |
| Font Heading | Montserrat | H1 (700), H3 (600) |
| Font Body | Inter | All other text |

---

## Data Source

- **Calendar ID:** `codexperts2024@gmail.com` (public Google Calendar)
- **iCal feed:** `https://calendar.google.com/calendar/ical/codexperts2024%40gmail.com/public/basic.ics`
- **Subscribe URL:** `https://calendar.google.com/calendar/r?cid=codexperts2024@gmail.com`
- **No Google Calendar API key required** — uses the public `.ics` feed parsed server-side
- API route: `/api/calendar?year=YYYY&month=M`
- Returns: `{ events: [{ date, title, location, description }] }`
- Supports recurring events (RRULE: DAILY / WEEKLY / MONTHLY / YEARLY, BYDAY, INTERVAL, UNTIL, COUNT, EXDATE)

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, py-12)                  │
│  H1: "Schedule"  (Montserrat 700 36px #1A1A1A)      │
│  Subtitle: "Stay up to date with codeXperts         │
│             meetings, events, and deadlines."        │
│  (Inter 400 16px #555555)                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CALENDAR SECTION  (bg: #FFFFFF, py-12)             │
│  max-width: 1000px, centered                        │
│                                                     │
│  Month navigation row:                              │
│    [←]  May 2026  [→]                               │
│    ChevronLeft/Right icon buttons (20px)            │
│    hover: bg #F3F3F3, color #1A1A1A                 │
│    Month label: Montserrat 600 16px, min-w 140px    │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Google Calendar embed (iframe)              │   │
│  │  height: 600px, width: 100%                  │   │
│  │  border: 1px solid #E5E5E5, rounded           │   │
│  │  src updates dynamically with month/year     │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ACTION BUTTONS  (bg: #FFFFFF, pb-8)                │
│  max-width: 1000px, flex row, gap-3                 │
│                                                     │
│  [📅 Subscribe]     [⬇ Download .ics]              │
│   Secondary outline  Secondary outline              │
│   → Google Calendar  → Downloads .ics file         │
│     Add to calendar    (codexperts-schedule.ics)    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MONTHLY EVENT LIST  (bg: #F9F9F9, py-12)           │
│  max-width: 1000px, centered                        │
│                                                     │
│  ┌── Layer 1: #EAEAEA rounded-2xl p-6 ─────────┐   │
│  │  H3: "May 2026 Events" (Montserrat 600 20px) │   │
│  │                                               │   │
│  │  ┌── Layer 2: #DBDBDB rounded-full px-4 py-2┐│   │
│  │  │  [May 3]  Weekly Coding Session           ││   │
│  │  └──────────────────────────────────────────┘│   │
│  │  ┌── Layer 2 ────────────────────────────────┐│   │
│  │  │  [May 10]  Problem Submission Deadline    ││   │
│  │  └──────────────────────────────────────────┘│   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Month Navigation

- **State:** `year` (number) + `month` (number, 1–12) stored in React state
- **Prev / Next buttons** update state, which simultaneously:
  1. Rebuilds the Google Calendar iframe `src` via `buildCalendarSrc(year, month)`
  2. Triggers a new `fetch('/api/calendar?year=Y&month=M')` call for the event list
- **iframe key:** set to `calendarSrc` so React unmounts/remounts when the URL changes
- **Label:** `"May 2026"` format, centered, `min-width: 140px`

---

## Google Calendar Embed

```
src format:
  https://calendar.google.com/calendar/embed
  ?src=codexperts2024%40gmail.com
  &ctz=America%2FToronto
  &mode=MONTH
  &dates=YYYYMM01%2FYYYYMM01

iframe attributes:
  width: 100%
  height: 600px
  border: 0
  scrolling: no
  frameBorder: 0
```

---

## Monthly Event List — 3-Layer Depth System

| Layer | Element | Color | Shadow |
|-------|---------|-------|--------|
| Layer 0 | Section background | `#F9F9F9` | — |
| Layer 1 | Event list container card | `#EAEAEA` | `0 1px 3px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)` |
| Layer 2 | Event row pill (button) | `#DBDBDB` | `0 1px 2px rgba(0,0,0,0.19), 0 2px 4px rgba(0,0,0,0.08)` |
| Layer 2 hover | Event row pill hover | `#CFCFCF` | `0 2px 4px rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.10)` |

**Event row pill layout:**
```
[  Apr 8  ]  [  Weekly Coding Session  ]
  date label      event title
  Inter 700 xs    Inter 400 sm
  #1A1A1A         #555555
  shrink-0 w-12
```

**States:**
- Loading: `"Loading events..."` in `#999999`
- Error: `"Unable to load events. Please try again later."` in `#999999`
- Empty: `"No events this month."` in `#999999`

---

## Event Detail Modal

Clicking any event row pill opens a modal overlay (no page navigation).

```
┌── Backdrop: rgba(0,0,0,0.30) ─────────────────────┐
│                                                    │
│  ┌── Layer 1: #EAEAEA rounded-2xl p-6 ──────────┐ │
│  │                              [X] close button │ │
│  │  Event Title   (Montserrat 600 18px #1A1A1A)  │ │
│  │  Full date     (Inter 400 14px #555555)       │ │
│  │                                               │ │
│  │  ┌── Layer 2 pill (if location) ───────────┐  │ │
│  │  │ 📍 Location text (underlined)           │  │ │
│  │  │    → links to Google Maps search        │  │ │
│  │  └─────────────────────────────────────────┘  │ │
│  │                                               │ │
│  │  ┌── Layer 2 pill (if description) ────────┐  │ │
│  │  │ ≡ Description text                      │  │ │
│  │  └─────────────────────────────────────────┘  │ │
│  │                                               │ │
│  │  (if neither: "No additional details.")       │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Modal behavior:**
- Close: click backdrop / press Escape / click X button
- Location pill: `<a>` to `https://www.google.com/maps/search/?api=1&query=ENCODED_LOCATION`
  - Opens in new tab, `rel="noopener noreferrer"`
  - MapPin icon: `#C0392B`, text underlined
  - Hover: bg `#CFCFCF`, stronger shadow
- Description pill: plain text, AlignLeft icon `#555555`

---

## Action Buttons

### Subscribe
```
Label: "Subscribe"
Icon: CalendarPlus (Lucide, 16px)
Style: Secondary outline — border 1px #CCCCCC, color #555555, radius 6px, px-4 py-2
Hover: border-color #1A1A1A, color #1A1A1A
Action: Opens https://calendar.google.com/calendar/r?cid=codexperts2024@gmail.com in new tab
```

### Download .ics
```
Label: "Download .ics"
Icon: Download (Lucide, 16px)
Style: Secondary outline — same as Subscribe
Action: Downloads .ics file from Google Calendar public feed
        download attribute: "codexperts-schedule.ics"
```

---

## API Route: `/api/calendar`

**File:** `src/app/api/calendar/route.js`

**Request:** `GET /api/calendar?year=2026&month=5`

**Response:**
```json
{
  "events": [
    {
      "date": "2026-05-04T18:00:00.000Z",
      "title": "Weekly Coding Session",
      "location": "Room A1234, Seneca@York",
      "description": "Bring your laptop."
    }
  ]
}
```

**iCal parsing features:**
- Line unfolding (CRLF + space/tab continuation)
- Text cleaning (escaped `\n`, `\,`, `\\`)
- DTSTART formats: date-only (`20260504`), datetime local, datetime UTC
- RRULE expansion: FREQ (DAILY/WEEKLY/MONTHLY/YEARLY), BYDAY, INTERVAL, UNTIL, COUNT
- EXDATE support (cancelled occurrences)
- Events sorted ascending by date

---

## Notes

- Google Calendar must be set to **public** visibility for the iCal feed to be accessible
- No Google API key required — public `.ics` feed is sufficient
- Month navigation is controlled client-side; the iframe reloads via `key` prop change
- The event list is a completely separate React-rendered section (not part of the iframe)
- No admin controls on this page — all schedule management is done via Google Calendar
