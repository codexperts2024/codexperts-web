# Page: Our Team `/team`
> Visibility: public

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Role badge: bg `#EAF4F0`, color `#2E7D5E`
- Font: Montserrat (headings) / Inter (body)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: Seneca section bg `#FFFFFF`, York section bg `#F9F9F9`. Do NOT change this.
- Font: Montserrat for H1/H2. Inter for names, roles, labels. Do NOT use any other font.
- Accent `#C0392B` is NOT used on this page. Role badges use green (`#2E7D5E`), not red.
- Do NOT add a bio section, contact form, or social feed on this page.
- Team cards are arranged in a 3-column grid desktop / 2-column tablet / 1-column mobile. Do NOT use a 4-column or any other grid.
- Each card is centered, text-align center: avatar (72px circle) → name → role badge → LinkedIn icon. Nothing else.
- Role badges: bg `#EAF4F0`, color `#2E7D5E`, font-size 11px, padding 2px 8px, radius 4px.
- Avatar placeholder: gray circle with initials (e.g. "T1" for Team1). Do NOT use stock photos.
- LinkedIn icon: 16px, color `#555555`. Do NOT add GitHub or email icons on this page.
- Card border: NONE (no card border on this page — clean grid look). Cards have no box-shadow.
- Placeholder names: Team1 through Team6. Do NOT invent real names.
- H2 section headers ("Seneca College", "York University") are left-aligned, Montserrat 600 26px.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 48px 0)        │
│  H1: "Our Team"                                     │
│  Subtitle: "The people behind codeXperts"           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SENECA COLLEGE  (bg: #FFFFFF, padding: 64px 0)     │
│  H2: "Seneca College"                               │
│  Campus tag: small gray label                       │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  [photo] │  │  [photo] │  │  [photo] │          │
│  │  72px ○  │  │  72px ○  │  │  72px ○  │          │
│  │  Team1   │  │  Team2   │  │  Team3   │          │
│  │[President│  │   [VP]   │  │[Treasurer│          │
│  │  badge]  │  │  badge]  │  │  badge]  │          │
│  │[LinkedIn]│  │[LinkedIn]│  │[LinkedIn]│          │
│  └──────────┘  └──────────┘  └──────────┘          │
│   3-col grid desktop / 2-col tablet / 1-col mobile  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  YORK UNIVERSITY  (bg: #F9F9F9, padding: 64px 0)    │
│  H2: "York University"                              │
│  Campus tag: small gray label                       │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  [photo] │  │  [photo] │  │  [photo] │          │
│  │  72px ○  │  │  72px ○  │  │  72px ○  │          │
│  │  Team4   │  │  Team5   │  │  Team6   │          │
│  │[President│  │   [VP]   │  │[Treasurer│          │
│  │  badge]  │  │  badge]  │  │  badge]  │          │
│  │[LinkedIn]│  │[LinkedIn]│  │[LinkedIn]│          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Team Card Spec
```
Container:
  background: #FFFFFF
  border: 1px solid #E5E5E5
  border-radius: 8px
  padding: 24px 20px
  text-align: center

Avatar:
  size: 72px circle
  object-fit: cover
  margin-bottom: 12px

Name:
  font: Inter 500 15px
  color: #1A1A1A

Role badge:
  background: #EAF4F0
  color: #2E7D5E
  font-size: 11px
  padding: 2px 8px
  border-radius: 4px

Campus label:
  font: Inter 400 12px
  color: #999999

LinkedIn icon:
  size: 16px
  color: #555555
  hover: color #1A6FBF
  links to personal LinkedIn profile
```

---

## Notes
- Placeholder: Team1–Team6, replace with real names when confirmed
- Seneca section bg: white, York section bg: #F9F9F9
- Grid: 3 columns desktop, 2 tablet, 1 mobile (max-width 280px per card)
