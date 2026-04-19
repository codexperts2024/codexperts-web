# Signup / Login — Auth Flow

> No dedicated page. Triggered by [Log In] or [Join Us] buttons.
> Google OAuth runs FIRST. Additional info is collected after OAuth only for new users.

## Design Tokens (summary)
- Modal bg: `#FFFFFF`, overlay: `rgba(0,0,0,0.4)`
- Accent: `#C0392B` (Log In button, submit button, input focus)
- Font: Inter (body / labels)

---

## Auth Flow (Full)

```
[Log In] or [Join Us] click
  → Google OAuth
    → Existing approved member (role: member / executive / admin)
        → redirect to / (logged in)
    → New user (not in profiles table)
        → profile created with: name, email, avatar_url (from Google), role: pending
        → Profile completion modal opens
            → user fills in: Campus, Cohort, Phone Number
            → [Submit] → profile updated → pending screen
    → Existing pending user
        → pending screen
```

---

## Trigger Points

```
[Log In] in Navbar         → Google OAuth (same flow for all users)
[Join Us] in Navbar        → Google OAuth (same flow for all users)
[Join Us →] on Home CTA    → Google OAuth (same flow for all users)
[Join Us →] on About CTA   → Google OAuth (same flow for all users)
```

Log In and Join Us both trigger the same Google OAuth flow.
Routing after OAuth is handled automatically based on profile state.

---

## Step 1 — Log In / Join Us Button

```
Button style: bg #C0392B, text #FFFFFF, radius 6px, Inter 500 14px
Label: "Log In" (Navbar) or "Join Us" (CTA buttons)
On click: trigger Supabase Google OAuth via authService
```

---

## Step 2 — Profile Completion Modal (new users only)

Shown after Google OAuth for users with no existing profile.
Google already returned: `name`, `email`, `avatar_url` — these are saved automatically.
Modal collects the remaining required fields.

**THIS IS A MODAL, NOT A PAGE. Render as overlay on top of current page.**

- Modal width: 420px, centered. Border-radius: 8px. Padding: 32px.
- Overlay: `rgba(0,0,0,0.4)`
- Font: Inter for all labels, inputs, buttons.
- EXACTLY 3 input fields: Campus, Cohort, Phone Number. Do NOT add or remove fields.
- Field order is FIXED: Campus first, Cohort second, Phone Number third.
- [Submit] button: bg `#C0392B`, text `#FFFFFF`, full-width, radius 6px, Inter 500 14px.
- Input fields: bg `#F5F5F5`, border 1px `#CCCCCC`, radius 6px, padding 8px 12px. Focus border: `#C0392B`.
- No [✕] close button — user must complete the form.
- Do NOT add terms of service, password, or email fields (email already from Google).

```
┌──────────────────────────────────────────┐
│  Complete your profile                   │
│  ──────────────────────────────────────  │
│  Signed in as: [avatar] name@gmail.com   │
│                                          │
│  Campus                                  │
│  ┌──────────────────────────────────┐    │
│  │ Select your campus             ▾ │    │
│  └──────────────────────────────────┘    │
│    └ Seneca College                      │
│    └ York University                     │
│                                          │
│  Cohort  (when did you join?)            │
│  ┌──────────────────────────────────┐    │
│  │ Select cohort                  ▾ │    │
│  └──────────────────────────────────┘    │
│    └ Fall 2024    1st                    │
│    └ Winter 2025  2nd                    │
│    └ Summer 2025(X)                      │
│    └ Fall 2025    3rd                    │
│    └ Winter 2026  4th                    │
│    └ Summer 2026  ← current (5th)        │
│                                          │
│  Phone Number                            │
│  ┌──────────────────────────────────┐    │
│  │ (416) 000-0000                   │    │
│  └──────────────────────────────────┘    │
│    Format: Canadian  (XXX) XXX-XXXX      │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │         Submit Application       │    │
│  └──────────────────────────────────┘    │
│   bg #C0392B, text white, radius 6px     │
└──────────────────────────────────────────┘
```

---

## Step 3 — Pending Screen

Shown after modal submission (or when pending user logs in again).

```
"Your application is under review."
"An admin will approve your request soon."
[Sign out] button
[Back to home] link
```

---

## Field Specs

### Campus Dropdown
```
Options: Seneca College | York University
Required: yes
Stored in DB: profiles.campus
```

### Cohort Dropdown
```
Options: Winter / Summer / Fall + year (generated dynamically)
  Winter = Jan–Apr  |  Summer = May–Aug  |  Fall = Sep–Dec
Required: yes
Stored in DB: profiles.cohort  (e.g. "Fall 2024")
Purpose: track when member joined, group by semester
```

### Phone Number
```
Format: Canadian  (XXX) XXX-XXXX
Input type: tel
Validation: must match (XXX) XXX-XXXX pattern
Required: yes
Stored in DB: profiles.phone
Phone format auto-masked: type 4161234567 → displays (416) 123-4567
```

---

## DB Insert on Signup
```
From Google OAuth:
  name, email, avatar_url

From modal:
  campus, cohort, phone

Auto-set:
  role: 'pending'
  created_at: now()
```

---

## Notes
- No standalone `/join` route — modal only
- Cohort list generated dynamically (not hardcoded)
- `authService.js` handles all Supabase OAuth calls — no direct Supabase calls in components
