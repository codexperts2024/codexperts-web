# Page: Events `/events` + `/events/:id`
> Visibility: public

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B`
- Text: `#1A1A1A` / `#555555`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: Upcoming section bg `#FFFFFF`, Past Events section bg `#F9F9F9`. Do NOT change.
- Font: Montserrat for H1/H2/H3. Inter for body, meta, buttons. Do NOT use any other font.
- Accent `#C0392B` used ONLY on [Learn More →] button. Nowhere else.
- Do NOT add a calendar view, filter bar, tags, or search box on this page.
- UPCOMING section: ONE featured event as a wide banner card (full container width). Cover photo top (~400px), H3 title, meta row (📅 date · 📍 location), 2-line description, [Learn More →] primary red button. If multiple upcoming events, stack vertically — do NOT use a carousel or slider.
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
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Events"                                       │
│  Subtitle: "Competitions, workshops, and meetups"   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  UPCOMING EVENTS  (bg: #FFFFFF, padding: 48px 0)    │
│  H2: "Upcoming"                                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Event cover image — wide banner]          │    │
│  │  ~400px tall, object-fit cover, radius 8px  │    │
│  │                                             │    │
│  │  H3: Spring Coding Competition 2026         │    │
│  │  📅 April 20, 2026  ·  📍 Seneca College   │    │
│  │  Short description (2 lines max)            │    │
│  │                                             │    │
│  │  [Learn More →]   ← links to /events/:id   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  If multiple upcoming events: horizontal scroll     │
│  or stacked cards (max 3 visible)                   │
│                                                     │
│  Empty state: "No upcoming events at the moment.    │
│               Check back soon!"                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAST EVENTS  (bg: #F9F9F9, padding: 48px 0)        │
│  H2: "Past Events"                                  │
│                                                     │
│  Grid: 3 columns desktop / 2 tablet / 1 mobile      │
│  repeat(auto-fit, minmax(280px, 1fr))               │
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
│  color: #555555, Inter 13px                         │
│  [← Back to Events]                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HERO IMAGE  (full-width)                           │
│  width: 100%, height: 400px, object-fit: cover      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  EVENT INFO  (bg: #FFFFFF, padding: 48px 0)         │
│  max-width: 900px, centered                         │
│                                                     │
│  H1: [Event Title]                                  │
│  Meta row:                                          │
│    📅 [Date]   ·   📍 [Location]   ·   🏫 [Campus] │
│    Inter 14px, color #555555                        │
│                                                     │
│  Divider: 1px solid #E5E5E5                         │
│                                                     │
│  H3: "About this Event"                             │
│  Body: full description, markdown rendered          │
│        What we did, how it went, highlights         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PHOTO GALLERY  (bg: #F9F9F9, padding: 48px 0)      │
│  H3: "Photos"                                       │
│                                                     │
│  Masonry or uniform grid                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ img  │ │ img  │ │ img  │ │ img  │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│  ┌───────────┐ ┌───────────┐                        │
│  │   img     │ │   img     │                        │
│  └───────────┘ └───────────┘                        │
│                                                     │
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
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
overflow: hidden

  Cover photo: width 100%, height 200px, object-fit cover
  Padding below photo: 16px

  Date: Inter 400 12px, color #999999
  Title: Inter 500 15px, color #1A1A1A
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
- Admin manages events via `/admin` panel (CRUD)
