---
name: workshop-planning
description: Prepare and explain an AI Website Workshop proposal from approved Green requirements before generating code.
---

# Propose the site

## Inputs and prerequisites
Current approved requirements in .workshop/state.json. Check with
npm start -- status <folder>. Approval of another revision is insufficient.

## Procedure
1. Run npm start -- plan <folder>.
2. Explain pages, functionality, appearance, pending content, hosting, potential
   costs and exclusions in the proposal in English.
3. Keep Astro static: "Public files, without visitor accounts or data storage."
   Do not add external services or alternative architectures.
4. Review design.md and confirm realistic design expectations. The template is a
   starting point; the agent adapts it rather than relying on an automatic design
   engine. Never promise functionality that has not been implemented.
5. If business expectations change, return to workshop-discovery for a new revision.
   Approval of earlier needs never authorizes new functionality.
6. Display the complete proposal. The person runs npm start -- approve <folder>
   proposal and personally types APPROVE N.

## Outputs
Structured proposal and approval bound to its fingerprint in persistent state.

## Completion
Stage is development; requirements and proposal belong to the same revision.

## Failures
Ask for specific missing information. Reclassify changed needs. Never generate by
bypassing the controller. Continue with workshop-development after approval.
