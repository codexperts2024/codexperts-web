# Page: Home `/`
> Visibility: public | Same layout for logged-in and logged-out users

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B` | Text: `#1A1A1A` / `#555555`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF`. Do NOT use any other background color, gradient, or hero overlay.
- Font: Montserrat for logo and H2. Inter for body and buttons. Do NOT use any other font.
- Accent `#C0392B` used ONLY on: [Join Us →] primary button. Nowhere else.
- Do NOT add animations, parallax, scroll effects, hero text overlay on the photo, or decorative illustrations.
- Do NOT add a carousel, news ticker, or any auto-rotating element.
- The group photo is a full-width image with NO text on top of it. It is purely a photo.
- The Elfsight social feed is a single embedded widget block — render as a gray placeholder box labeled "Elfsight Social Feed (Instagram + LinkedIn)" centered, width 100%, height 300px.
- The two CTA buttons are side by side: [Join Us →] on the LEFT (primary red), [About Us →] on the RIGHT (secondary outline). Do NOT swap order.
- [Log In] button in navbar: Secondary outline style — border 1px `#CCCCCC`, text `#555555`, radius 6px. Do NOT make it red.
- Mobile: group photo height reduces to 280px. Elfsight feed stacks full width. CTA buttons stack vertically (Join Us on top).
- Navbar collapses to hamburger icon on mobile (≤768px). Social icons move to bottom of mobile menu.
- Navbar has EXACTLY these items in this order (left to right):
  LEFT SIDE: [codeXperts logo] · Home · About▾ · Updates▾ · Events · (Practice▾) · (Members) · Join Us · {⚙}
  RIGHT SIDE: [LinkedIn icon] [Email icon] [Instagram▾ icon] ([Discord▾ icon]) [Log In]
  Total visible tabs for public user: Home, About▾, Updates▾, Events, Join Us = 5 nav items + social icons + Log In.
  Practice▾ and Members are HIDDEN for logged-out users. Discord icon is HIDDEN for logged-out users.
  ⚙ gear icon is placed immediately to the RIGHT of "Join Us". HIDDEN for non-admin users. Admin only.
  Do NOT add, remove, or reorder any navbar item. Do NOT make all items visible — respect visibility rules above.
- About▾ dropdown contains EXACTLY 2 items: "About Us" and "Our Team". Nothing else.
- Updates▾ dropdown contains EXACTLY 2 items: "Announcements" and "Schedule". Nothing else.
- Practice▾ dropdown contains EXACTLY 2 items: "Problems" and "Solutions". Nothing else.
- Dropdown trigger: hover. Style: bg `#FFFFFF`, border 1px `#E5E5E5`, radius 6px, shadow `0 4px 12px rgba(0,0,0,0.08)`.

---

## Navbar

```
LEFT SIDE (nav links):
  [codeXperts logo]  Home  About▾  Updates▾  Events  (Practice▾)  (Members)  Join Us  {⚙}

RIGHT SIDE (icons + auth):
  [LinkedIn]  [Email]  [Instagram▾]  ([Discord▾])  [Log In]
```

**Full item breakdown:**

| Item | Type | Position | Visibility |
|------|------|----------|------------|
| codeXperts logo | logo link → `/` | far left | always |
| Home | nav link → `/` | left | always |
| About▾ | dropdown | left | always |
| Updates▾ | dropdown | left | always |
| Events | nav link → `/events` | left | always |
| Practice▾ | dropdown | left | member only |
| Members | nav link → `/members` | left | member only |
| Join Us | opens signup modal (no separate page) | left | non-member only |
| ⚙ (gear icon) | icon link → `/admin` | left, right of Join Us | admin only |
| LinkedIn | icon button (external) | right | always |
| Email | icon button (mailto:) | right | always |
| Instagram▾ | icon + hover dropdown | right | always |
| Discord▾ | icon + hover dropdown | right | member only |
| Log In | button → Google OAuth | far right | logged-out only |

**Dropdowns:**
- About▾ → "About Us" (`/about`) · "Our Team" (`/team`)
- Updates▾ → "Announcements" (`/announcements`) · "Schedule" (`/schedule`)
- Practice▾ → "Problems" (`/problems`) · "Solutions" (`/solutions`)
- Instagram▾ → "Seneca" · "York" · "TMU (coming soon)"
- Discord▾ → "Seneca" · "York" · "TMU (coming soon)"

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Full-width club group photo]                      │
│   width: 100%, height: ~500px, object-fit: cover    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ELFSIGHT SOCIAL FEED                               │
│  Instagram + LinkedIn embed                         │
│  centered, max-width 1200px, padding 48px 0         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CLUB INTRODUCTION                                  │
│  bg: #F9F9F9, padding: 64px 0                       │
│                                                     │
│  H2: "Who We Are"                                   │
│  Body (2–3 lines):                                  │
│    codeXperts is a student coding club bridging     │
│    the gap between classroom learning and real      │
│    coding expertise — through weekly challenges,    │
│    competitions, and cross-campus collaboration.    │
│                                                     │
│  [  Join Us →  ]        [  About Us →  ]            │
│   Primary (#C0392B)      Secondary (outline)        │
│   → /join                → /about                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Footer
```
┌─────────────────────────────────────────────────────┐
│  [codeXperts logo]                                  │
│  "Code. Learn. Grow."                               │
│                                                     │
│  Links:              Social:                        │
│  Home                [LinkedIn icon]                │
│  About Us            [Email icon]                   │
│  Events              [Instagram icon ▾]             │
│  Join Us             [Discord icon ▾] ← member only │
│                                                     │
│  © 2025 codeXperts Club. All rights reserved.       │
└─────────────────────────────────────────────────────┘
```

---

## Notes
- No member-only sections on this page
- Group photo: full container width, no padding
- CTA: Join Us = left (primary red), About Us = right (secondary outline)
- Footer repeated on all pages
