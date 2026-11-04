---
name: workshop-maintenance
description: Resume or update an AI Website Workshop site and explain maintenance notices while preserving human review, classification and tests.
---

# Maintain without surprises

## Inputs and prerequisites
Existing site, .workshop/state.json and requested change or GitHub notice.

## Procedure
1. Run npm start -- status . . Explain the current step and preserve approved work.
2. Significant business/design changes need workshop-discovery, a new revision and
   approval. For dependencies, review the Dependabot PR and release notes; no auto-merge.
3. Check proposed npm/Actions updates for changes to scripts, permissions or product
   limits. New fingerprints invalidate earlier verification. Never delete the
   lockfile to dismiss an alert.
4. Run npm.cmd ci --ignore-scripts and workshop-verification for the proposal.
   If an update fails, leave its PR open, explain the blocker and get help.
5. Explain weekly build, tests, audit and availability checks for the Azure URL
   in SITE_URL. A missing URL is NOT EXECUTED and fails that check; never call it available.
6. Read docs/en/19-maintenance.md: schedules may be delayed, and public repository
   schedules are disabled after 60 inactive days.
7. The responsible person reviews and decides whether to merge. Publication always
   follows workshop-deployment. No silent merges, deployments or third-party messages.

## Outputs
English explanation, new evidence or blocker report; a prepared PR only when GitHub
work is authorized. Providers never receive information automatically.

## Completion
Reviewed and verified change, or documented blocker with a concrete next action.

## Failures
Do not require participants to resolve Git conflicts. Explain the professional
help needed and preserve the published version. Never promise continuous monitoring
or complete security.
