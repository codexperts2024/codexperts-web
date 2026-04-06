# codeXperts Club — Sitemap & Navigation

**Visibility Legend:**
- `[public]` — Anyone (unauthenticated)
- `(member)` — Logged-in approved members only
- `{admin}` — Admin only

---

## Navbar Structure

```
[Logo → /]   Home   About Us   Schedule   Events   Announcements   [Join Us]   (Problems)   (Members)   [LinkedIn] [Email] [Instagram ▾] (Discord ▾) {⚙}
```

| Item | Route | Visibility | Notes |
|------|-------|------------|-------|
| Logo | `/` | public | Links to Home |
| Home | `/` | public | |
| About Us | `/about` | public | Includes Executive Board section |
| Schedule | `/schedule` | public | Google Calendar embed |
| Events | `/events` | public | |
| Announcements | `/announcements` | public | Executive/Admin can post |
| Join Us | `/join` | public (non-member only) | Hidden after login & approval |
| Problems | `/problems` | member | |
| Members | `/members` | member | |
| LinkedIn | external | public | Single link |
| Email | mailto: | public | Single link |
| Instagram | — | public | Hover dropdown |
| Discord | — | member | Hover dropdown |
| ⚙ Admin | `/admin` | admin | Icon only, no text label |

---

## Social Links — Hover Dropdown

### Instagram (Public)
Hover to expand. Add new campus by appending to the array.

```
Instagram ▾
  └ Seneca
  └ York
  └ TMU        ← future
```

### Discord (Member only — not visible to public)
Same hover behavior as Instagram.

```
Discord ▾
  └ Seneca
  └ York
  └ TMU        ← future
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

### [public] Join Us `/join`
- Membership application form
- Google Sign-In → pending status
- Only shown to non-members (hidden once approved)

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
