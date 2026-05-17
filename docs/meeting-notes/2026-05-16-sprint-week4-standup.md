# Meeting Notes — Sprint Week 4 Standup

**Date:** 2026-05-16
**Type:** Weekly Standup — Saturday 7:30 PM via Google Meet
**Attendees:** Paul, Dave, Andra, Kai, Judy

---

## Progress Updates

| Member | Area | Status |
|--------|------|--------|
| Dave | Navbar / Login | Navbar modal fixed; Google Auth login integration in progress |
| Dave | Problem List Page | Feature implemented with React Markdown; PR #74, #77 (executive permission fix) |
| Dave | Infrastructure | Railway trial expiring; fallback planned (Dave's personal infra or Paul's Oracle Cloud) |
| Paul | Main Branch | All team PRs merged to main |
| Paul | Schedule Page | Google Calendar API integrated; members can subscribe and download events |
| Paul | Instagram Feed | Feed works locally but fails on Vercel; under re-investigation |
| Andra | Events Page | Dark mode + component split in progress; 404 and image path bugs identified, fix planned tonight |
| Andra | Events Page | Card height uniformity and past-events sort order (newest-left) confirmed per feedback |
| Kai | Mobile Layout | Home and About Us position adjustments in progress; mobile sub-issues to be filed post web-version push |
| Kai | Announcement Page | Implementation ongoing |
| Judy | Members Page | Design and markup complete; mock data populated; filter and profile detail pages next |
| Judy | Cohort Display | Cohort number (1, 2, 3...) confirmed for member cards per Figma spec |

---

## Decisions

- Railway infrastructure: no blocker — URL will be re-pointed to alternative host when trial ends
- Events card height: standardized across all cards
- Events past list sort: newest event appears on the left
- Members cohort display: numeric badge format confirmed

---

## Action Items

| Owner | Task |
|-------|------|
| Dave | Complete Google Auth login wiring |
| Andra | Fix Events page 404 and image path errors tonight |
| Kai | Push web-version pages; file mobile sub-issues |
| Judy | Implement filter functionality and profile detail page |
| Paul | Re-investigate Instagram feed on Vercel |
