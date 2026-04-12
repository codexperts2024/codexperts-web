# Page: Admin `/admin`
> Visibility: admin only | Icon-only link in navbar (⚙)

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B` (approve, primary actions)
- Success: `#2E7D5E` (approved, active states)
- Warning: `#B45309` (pending count badge)
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF` for dashboard, `#F9F9F9` for section panels. Do NOT change.
- Font: Montserrat for H1/H2. Inter for all body, labels, table text, buttons. Do NOT use any other font.
- Accent `#C0392B` used ONLY on: primary action buttons (Start Session, Publish, Assign). Nowhere else.
- The dashboard has EXACTLY 6 section cards in a 2-column grid: Pending Approvals, Members, Problems, Events, Attendance, Badges. Do NOT add, remove, or rename any card.
- Stat row above the cards: 4 mini stat cards (Pending / Members / Problems / Events). Horizontal row, equal width. Pending badge: bg `#FEF3C7`, color `#B45309`. Do NOT make the stat cards red.
- Each dashboard card: bg `#FFFFFF`, border 1px `#E5E5E5`, radius 8px, padding 24px. Icon (24px `#555555`) + title (Montserrat 600 16px) + subtitle (Inter 400 13px `#555555`) + [Manage →] link (color `#C0392B`, bottom). On hover: box-shadow `0 4px 12px rgba(0,0,0,0.08)`.
- Pending Approvals card: border `#FDE68A`, title color `#B45309` when pending count > 0.
- Render the dashboard overview AND each of the 6 expanded sections as separate screens (7 screens total).
- Expanded sections open INLINE below the dashboard — no page navigation, no modal. Each section has a [← Back] link top-right.
- Members table: inline role and status dropdowns per row. Changes save immediately — do NOT add a Save button per row.
- Attendance section: QR code renders as a square placeholder box (200×200px) with label "QR Code". Session timer shows "Expires in 14:32". Do NOT render a real QR pattern.
- Badge assignment: member search input + badge dropdown + optional event dropdown + [Assign Badge] primary red button.
- Do NOT add charts, graphs, analytics panels, or export buttons.
- Mobile: 2-column card grid collapses to 1 column.

---

## Layout: Dashboard Overview

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                         {⚙}  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Admin Dashboard"                              │
│  Subtitle: "codeXperts management panel"            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  STAT ROW  (bg: #FFFFFF, padding: 32px 0)           │
│  4 mini stat cards, horizontal row                  │
│                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐ │
│  │ Pending   │ │ Members   │ │ Problems  │ │Events│ │
│  │  🟡 3    │ │  42       │ │  12 weeks │ │  5   │ │
│  │ approvals │ │  total    │ │  posted   │ │total │ │
│  └───────────┘ └───────────┘ └───────────┘ └──────┘ │
│                                                     │
│  Pending count badge: bg #FEF3C7, color #B45309     │
│  Other counts: color #1A1A1A                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  DASHBOARD CARDS  (bg: #F9F9F9, padding: 48px 0)    │
│  2-column grid desktop / 1-column mobile            │
│                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐  │
│  │  👥 Pending Approvals│ │  🧑‍🤝‍🧑 Members          │  │
│  │  3 waiting           │ │  42 total             │  │
│  │  ──────────────────  │ │  ──────────────────   │  │
│  │  [Manage →]          │ │  [Manage →]           │  │
│  └──────────────────────┘ └──────────────────────┘  │
│                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐  │
│  │  📝 Problems         │ │  🎉 Events            │  │
│  │  Week 12 active      │ │  1 upcoming           │  │
│  │  ──────────────────  │ │  ──────────────────   │  │
│  │  [Manage →]          │ │  [Manage →]           │  │
│  └──────────────────────┘ └──────────────────────┘  │
│                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐  │
│  │  📅 Attendance       │ │  🏅 Badges            │  │
│  │  No active session   │ │  Assign achievements  │  │
│  │  ──────────────────  │ │  ──────────────────   │  │
│  │  [Manage →]          │ │  [Manage →]           │  │
│  └──────────────────────┘ └──────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Section 1: Pending Approvals

```
┌─────────────────────────────────────────────────────┐
│  H2: "Pending Approvals"           [← Back]         │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │ [Avatar] John Kim                              │ │
│  │          john.kim@gmail.com                    │ │
│  │          Seneca College  ·  Fall 2024          │ │
│  │          (416) 123-4567  ·  Applied: Apr 7     │ │
│  │                    [✓ Approve]  [✕ Reject]     │ │
│  ├────────────────────────────────────────────────┤ │
│  │ [Avatar] Sara Lee  ...                         │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  [✓ Approve]: bg #2E7D5E, text white               │
│  [✕ Reject]:  bg transparent, border #CCCCCC       │
│  On approve → member status: pending → member      │
│  On reject  → confirm modal → record deleted       │
│  Empty state: "No pending approvals. You're all    │
│               caught up!"                          │
└─────────────────────────────────────────────────────┘
```

---

## Section 2: Member Management

```
┌─────────────────────────────────────────────────────┐
│  H2: "Members"                     [← Back]         │
│  Filters: [All Cohorts ▾] [All Schools ▾] [All Roles ▾]
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌──────┬──────────┬──────────┬───────────┬───────┐ │
│  │      │ Name     │ School   │ Role      │ Status│ │
│  ├──────┼──────────┼──────────┼───────────┼───────┤ │
│  │ (●)  │ John Kim │ Seneca   │[Member  ▾]│Student│ │
│  │ (●)  │ Sara Lee │ York     │[Executive▾│Student│ │
│  │ (●)  │ Mike Park│ Seneca   │[Member  ▾]│[Grad ▾│ │
│  └──────┴──────────┴──────────┴───────────┴───────┘ │
│                                                     │
│  Role dropdown per row: Member / Executive / Admin  │
│  Status dropdown per row: Student / Graduate        │
│  Changes save immediately (no save button needed)   │
│  Row click → opens /members/:id in new tab          │
└─────────────────────────────────────────────────────┘
```

---

## Section 3: Problems Management

```
┌─────────────────────────────────────────────────────┐
│  H2: "Problems"          [+ New Problem]  [← Back]  │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌──────┬──────────────────┬────────┬───────┬─────┐ │
│  │ Week │ Title            │ Lang   │ Due   │     │ │
│  ├──────┼──────────────────┼────────┼───────┼─────┤ │
│  │  12  │ Graph Traversal  │ Python │ Apr 20│[✏️][🗑]│
│  │  11  │ DP — Knapsack    │ Java   │ Apr 13│[✏️][🗑]│
│  └──────┴──────────────────┴────────┴───────┴─────┘ │
│                                                     │
│  [✏️ Edit]: opens edit form (same as create form)   │
│  [🗑 Delete]: confirm modal before delete           │
│                                                     │
│  New / Edit Problem Form:                           │
│  ┌──────────────────────────────────────────────┐   │
│  │  Title          [                          ] │   │
│  │  Week #         [    ]                       │   │
│  │  Language tags  [Python ✕] [+ Add]           │   │
│  │  Due date       [Apr 20, 2026  📅]           │   │
│  │  Forbidden rules[break ✕] [STL ✕] [+ Add]   │   │
│  │  Body           [Markdown editor            ]│   │
│  │                 [Cancel]  [Publish]           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Section 4: Events Management

```
┌─────────────────────────────────────────────────────┐
│  H2: "Events"              [+ New Event]  [← Back]  │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌────────────────────────┬──────────┬───────┬────┐ │
│  │ Title                  │ Date     │ Type  │    │ │
│  ├────────────────────────┼──────────┼───────┼────┤ │
│  │ Spring Competition 2026│ Apr 20   │Upcoming[✏️][🗑]│
│  │ Winter Meetup 2026     │ Jan 15   │ Past  │[✏️][🗑]│
│  └────────────────────────┴──────────┴───────┴────┘ │
│                                                     │
│  New / Edit Event Form:                             │
│  ┌──────────────────────────────────────────────┐   │
│  │  Title          [                          ] │   │
│  │  Date           [Apr 20, 2026  📅]           │   │
│  │  Location       [                          ] │   │
│  │  Campus         [Seneca ▾]                   │   │
│  │  Cover photo    [Upload image]               │   │
│  │  Gallery photos [Upload images (multi)]      │   │
│  │  Body           [Markdown editor            ]│   │
│  │                 [Cancel]  [Publish]           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Section 5: Attendance / QR

```
┌─────────────────────────────────────────────────────┐
│  H2: "Attendance"                      [← Back]     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  CURRENT SESSION                                    │
│  No active session                                  │
│  [▶ Start Attendance Session]  ← Primary red        │
│                                                     │
│  On click → generates QR token                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Session active  ·  Expires in 14:32         │   │
│  │                                              │   │
│  │         [████████████]                       │   │
│  │         [██  QR Code ██]                     │   │
│  │         [████████████]                       │   │
│  │                                              │   │
│  │  Scanned: 12 members                         │   │
│  │  [■ End Session]  ← Secondary outline        │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ATTENDANCE HISTORY                                 │
│  ┌────────────────┬──────────┬──────────────────┐   │
│  │ Date           │ Campus   │ Attendees        │   │
│  ├────────────────┼──────────┼──────────────────┤   │
│  │ Apr 7, 2026    │ Seneca   │ 18 members       │   │
│  │ Mar 31, 2026   │ York     │ 12 members       │   │
│  └────────────────┴──────────┴──────────────────┘   │
│  Click row → see list of who attended               │
└─────────────────────────────────────────────────────┘
```

---

## Section 6: Badge Management

```
┌─────────────────────────────────────────────────────┐
│  H2: "Badges"                          [← Back]     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ASSIGN BADGE                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Member    [Search member name...          ] │   │
│  │  Badge     [Competition Participant       ▾] │   │
│  │              └ Competition Participant        │   │
│  │              └ 1st Place                      │   │
│  │              └ 2nd Place                      │   │
│  │              └ 3rd Place                      │   │
│  │              └ Perfect Attendance             │   │
│  │              └ 10 Problems Solved             │   │
│  │              └ 25 Problems Solved             │   │
│  │              └ 50 Problems Solved             │   │
│  │  Event ref [Spring Competition 2026       ▾] │   │
│  │  (optional — links badge to a specific event) │   │
│  │                            [Assign Badge]     │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  RECENT ASSIGNMENTS                                 │
│  ┌──────────────┬──────────────────┬────────┬─────┐ │
│  │ Member       │ Badge            │ Date   │     │ │
│  ├──────────────┼──────────────────┼────────┼─────┤ │
│  │ John Kim     │ 1st Place        │ Apr 7  │ [🗑]│ │
│  │ Sara Lee     │ Competition Part.│ Apr 7  │ [🗑]│ │
│  └──────────────┴──────────────────┴────────┴─────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Dashboard Card Spec
```
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
padding: 24px
cursor: pointer
hover: box-shadow 0 4px 12px rgba(0,0,0,0.08)

Icon: 24px, color #555555
Title: Montserrat 600 16px, color #1A1A1A
Subtitle: Inter 400 13px, color #555555
[Manage →]: Inter 500 13px, color #C0392B, bottom of card

Pending card: title color #B45309, border-color #FDE68A
  (visual alert when pending count > 0)
```

---

## Notes
- All 6 sections open inline below the dashboard (no separate routes)
- [← Back] returns to dashboard card overview
- Role/status changes in Members save instantly (optimistic UI)
- QR session token expires after 15 minutes (configurable)
- Attendance auto-records when member scans QR with their logged-in session
- Badge auto-award rules (e.g. 10 problems solved) handled by backend trigger
  Manual override available here for edge cases
