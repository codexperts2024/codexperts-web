# Security and reliability follow-up plan

Date: 2026-10-08
Status: Item 1 implemented and locally verified; database application and deployment pending. Remaining items are not implemented.

## Decisions and handoff

The user approved items 1–6. Item 7 (calendar HTML sanitization) is deferred. Calendar editing inside the website is a separate proposed feature, not an approved implementation scope.

Remove personal email and phone from public/member-facing access. Preserve authentication email, existing records, and owner/reviewer access. Stopping phone collection or permanently deleting stored phone numbers is not included without explicit scope confirmation.

PR #213 was merged into develop. The user confirmed applying migrations through `20261008180000_allow_reapplication.sql`. Production deployment is a separate status. Check the latest branch and working tree before starting; do not overwrite unrelated work. Use new migrations for follow-up changes. Never log credentials or personal contact values.

**Document lifecycle:** Once all approved issues (1–6) are implemented, verified, and their required migrations/rollout completed, delete this plan and remove its reference from CLAUDE.md in the same change. Do not delete it after item 1 alone. Deferred item 7 and the optional calendar feature do not block cleanup; transfer any still-relevant deferred notes before deletion. Keep documentation in English.

## Review evidence

Reviewed changes through `00ac43c00bad522503028797de7360fa0026ad92`. The existing 42 tests and production build passed. These tests did not cover the issues below. An anonymous read against the connected Supabase project returned executive/admin email and phone fields with nonempty values; no values were printed or retained. Review focused on frontend, Next.js APIs, and database policies, not a complete audit of the separate FastAPI implementation or production infrastructure.

## 1. Remove contact exposure — highest priority, approved

Cause: `supabase/migrations/20260607040000_fix_profiles_executive_policy.sql` exposes entire executive/admin rows publicly. Member directory access also permits reading other profiles.

Plan: Restrict raw database column access to an explicit non-contact allowlist. Preserve a caller-bound owner read and server-authorized reviewer reads. Remove phone from member directory/detail queries and displays. Keep About executive introductions and authentication working. Do not rely only on frontend field selection.

Acceptance: Anonymous and authenticated non-owner raw API requests cannot select email/phone or use them to filter/order results. Owner reads cannot request another identity. Public executive fields, member directory, own profile, and reviewer functionality continue working.

## 2. Enforce Hidden settings in data access — highest priority, approved

Cause: `src/services/membersService.js` fetches hidden values and `src/components/members/MemberCard.js` ignores visibility for company, occupation, and social links.

Plan: Return only permitted fields to other viewers from the server/database. Separate owner editing data from viewer data. Apply the same visibility rules to cards, detail pages, and executive introductions. Define defaults for missing settings; contacts remain private.

Acceptance: Hidden values are absent from another user's response, while owners can edit them. Test public, member, owner, and reviewer access. Item 1 does not by itself resolve this issue.

## 3. Make administrator edits atomic — approved

Cause: `src/app/api/admin/members/[id]/route.js` saves profiles before `src/lib/syncExecutiveTitle.js` separately closes and creates executive terms.

Plan: Use one database transaction/RPC for role, school, title, and term updates. Validate authorization and inputs first. Use locking/constraints to prevent concurrent duplicate active titles or school/title seats. Preserve existing privilege and self-account protections.

Acceptance: A failure during title insertion leaves profile and term history unchanged. Concurrent requests cannot create duplicate active assignments. Return confirmed stored state.

## 4. Preserve visible review history after reapplication — approved

Cause: `src/app/api/admin/members/route.js` and `src/app/admin/page.js` only load/display rejection details for currently rejected accounts.

Plan: Separate current application state from review history. Keep past rejections visible after resubmission or approval, including reason, date, and reviewer. Preserve multiple decisions. Limit access to the applicant and reviewers; label missing historical data honestly.

Acceptance: Reject → reapply → reject/approve retains accessible history. Ordinary members cannot read another applicant's decisions.

## 5. Handle sign-out failures honestly — approved

Cause: `src/contexts/AuthContext.js` swallows sign-out errors/timeouts and navigates away, potentially restoring a still-persisted session.

Plan: Confirm local browser session termination before navigation. Distinguish local logout from all-device logout. Provide retry on failure, share consistent cleanup with account switching, prevent duplicate actions and stale-account responses, and retain Google's account selector.

Acceptance: Reload after successful logout does not restore the old session. Cover failure, timeout, retry, and account-switch behavior.

## 6. Prevent contact-form abuse — approved

Cause: `src/app/api/contact/route.js` lacks request throttling and adequate input-size validation. No repeated live email experiment was performed.

Plan: Validate JSON, types, email format, field lengths, and request size. Use a shared rate-limit store suitable for multiple serverless instances, not only process memory. Add server-side bot verification; select provider, cost, and secrets before implementation. Return 429 with retry guidance for throttling and 400 for invalid input. Mock mail delivery in tests.

Acceptance: Invalid, bot-rejected, or throttled requests never invoke mail delivery; valid requests still work.

## 7. Calendar HTML sanitization — deferred by user

Keep the current Google Calendar editing and HTML display behavior. The user trusts calendar administrators. `src/app/schedule/page.js` renders HTML directly and `src/app/api/calendar/route.js` does not sanitize it. Account compromise or copied external content remains a conditional risk; an exploit through the actual Google Calendar feed was not reproduced. Do not describe this as proven safe.

## Optional: Edit Google Calendar from the website

The current public ICS feed is read-only. Google Calendar API can create, update, and delete events through a website editor.

Recommended design: Keep Google Calendar as the source of truth. Connect the operating calendar owner's account through a separate administrative OAuth consent flow, not ordinary member sign-in. Request only necessary event scopes and verify calendar write permission. Server endpoints must authorize site admins and use a fixed operating calendar ID. Store refresh tokens only on the server; handle revocation/reconnection without storing Google passwords.

Preserve event IDs, Toronto timezone, all-day semantics, recurring-series versus single-instance edits, concurrency checks, deletion confirmation, attendee notification choices, and an audit trail. Show the confirmed API result after saving rather than stale ICS data.

Setup requires Calendar API enablement, OAuth application/consent configuration, redirect URIs, owner consent, and server secrets. OAuth verification requirements depend on scopes and distribution. Initial consent can avoid repeated visits to Google Calendar, but revoked/expired authorization may require reconnection.

Official references checked 2026-10-08:
- https://developers.google.com/workspace/calendar/api/guides/create-events
- https://developers.google.com/workspace/calendar/api/v3/reference/events/update
- https://developers.google.com/workspace/calendar/api/auth

## Execution and completion tracking

Order: contact exposure, visibility enforcement, atomic admin edits, review history, logout, contact-form protection. Scope calendar editing separately and retain the sanitization deferral.

For each item record implementation, validation, migration application, environment setup, PR merge, and deployment separately. A document or passing build does not mean rollout is complete. Delete this plan only under the lifecycle rule above.

### Item 1 implementation record — 2026-10-08

Branch: `codex/protect-profile-contact-data`.

Added `20261008200000_protect_profile_contacts.sql`: revoke blanket and pre-existing column SELECT grants for PUBLIC/anon/authenticated; grant explicit non-contact columns; expose full owner data only through the caller-bound `get_own_profile()` RPC; preserve service-role reviewer access. Updated authentication reads to the RPC and removed phone from member detail/directory reads and profile editing. Profile saves no longer submit a blank phone and therefore preserve stored contact values. Signup and administrator contact handling are unchanged.

Verification: 46 tests passed and production build passed. PostgreSQL tests cover anonymous/member contact selection, filter/order denial, owner isolation, and service-role access. Live database writes were not performed.

Rollout: coordinate SQL application with the new frontend. The old frontend uses SELECT * / phone and will fail after the restrictions; the new frontend needs the new RPC. For a zero-interruption staged rollout, create the owner RPC first, deploy the new frontend, then apply the full migration. Otherwise use a coordinated maintenance window. Keep service-role credentials server-only. After rollout verify anonymous denial, owner login, signup, About, directory, and admin review against the connected project without printing contact values.

Not yet complete: apply the migration and verify the deployed behavior. Keep this document until all approved items and their rollouts are complete.
