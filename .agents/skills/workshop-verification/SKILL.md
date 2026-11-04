---
name: workshop-verification
description: Execute real AI Website Workshop checks and produce an English evidence report before publication or after changes.
---

# Verify with evidence

## Inputs and prerequisites
Generated site, installed dependencies, approved content, npm and Playwright browser
access. Keep permissions limited. Connection failures never count as success.

## Procedure
1. From the site prepare Chromium with npx.cmd --no-install playwright install chromium.
2. Run npm.cmd run verify. It first invalidates previous results, then checks scope,
   static boundaries, secrets, types, build, links/size, Playwright/axe and dependency
   audit. Never fabricate verification.json.
3. Read evidence/report.md, evidence/verification.json and relevant logs. Explain
   PASSED, FAILED, NOT EXECUTED and pending human review separately.
4. Allow at most TWO code-repair attempts within approved scope. Preserve every
   failed report in history or an attempt-specific location. Never disable rules,
   skip audits, change thresholds or manually mark results passed.
5. After any source change repeat all checks. Add requirement-specific tests when
   existing coverage does not exercise the behavior. Generic tests cover approved
   pages at mobile/tablet/desktop widths, keyboard, navigation and accessibility.
6. Request human review of facts, licenses, assistive-technology use, privacy and
   real networks. A byte budget is not a real-user performance metric. Pattern
   scanning has false negatives.
7. Run npm start -- ready . . A changed fingerprint, failure, unexecuted check or
   report older than 24 hours blocks local readiness.

## Outputs
Actual report/logs under evidence; verified or blocked state. No guarantee of
complete security, legal compliance or absence of errors.

## Completion
All mandatory checks actually passed for the same revision and source fingerprint.

## Failures
After two repair attempts stop and explain failure, impact, attempted repairs and
the professional assistance needed. Never publish while blocked. Use
workshop-deployment only after passing.
