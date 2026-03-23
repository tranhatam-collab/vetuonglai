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
- `src/data/courses.json`: EDU catalog and course detail data
- `src/shared/style.css`: shared design system for all subdomains
- `src/shared/app.js`: shared UI helpers
- `scripts/build.mjs`: generates deployable static output into `dist/`
- `cloudflare/pages-projects.json`: live Pages project and domain mapping
- `scripts/cloudflare-sync.mjs`: ensures Pages projects and custom domains exist
- `scripts/deploy-pages.mjs`: deploys each generated site root to Cloudflare Pages

## Build

```bash
npm run build
npm run check
npm run cloudflare:sync
npm run cloudflare:deploy
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
- GitHub Actions workflow lives at `.github/workflows/deploy-pages.yml` and expects `CLOUDFLARE_API_TOKEN`.

## Deploy Mapping

- `dist/vetuonglai.com` -> `vetuonglai.com` and `www.vetuonglai.com`
- `dist/vc.vetuonglai.com` -> `vc.vetuonglai.com`
- `dist/edu.vetuonglai.com` -> `edu.vetuonglai.com`
- `dist/green.vetuonglai.com` -> `green.vetuonglai.com`
- `dist/finance.vetuonglai.com` -> `finance.vetuonglai.com`
- `dist/life.vetuonglai.com` -> `life.vetuonglai.com`
- `dist/invest.vetuonglai.com` -> `invest.vetuonglai.com`
