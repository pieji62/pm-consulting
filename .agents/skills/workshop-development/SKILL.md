---
name: workshop-development
description: Generate or adapt an approved static Astro site using the AI Website Workshop template and gates, with local preview and visual changes.
---

# Build and preview

## Inputs and prerequisites
Approved requirements/proposal, Green classification and destination folder.
Read the appropriate AGENTS.md and design.md.

## Procedure
1. For a new project run npm start -- generate <folder> from the product/kit.
   Never copy the template over an existing site. Preserve existing code and apply
   only the approved change.
2. Open the generated folder. Run npm.cmd ci --ignore-scripts in Windows
   (npm ci --ignore-scripts elsewhere). Preserve lockfile and exact versions.
3. Customize src/styles/global.css and Astro components for the approved proposal.
   Content lives in src/data/site.json, is escaped during rendering and must match
   requirements. Never use set:html or interpolate supplied content as code.
4. Preserve semantic HTML, keyboard navigation, visible focus, metadata, alternative
   text and compressed local images with dimensions. Stay below 500 KB per file
   and 3 MB initially. Confirm usage rights before obtaining images. No external
   calls or visitor scripts.
5. Run npm.cmd run dev and show http://127.0.0.1:4321. Explain Ctrl+C to stop.
   Ask for visual feedback in plain language without requiring code.
6. Record significant changes with workshop-discovery, then obtain new requirements
   and proposal approvals. Edit the existing site; never repeat generate over it.
7. Additional languages need approved static content and appropriate lang values.
   Never invent commercially approved translations without owner review.
8. Record confirmed design decisions in design.md and continue with workshop-verification.

## Outputs
Independent project with controller, skills, documentation, tests and workflows.

## Completion
Local preview opens; pages/content match approved needs. Preview never means passed
verification or public deployment.

## Failures
Do not add dependencies to work around a gate. Explain errors and refer external
needs for assessment. Never present placeholders as real business facts.
