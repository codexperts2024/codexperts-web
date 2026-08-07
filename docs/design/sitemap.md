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
| About▾ | dropdown | public | About Us `/about` + Our Team `/about#team` + Our Mentor `/mentor` |
| Updates▾ | dropdown | public | Announcements + Schedule |
| Events | `/events` | public | |
| Practice▾ | dropdown | member | Problems + Solutions |
| Members | `/members` | member | |
| LinkedIn | external | public | Icon button |
| Email | mailto: | public | Icon button |
| Instagram▾ | — | public | Hover dropdown (Seneca / York) |
| Discord▾ | — | member | Hover dropdown (Seneca / York) |
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
- Club intro, Why We Exist, Our Story timeline
- **Our Team** section at the `#team` anchor: Executive Board grid, one block per campus
  (Seneca, York), cards ordered by executive title
- Executives are read from the `executive_roles` table, grouped by school
- Spec: docs/design/page-specs/team.md

### [public] Our Mentor `/mentor`
- Welcome letter from Professor Danny Yoon (Founder and Mentor)
- Portrait photo (Cloudinary; executive/admin can replace via inline editor)
- Accessible via About▾ → Our Mentor

### [public] Schedule `/schedule`
- Weekly/monthly meeting schedule
- Google Calendar embed (public Google Calendar)

### [public] Events `/events`
- Event cards (hackathons, workshops, socials)
- Past events archive
- Executive/Admin creates, edits, and deletes via the Events page (inline CRUD)
- Stored in `events` table in Supabase (cover + gallery images via Cloudinary)

### [public] Announcements `/announcements`
- Club-wide announcements posted by Executives/Admins
- Reverse chronological order (newest first)
- Executive/Admin creates via Admin panel (title, body, date)
- Stored in `announcements` table in Supabase

### [public] Join Us
- **No dedicated route** — rendered as a modal overlay on the current page
- Triggered by [Join Us] button in Navbar and Home page CTA
- 3 fields: Campus (dropdown), Cohort (dropdown), Phone Number (input)
- [Continue with Google] → Supabase Google OAuth → new user lands on pending screen
- Modal hidden once user is an approved member
- Spec: docs/design/page-specs/join.md

### (member) Problems `/problems`
- Problem list by week
- Problem detail, markdown or uploaded document
- Executives and admins can create, edit and delete; members are read-only

### (member) Solutions `/solutions`, `/solutions/:id`
- Solutions list, then a per-problem workspace
- Monaco Editor in six languages (Python, Java, C, C++, JavaScript, TypeScript)
- [▶ Run] executes through the FastAPI `/execute` proxy to Judge0 CE
- [✦ Evaluate] returns a Gemini review of Big O and duplicated logic, once the sample tests pass
- [⬆ Submit] upserts to the `submissions` table; one submission per member per problem
- Community Solutions accordion for reading other members' code
- Spec: docs/design/page-specs/solutions.md

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
