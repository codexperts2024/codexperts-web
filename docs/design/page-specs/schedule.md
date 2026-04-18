# Page: Schedule `/schedule`
> Visibility: public

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B` (event dots on calendar)
- Text: `#1A1A1A` / `#555555`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF` for calendar section, `#F9F9F9` for monthly event list. Do NOT change.
- Font: Montserrat for H1/H3. Inter for event list items and buttons. Do NOT use any other font.
- Accent `#C0392B` used ONLY on event dots in the monthly list. Nowhere else.
- The Google Calendar embed is a GRAY PLACEHOLDER BOX: width 100% (max 1000px), height 600px, bg `#F3F3F3`, centered label "Google Calendar Embed". Do NOT try to render an actual calendar UI.
- The two action buttons ([📅 Subscribe] and [⬇ Download .ics]) are side by side, BELOW the calendar embed. Both are secondary outline style — border 1px `#CCCCCC`, text `#555555`, radius 6px. Do NOT make either button red.
- The monthly event list section is BELOW the two buttons, separated by a section bg change to `#F9F9F9`. It shows H3 "April 2026 Events" and a vertical list of events (red dot · date · title). Do NOT skip this section.
- Monthly event list items: red dot (8px circle `#C0392B`) · date (Inter 500 14px `#1A1A1A`) · event title (Inter 400 14px `#555555`).
- Do NOT add a list view toggle, week view, or any calendar alternative layout.
- Do NOT add admin controls on this page.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Schedule"                                     │
│  Subtitle: "Stay up to date with codeXperts         │
│             meetings, events, and deadlines."        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  GOOGLE CALENDAR EMBED  (bg: #FFFFFF, padding: 48px)│
│  max-width: 1000px, centered                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  ← April 2026 →                             │    │
│  │  Su  Mo  Tu  We  Th  Fr  Sa                 │    │
│  │   -   -   -   1   2   3   4                 │    │
│  │   5   6   7  [8]  9  10  11  ← event dot    │    │
│  │  12  13  14  15  16  17  18                 │    │
│  │  19  20  21 [22] 23  24  25  ← event dot    │    │
│  │  26  27  28  29  30   -   -                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Embed config: Google Calendar public iframe         │
│  Height: 600px, responsive width                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CALENDAR ACTIONS  (padding: 24px 0)                │
│  max-width: 1000px, centered, flex row              │
│                                                     │
│  [📅 Subscribe]       [⬇ Download .ics]             │
│   Secondary outline    Secondary outline            │
│                                                     │
│  · [Subscribe]: Opens Google Calendar "Add to       │
│    calendar" link (webcal:// or Google Calendar URL)│
│  · [Download .ics]: Downloads the .ics file for     │
│    import into Apple Calendar, Outlook, etc.        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MONTHLY EVENT LIST  (bg: #F9F9F9, padding: 48px 0) │
│  Dynamically updates when month changes in calendar │
│  Pulled from Google Calendar API                    │
│                                                     │
│  H3: "April 2026 Events"  (updates with month)      │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ [red dot] Apr 5   Weekly Coding Session      │   │
│  │ [red dot] Apr 12  Problem Submission Deadline│   │
│  │ [red dot] Apr 20  Spring Coding Competition  │   │
│  │ [red dot] Apr 27  Weekly Coding Session      │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  · Event dot: 8px circle, color #C0392B             │
│  · Date: Inter 500 14px, color #1A1A1A              │
│  · Event title: Inter 400 14px, color #555555       │
│  · Empty state: "No events this month."             │
│  · Row hover: bg #FFFFFF, cursor default            │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Button Specs

### [📅 Subscribe]
```
Style: Secondary outline — border 1px #CCCCCC, color #555555, radius 6px
Icon: calendar icon (Lucide CalendarPlus), 16px, left of label
Action: Opens webcal:// link OR Google Calendar "Add to my calendar" URL
        in new tab
```

### [⬇ Download .ics]
```
Style: Secondary outline — same as Subscribe
Icon: download icon (Lucide Download), 16px, left of label
Action: Triggers download of .ics file for the codeXperts calendar
        Compatible with: Apple Calendar, Outlook, Google Calendar import
```

---

## Monthly Event List — Behavior
```
- Synced with the calendar embed's currently displayed month
- When user clicks ← / → to change month in the Google Calendar embed,
  the event list below updates to show that month's events
- Data source: Google Calendar API (public calendar)
- Events sorted by date ascending
- If no events in the selected month: show "No events this month." in #999999
```

---

## Notes
- Google Calendar iframe must be set to public visibility
- Calendar embed: use Google Calendar's embeddable URL with minimal UI
- Subscribe / Download buttons reference the same public Google Calendar
- Monthly event list is a separate component below the embed (not part of iframe)
- No admin controls on this page — schedule is managed via Google Calendar directly
