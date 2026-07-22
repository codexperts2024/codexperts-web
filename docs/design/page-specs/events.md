# Page: Events `/events` + `/events/:id`
> Visibility: public (read) · Create/Edit/Delete: executive, admin

## Design Tokens (summary)
- BG: `bg-bg-surface` (`#FAFAF8`) / `bg-bg-base` (`#F8F9F6`)
- Accent: `accent` (`#B80F0A`)
- Text: `text-text-primary` / `text-text-secondary`
- Font: Montserrat (headings) / Inter (body)
- See `docs/design/design-system.md` and `tailwind.config.js`

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: Upcoming section `bg-bg-surface`, Past Events section `bg-bg-base`. Do NOT change.
- Font: Montserrat for H1/H2/H3. Inter for body, meta, buttons. Do NOT use any other font.
- Accent (`bg-accent` / `#B80F0A`) used ONLY on [Learn More →] CTA and exec action buttons. Nowhere else.
- Do NOT add a calendar view, filter bar, tags, or search box on this page.
- UPCOMING section: featured events as wide banner cards (full container width), stacked vertically. Cover photo top (~400px), H3 title, meta row (date · location), 2-line description, [Learn More →] primary accent button. If multiple upcoming events, stack vertically — do NOT use a carousel or slider.
- PAST EVENTS section: 3-column grid desktop / 2-col tablet / 1-col mobile. Card: cover photo 200px → date → title → campus badge. No extra info on card.
- Past event card hover: box-shadow `0 4px 12px rgba(0,0,0,0.10)`. No color change.
- Render BOTH the list view AND the detail view (`/events/:id`) as separate screens.
- Event detail: full-width hero image (400px, NO text overlay), then info section, then photo gallery grid with lightbox on click.
- Do NOT add comments, ratings, or RSVP buttons.

---

## View 1: Events List `/events`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg-bg-base, padding: 32px 0)         │
│  H1: "Events"                                       │
│  Subtitle: "Competitions, workshops, and meetups"   │
│  [New]  ← executive/admin only                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  UPCOMING EVENTS  (bg-bg-surface, padding: 48px 0)  │
│  H2: "Upcoming"                                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Event cover image — wide banner]          │    │
│  │  ~400px tall, object-fit cover, radius 8px  │    │
│  │                                             │    │
│  │  H3: Spring Coding Competition 2026         │    │
│  │  date · location                            │    │
│  │  Short description (2 lines max)            │    │
│  │                                             │    │
│  │  [Learn More →]   ← links to /events/:id   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  If multiple upcoming events: stacked vertically    │
│                                                     │
│  Empty state: "No upcoming events at the moment.    │
│               Check back soon!"                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAST EVENTS  (bg-bg-base, padding: 48px 0)         │
│  H2: "Past Events"                                  │
│                                                     │
│  Grid: 3 columns desktop / 2 tablet / 1 mobile      │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ [photo]  │  │ [photo]  │  │ [photo]  │          │
│  │ 200px    │  │ 200px    │  │ 200px    │          │
│  │ cover    │  │ cover    │  │ cover    │          │
│  │──────────│  │──────────│  │──────────│          │
│  │ Jan 2026 │  │ Nov 2025 │  │ Sep 2025 │          │
│  │ Event    │  │ Event    │  │ Event    │          │
│  │ Title    │  │ Title    │  │ Title    │          │
│  │ Seneca   │  │ York     │  │ Seneca   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  Card hover: box-shadow stronger, cursor pointer    │
│  Click card → /events/:id                          │
│                                                     │
│  Load more: [Load More] button if > 6 past events  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## View 2: Event Detail `/events/:id`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BREADCRUMB  (padding: 16px 0)                      │
│  Events  /  Spring Coding Competition 2026          │
│  text-text-secondary, Inter 13px                    │
│  [← Back to Events]                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HERO IMAGE  (full-width)                           │
│  width: 100%, height: 400px, object-fit: cover      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  EVENT INFO  (bg-bg-surface, padding: 48px 0)       │
│  max-width: 900px, centered                         │
│                                                     │
│  H1: [Event Title]  (+ Edit/Delete for exec+)       │
│  Meta row:                                          │
│    [Date]   ·   [Location]   ·   [Campus]           │
│    Inter 14px, text-text-secondary                  │
│                                                     │
│  Divider: border-border                             │
│                                                     │
│  H3: "About this Event"                             │
│  Body: full description, markdown rendered          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PHOTO GALLERY  (bg-bg-base, padding: 48px 0)       │
│  H3: "Photos"                                       │
│                                                     │
│  Uniform grid                                       │
│  Click photo → lightbox (full-screen overlay)       │
│  Lightbox: [← prev] [photo] [next →] [✕ close]     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NAV ROW  (padding: 32px 0)                         │
│  [← Previous Event]          [Next Event →]         │
│   Secondary outline           Secondary outline     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Past Event Card Spec
```
background: bg-bg-surface
border: border-border
border-radius: 8px
overflow: hidden

  Cover photo: width 100%, height 200px, object-fit cover
  Padding below photo: 16px

  Date: Inter 400 12px, text-text-hint
  Title: Inter 500 15px, text-text-primary
  Campus tag: small badge — Seneca or York
  hover: box-shadow 0 4px 12px rgba(0,0,0,0.10)
```

---

## Notes
- Upcoming events: sorted by date ascending (soonest first)
- Past events: sorted by date descending (most recent first)
- Event detail supports multiple photos (gallery)
- Photo lightbox: keyboard arrow navigation supported
- `/events/:id` works for both upcoming and past events
- Data stored in Supabase `events` table
- Executive/Admin manages events via inline CRUD on `/events` and `/events/:id` (create, edit, delete + Cloudinary cover/gallery upload)
