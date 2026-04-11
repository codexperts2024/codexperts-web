# Signup — Modal (replaces `/join` page)
> No dedicated page. Triggered by [Join Us] button on Home navbar/CTA.

## Design Tokens (summary)
- Modal bg: `#FFFFFF`, overlay: `rgba(0,0,0,0.4)`
- Accent: `#C0392B` (Google sign-in button)
- Input border focus: `#C0392B`
- Font: Inter (body / labels)

---

## Stitch Instructions

**THIS IS A MODAL, NOT A PAGE. Render it as a modal overlay on top of the Home page.**

- Modal bg: `#FFFFFF`. Overlay behind modal: `rgba(0,0,0,0.4)`. Do NOT render as a full page.
- Modal width: 420px, centered on screen. Border-radius: 8px. Padding: 32px.
- Font: Inter for all labels, inputs, and buttons. Do NOT use Montserrat inside the modal.
- The modal has EXACTLY 3 input fields: Campus (dropdown), Cohort (dropdown), Phone Number (text input). Do NOT add or remove any fields.
- Field order is FIXED: Campus first, Cohort second, Phone Number third. Do NOT reorder.
- [Continue with Google] button: bg `#C0392B`, text `#FFFFFF`, full-width, radius 6px, Inter 500 14px. Show Google "G" logo icon on the LEFT of the label.
- Input fields: bg `#F5F5F5`, border 1px `#CCCCCC`, radius 6px, padding 8px 12px. Focus border: `#C0392B`.
- "Already a member? Log in →" is a plain text line at the bottom — Inter 13px, color `#555555`. "Log in" is a red link `#C0392B`. Do NOT make this a button.
- [✕] close button in top-right corner of modal: plain icon, color `#999999`, no background.
- Do NOT add a terms of service checkbox, email input, or password field.
- Do NOT add a progress indicator or multi-step wizard — this is a single-screen modal.

---

## Trigger Points
```
[Join Us] in Navbar        → opens modal
[Join Us →] on Home CTA    → opens modal
[Log In] in Navbar         → Google OAuth directly (existing members)
  → if new Google account  → same modal opens after OAuth
```

---

## Modal Layout

```
┌──────────────────────────────────────────┐
│  Join codeXperts                    [✕]  │
│  ──────────────────────────────────────  │
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
│    └ Winter 2024  (Jan – Apr)            │
│    └ Summer 2024  (May – Aug)            │
│    └ Fall 2024    (Sep – Dec)            │
│    └ Winter 2025                         │
│    └ Summer 2025                         │
│    └ Fall 2025                           │
│    └ Winter 2026                         │
│    └ Summer 2026  ← current              │
│                                          │
│  Phone Number                            │
│  ┌──────────────────────────────────┐    │
│  │ (416) 000-0000                   │    │
│  └──────────────────────────────────┘    │
│    Format: Canadian  (XXX) XXX-XXXX      │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  G  Continue with Google         │    │
│  └──────────────────────────────────┘    │
│   bg #C0392B, text white, radius 6px     │
│                                          │
│  Already a member?  Log in →             │
│  Inter 13px, color #555555, link #C0392B │
└──────────────────────────────────────────┘
```

---

## Field Specs

### Campus Dropdown
```
Options: Seneca College | York University
Required: yes
Stored in DB: users.campus
```

### Cohort Dropdown
```
Options: Winter / Summer / Fall + year (generated dynamically)
  Winter = Jan–Apr  |  Summer = May–Aug  |  Fall = Sep–Dec
Required: yes
Stored in DB: users.cohort  (e.g. "Fall 2024")
Purpose: track when member joined, group by semester
```

### Phone Number
```
Format: Canadian  (XXX) XXX-XXXX
Input type: tel
Validation: must match (XXX) XXX-XXXX pattern
Required: yes
Stored in DB: users.phone
```

---

## Post-Submit Flow
```
[Continue with Google] click
  → validate all 3 fields (show inline errors if missing)
  → Google OAuth popup
  → on success:
      DB insert: {
        google_id, name, email, avatar_url,   ← from Google
        campus, cohort, phone,                ← from modal
        status: "pending",                    ← default
        created_at: now()
      }
  → redirect to confirmation page or show success message:
      "You're on the list! An admin will approve your request soon."
```

---

## Notes
- No standalone `/join` route — modal only
- Cohort list generated dynamically (not hardcoded) — add new semester = one config entry
- Existing members re-registering: select their original cohort from dropdown
- Phone format auto-masked on input: type 4161234567 → displays (416) 123-4567
- All fields required before Google OAuth proceeds
