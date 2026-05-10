# Vetuonglai System

Static multi-site codebase for:

- `vetuonglai.com`
- `vc.vetuonglai.com`
- `edu.vetuonglai.com`
- `green.vetuonglai.com`
- `finance.vetuonglai.com`
- `life.vetuonglai.com`
- `invest.vetuonglai.com`

## Structure

- `src/data/apps.json`: app registry exposed by hub
- `src/data/certificates.json`: sample verification records for VC
- `src/data/system.json`: V1.0 manifest, release metadata, and NFT bridge mapping
- `src/data/courses.json`: EDU catalog and course detail data
- `src/shared/style.css`: shared design system for all subdomains
- `src/shared/app.js`: shared UI helpers
- `scripts/build.mjs`: generates deployable static output into `dist/`
- `cloudflare/pages-projects.json`: live Pages project and domain mapping
- `cloudflare/workers-projects.json`: live Workers route mapping for domains that are already fronted by Workers
- `scripts/cloudflare-sync.mjs`: ensures Pages projects and custom domains exist
- `scripts/deploy-pages.mjs`: deploys each generated site root to Cloudflare Pages
- `scripts/deploy-workers.mjs`: updates the live Worker scripts that currently front the Vetuonglai domains

## Human Text Web Gate

Before any public page, SEO metadata, QA report, release note, or handoff can be called web-ready, read:

- `../UNIVERSAL_WEB_HUMAN_TEXT_SEO_QA_GATE_PROTOCOL_2026.md`
- `docs/web-governance/HUMAN_TEXT_CHARACTER_AND_RESPONSE_PROTOCOL.md`
- `docs/final-lock/VTL_72_HUMAN_TEXT_WEB_GATE_ADOPTION_2026-05-05.md`

Run:

```bash
npm run verify:human-text:web
```

This gate is for visible text, SEO, QA, and reporting. It does not authorize backend, payment, invoice routing, legal mapping, auth, database, user data, secret, or production deployment changes.

## Build

```bash
npm run build
npm run check
npm run cloudflare:sync
npm run cloudflare:deploy
npm run cloudflare:deploy:workers
```

## Preview

Each subdomain is generated as its own root inside `dist/`.

```bash
npm run preview:hub
npm run preview:vc
npm run preview:edu
npm run preview:green
npm run preview:finance
npm run preview:life
npm run preview:invest
```

`npm run check` verifies the deploy artifacts, VC rewrite file, EDU health/catalog output, and generated course detail pages.

## Cloudflare

- Account target is configured in `cloudflare/pages-projects.json`.
- Existing live projects reused:
  - `vetuonglai-landing`
  - `vetuonglai-vc`
  - `vetuonglai-edu`
- New subdomain projects are provisioned on demand by `npm run cloudflare:sync`.
- Current live traffic for `vetuonglai.com`, `vc.vetuonglai.com`, `edu.vetuonglai.com`, `green.vetuonglai.com`, and `finance.vetuonglai.com` is still fronted by Worker routes, so `npm run cloudflare:deploy:workers` is the decisive live-update step.
- GitHub Actions workflow lives at `.github/workflows/deploy-pages.yml` and expects `CLOUDFLARE_API_TOKEN`.

## Team 1 Ops Runbook

For Wave D DNS rollout and account-migration runtime checks, use the npm wrappers below (instead of calling scripts directly):

```bash
# Wave D DNS setup
npm run ops:wave-d:dns:dry-run
npm run ops:wave-d:dns

# Zone + runtime readiness check
npm run ops:zone:verify
npm run ops:zone:verify:verbose

# Worker secret injection
npm run ops:secrets:inject:dry-run
npm run ops:secrets:inject
```

Recommended order:

1. Run `ops:zone:verify:verbose` to confirm current zone status and blockers.
2. Run `ops:secrets:inject` to fill missing required worker secrets.
3. Run `ops:wave-d:dns` when ready to open Wave D DNS records.
4. Re-run `ops:zone:verify` to confirm readiness before live Wave D publish.

## Deploy Mapping

- `dist/vetuonglai.com` -> `vetuonglai.com` and `www.vetuonglai.com`
- `dist/vc.vetuonglai.com` -> `vc.vetuonglai.com`
- `dist/edu.vetuonglai.com` -> `edu.vetuonglai.com`
- `dist/green.vetuonglai.com` -> `green.vetuonglai.com`
- `dist/finance.vetuonglai.com` -> `finance.vetuonglai.com`
- `dist/life.vetuonglai.com` -> `life.vetuonglai.com`
- `dist/invest.vetuonglai.com` -> `invest.vetuonglai.com`

## V1.0 notes

- Hub now exposes `manifest.json` with release metadata for the V1.0 cut.
- `vc.vetuonglai.com` still ships its local certificate registry, but also fetches runtime asset mirrors from `https://nft.iai.one/api/asset-registrations`.
- This keeps VC independent from the operational app while letting NFT/crypto asset records appear on the public verification layer without rebuilding VC for every new registration.
