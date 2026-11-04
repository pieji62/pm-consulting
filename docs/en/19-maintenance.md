# 19. Understand maintenance notices

Dependabot proposes updates; it does not install them in production by itself.
Weekly maintenance checks the site and its configured public address.

1. Open GitHub Actions and find Weekly maintenance.
2. Green means that run succeeded; Red requires review.
3. Open Pull requests to see Dependabot proposals. Ask what changes and whether checks passed.
4. Missing SITE_URL marks availability NOT EXECUTED and fails the check. Add the
   Azure URL with instructor support; never invent a positive result.
5. Configure GitHub notifications for relevant failures. The workshop does not
   send email to third parties or create commercial contacts.
6. A person reviews before merging; every publication remains manual.

Scheduled jobs may be delayed or dropped under load and run from the default branch.
In public repositories GitHub disables schedules after 60 inactive days; re-enable
them through Actions. Check plan quotas too. This is not continuous monitoring or
an automatic incident-response service.

Keep security notices and ask the agent to explain impact, urgency and next action.
You do not need to interpret scanners without support.

> Screenshot pending: maintenance run and fictional Dependabot proposal.

Reference: [scheduled event limits](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
