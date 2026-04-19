# codeXperts — Design System

> Wireframe & dev reference. For Google Stitch mockup generation and team use.

---

## 1. Core Principles

- **Light mode only** — No dark mode toggle. Clean, minimal, professional.
- **Minimal** — Vercel / Linear style. Whitespace over information density.
- **Coding club identity** — Editor and code culture reflected naturally in UI.
- **One accent** — `#C0392B` red for CTA/emphasis only. Do not overuse.

---

## 2. Color Tokens

### Red Accent — `#C0392B`

```
--color-accent:        #C0392B   ← buttons, logo X, active tab, emphasis text, border highlight
--color-accent-light:  #E87A6E   ← hover state
--color-accent-bg:     #FDECEA   ← tag/badge background (light red tint)
```

> Accent is only for call-to-action (CTA) or brand emphasis.
> Never use on generic text, icons, or dividers.

---

### Background Layers

```
--color-bg-base:       #FFFFFF   ← full page background
--color-bg-surface:    #F9F9F9   ← cards, sidebar, navigation
--color-bg-elevated:   #F3F3F3   ← tab bar, header, dropdown, modal
--color-bg-input:      #F5F5F5   ← input fields, textarea
```

### Text

```
--color-text-primary:  #1A1A1A   ← body text, labels
--color-text-secondary:#555555   ← subtitles, meta info, placeholder
--color-text-hint:     #999999   ← inactive menu, helper text
```

### Border

```
--color-border:        #E5E5E5   ← default divider
--color-border-strong: #CCCCCC   ← card border, input focus
```

### Semantic (Functional)

```
--color-success:       #2E7D5E   ← attendance complete, submission success
--color-link:          #1A6FBF   ← links, interactive elements
--color-warning:       #B45309   ← warnings, due soon
--color-error:         #C0392B   ← errors (same as accent)
```

---

## 3. Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| Logo / nav brand | Montserrat | 700 | variable |
| Heading H1 | Montserrat | 700 | 36px |
| Heading H2 | Montserrat | 600 | 26px |
| Heading H3 | Montserrat | 600 | 20px |
| Body | Inter | 400 | 16px |
| Label / meta | Inter | 400 | 13–14px |
| Code / editor | JetBrains Mono | 400 | 14px |

> Line-height: body 1.7 / heading 1.2 / code 1.6

---

## 4. Component Specs

### Buttons

```
Primary (CTA)
  background: #C0392B
  color: #FFFFFF
  border-radius: 6px
  padding: 8px 20px
  font: Inter 500 14px
  hover: background #A93226

Secondary (Outline)
  background: transparent
  color: #555555
  border: 1px solid #CCCCCC
  border-radius: 6px
  padding: 8px 20px
  hover: border-color #1A1A1A, color #1A1A1A
```

### Cards

```
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
padding: 16px 20px
box-shadow: 0 1px 4px rgba(0,0,0,0.06)
```

### Input

```
background: #F5F5F5
border: 1px solid #CCCCCC
border-radius: 6px
padding: 8px 12px
color: #1A1A1A
font: Inter 14px
focus → border-color: #C0392B
```

### Tags / Badges

```
Language tag (Python, Java, etc.)
  background: #FDECEA
  color: #C0392B
  font-size: 11px
  padding: 2px 8px
  border-radius: 4px

Role badge (admin, executive)
  background: #EAF4F0
  color: #2E7D5E
  same spec
```

### Navigation

```
background: #FFFFFF
border-bottom: 1px solid #E5E5E5
active tab: color #C0392B, border-bottom 2px solid #C0392B
inactive: color #555555
hover: color #1A1A1A
```

### Social Icon Buttons (Navbar)

```
LinkedIn icon button  → links to codeXperts LinkedIn page
Email icon button     → mailto: club email
Instagram icon button → hover dropdown (Seneca / York / TMU)
Discord icon button   → hover dropdown, member only (Seneca / York / TMU)

Style:
  icon size: 18px
  color: #555555
  hover: color #1A1A1A
  spacing: 8px between icons
```

---

## 5. Navigation Bar

```
[codeXperts logo]  Home  About▾  Updates▾  Events  |  (Practice▾)  (Members)  Join Us  [LinkedIn] [Email] [Instagram▾] ([Discord▾]) ({⚙})  [Log In]

About dropdown:
  └ About Us  → /about
  └ Our Team  → /team

Updates dropdown:
  └ Announcements  → /announcements
  └ Schedule       → /schedule

Practice dropdown (member only):
  └ Problems       → /problems
  └ Solutions      → /solutions
```

| Item | Route | Visibility | Notes |
|------|-------|------------|-------|
| Logo | `/` | public | Links to Home |
| Home | `/` | public | |
| About | dropdown | public | About Us + Our Team |
| Updates | dropdown | public | Announcements + Schedule |
| Events | `/events` | public | |
| Join Us | `/join` | public | Hidden after login & approval |
| Practice | dropdown | member | Problems + Solutions |
| Members | `/members` | member | |
| LinkedIn | external | public | Icon button |
| Email | mailto: | public | Icon button |
| Instagram | — | public | Hover dropdown per campus |
| Discord | — | member | Hover dropdown per campus |
| ⚙ Admin | `/admin` | admin | Icon only |
| Log In | `/login` | public | Right-most, triggers Google OAuth |

**Auth Flow:**
```
[Log In] click
  → Google OAuth
    → Existing approved member → logged in ✓
    → New Google account → Sign Up page → pending → Admin approval
```

**Mobile Nav:**
- Hamburger menu
- Same visibility rules apply
- Social icons in bottom of mobile menu

---

## 6. Footer

```
[codeXperts logo + tagline]

Links:                    Social:
Home                      [LinkedIn icon]
About Us                  [Email icon]
Events                    [Instagram icon ▾]
                          [Discord icon ▾] ← member only

© 2025 codeXperts Club. All rights reserved.
```

---

## 7. Page Index

| # | Page | Route | Visibility | Stitch File |
|---|------|-------|------------|-------------|
| 1 | Home | `/` | public | home.md ✅ |
| 2 | About Us | `/about` | public | about.md ✅ |
| 3 | Our Team | `/team` | public | team.md ✅ |
| 4 | Events | `/events` | public | events.md ✅ |
| 5 | Event Detail | `/events/:id` | public | events.md ✅ |
| 6 | Announcements | `/announcements` | public | announcements.md ✅ |
| 7 | Schedule | `/schedule` | public | schedule.md ✅ |
| 8 | Problems | `/problems` | member | problems.md ✅ |
| 9 | Solutions | `/solutions` + `/solutions/:id` | member | solutions.md ✅ |
| 10 | Members | `/members` + `/members/:id` | member | members.md ✅ |
| 10a | Edit Profile | `/members/:id` (edit mode, self only) | member | members.md ✅ |
| 11 | Admin | `/admin` | admin | admin.md ✅ |

**Signup: modal only** — no `/join` route. Triggered by [Join Us] button. See `join.md` for modal spec.

---

## 8. Page Layouts (Stitch Reference)

### Page 1: `/` Home (public)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│ [Full-width club group photo]                       │
│ (hero image, ~500px tall)                           │
├─────────────────────────────────────────────────────┤
│ Elfsight Social Feed                                │
│ (Instagram + LinkedIn embed, centered)              │
├─────────────────────────────────────────────────────┤
│        Club Introduction Text                       │
│   H2: "Who We Are"                                  │
│   Body: short paragraph about the club              │
│                                                     │
│   [Join Us →]          [About Us →]                 │
│   (Primary red CTA)    (Secondary outline)          │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

**Notes:**
- Same layout for logged-in and logged-out users
- No member-only sections on this page
- Group photo: full container width, object-fit cover
- CTA buttons: Join Us on left (primary), About Us on right (secondary)

---

### Page 2: `/about` About Us (public)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│  H1: "About codeXperts"                             │
│  Subtitle: short tagline                            │
├─────────────────────────────────────────────────────┤
│  MISSION SECTION                                    │
│  H2: "Why We Exist"                                 │
│  Body:                                              │
│    School curriculum alone isn't enough to become   │
│    a true coding expert. codeXperts exists to fill  │
│    that gap — sharpening algorithmic thinking,      │
│    building real coding skills, and connecting      │
│    students across campuses through collaboration   │
│    and friendly competition.                        │
│                                                     │
│  3 icon + text pillars (horizontal row):            │
│    [💡 Algorithmic Thinking]                        │
│    [🤝 Student Networking]                          │
│    [🏫 Inter-School Exchange]                       │
├─────────────────────────────────────────────────────┤
│  TIMELINE SECTION                                   │
│  H2: "Our Story"                                    │
│                                                     │
│  Vertical timeline (left line, cards on right):     │
│                                                     │
│  ● 2024 — Fall                                      │
│    codeXperts founded at Seneca College             │
│    by Prof. Yoon and a group of students            │
│    passionate about going beyond the classroom.     │
│                                                     │
│  ● 2026 — Winter                                    │
│    First official event: Coding Competition         │
│    hosted at Seneca.                                │
│                                                     │
│  ● 2026 — Fall                                      │
│    codeXperts officially launched as a              │
│    York University recognized club.                 │
│    Inter-campus collaboration begins.               │
├─────────────────────────────────────────────────────┤
│  CTA ROW                                            │
│  [Meet Our Team →]         [Join Us →]              │
│  (Secondary outline)       (Primary red)            │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

**Notes:**
- Timeline dot color: `#C0392B`
- Pillar icons: simple outlined icons (Lucide or similar)
- Page background: `#FFFFFF`, section alternates with `#F9F9F9`

---

### Page 3: `/team` Our Team (public)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│  H1: "Our Team"                                     │
│  Subtitle: "The people behind codeXperts"           │
├─────────────────────────────────────────────────────┤
│  SENECA CAMPUS                                      │
│  H2: "Seneca College"                               │
│                                                     │
│  [Card: Team1]    [Card: Team2]    [Card: Team3]    │
│   President        VP               Treasurer       │
│   photo            photo            photo           │
│   Name             Name             Name            │
│   [LinkedIn icon]  [LinkedIn icon]  [LinkedIn icon] │
├─────────────────────────────────────────────────────┤
│  YORK UNIVERSITY                                    │
│  H2: "York University"                              │
│                                                     │
│  [Card: Team4]    [Card: Team5]    [Card: Team6]    │
│   President        VP               Treasurer       │
│   photo            photo            photo           │
│   Name             Name             Name            │
│   [LinkedIn icon]  [LinkedIn icon]  [LinkedIn icon] │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

**Team Card Spec:**
```
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
padding: 20px
text-align: center

  avatar: 72px circle, object-fit cover
  name: Inter 500 15px, #1A1A1A
  role badge: green badge (Executive style)
  campus tag: small gray label
  LinkedIn icon: 16px, links to personal LinkedIn
```

**Notes:**
- Placeholder names: Team1–Team6 until real names confirmed
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Section divider between Seneca and York

---

### Page 4: `/events` Events (public)

> TBD — confirm layout in next session

---

### Page 5: `/announcements` Announcements (public)

> TBD — confirm layout in next session

---

### Page 6: `/schedule` Schedule (public)

> TBD — confirm layout in next session

---

### Page 7: `/join` Join Us (public)

> TBD — confirm layout in next session

---

### Page 8: `/problems` Problems (member only)

> TBD — confirm layout in next session

---

### Page 9: `/solutions` Solutions (member only)

> TBD — confirm layout in next session

---

### Page 10: `/members` Members (member only)

> TBD — confirm layout in next session

---

### Page 11: `/admin` Admin (admin only)

> TBD — confirm layout in next session

---

## 8. Spacing & Responsive

```
Base unit: 4px multiples (8, 12, 16, 24, 32, 48)
Max content width: 1200px
Mobile breakpoint: 768px
Card grid: repeat(auto-fit, minmax(280px, 1fr))
```

---

## 9. Monaco Editor Config (Problems page)

```javascript
theme: "vs"               // light theme — white background
fontFamily: "JetBrains Mono"
fontSize: 14
lineHeight: 1.6
minimap: { enabled: false }
```

---

## 10. Usage Guide (How to Use in Code)

### Colors
Use Tailwind custom tokens instead of hardcoded hex values.

```jsx
// Do not hardcode colors
<div className="bg-red-600 text-gray-900 border-gray-200">

// Use design tokens
<div className="bg-accent text-text-primary border-border">
```

| Token | Tailwind Class | Use case |
|-------|---------------|----------|
| `#C0392B` | `bg-accent` / `text-accent` | CTA buttons, logo X, emphasis |
| `#A93226` | `bg-accent-hover` | Button hover state |
| `#FDECEA` | `bg-accent-bg` | Tag/badge background |
| `#FFFFFF` | `bg-bg-base` | Page background |
| `#F9F9F9` | `bg-bg-surface` | Cards, sidebar |
| `#F3F3F3` | `bg-bg-elevated` | Header, dropdowns |
| `#F5F5F5` | `bg-bg-input` | Input fields |
| `#1A1A1A` | `text-text-primary` | Body text, labels |
| `#555555` | `text-text-secondary` | Subtitles, meta info |
| `#999999` | `text-text-hint` | Placeholder, inactive |
| `#E5E5E5` | `border-border` | Default divider |
| `#CCCCCC` | `border-border-strong` | Card border, input focus |
| `#2E7D5E` | `text-success` / `bg-success` | Success states |
| `#B45309` | `text-warning` | Warnings |
| `#1A6FBF` | `text-link` | Links |

---

### Fonts
Fonts are loaded globally in `layout.js`. Use Tailwind classes to apply.

```jsx
// Heading (Montserrat)
<h1 className="font-montserrat font-bold text-4xl">Title</h1>
<h2 className="font-montserrat font-semibold text-2xl">Subtitle</h2>

// Body (Inter — applied globally, no need to add manually)
<p className="text-base">Body text</p>

// Code (JetBrains Mono)
<code className="font-mono text-sm">const x = 1</code>
```

---

### UI Components
Base components are in `src/components/ui/`. Import and use directly.

```jsx
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

// Button variants
<Button variant="primary">Join Us</Button>
<Button variant="secondary">About Us</Button>

// Card
<Card>
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>

// Input
<Input type="email" placeholder="Enter your email" />
```

---

_Last updated: 2026-04-18 | Owner: Paul_
