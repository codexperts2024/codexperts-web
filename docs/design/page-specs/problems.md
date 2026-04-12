# Page: Problems `/problems`
> Visibility: member only

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B`
- Text: `#1A1A1A` / `#555555`
- Language tag: bg `#FDECEA`, color `#C0392B`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF`. Do NOT use any other background color or gradient.
- Font: Montserrat for H1/H2. Inter for all body, labels, buttons. Do NOT use any other font.
- Accent `#C0392B` used ONLY on: [+ New] button, language tags, [✏️ Go to My Solution] button. Nowhere else.
- This page has EXACTLY TWO views: Post View and List View. Render BOTH as separate screens.
- Do NOT add a sidebar, search bar, difficulty rating stars, or any element not listed below.
- Do NOT add dark mode, gradients, or decorative illustrations.
- Language tags style: bg `#FDECEA`, color `#C0392B`, font-size 11px, padding 2px 8px, border-radius 4px.
- All button labels are in ENGLISH. Do not translate or alter them.
- Navbar and Footer are identical on every page — see home.md.

**View 1 (Post View) must show:**
1. Navbar
2. Page header (bg `#F9F9F9`): H1 "Problems" left, [+ New] right (admin only — show for mockup)
3. Problem content (bg `#FFFFFF`, max-width 800px, centered): H2 title, meta row (language tags + week + due date + author), divider, markdown body, [✏️ Go to My Solution →] full-width red button at bottom
4. Navigation row: [← Previous] left, [List] center, [Next →] right, [🗑 Delete] far right red text (admin only)
5. Footer

**View 2 (List View) must show:**
1. Navbar
2. Page header same as View 1
3. Table (max-width 900px, centered): columns Week / Title / Lang / Due / ✓. 3 sample rows. ✓ column shows green checkmark or gray dash.
4. Footer

---

## Views Overview

Two views — same pattern as Announcements:
1. **Post View** — default, opens the most recent problem
2. **List View** — bulletin board of all problems, accessed via [List] button

---

## View 1: Post View (default)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Problems"                                     │
│                                          [+ New]   │  ← admin only
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PROBLEM CONTENT  (bg: #FFFFFF, padding: 48px 0)    │
│  max-width: 800px, centered                         │
│                                                     │
│  H2: [Problem Title]                                │
│  Meta row:                                          │
│    [Python] [Java]  ← language tags  ·  Week 12    │
│    📅 Due: Apr 20, 2026  ·  Posted by: Paul         │
│                                                     │
│  Divider: 1px solid #E5E5E5                         │
│                                                     │
│  [Body — markdown rendered]                         │
│   Problem description, constraints, examples        │
│   Inter 16px, line-height 1.7                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [✏️ Go to My Solution →]                   │    │
│  │  bg #C0392B, text white, full-width, radius 6px  │
│  └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NAVIGATION ROW  (padding: 32px 0)                  │
│  max-width: 800px, centered                         │
│                                                     │
│  [← Previous]    [List]      [Next →]               │
│                              [🗑 Delete] ← admin only│
│                                                     │
│  · [← Previous]: disabled (grayed #CCCCCC) if oldest│
│  · [Next →]: disabled (grayed #CCCCCC) if newest    │
│  · [List]: always active, navigates to List View    │
│  · [🗑 Delete]: admin only, red text no bg, confirm │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## View 2: List View (bulletin board)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Problems"                                     │
│                                          [+ New]   │  ← admin only
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BULLETIN BOARD  (bg: #FFFFFF, padding: 48px 0)     │
│  max-width: 900px, centered                         │
│                                                     │
│  ┌──────┬──────────────────┬────────┬───────┬─────┐ │
│  │ Week │ Title            │ Lang   │ Due   │ ✓   │ │
│  ├──────┼──────────────────┼────────┼───────┼─────┤ │
│  │  12  │ Graph Traversal  │ Python │ Apr 20│  ✓  │ │
│  │  11  │ DP — Knapsack    │ Java   │ Apr 13│  –  │ │
│  │  10  │ Binary Search    │ C++    │ Apr 06│  ✓  │ │
│  └──────┴──────────────────┴────────┴───────┴─────┘ │
│                                                     │
│  ✓ = green (#2E7D5E), – = gray (#999999)            │
│  Row hover: bg #F9F9F9, cursor pointer              │
│  Click row → Post View for that problem             │
│  Newest week at top                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Button Specs

### [+ New] — Admin only
```
Position: top-right of page header
Style: Primary — bg #C0392B, text #FFFFFF, border-radius 6px, padding 8px 20px, Inter 500 14px
Action: Opens new problem form
  Fields: Title, Week #, Language tags, Due date, Forbidden rules, Body (markdown editor)
  [Publish] button submits
```

### [✏️ Go to My Solution →]
```
Style: Primary — bg #C0392B, text #FFFFFF, full-width, border-radius 6px, Inter 500 14px
Action: Navigates to /solutions/:id — opens Monaco editor tab by default
```

### [← Previous] / [Next →] / [List] / [🗑 Delete]
```
Same spec as Announcements page — see announcements.md Button Specs
```

---

## Notes
- Default `/problems` opens the problem with the highest week number (most recent)
- `/problems/:id` for a specific problem
- Submission status (✓) is per-member — each member sees their own status
- Language tags support multiple per problem
- Markdown body supports: headings, bold, code blocks, lists, images
