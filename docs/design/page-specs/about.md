# Page: About Us `/about`
> Visibility: public

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B` (timeline dots, highlights)
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background alternates per section: `#FFFFFF` → `#F9F9F9` → `#FFFFFF` → `#F9F9F9`. Do NOT change this pattern.
- Font: Montserrat for all headings. Inter for body. Do NOT use any other font.
- Accent `#C0392B` used ONLY on: timeline dots and the [Join Us →] button. Nowhere else.
- Do NOT add photos, illustrations, team member photos, or background images to this page.
- The 3 pillars (Algorithmic Thinking / Student Networking / Inter-School Exchange) are EQUAL WIDTH cards in a horizontal row. Each has: icon on top, label below. Border: 1px solid `#E5E5E5`, bg `#FFFFFF`, radius 8px, padding 24px.
- Mobile: 3 pillars stack to 1 column (full width each).
- The timeline is a VERTICAL list with a left red line (`#C0392B`). Each entry has a red dot (8px circle `#C0392B`) on the left, and text on the right. Do NOT render this as a horizontal timeline.
- Timeline line color: `#E5E5E5`. Timeline dot color: `#C0392B`.
- CTA row at bottom: [Meet Our Team →] LEFT (secondary outline), [Join Us →] RIGHT (primary red). Do NOT swap order.
- Do NOT add a back-to-top button or sticky sidebar.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 48px 0)        │
│  H1: "About codeXperts"                             │
│  Subtitle: "More than a club — a community of       │
│             coders going beyond the classroom."     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MISSION SECTION  (bg: #FFFFFF, padding: 64px 0)    │
│  H2: "Why We Exist"                                 │
│  Body:                                              │
│    School curriculum alone isn't enough to become   │
│    a true coding expert. codeXperts was created     │
│    to fill that gap — sharpening algorithmic        │
│    thinking, building real-world coding skills,     │
│    and connecting students across campuses through  │
│    collaboration, competition, and community.       │
│                                                     │
│  ┌──────────────┬──────────────┬────────────────┐   │
│  │ 💡           │ 🤝           │ 🏫             │   │
│  │ Algorithmic  │ Student      │ Inter-School   │   │
│  │ Thinking     │ Networking   │ Exchange       │   │
│  └──────────────┴──────────────┴────────────────┘   │
│   3-column icon pillars, card style, border #E5E5E5 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OUR STORY  (bg: #F9F9F9, padding: 64px 0)          │
│  H2: "Our Story"                                    │
│                                                     │
│  Vertical timeline — left red line, entries right:  │
│                                                     │
│  ●── 2024 Fall                                      │
│  │   codeXperts founded at Seneca College           │
│  │   by Prof. Yoon and students passionate about    │
│  │   going beyond the classroom.                    │
│  │                                                  │
│  ●── 2026 Winter                                    │
│  │   First official event: Coding Competition       │
│  │   hosted at Seneca College.                      │
│  │                                                  │
│  ●── 2026 Fall                                      │
│      codeXperts officially launched as a            │
│      York University recognized club.               │
│      Inter-campus collaboration begins.             │
│                                                     │
│  Timeline dot color: #C0392B                        │
│  Line color: #E5E5E5                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CTA ROW  (padding: 48px 0, text-align: center)     │
│  [  Meet Our Team →  ]     [  Join Us →  ]          │
│   Secondary (outline)       Primary (#C0392B)       │
│   → /team                   → /join                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Notes
- Sections alternate bg: white → #F9F9F9 → white → #F9F9F9
- 3 pillars: equal width, icon on top, short label below
- Timeline is a simple vertical left-border list, not a library component
