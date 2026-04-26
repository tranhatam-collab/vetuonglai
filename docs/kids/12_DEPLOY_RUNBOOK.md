# 12 — Kids Deploy Runbook

> Step-by-step playbook for taking `kids.vetuonglai.com` from local dist to live.
> Reference: [`docs/00_master/41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md`](../00_master/41_UNIVERSAL_BILINGUAL_LANGUAGE_REBUILD_COMMAND.md), [`docs/00_master/42_BILINGUAL_AUDIT_REPORT.md`](../00_master/42_BILINGUAL_AUDIT_REPORT.md), [`docs/kids/11_DAY_0_LAUNCH_PLAN.md`](11_DAY_0_LAUNCH_PLAN.md).

This runbook gets the **homepage live publicly** with no email, payment, or registration paths exposed. Everything below works against the new Cloudflare account `62d57eaa548617aeecac766e5a1cb98e`.

---

## 0. Owner expectations

| Item | Owner |
| --- | --- |
| DNS record for `kids.vetuonglai.com` | Founder (Cloudflare dashboard) |
| Worker route binding `kids.vetuonglai.com/*` | Founder (Cloudflare dashboard) |
| Local build, audit, deploy command | Dev (this runbook) |
| Child-safety review approval | Founder |
| Post-deploy smoke verification | Dev |

---

## 1. Pre-deploy checklist

### 1.0 One-shot gate (recommended)

```bash
npm run verify:kids:predeploy
```

Runs `build` → `audit:bilingual` → `smoke:kids:worker` in sequence and
exits non-zero on the first failure. If this command exits 0, you can
skip §1.1 and §1.2 — they have already run.

### 1.1 Build is up to date

```bash
node scripts/build.mjs       # or: npm run build
```

Output should end with `[build] kids done` and `[build] all domains done`.

### 1.2 Bilingual audit passes

```bash
node scripts/audit-bilingual.mjs   # or: npm run audit:bilingual
```

Expected: `Audit complete — 0 issues across 52 files.`
If non-zero: read [`docs/00_master/42_BILINGUAL_AUDIT_REPORT.md`](../00_master/42_BILINGUAL_AUDIT_REPORT.md) and fix before deploy.

### 1.2b Worker smoke harness passes

```bash
npm run smoke:kids:worker
```

Expected: `Passed: 30 / Failed: 0`. Imports the worker module locally
and exercises 30 assertions against the kids handlers (curriculum,
contract, 18 stub endpoints, cross-host isolation, www mirror, team4
regression). Catches handler bugs before they reach Cloudflare.

### 1.3 Hub leak check

```bash
grep -rl "kids.vetuonglai" dist/vetuonglai.com dist/member.vetuonglai.com 2>/dev/null
```

Expected: empty (zero results). Hub and member must never link the public-discovery surface.

### 1.4 Static-page inventory

```bash
find dist/kids.vetuonglai.com -type f | sort
```

Expected file set:

```
dist/kids.vetuonglai.com/api/contract.json
dist/kids.vetuonglai.com/api/curriculum.json
dist/kids.vetuonglai.com/api/health
dist/kids.vetuonglai.com/api/registry.json
dist/kids.vetuonglai.com/api/kids/*.stub.json   (15 endpoint stubs)
dist/kids.vetuonglai.com/assets/kids.css
dist/kids.vetuonglai.com/assets/kids.js
dist/kids.vetuonglai.com/index.html
dist/kids.vetuonglai.com/en/index.html
dist/kids.vetuonglai.com/learn/{achievements,ai-helper,dashboard,lessons}/index.html
dist/kids.vetuonglai.com/parent/{dashboard,pricing}/index.html
dist/kids.vetuonglai.com/parent/onboarding/{child-profile,consent}/index.html
dist/kids.vetuonglai.com/parent/support/sessions/index.html
dist/kids.vetuonglai.com/robots.txt
dist/kids.vetuonglai.com/sitemap.xml
```

### 1.5 No commerce surfaces

```bash
grep -E "email|register|sign.?up|subscribe|pay|checkout|stripe|paypal|buy now|purchase" \
  dist/kids.vetuonglai.com/index.html dist/kids.vetuonglai.com/en/index.html
```

Expected: empty. The homepage announces, it does not transact.

---

## 2. DNS + route binding (Cloudflare dashboard, founder action)

1. Open Cloudflare dashboard for account `62d57eaa548617aeecac766e5a1cb98e` → zone `vetuonglai.com`.
2. **DNS** → add record:
   - Type: `CNAME`
   - Name: `kids`
   - Target: leave the proxied target empty for now; it will be set to the worker route on step 3.
   - Proxy: enabled (orange cloud).
3. **Workers & Pages** → Triggers (after worker is deployed, see §3) → Add custom domain → `kids.vetuonglai.com`.
4. Optionally also bind `www.kids.vetuonglai.com` if the founder wants `www.` to resolve.

> If DNS is not ready, the deploy in §3 still succeeds — the worker is created on `*.workers.dev` first; the route binding can be attached later from the dashboard.

---

## 3. Deploy the kids worker

### 3.1 Wrangler login (once per machine)

```bash
npx wrangler login
```

Use the Cloudflare account that owns `62d57eaa548617aeecac766e5a1cb98e`.

### 3.2 Deploy only the kids worker

```bash
node scripts/deploy-workers.mjs --worker=kids
```

What this does:

- Reads `cloudflare/workers-projects.json` and picks the `kids` entry only.
- Verifies `workers/generic-worker.mjs` and `dist/kids.vetuonglai.com/` are present.
- Calls `wrangler deploy workers/generic-worker.mjs --name vetuonglai-kids --assets dist/kids.vetuonglai.com --routes kids.vetuonglai.com/* www.kids.vetuonglai.com/*`.
- The kids worker has no required secrets; the deploy completes without prompting for any.

Expected output:

```
Total Upload: ... KiB / gzip: ... KiB
Uploaded vetuonglai-kids (...) (... sec)
Deployed vetuonglai-kids triggers (...)
  https://kids.vetuonglai.com/*
  https://www.kids.vetuonglai.com/*
Current Version ID: ...
```

### 3.3 Pages assets fallback

The kids worker uses `ASSETS` binding to serve dist files. The `--assets` flag in §3.2 uploads the dist tree alongside the worker. No separate Pages project is required for kids.

---

## 4. Post-deploy smoke verification

Run these in order. Stop at the first failure.

### 4.1 Landing reachable, indexable

```bash
curl -sIL https://kids.vetuonglai.com/ | head -20
```

Expected: HTTP 200, `content-type: text/html`, `x-robots-tag` not present (landing is index-allowed).

```bash
curl -s https://kids.vetuonglai.com/robots.txt
```

Expected:

```
User-agent: *
Allow: /$
Allow: /en/
Allow: /assets/
...
Disallow: /parent/
Disallow: /learn/
Disallow: /api/kids/
Sitemap: https://kids.vetuonglai.com/sitemap.xml
```

### 4.2 EN mirror reachable

```bash
curl -sIL https://kids.vetuonglai.com/en/ | head -5
```

Expected: HTTP 200.

### 4.3 Curriculum + contract endpoints

```bash
curl -s https://kids.vetuonglai.com/api/curriculum.json | head -10
curl -s https://kids.vetuonglai.com/api/contract.json | head -10
curl -s https://kids.vetuonglai.com/api/health | head -10
```

Each returns JSON with the expected shape and child-safety headers (`x-child-safe-zone: kids.vetuonglai.com`).

### 4.4 API stub returns 501

```bash
curl -si -X GET https://kids.vetuonglai.com/api/kids/parent/profile | head -20
curl -si -X POST https://kids.vetuonglai.com/api/kids/parent/profile | head -20
```

Each returns HTTP 501 with `error.code: "NOT_IMPLEMENTED"` and the contract spec inline.

### 4.5 Inner pages noindex (safety)

```bash
curl -sI https://kids.vetuonglai.com/parent/dashboard/ | grep -i x-robots-tag
curl -s https://kids.vetuonglai.com/parent/dashboard/ | grep robots
```

Expected: meta robots = `noindex,nofollow`. Inner pages are gated against indexing.

### 4.6 Hub still has zero kids leak

```bash
curl -s https://vetuonglai.com/api/system-registry.json | grep -c '"key": "kids"'
curl -s https://member.vetuonglai.com/api/system-registry.json | grep -c '"key": "kids"'
```

Both should print `0`.

---

## 5. Roll-back procedure

If anything goes wrong post-deploy:

```bash
npx wrangler rollback --name vetuonglai-kids
```

This reverts to the previous deployed version of the worker. Routes stay attached. If the worker is irrecoverable:

```bash
npx wrangler delete vetuonglai-kids
```

This unbinds routes and removes the worker. Hub and member never depended on kids being live, so there is no fan-out impact.

---

## 6. Day-0 acceptance criteria

The deploy is **accepted** when all of the following hold:

- `https://kids.vetuonglai.com/` renders the Day-0 landing in Vietnamese, with the H1 `TRẺ EM VỀ TƯƠNG LAI` and the announcement block `MÙA HÈ LẬP TRÌNH VIÊN — ĐÀ LẠT`.
- `https://kids.vetuonglai.com/en/` renders the same structure in English.
- The language switcher reads `Tiếng Việt · English` (no abbreviations).
- The "Mùa Hè" CTA is the passive tag `Xem chi tiết chương trình (sắp công bố)` (no link, no form).
- `/api/curriculum.json` and `/api/contract.json` return their contracts.
- `/api/kids/*` paths matching the contract return HTTP 501 with stub bodies.
- `/parent/*` and `/learn/*` are reachable but `noindex,nofollow`.
- Hub and member have zero kids leakage.
- No email, register, subscribe, payment, checkout, or stripe path is exposed on kids.

When all six bullets above are green, the kids subdomain is **homepage-live without email or payment dependency**.

---

## 7. Future deploy gates (out of scope for Day-0)

These are tracked but explicitly not blocking V1 launch:

- Backend API for `/api/kids/*` (parent profile, child profile, lessons, AI chat, support sessions, recording consent, data requests, safety reports). The contract is locked in [`src/data/kids-api-contract.json`](../../src/data/kids-api-contract.json) — backend implementation must match.
- Email transactional pipeline (parental notifications, support session reminders).
- Payment integration (parent-only, no commerce for minors per child-safety lock).
- Content seed: 10 sample projects, 5 parent articles, 3 demo videos, 3 sample progress records (per launch plan §12).

When any of these graduates from "stub" to "live", repeat §4 smoke-verification before considering it shipped.
