# VTL_72 Human Text Web Gate Adoption

Status: LOCKED
Date: 2026-05-05
Scope: `vetuonglai-system` only
Universal parent: `../../UNIVERSAL_WEB_HUMAN_TEXT_SEO_QA_GATE_PROTOCOL_2026.md`
Applies to: Team 1, Team 2, Team 3, Team 5, QA, PM, Founder
Does not apply to unrelated sites outside this repo

## Verdict

`HUMAN_TEXT_CHARACTER_AND_RESPONSE_PROTOCOL.md` is approved for immediate adoption in this repo as:

- web text gate
- SEO metadata gate
- QA reporting gate
- release-note and handoff gate

It is not a backend or payment change protocol.

## Mandatory protocol source

- `../../UNIVERSAL_WEB_HUMAN_TEXT_SEO_QA_GATE_PROTOCOL_2026.md`
- `docs/web-governance/HUMAN_TEXT_CHARACTER_AND_RESPONSE_PROTOCOL.md`

## Immediate adoption rules

1. No page is called `WEB_READY` without the human-text gate.
2. No report is called release-ready without evidence.
3. No team may use text gate to justify backend, payment, auth, legal, or database changes.
4. Technical tokens remain untouched when they are required by standards or routes.
5. Human review remains required even when the automated scan passes.

## Gates required before web-ready

- `CHARACTER_HYGIENE_GATE`
- `H_STANDARD_GATE`
- `SEO_TEXT_GATE`
- `TRUE_STATE_GATE`
- `RELEASE_EVIDENCE_GATE`

## Required page checklist

- one H1 only
- valid H2/H3 hierarchy
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

## Required team statuses

- `WEB_COPY_DRAFT`
- `WEB_COPY_PASS`
- `CHARACTER_HYGIENE_FAIL`
- `H_STANDARD_FAIL`
- `SEO_METADATA_INCOMPLETE`
- `SEO_READY_PENDING_QA`
- `A11Y_READY_PENDING_QA`
- `RELEASE_READY_PENDING_EVIDENCE`
- `WEB_READY`

## Report shape

Every web QA or release report in this repo must contain:

- `Verdict:`
- `Evidence checked:`
- `Pass:`
- `Fail:`
- `Blocked by Founder:`
- `Blocked by external asset:`
- `True state:`
- `Team command:`
- `Hard stop:`

## Team command

Team 2:

- apply protocol to visible page text, CTA text, headings, and metadata
- do not rewrite technical tokens blindly

Team 3:

- sign off wording, disclosure language, and true-state wording
- distinguish copy fail from release fail

Team 5:

- enforce the automated gate
- attach URL-by-URL inventory evidence before release claim

Team 1:

- keep gate in build and verification path
- do not treat text gate as deploy authorization by itself

## Hard stop

Do not call any page in this repo web-ready or release-ready if it fails any of:

- character hygiene
- heading structure
- language quality
- SEO metadata presence
- accessibility basics
- rendered evidence
- true-state declaration

## Immediate work order

1. Add automated verifier for the gate.
2. Add URL-by-URL inventory output.
3. Wire the verifier into `verify:qa`.
4. Rebuild the repo.
5. Re-run release verification.
6. Deploy refreshed pages/workers only after verification passes.
