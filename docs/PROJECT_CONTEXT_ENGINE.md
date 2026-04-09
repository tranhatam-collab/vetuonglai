# PROJECT_CONTEXT_ENGINE

Version: 1.1
Last updated: 2026-04-09
Status: active operational truth

## Purpose

This file is the operational context engine for AI agents, engineers, and execution leads working inside the `*.vetuonglai.com` system.

Read this before proposing, editing, or shipping anything.

If this file conflicts with older chat memory or older informal notes, follow this file and then verify against the latest source-of-truth docs and runtime truth files.

## Mandatory instruction for AI

Follow `docs/PROJECT_CONTEXT_ENGINE.md` strictly.

Do not treat this project like:

- a generic LMS
- a generic startup landing page
- a cheap MMO / affiliate farm
- an AI-content publishing machine
- a fake success / FOMO funnel

Treat this project as a human life system with a proof-based economy and a trust layer.

## Project identity

Project name: Vetuonglai / Ve Tuong Lai

Core line:

- Song that
- Lam that
- Tuong lai that

System definition:

- a human-centered ecosystem
- AI-assisted, not AI-first in a soulless way
- proof-driven, not hype-driven
- designed to help people learn, work, prove, earn, and grow with dignity

The system exists to solve:

- lack of proof for real ability
- lack of safe environments to practice real work
- lack of a path from capability to sustainable income

## What the system is

At the strategic level, the system is a proof-based economy:

`EDU -> WORK / PROJECT -> VC PROOF -> EARNING / MARKET -> COMMUNITY / STORIES -> MENTOR / PARTNER`

At the runtime level today, the repo is a static multi-site system that builds and verifies multiple domains for Vetuonglai.

## Core principles

- Human-centered first.
- Real outputs over empty learning.
- Real trust over marketing claims.
- Sustainable growth over fast-win promises.
- Domain roles must stay separate and clear.
- Every domain should have one primary mission.
- Runtime truth overrides assumptions about what is actually live.

## Source of truth hierarchy

Use this order when making decisions:

1. `docs/PROJECT_CONTEXT_ENGINE.md`
2. `docs/final-lock/VTL_00_FINAL_LOCK_INDEX_2026-04-09.md`
3. `docs/final-lock/VTL_01_SYSTEM_VALUE_MAP_FINAL.md`
4. `docs/final-lock/VTL_02_RUNTIME_TRUTH_AND_DOMAIN_MATRIX_FINAL.md`
5. `docs/final-lock/VTL_03_ACCESS_PRICING_AND_ENTITLEMENT_FINAL.md`
6. `docs/final-lock/VTL_04_CONTENT_GATE_SEO_AND_COPY_RULES_FINAL.md`
7. `docs/final-lock/VTL_05_SPECIALIST_PACKS_AND_AFFILIATE_FINAL.md`
8. `docs/final-lock/VTL_06_EXECUTION_WORKSTREAMS_AND_DEPENDENCIES_FINAL.md`
9. `docs/final-lock/VTL_07_TEAM_SPLIT_WORKLOAD_AND_PROMPTS_FINAL.md`
10. `docs/final-lock/VTL_08_FOUNDER_UPDATE_CHANGELOG_2026-04-09.md`
11. `VETUONGLAI_MASTER_HANDOFF_INDEX.md`
12. `VETUONGLAI_MASTER_VISION_AND_POSITIONING.md`
13. `VETUONGLAI_ECOSYSTEM_ARCHITECTURE.md`
14. `VETUONGLAI_DOMAIN_ROLE_MATRIX.md`
15. `VETUONGLAI_MASTER_SYSTEM_UPGRADE_2026_04.md`
16. `VETUONGLAI_NORTH_STAR_VISION_2026.md`
17. `VETUONGLAI_SUBDOMAIN_MISSION_AND_SEO_MASTER.md`
18. `VETUONGLAI_RUNTIME_TRUTH_AND_QA.md`
19. `cloudflare/domain-runtime-truth.json`

## Founder Final Lock 2026-04-09

The repo now carries a final planning lock under `docs/final-lock/`.

Use it to resolve all product-level questions about:

- annual access pricing
- specialist packs
- affiliate activation
- homepage vs subdomain commerce roles
- mandatory planning-before-dev rules

The older `Gateway System (V2.1)` docs remain historical references only.

## Gateway System (V2.1)

New operational docs for the 2 USD lifetime unlock gateway:

- `15_paywall_unlock_strategy.md`
- `16_homepage_teaser_system.md`
- `17_demo_kit_all_subdomains.md`
- `18_payment_magiclink_integration.md`
- `19_seo_teaser_guideline.md`
- `20_branding_message_paywall.md`
- `21_dev_sync_update_v2.md`
- `22_launch_paywall_roadmap.md`

Important:

- these docs are no longer the final product truth
- they may still help as technical reference
- they must be reconciled against `docs/final-lock/` before use

## DEV Gateway Files

The repo now also carries three dev-complete gateway files:

- `DEV_FILE_01_TECH_ARCHITECTURE_AND_DATABASE.md`
- `DEV_FILE_02_GATEWAY_SYSTEM_AND_FRONTEND.md`
- `DEV_FILE_03_ROUTING_SEO_AND_DEPLOYMENT.md`

Important:

- strategy docs can describe target architecture
- runtime truth files describe what is actually live, preview, or planned
- do not silently convert planned architecture into runtime reality

## Current runtime reality

Verified in repo from `cloudflare/domain-runtime-truth.json` and build/check scripts.

Currently live and required public:

- `vetuonglai.com`
- `vc.vetuonglai.com`
- `edu.vetuonglai.com`
- `green.vetuonglai.com`
- `finance.vetuonglai.com`

Currently planned public, not required public:

- `life.vetuonglai.com`
- `invest.vetuonglai.com`

Not yet present in runtime truth as public domains even if described in strategic docs:

- `member.`
- `work.`
- `market.`
- `community.`
- `stories.`
- `tools.`
- `admin.`
- `api.`
- `affiliate.`
- `blog.`
- `ai.`
- `live.`

## Current implementation reality

Current build system:

- `scripts/build.mjs` generates the static multi-site output
- `scripts/check.mjs` validates required outputs and content assertions
- output goes to `dist/`

Currently implemented in code:

- hub root pages under `vetuonglai.com`
- VC registry pages and sample records
- EDU catalog, course pages, player routes, API JSON, health endpoint
- GREEN, FINANCE, LIFE, INVEST landing pages
- shared design tokens wired into runtime output

Current hub route expansion already present:

- `/ve-chung-toi/`
- `/he-sinh-thai/`
- `/bat-dau/`
- `/thanh-vien/`
- `/tin-tuc/`
- `/lien-he/`
- `/sitemap/`

Not yet implemented in code, despite being part of the planned direction:

- domain registry for `member`, `work`, `market`, `community`, `tools`, `admin`, `api`, and similar expansions
- canonical/source-owner/robots support in the main page shell
- global footer backlinks across the ecosystem
- cross-domain internal-link rules enforced in generated output
- route skeletons for `member`, `work`, `market`, expanded `vc`

## Known issues

- `npm run check` has shown transient `ENOENT` failures when executed immediately after `npm run build`.
- Re-running `npm run check` has passed afterward.
- This is a real repo issue and should be treated as a known verification instability until root-caused.

## Strategic map vs runtime map

Never confuse these two layers.

Strategic map:

- describes the full intended ecosystem and future domain layout
- includes layers like member, work, market, community, tools, admin, api

Runtime map:

- describes what the generated system and deployment truth actually serve now
- must be validated via build output, checks, and Cloudflare runtime truth

Rule:

- if a domain or route is not in runtime truth or generated output, treat it as planned, preview, or internal design work only

## Domain role rules

Each domain must have one primary mission.

Required behavior:

- no duplicate purpose between domains
- no near-identical homepage promises on different hosts
- no content duplication without canonical ownership
- cross-links must reinforce the system map, not blur it

Canonical ownership rule:

- every primary piece of content should have one source owner
- previews, mirrors, and summaries must point back to the source owner
- if a page exists mainly to route users elsewhere, say that clearly

## Priority now

Immediate execution priority:

1. Keep the docs and runtime aligned.
2. Preserve the current build/check pipeline.
3. Expand the system only where there is a clear owner and mission.
4. Add missing operational structure for AI/dev execution.

Next implementation priorities already identified:

1. Add canonical, source-owner, and robots controls in page generation.
2. Standardize internal-link patterns and ecosystem footer backlinks.
3. Add route skeletons for `member`, `work`, `market`, and expanded `vc` pages.
4. Update checks to cover those routes once implemented.

## Working rules for AI and engineers

- Read the source-of-truth hierarchy before editing.
- Verify the current code state before assuming a feature exists.
- Prefer the smallest correct change.
- Do not write marketing fluff into product code or docs.
- Do not introduce a new domain without a single clear mission.
- Do not duplicate content across domains without canonical ownership.
- Do not describe planned domains as live.
- Do not weaken the VC trust layer with vague proof language.
- Do not turn EDU into a passive catalog or old-style LMS.
- Do not turn the ecosystem into a generic link hub with no operating logic.

## Task memory

Recently completed:

- locked a large V2 source-of-truth doc set for strategy, product, ops, legal, content, design, and investor alignment
- expanded the hub runtime with additional system pages
- shipped EDU player runtime at pilot level with local proof/progress flow
- wired runtime design tokens into generated output
- maintained build/check scripts and runtime verification flow

Recently requested but not yet completed before this file:

- create this `docs/PROJECT_CONTEXT_ENGINE.md` file
- standardize internal-link and footer backlink patterns
- add canonical/source-owner rules in runtime shell
- add new route skeletons for upcoming ecosystem domains
- perform a fuller plan risk audit

## Active files to check first

- `docs/PROJECT_CONTEXT_ENGINE.md`
- `VETUONGLAI_MASTER_HANDOFF_INDEX.md`
- `VETUONGLAI_MASTER_SYSTEM_UPGRADE_2026_04.md`
- `VETUONGLAI_NORTH_STAR_VISION_2026.md`
- `cloudflare/domain-runtime-truth.json`
- `scripts/build.mjs`
- `scripts/check.mjs`
- `src/data/apps.json`
- `src/data/system.json`

## Current prompt mode

Default operating mode:

- act, do not just brainstorm
- inspect code before changing code
- finish the task end-to-end when feasible
- verify changes with the existing repo commands
- keep docs and runtime in sync

## Changelog snapshot

- `24d52de` - stabilize P0 runtime and integrate domain design tokens
- `cf8ddc4` - sync ecosystem copy and add EDU course player AI specs
- `e867a5d` - ship EDU course player runtime and admin journey specs
- `b5db9bf` - lock V2 source of truth and domain direction

## Quick start for AI

When starting a new task:

1. Read this file.
2. Read the handoff index.
3. Check runtime truth and the relevant build files.
4. Distinguish live vs planned before making changes.
5. Make the smallest correct edit.
6. Run `npm run build` and `npm run check` when the task affects runtime output.
7. If checks fail because of the known transient issue, re-run once and then report the result clearly.

## Update instruction

Update this file when any of the following changes:

- source-of-truth hierarchy changes
- runtime live/preview/planned state changes
- next priorities change
- new domains move from planned to implemented
- known issues materially change
- the expected AI working mode changes

Keep updates factual. This file is for operating context, not storytelling.
