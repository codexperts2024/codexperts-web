# Page: Members `/members` + `/members/:id`
> Visibility: member only

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Role badge Executive: bg `#EAF4F0`, color `#2E7D5E`
- Status badge Graduate: bg `#F3F3F3`, color `#555555`
- Accent: `#C0392B`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF`. Do NOT use any other background color.
- Font: Montserrat for H1. Inter for names, labels, badges, filters. Do NOT use any other font.
- Accent `#C0392B` used ONLY on: avatar hover ring. Nowhere else on the list page.
- The member grid is EXACTLY 5 columns on desktop / 3 tablet / 2 mobile. Do NOT use a different column count.
- Each member card layout from top to bottom: avatar (64px circle) → name (Inter 500 14px) → school (Inter 400 12px `#555555`) → status badge → role badge (if Executive) → social icons row (LinkedIn + GitHub). No card border — clean grid, no box-shadow.
- Avatar: 64px circle, gray placeholder with initials. Hover: 2px ring `#C0392B`.
- Status badges: Student (bg `#F0F4FF`, color `#1A6FBF`) / Graduate (bg `#F3F3F3`, color `#555555`).
- Role badge Executive: bg `#EAF4F0`, color `#2E7D5E`. Only shown if role = Executive.
- Social icons: LinkedIn (16px) + GitHub (16px). Color `#555555`. Only rendered if member has links set.
- Filter row: 4 dropdowns in a horizontal row — [All Cohorts ▾] [All Schools ▾] [All Status ▾] [All Roles ▾]. Secondary outline style. Do NOT add a search bar or sort toggle.
- Render BOTH the list view AND the profile view (`/members/:id`) as separate screens.
- Profile page: avatar (96px), name, badges, school·cohort, social icons → Bio section → Heatmap → Badges grid. Do NOT add a follow button, message button, or friend request button.
- Activity heatmap: GitHub-style 52×7 grid. Colors: `#F3F3F3` (0) → `#C8E6D4` → `#81C995` → `#34A853` → `#1A7A35`. Do NOT use red for the heatmap.
- Badges: small square cards with icon + label. Locked badges: opacity 0.35 + 🔒 overlay.

---

## View 1: Members List `/members`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Members"                                      │
│  Subtitle: "Active and alumni codeXperts community" │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FILTER ROW  (bg: #FFFFFF, padding: 16px 0)         │
│  max-width: 1200px, centered, flex row, gap: 12px   │
│                                                     │
│  [All Cohorts ▾]  [All Schools ▾]  [All Status ▾]  [All Roles ▾]
│                                                     │
│  Cohort dropdown:                                   │
│    All Cohorts / Winter 2024 / Summer 2024 /        │
│    Fall 2024 / Winter 2025 / ...                    │
│                                                     │
│  School dropdown:                                   │
│    All Schools / Seneca College / York University   │
│                                                     │
│  Status dropdown:                                   │
│    All Status / Student / Graduate                  │
│                                                     │
│  Role dropdown:                                     │
│    All Roles / Member / Executive                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MEMBER GRID  (bg: #FFFFFF, padding: 32px 0)        │
│  max-width: 1200px, centered                        │
│  5 columns desktop / 3 tablet / 2 mobile            │
│  Sorted by activity score (most active first)       │
│                                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ │
│  │  ( ) │ │  ( ) │ │  ( ) │ │  ( ) │ │  ( ) │ │
│  │ 64px  │ │ 64px  │ │ 64px  │ │ 64px  │ │ 64px  │ │
│  │ photo │ │ photo │ │ photo │ │ photo │ │ photo │ │
│  │ Name  │ │ Name  │ │ Name  │ │ Name  │ │ Name  │ │
│  │ School│ │ School│ │ School│ │ School│ │ School│ │
│  │[badge]│ │[badge]│ │[badge]│ │[badge]│ │[badge]│ │
│  │[in][gh│ │[in][gh│ │[in][gh│ │[in][gh│ │[in][gh│ │
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ │
│                                                     │
│  Avatar click → /members/:id (profile page)         │
│  Name click   → /members/:id                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Member Card Spec

```
Layout: vertical flex, text-align center
Width: ~200px, padding: 20px 16px
border: none (no card border — clean grid look)

Avatar:
  size: 64px circle
  src: Google profile URL
  object-fit: cover
  cursor: pointer → links to /members/:id
  hover: ring 2px solid #C0392B

Name:
  Inter 500 14px, color #1A1A1A
  margin-top: 10px
  cursor: pointer → links to /members/:id

School:
  Inter 400 12px, color #555555

Status badge:
  Student  → bg #F0F4FF, color #1A6FBF, "Student"
  Graduate → bg #F3F3F3, color #555555, "Graduate"
  font-size: 11px, padding: 2px 8px, radius 4px

Role badge (if Executive):
  bg #EAF4F0, color #2E7D5E, "Executive"
  shown below status badge

Social icons row:
  [LinkedIn icon]  [GitHub icon]
  size: 16px, color #555555
  hover: LinkedIn → #1A6FBF, GitHub → #1A1A1A
  margin-top: 8px
  only shown if member has set their links
```

---

## View 2: Member Profile `/members/:id`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PROFILE HEADER  (bg: #F9F9F9, padding: 48px 0)     │
│  max-width: 900px, centered                         │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │  [Avatar 96px circle]                      │     │
│  │  H2: Member Name                           │     │
│  │  [Executive badge]  [Student / Graduate]   │     │
│  │  Seneca College  ·  Fall 2024 cohort        │     │
│  │                                            │     │
│  │  [LinkedIn icon]  [GitHub icon]  [Email]   │     │
│  │                                            │     │
│  │  [Edit Profile]  ← shown only to self      │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BIO SECTION  (bg: #FFFFFF, padding: 40px 0)        │
│  H3: "About"                                        │
│  Body: member-written bio text                      │
│  Empty state: "This member hasn't added a bio yet." │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ACTIVITY HEATMAP  (bg: #F9F9F9, padding: 40px 0)   │
│  H3: "Activity"                                     │
│                                                     │
│  GitHub-style grass graph (52 weeks × 7 days)       │
│  Color scale:                                       │
│    0 activity   → #F3F3F3                           │
│    low          → #C8E6D4                           │
│    medium       → #81C995                           │
│    high         → #34A853                           │
│    very high    → #1A7A35                           │
│  Data: submissions + attendance combined            │
│  Hover cell: tooltip "N activities on [date]"       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BADGES  (bg: #FFFFFF, padding: 40px 0)             │
│  H3: "Achievements"                                 │
│                                                     │
│  Badge grid (horizontal scroll on mobile):          │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  🏆      │ │  🥇      │ │  🎯      │            │
│  │ Spring   │ │  1st     │ │ Perfect  │            │
│  │ Comp 2026│ │  Place   │ │Attendance│            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  Badge types:                                       │
│  · Competition participation  (event name + year)  │
│  · Competition ranking        (1st / 2nd / 3rd)    │
│  · Attendance streak          (monthly / semester) │
│  · Submission milestone       (10 / 25 / 50 solved)│
│                                                     │
│  Locked badge: grayed out with 🔒, tooltip on hover │
│  Empty state: "No achievements yet. Keep going!"    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Filter Behavior
```
Filters are combinable (AND logic):
  e.g. Cohort: Fall 2024 + School: Seneca + Role: Executive
  → shows only Fall 2024 Seneca Executives

Default sort: activity score descending (most active first)
Activity score = submissions count + attendance count (last 90 days)

Filter state persists on page (URL query params):
  /members?cohort=fall-2024&school=seneca&status=student&role=member
```

---

## Badge Spec
```
Container:
  bg: #F9F9F9
  border: 1px solid #E5E5E5
  border-radius: 8px
  padding: 12px
  text-align: center
  width: 90px

Icon: emoji or SVG, 28px
Label line 1: event/achievement name, Inter 500 11px
Label line 2: year or detail, Inter 400 10px, color #555555

Earned badge: full color
Locked badge: opacity 0.35 + 🔒 overlay
```

---

## View 3: Edit Profile Mode (own profile only)

Triggered by clicking [Edit Profile] button on `/members/:id` when `userId === currentUser.id`.
Replaces the read view inline — no separate route.

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PROFILE HEADER  (bg: #F9F9F9, padding: 48px 0)     │
│  max-width: 900px, centered                         │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │                                            │     │
│  │  PHOTO FIELD                               │     │
│  │  [Avatar 96px circle]  [Upload photo]      │     │
│  │  Visibility: [👁 Visible to members ▾]     │     │
│  │                                            │     │
│  │  H2: Member Name  (read-only — set by Admin)│    │
│  │  [Executive badge]  [Student / Graduate]   │     │
│  │  Seneca College  ·  Fall 2024 cohort        │     │
│  │                                            │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  EDIT FORM  (bg: #FFFFFF, padding: 40px 0)          │
│  max-width: 900px, centered                         │
│                                                     │
│  Each field row layout:                             │
│  [Label]                          [👁 toggle]       │
│  [Input / Textarea              ]                   │
│                                                     │
│  ─────────────────────────────────────────          │
│  Status                                             │
│  Student ●────────○ Graduate                        │
│  (toggle switch, no visibility control)             │
│                                                     │
│  ─────────────────────────────────────────          │
│  Bio                              [👁 Visible ▾]    │
│  ┌─────────────────────────────────────────┐        │
│  │ Tell others about yourself...           │        │
│  │ (textarea, 4 rows, max 300 chars)       │        │
│  └─────────────────────────────────────────┘        │
│  char counter: "0 / 300" (Inter 12px #999999)       │
│                                                     │
│  ─────────────────────────────────────────          │
│  LinkedIn URL                     [👁 Visible ▾]    │
│  [https://linkedin.com/in/...                ]      │
│                                                     │
│  ─────────────────────────────────────────          │
│  GitHub URL                       [👁 Visible ▾]    │
│  [https://github.com/...                    ]       │
│                                                     │
│  ─────────────────────────────────────────          │
│  Email                            [👁 Visible ▾]    │
│  [yourname@email.com                        ]       │
│                                                     │
│  ─────────────────────────────────────────          │
│                                                     │
│  [Cancel]              [Save Changes]               │
│  (secondary outline)   (primary red CTA)            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ACTIVITY HEATMAP  (unchanged — read-only)          │
│  BADGES            (unchanged — read-only)          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

### Visibility Toggle Spec
```
Component: dropdown button per field
Default: Visible to members

Options:
  👁  Visible to members   ← shown on profile to all members
  🔒  Hidden               ← stored in DB but not rendered on profile

Style:
  bg: #F5F5F5
  border: 1px solid #CCCCCC
  border-radius: 6px
  padding: 4px 10px
  font: Inter 12px #555555
  icon size: 14px
  min-width: fit-content

Active state (Hidden):
  bg: #F3F3F3
  color: #999999

Position: top-right of each field row
```

### Status Toggle Spec
```
Component: two-option toggle switch (Student / Graduate)
Label: "Status"
No visibility toggle — always shown on profile

Style:
  Track: pill shape, bg #E5E5E5
  Active side: bg #1A6FBF (Student) / #555555 (Graduate)
  Thumb: white circle, 20px
  Label text: Inter 13px
    Student  → color #1A6FBF when active
    Graduate → color #555555 when active

Behavior:
  - Updates user status on Save Changes
  - Badge on read view updates accordingly:
      Student  → bg #F0F4FF, color #1A6FBF
      Graduate → bg #F3F3F3, color #555555
```

### Edit Mode Behavior
```
- Name, school, cohort, role: read-only (set by Admin)
- Status (Student / Graduate): member-editable via toggle switch
- Photo: click avatar or "Upload photo" → file picker → preview inline (max 2MB, JPG/PNG)
- Bio: textarea with 300 char limit
- LinkedIn / GitHub: text input, validated as URL on save
- Email: text input, validated as email format on save
- Cancel: discards all changes, returns to read view
- Save Changes: PATCH /api/users/:id → success toast → return to read view
- Unsaved changes guard: if user navigates away with changes → "Discard changes?" confirm dialog
```

### Visibility Logic (rendering on read view)
```
If field visibility = Hidden:
  - Field is NOT rendered for other members
  - On own profile (read view): field shows with a 🔒 icon next to it
    (so you can see what's hidden, others cannot)
```

---

## Notes
- Avatar src: Google OAuth profile photo URL by default; overridden by uploaded photo (stored in Supabase Storage)
- Bio, LinkedIn, GitHub, Email: member-editable from own profile only
- Edit button (`Edit Profile`) visible only when `userId === currentUser.id`
- Heatmap data: computed from `submissions` + `attendances` tables by date
- Badges: assigned by admin via `/admin` panel or auto-awarded by system rules
- Members not yet approved (pending) are not shown in this list
- Visibility settings stored as a `profile_visibility` JSONB column on the `users` table:
  `{ "photo": true, "bio": true, "linkedin": true, "github": false, "email": false }`
