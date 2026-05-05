# HUMAN_TEXT_CHARACTER_AND_RESPONSE_PROTOCOL

Status: APPROVED AS WEB TEXT, SEO, QA, AND REPORTING GATE
Scope: `vetuonglai-system` public web surfaces only
Universal parent: `../../UNIVERSAL_WEB_HUMAN_TEXT_SEO_QA_GATE_PROTOCOL_2026.md`
Applies to: DEV, FE, Content, SEO, QA, PM, Founder
Does not apply to: backend logic, payment logic, invoice routing, legal mapping, authentication, database schema, user data, or production authorization

## 0. Purpose

This protocol turns visible text into a release gate.

It implements the workspace-level universal web human text, SEO, QA, and reporting gate for `vetuonglai-system`.

A page is not web-ready only because the layout renders correctly.
A page becomes web-ready only when:

- character hygiene passes
- heading structure passes
- language quality passes
- SEO metadata exists
- accessibility basics pass
- rendered page evidence exists
- true state is clear
- release evidence exists if someone claims release-ready

## 1. Where this protocol applies

This protocol applies to:

- H1, H2, H3
- buttons and CTA labels
- menus
- form labels
- error and empty states
- meta title
- meta description
- Open Graph title and description
- canonical and hreflang review outputs
- alt text
- footer copy
- legal note copy
- trust and disclosure statements
- QA reports
- release notes
- handoff files
- team commands

## 2. What this protocol does not authorize

This protocol does not authorize:

- backend changes
- payment changes
- invoice routing changes
- legal entity mapping changes
- authentication changes
- database schema changes
- user data changes
- production release by itself

If a text issue requires code or infrastructure work, create a separate technical work order.

## 3. Character hygiene rule

Final public text, metadata, reports, and handoff copy must avoid decorative writing patterns that make the product feel synthetic, inflated, or untrustworthy.

Default forbidden patterns in final human-facing text:

- decorative arrows
- emoji
- decorative stars or symbols
- fake urgency markers
- decorative Unicode dashes used as styling

Allowed:

- plain punctuation
- ordinary ASCII hyphen in normal prose where needed
- standard Vietnamese diacritics
- technical tokens where the token is required by a standard

## 4. Technical token exception

Technical identifiers may keep required characters when they are part of a standard, route, API field, schema, protocol, file name, package name, or legal source reference.

Examples that must not be rewritten just for hygiene:

- `og:image`
- `application/ld+json`
- `x-default`
- `font-display`
- `JSON-LD`
- `hreflang`
- `webhook`
- `tokenURI`
- `EIP-712`
- `ERC-721`

Review the public explanation around those tokens, not the token itself.

## 5. Heading standard

Every public page must satisfy:

- one H1 only
- H2 and H3 hierarchy must be valid
- H1 must describe the real role of the page
- no hidden completion claim in headings

## 6. SEO text gate

Every public page must satisfy:

- meta title exists
- meta description exists
- canonical exists
- OG title exists
- OG description exists
- OG image exists
- alt text exists for meaningful images
- visible copy matches the page language
- title and description are human-readable
- no decorative symbols in SEO text

## 7. Language gate

Required:

- Vietnamese diacritics must be correct
- English must read naturally, not as literal translation
- public copy must not sound auto-generated
- public copy must not overclaim product state

This gate is scan plus human review, not scan only.

## 8. True state gate

Pages and reports must declare true state precisely.

Use explicit states such as:

- `WEB_COPY_DRAFT`
- `WEB_COPY_PASS`
- `CHARACTER_HYGIENE_FAIL`
- `H_STANDARD_FAIL`
- `SEO_METADATA_INCOMPLETE`
- `SEO_READY_PENDING_QA`
- `A11Y_READY_PENDING_QA`
- `RELEASE_READY_PENDING_EVIDENCE`
- `WEB_READY`

Avoid vague status words such as:

- gần xong
- ổn rồi
- looks good
- ready tạm
- đã ok

## 9. Report shape

Every web report must contain:

- `Verdict:`
- `Evidence checked:`
- `Pass:`
- `Fail:`
- `Blocked by Founder:`
- `Blocked by external asset:`
- `True state:`
- `Team command:`
- `Hard stop:`

## 10. Definition of done for a page

A page can only be called complete when all are true:

- one H1 only
- H2 and H3 hierarchy valid
- no forbidden decorative characters in final text
- Vietnamese diacritics correct
- English copy natural
- meta title exists
- meta description exists
- canonical exists
- OG title exists
- OG description exists
- OG image exists
- alt text exists for meaningful images
- true state declared
- QA evidence attached

## 11. Web implementation boundary

This protocol applies to visible text, SEO metadata, public HTML text, content source, CMS exports, QA reports, release notes, and team commands.

It does not authorize changes to backend logic, payment logic, invoice routing, legal entity mapping, authentication, database schema, user data, or production deployment.

If a text issue requires code change, create a separate technical work order.

## 12. Team command

TEAM COMMAND:

Action:
Apply HUMAN_TEXT_CHARACTER_AND_RESPONSE_PROTOCOL as a mandatory gate for all web copy, SEO metadata, public page reports, QA reports, release notes, and team handoff files.

Allowed files:

- content registry
- SEO registry
- UI copy registry
- public page copy
- metadata files
- CMS export
- HTML text
- markdown docs
- QA reports
- release evidence
- sitemap review reports
- robots review reports
- image alt text inventory

Forbidden actions:

- do not change backend logic
- do not change payment logic
- do not change invoice routing
- do not change legal mapping
- do not change authentication
- do not change database schema
- do not deploy production by text gate alone
- do not rewrite technical tokens blindly
- do not claim ready without evidence

Required evidence:

- character hygiene result
- H standard result
- SEO metadata result
- rendered page check
- language check
- true state
- team command
- release evidence if claiming release-ready

Stop condition:

If any page has forbidden characters in final text, broken H hierarchy, missing H1, missing title, missing description, missing canonical, missing OG image, missing important alt text, or unclear true state, do not call it web-ready.

## 13. Inventory requirement

The next required report format is URL-by-URL inventory with columns:

- URL
- page role
- H1 status
- character hygiene
- SEO metadata
- canonical
- OG image
- alt text
- language
- true state
- next action

## 14. Hard stop

Do not call any page ready only because the UI renders correctly.

Web-ready requires all of:

- character hygiene pass
- H standard pass
- language pass
- SEO pass
- accessibility basic pass
- rendered page evidence
- true state
- release evidence when release-ready is claimed
