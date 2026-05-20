# CLAUDE.md — Project Memory Index

> Auto-loaded by Claude Code when working in this repo. Keep this **short** —
> long-form memory lives in `docs/internal/AUTONOMOUS_DEV_HANDOFF_*.md`.
>
> Last refresh: 2026-05-20 · Master roadmap completion: **~91%** (89% autonomous ceiling; email pipeline ✅)

---

## What this repo is

**`vetuonglai-system`** = the production codebase for **vetuonglai.com** (Vietnamese platform "Về Tương Lai") and its 16 subdomains. Single repo, multi-site, deployed via Cloudflare Workers + Pages.

This is NOT `tramsaigon-home` / `tranhatam-home` / `iai.one` / `aiaccountingloop.com` — those are sibling projects in `/Users/tranhatam/Documents/Devnewproject/` but unrelated. Don't reference them from here.

## 16 subdomain map (locked accent colors)

| Key | Host | Accent | Pillar |
|---|---|---|---|
| hub | vetuonglai.com | cyan #22D3EE | Root / system map |
| vc | vc.vetuonglai.com | indigo #6366F1 | Trust / verification |
| edu | edu.vetuonglai.com | cyan #22D3EE | Learning |
| member | member.vetuonglai.com | violet #818CF8 | Identity / dashboard |
| finance | finance.vetuonglai.com | gold #FACC15 | Value |
| invest | invest.vetuonglai.com | violet #818CF8 | Value |
| green | green.vetuonglai.com | emerald #34D399 | Earth |
| life | life.vetuonglai.com | mint #4ADE80 | Life |
| work | work.vetuonglai.com | orange #FB923C | Mission |
| market | market.vetuonglai.com | pink #F472B6 | Value |
| community | community.vetuonglai.com | coral #FB7185 | Stories |
| ai | ai.vetuonglai.com | violet #818CF8 | AI assist |
| business | business.vetuonglai.com | deep-violet #7C3AED | Mission |
| read | read.vetuonglai.com | amber #B45309 | Learning |
| docs | docs.vetuonglai.com | slate #475569 | Trust |
| kids | kids.vetuonglai.com | warm-yellow #F59E0B | Life (isolated) |

Source of truth: `src/shared/design-tokens.css` + `Brandpro-all/forks/vetuonglai.com/country-packs/_MASTER-SUBDOMAIN-MATRIX.md`.

## Cloudflare account (production)

```bash
export CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e  # Anhhatam@gmail.com's Account
export ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7
```

Workers deployed: `vetuonglai-{home, vc, edu-github, member, green, finance, kids}`. `vetuonglai-home` + `vetuonglai-member` have email pipeline live (Mailgun via generic-worker). Other subdomains (community, work, read, etc.) deploy via Cloudflare Pages.

Required secrets on home/vc/member: `SESSION_COOKIE_SECRET`, `WALLET_ADDRESS_SECRET` (deterministic — NEVER rotate), `WALLET_INTERNAL_TOKEN`, `MAGIC_LINK_SIGNING_KEY` (home+member), `PAY_IAI_ONE_*` (home+member), `VC_*` (vc only).
Email pipeline (home+member): `MAIL_API_KEY`, `MAIL_API_BASE_URL`, `MAIL_API_WORKSPACE_ID` (set 2026-05-20, smoke-tested ✅).
KV binding `ACCESS_KV_NAMESPACE` on all three.

## Deploy commands

```bash
# Build (auto-runs postbuild + pagefind index)
npm run build

# Deploy 1 worker
node scripts/deploy-workers.mjs --worker home
node scripts/deploy-workers.mjs --worker vc
node scripts/deploy-workers.mjs --worker member
# etc — keys: home, vc, edu, member, green, finance, kids

# Deploy 1 Pages project
node scripts/deploy-pages.mjs --project community
# keys: hub, vc, edu, green, finance, life, invest, work, market, community, ai, business, read, docs
```

If wrangler errors `CLOUDFLARE_API_TOKEN required`, run `npx wrangler login` first.

## Runtime architecture

7 lightweight runtime libs at `workers/lib/*-runtime.mjs` all wire into both
`workers/generic-worker.mjs` (home/edu/member/etc.) and `workers/vc-worker.mjs`
(adds CORS for `*.vetuonglai.com`):

- `access-runtime.mjs` — magic link, session, payment webhooks, `/api/access/*`
- `wallet-runtime.mjs` — `/api/wallet/*` ledger, deterministic Bech32 `vtl1…` address
- `community-runtime.mjs` — posts/comments/reactions, 7 circles
- `jobs-runtime.mjs` — listings, applications, escrow ↔ wallet
- `affiliate-runtime.mjs` — codes, `/r/{code}` track, conversion
- `analytics-runtime.mjs` — event ingest, daily aggregate
- `notify-runtime.mjs` — template rendering, inbox queue
- `admin-cms-runtime.mjs` — founder-gated CRUD with revisions
- `vc-ownership-runtime.mjs` + `founder-runtime.mjs` (legacy, still active)

All share `runtime-helpers.mjs` (session reader, KV store, jsonResponse, etc.).

Storage: single KV namespace, prefix-keyed (`wallets:`, `community_post:`, `job_listing:`, `affiliate_code:`, `analytics_event:`, `notify_message:`, `cms_content:`, etc.).

## Build pipeline

`scripts/build.mjs` renders 16 subdomain dist trees from `src/` (data JSON + static-pages + shared design tokens). Postbuild chain: human-text sanitize → Pagefind index (hub/docs/read/edu).

`copyStaticTreeForDomain(domain)` copies `src/static-pages/<domain>/*` into `dist/<domain>/` — extend by adding HTML files there, no build code change needed.

Shared brand assets at `src/static-pages/shared-assets/{brand,web,icons}/` auto-copy to every domain's `assets/`.

## Brand v2 (Founder-approved)

Source: `files/brand/vetuonglai-brand-kit-final-v2/` (224 assets).
Logo set in `src/static-pages/shared-assets/brand/` — primary/dark/mono/monogram/favicon (SVG+PNG+ICO).
16 per-subdomain OG cards + favicons + hero banners under `shared-assets/web/`.
30 icons under `shared-assets/icons/`.

V3 zip exists at `files/brand/vetuonglai-brand-kit-final-v3.zip` — not yet adopted, V2 remains source of truth.

Brand fork (canonical decisions, sibling repo): `../Brandpro-all/forks/vetuonglai.com/` — contains 5 filled inputs, master subdomain matrix, Canva design library, prompt library.

## Voice rules (DO NOT violate)

5 voice attributes: **Thật · Ấm · Thực tế · Tỉnh thức · Có chủ đích**.

**Never** use: "giàu nhanh", "đột phá", "cam kết 100%", "top 1", "độc quyền", "thần tốc", "chỉ còn N slot", fake countdown, third-party ads, claim guaranteed income, dark patterns.

Disclaimers required: Finance pages → "Không phải lời khuyên tài chính." · Edu pages → "Không thay thế giáo dục chính quy." · Invest pages → "Mọi khoản đầu tư có rủi ro mất vốn."

## Active work pattern (autonomous loop)

Tick-based dev via CronCreate `*/19 * * * *` recurring. Each tick:
1. Read `docs/internal/BLOCKERS_NEED_USER_INPUT.md` for next-tick queue
2. Spawn 2 general-purpose agents in parallel if tasks are independent
3. Build → deploy (workers and/or Pages) → commit
4. Update BLOCKERS doc + Loop progress tracker
5. Stop when cum% ≥ 95

When resuming in a new session, paste `docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-18.md` (latest) and CronCreate again.

## Gotchas

1. Linter often minifies `dist/vc.vetuonglai.com/wallet/index.html` and a few other HTML files between turns — don't revert; build regenerates from src.
2. macOS Finder duplicates (`file 2.svg`, `index 3.html`) silently appear in `dist/` and can hang asset uploads → `find dist -name "* [2-4]*" -delete` before deploy.
3. Wrangler 4.x dropped `--kv-namespace` flag — `deploy-workers.mjs` already works around with a temp `wrangler.jsonc`. Don't try to add the flag back.
4. `WALLET_ADDRESS_SECRET` is HMAC seed for deterministic addresses → rotating it invalidates every existing wallet. **Never rotate.**
5. Cookie domain is `.vetuonglai.com` (dot-prefixed) so all subdomains share `vtl_session`. Don't change.

## External blockers (10% to 100%)

Listed in `docs/internal/BLOCKERS_NEED_USER_INPUT.md` section 10. Items requiring Founder action: KYC provider key, PayPal/Stripe production secrets, bank disbursement contract, Anthropic API key (EDU AI tutor), VC issuer pool, App Store/Play submission, TM filing.

✅ **Resolved 2026-05-20**: Email provider (Mailgun via generic-worker) — secrets set, `message_idempotency_key` bug fixed, smoke test passed (internal notification + external ack).

Cap on autonomous dev = ~89% until Founder unblocks ≥ 5 of remaining 7.

## Reference docs (long-form memory)

- `docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-17.md` — full state snapshot day 1
- `docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-18.md` — full state snapshot day 2 (89% mark)
- `docs/internal/BLOCKERS_NEED_USER_INPUT.md` — live progress + blocker list
- `docs/internal/BRAND_PROMPT_LIBRARY_POINTER.md` — pointer to Brandpro fork
- `docs/internal/LOCAL_DEV_EXECUTION_PROTOCOL_2026.md` — runbook
- `../Brandpro-all/forks/vetuonglai.com/PROMPT-LIBRARY.md` — 150 design asset prompts

## Sibling Devnewproject repos (do NOT touch from here)

`/Users/tranhatam/Documents/Devnewproject/` has multiple unrelated repos:
- `aiaccountingloop.com`, `docs.iai.one`, `flow.iai.one`, `home.iai.one`,
  `Life-Code-OS-team-dev`, `iai-platform-worktree.corrupt-archive-20260428`, etc.

If a task references those, switch project — don't cross-contaminate.
