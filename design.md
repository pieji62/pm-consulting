# Static website design

## Use and authority

This guide travels with the site and does not depend on developer documentation.
It describes the template baseline rather than owner-approved decisions. Read
[AGENTS.md](AGENTS.md) and the current revision in .workshop/state.json before
adapting the site. Approved requirements and proposal determine identity, pages,
languages and content. Markdown records decisions but never grants approval.

The ungenerated template has no approved state. In a generated site, record
confirmed decisions below and leave unknown facts marked pending.

## Implemented visual baseline

### PM Consulting implementation

Language selector update: requirements and proposal revision 3 approved. Both English and Español are visible together in a labeled group; the current language has a navy background and aria-current. Each static link opens the corresponding page, including when using the keyboard. Browser checks exercise both visible labels, exactly one current language, current-page links and switching between equivalent translations. Content, typography and other page composition follow the existing approved design.

Requirements and proposal revision 1 are recorded in .workshop/state.json. The following confirmed decisions supersede the template values below:

- Audience: universities and companies; purpose: present consulting, training and professional experience.
- Identity: PM Consulting in English and PM Consultores Internacionales in Spanish. Owner supplied the logo for this website; separate authorship and licensing documentation remains for human review.
- Palette: navy #061f3b and #102b46, cream #f8f5ed, gold #986314 for accents, and muted text #4d5d6b. Georgia headings and system UI text use local fonts.
- Layout: text and logo in a two-column hero, followed by three related-page cards; one-column mobile layout. Primary action leads to Services or Experience.
- Assets: original supplied logo preserved in source-assets/pm-logo.png; web delivery uses public/pm-logo.webp, compressed without cropping or redesign. No other images or remote resources.
- Pages: four English pages and four Spanish equivalents, with localized navigation, document language, skip links and equivalent-page language switching. Bilingual text was included in the approved requirements.
- Contact: only Colombia, United States, Ecuador and Romania, described as countries of professional experience. Public email and phone are intentionally deferred.
- Files: src/layouts/Layout.astro, src/pages/[...slug].astro and src/styles/global.css adapt the approved template. public/favicon.svg uses PM initials. src/data/site.json retains the controller-generated approved content.
- Browser verification retains checks across all routes and sizes and adds equivalent-page language switching and localized keyboard skip navigation.

The following table documents the original template for reference, not the current PM palette.

The implementation source is src/styles/global.css. These values describe the
initial template; update the table after applying a different approved design.

| Element | Initial value and purpose |
| --- | --- |
| Typography | System fonts: system-ui, Segoe UI and fallbacks; no font download |
| Text and primary action | #173f35 |
| Background | #f6f4ed |
| Secondary text | #43564e |
| Link focus | #a84b1a outline, 3 px thick with 6 px offset |
| Cards | #efeee5 background, #bdc8bd border |
| Decoration | Peach #e6b28b, green #315f4e, yellow #f8e5b0 |
| Container | Maximum 1180 px; available width minus 40 px |
| Main heading | clamp(2.6rem,6vw,5.6rem), maximum width approximately 12 characters |
| Introductory text | 1.12 rem; maximum width approximately 46 characters |
| Responsive layout | One column; from 800 px, two-column hero and card grid |

These are starting values, not a contrast guarantee for every combination. Review
each change in context and with zoom; avoid forcing text into fixed heights.
Keep spacing and margins coherent when adding sections.

## Structure and components

- src/layouts/Layout.astro: language, title, description, favicon, skip link,
  header, navigation, main region and contact footer.
- src/pages/[...slug].astro: data-defined routes, one h1 per page, introduction,
  action link and cards linking to other pages.
- The CSS illustration is decorative (aria-hidden) and carries no essential
  information. The initial brand symbol is not an approved logo.
- src/pages/404.astro: missing-page response and return-home link.
- src/data/site.json: public content matching the approved revision.

Check that each primary action has suitable wording and destination. Generic
composition does not establish the business's commercial intent. Never invent
testimonials, metrics, services, certifications or legal text.

## Accessibility, responsiveness and assets

Use semantic HTML, coherent headings, understandable navigation and visible focus.
Preserve skip navigation and current-page state. Check keyboard use, zoom, long
text and overflow. Tests cover widths of 375, 768 and 1440 px; also review intermediate
sizes and the 800 px breakpoint. Identify states with text as well as color and
respect reduced-motion preferences.

Informative images need useful alternative text, dimensions and compression.
Decorative images need empty alternatives or appropriate accessibility exclusion.
Use local files with confirmed rights. Do not load external fonts, images, embeds
or scripts. Current automated budgets allow at most 500 KB per file and 3 MB total;
the workshop procedure asks for margin below those limits. These are not real-world
performance metrics or WCAG certification.

Do not add forms, analytics, visitor scripts, accounts or data processing.
HTTPS navigation links need manual destination review. Preserve the protections
in public/staticwebapp.config.json.

## Site decision record

Complete this table from the approved revision when adapting a site:

| Decision | Initial status |
| --- | --- |
| Requirements/proposal revision consulted | Pending; read .workshop/state.json |
| Audience, objective and primary action | Pending owner confirmation |
| Identity, palette and typography | Template baseline; adaptation pending |
| Images, authorship and usage rights | Pending; never assume rights |
| Languages and reviewed translations | Follow approved requirements; record human review |
| Reason and files for each visual change | Record when implementing approved work |

Keep passwords, private data and duplicate approvals out of this document.
Visual, content and scope changes follow discovery, classification and approvals
of the new revision before implementation.

## Acceptance criteria

Check requirements alignment, navigation/404, small and large layouts, keyboard,
focus, metadata, language, rights and real content. Run npm run verify from the
site folder and read evidence/report.md. Editing this document or any other source
changes the fingerprint and requires new verification.

Distinguish passed, failed and not-executed results. Axe/Chromium do not cover every
assistive technology or browser; human review, external links and actual devices/
networks remain necessary. Read [guides](docs/en/README.md) and [AGENTS.md](AGENTS.md)
for maintenance and authorized publication.
