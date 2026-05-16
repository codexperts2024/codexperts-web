# Page: Announcements `/announcements`
> Visibility: public (read) | Admin only (create / delete)

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Accent: `#C0392B` (new post button, active state)
- Text: `#1A1A1A` / `#555555`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF`. Do NOT use any other background color or gradient.
- Font: Montserrat for H1/H2. Inter for all body text, labels, and buttons. Do NOT use any other font.
- Accent color `#C0392B` is used ONLY on: [+ New] button, active nav tab underline. Nowhere else.
- This page has EXACTLY TWO views: Post View and List View. Render BOTH as separate screens.
- Do NOT add a sidebar, search bar, filter, or any element not listed below.
- Do NOT add dark mode, gradients, shadows beyond `0 1px 4px rgba(0,0,0,0.06)`, or decorative illustrations.
- All button labels are in ENGLISH. Do not translate or alter them.
- Navbar is identical on every page. See home.md for navbar spec.
- Footer is identical on every page. See home.md for footer spec.

**View 1 (Post View) must show:**
1. Navbar
2. Page header (bg `#F9F9F9`) with H1 "Announcements" left-aligned and [+ New] right-aligned (admin only — render as visible for mockup)
3. Post content area (bg `#FFFFFF`, max-width 800px, centered): H2 title, meta line (date · author), divider, markdown body
4. Navigation row (max-width 800px, centered): [← Previous] left, [List] center, [Next →] right, [🗑 Delete] far right below (red text, no bg)
5. Footer

**View 2 (List View) must show:**
1. Navbar
2. Page header same as View 1
3. Table (max-width 900px, centered): columns # / Title / Date / Author. 5 sample rows. Row hover bg `#F9F9F9`.
4. Footer

---

## Views Overview

Two views:
1. **Post View** — default, opens the most recent announcement
2. **List View** — bulletin board, accessed via [List] button

---

## View 1: Post View (default)

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Announcements"                                │
│                                          [+ New]   │  ← admin only
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  POST CONTENT  (bg: #FFFFFF, padding: 48px 0)       │
│  max-width: 800px, centered                         │
│                                                     │
│  H2: [Post Title]                                   │
│  Meta: [Date]  ·  [Author name]                     │
│  Divider: 1px solid #E5E5E5                         │
│                                                     │
│  [Body — markdown rendered]                         │
│   Inter 16px, line-height 1.7, color #1A1A1A        │
│   Supports: headings, bold, lists, links, images    │
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
│    modal before deleting                            │
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
│  H1: "Announcements"                                │
│                                          [+ New]   │  ← admin only
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BULLETIN BOARD  (bg: #FFFFFF, padding: 48px 0)     │
│  max-width: 900px, centered                         │
│                                                     │
│  ┌────┬──────────────────────────┬────────┬───────┐ │
│  │ #  │ Title                    │ Date   │ Author│ │
│  ├────┼──────────────────────────┼────────┼───────┤ │
│  │ 5  │ Weekly Problem - Apr W2  │ Apr 12 │ Paul  │ │
│  │ 4  │ April Schedule Update    │ Apr 05 │ Sid   │ │
│  │ 3  │ Coding Competition Info  │ Mar 28 │ Paul  │ │
│  │ 2  │ York Chapter Launch      │ Mar 15 │ Paul  │ │
│  │ 1  │ Welcome to codeXperts    │ Feb 01 │ Paul  │ │
│  └────┴──────────────────────────┴────────┴───────┘ │
│                                                     │
│  Row hover: bg #F9F9F9, cursor pointer              │
│  Click any row → opens Post View for that post      │
│  Newest post at top (#5), oldest at bottom          │
│                                                     │
│  Pagination (if > 20 posts):                        │
│  [← Prev]   Page 1 of 3   [Next →]                 │
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
Action: Opens new post form (title input + markdown body editor + [Publish] button)
Visibility: Rendered only when user role = admin or executive
```

### [← Previous]
```
Style: Secondary outline — bg transparent, border 1px #CCCCCC, color #555555, radius 6px
State: Disabled (color #CCCCCC, border #CCCCCC, not clickable) when viewing the oldest post
Action: Navigates to the post with the previous ID (older post)
```

### [List]
```
Style: Secondary outline — same as Previous
State: Always active
Action: Switches to List View
```

### [Next →]
```
Style: Secondary outline — same as Previous
State: Disabled (color #CCCCCC, border #CCCCCC) when viewing the newest post
Action: Navigates to the post with the next ID (newer post)
```

### [🗑 Delete] — Admin only
```
Position: Right side of navigation row, aligned below [Next →]
Style: Text only — color #C0392B, no background, no border, Inter 500 14px
State: Visible only when user role = admin or executive
Action: Opens confirmation modal
  Modal text: "Delete this announcement? This cannot be undone."
  Modal buttons: [Cancel] (secondary) / [Delete] (primary red)
```

---

## Notes
- Default `/announcements` always opens the most recent post (highest ID)
- `/announcements/list` or query param `?view=list` for List View
- `/announcements/:id` for a specific post
- Markdown body supports: headings, bold/italic, bullet lists, numbered lists, links, images
- Post author = logged-in admin/executive who created it
