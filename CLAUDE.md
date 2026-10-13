# Repository handoff

Keep Markdown documentation written for this work in English.

Before continuing security/reliability work, read [the follow-up plan](docs/security-and-reliability-plan.md). It records approved items 1–6, deferred calendar HTML sanitization, optional Google Calendar editing, verification requirements, and rollout status.

Follow the current user's requested scope. Preserve unrelated changes and never expose credentials or personal data. Confirm current branches and migration status before work.

When all approved issues are resolved, verified, and rolled out, delete the plan and remove this pointer in the same change. Do not delete it after only the first item. Preserve relevant deferred notes elsewhere if needed.

## Incremental delivery

Keep the follow-up pull request in draft. After each completed work item, commit and push that item, then update the same draft PR with the implemented behavior, verification results, migration/application status, and remaining work. Do not mark the PR ready or merge without the user requesting it.
