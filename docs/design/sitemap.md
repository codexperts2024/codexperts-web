# codeXperts Club — Sitemap & Navigation

**Visibility Legend:**
- `[public]` — Anyone (unauthenticated)
- `(member)` — Logged-in approved members only
- `{admin}` — Admin only

---

## Navbar Structure

```
LEFT:  [Logo → /]  Home  About▾  Updates▾  Events  (Practice▾)  (Members)  Join Us  {⚙}
RIGHT: [LinkedIn] [Email] [Instagram▾] ([Discord▾])  [Log In]
```

| Item | Route | Visibility | Notes |
|------|-------|------------|-------|
| Logo | `/` | public | Links to Home |
| Home | `/` | public | |
| About▾ | dropdown | public | About Us + Our Team |
| Updates▾ | dropdown | public | Announcements + Schedule |
| Events | `/events` | public | |
| Practice▾ | dropdown | member | Problems + Solutions |
| Members | `/members` | member | |
| LinkedIn | external | public | Icon button |
| Email | mailto: | public | Icon button |
| Instagram▾ | — | public | Hover dropdown (Seneca / York / TMU) |
| Discord▾ | — | member | Hover dropdown (Seneca / York / TMU) |
| Join Us | (modal) | public (non-member only) | Triggers signup modal overlay on current page. No `/join` route. Hidden after approval. |
| Log In | Google OAuth | logged-out only | Far right |
| ⚙ (gear) | `/admin` | admin | Icon only, right of Join Us |

---

## Social Links — Hover Dropdown

### Instagram (Public)
Hover to expand. Add new campus by appending to the array.

```
Instagram ▾
  └ Seneca
  └ York

```

### Discord (Member only — not visible to public)
Same hover behavior as Instagram.

```
Discord ▾
  └ Seneca
  └ York

```

**Implementation note:** Manage campus links as a config array (not hardcoded).
Adding a new campus = one entry in the config file, no component changes needed.

---

## Pages

### [public] Home `/`
- Hero section (club name, tagline)
- Mission statement
- CTAs: About Us / Events / Join Us
- Instagram social feed — Elfsight embed (Seneca + York)
- Community links (Instagram, Discord teaser)

### [public] About Us `/about`
- Club intro
- Executive Board (org chart / team cards)

### [public] Schedule `/schedule`
- Weekly/monthly meeting schedule
- Google Calendar embed (public Google Calendar)

### [public] Events `/events`
- Event cards (hackathons, workshops, socials)
- Past events archive

### [public] Announcements `/announcements`
- Club-wide announcements posted by Executives/Admins
- Reverse chronological order (newest first)
- Executive/Admin creates via Admin panel (title, body, date)
- Stored in `announcements` table in Supabase

### [public] Our Team `/team`
- Executive Board grid (Seneca + York sections)
- 3-column card layout per campus: photo, name, role badge, LinkedIn
- Accessible via About▾ dropdown and About page CTA [Meet Our Team →]
- Spec: docs/design/page-specs/team.md

### [public] Join Us
- **No dedicated route** — rendered as a modal overlay on the current page
- Triggered by [Join Us] button in Navbar and Home page CTA
- 3 fields: Campus (dropdown), Cohort (dropdown), Phone Number (input)
- [Continue with Google] → Supabase Google OAuth → new user lands on pending screen
- Modal hidden once user is an approved member
- Spec: docs/design/page-specs/join.md

### (member) Problems `/problems`
- Problem list by week
- Problem detail + Monaco Editor
- Code execution via Piston API
- Submit & view other members' solutions

### (member) Members `/members`
- Member directory (profile cards)
- Filter by cohort, campus
- Profile page: photo, school, LinkedIn, GitHub, activity heatmap

### {admin} Admin `/admin`
- Pending user approvals
- Role management
- Problem CRUD (create/edit/delete)
- QR attendance session management

---

## Mobile Nav
- Hamburger menu
- Same visibility rules apply
- Social icons in footer or bottom of mobile menu
