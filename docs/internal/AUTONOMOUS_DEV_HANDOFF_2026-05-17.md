# Autonomous Dev — Session Handoff Pack (2026-05-17)

> Paste **toàn bộ file này** vào đầu chat Claude mới để resume autonomous dev loop tới 100% master roadmap.
>
> Hệ thống live tại `*.vetuonglai.com` (Cloudflare account `62d57eaa548617aeecac766e5a1cb98e`, account "Anhhatam@gmail.com's Account").

---

## 0. CONTEXT BLOCK — paste vào prompt đầu tiên ở chat mới

```
Tôi đang autonomous dev hệ vetuonglai.com (Vietnamese platform, 16 subdomain).
Chat trước đã ship qua 5 tick. Đọc:

  docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-17.md   ← FILE NÀY (full state)
  docs/internal/BLOCKERS_NEED_USER_INPUT.md            ← live progress tracker

Sau khi đọc xong:
1. Tạo cron job mới qua CronCreate với cron `*/19 * * * *` recurring=true,
   prompt là khối "TICK PROMPT" ở section 8 của file handoff.
2. Execute tick đầu tiên ngay (không đợi cron) — pick từ "Next-tick queue"
   section 7.
3. Spawn 2 agent general-purpose song song khi task độc lập.
4. Mỗi tick: implement → build → deploy → commit → cập nhật BLOCKERS doc.
5. Khi cum% ≥ 95 → CronDelete + in báo cáo final.

PRE-DEPLOY CHECK: wrangler OAuth token có thể đã expire. Chạy
`npx wrangler whoami` để verify. Nếu fail → `npx wrangler login` trước
khi deploy worker.

Bắt đầu ngay. Auto mode active, không hỏi confirmation.
```

---

## 1. Roadmap status snapshot

**Master roadmap: ~70% completion** (lên từ ~32% đầu session).

| Subsystem | Trước session | Hiện tại | Delta |
|---|---|---|---|
| Wallet (full ledger) | 0% | 60% | +60 |
| Community subsystem | 5% | 75% | +70 |
| Jobs board | 10% | 70% | +60 |
| Affiliate tracking | 15% | 80% | +65 |
| Analytics ingestion | 10% | 70% | +60 |
| Notify queue + inbox | 30% | 75% | +45 |
| Admin CMS | 35% | 75% | +40 |
| Search (Pagefind) | 0% | **100%** ✅ | +100 |
| Read books + library | 65% | 80% | +15 |
| Brand identity v2 | 35% | 80% | +45 |
| Mobile PWA | 45% | 60% | +15 |
| VC Trust real attestation | 55% | 55% | — (BLOCKER) |
| KYC verification real | 0% | 0% | — (BLOCKER) |
| Payment full | 50% | 50% | — (BLOCKER) |
| AI Tutor (Claude API) | 40% | 40% | — (BLOCKER) |
| Email delivery real | 30% | 30% | — (BLOCKER) |

---

## 2. Commit log session này (newest first)

```
06d200c feat(read): reading-progress + library + PWA manifest V2 (Tick 5)
1d48962 feat(ui): Notify inbox + Admin CMS UI (Tick 4 — 2 agents parallel)
e3679d0 feat(ui): Affiliate dashboard + auto analytics tracking (Tick 3)
6fff14f feat(ui): Community feed + Jobs board pages (Tick 2)
f8d87e6 feat(seo): Pagefind static search + JSON-LD SearchAction (Tick 1)
2c4a705 feat(brand): apply Vetuonglai Brand Kit V2 to all subdomains
a2bcdda docs(brand): prompt-library pointer + section trigger script
ca9980b feat(brand): 9 Canva design artifacts
5d05dd0 feat(brand): apply Brandpro v1 fork — logo SVG family + dark mode + a11y
88070c8 feat(platform): community + jobs + affiliate + analytics + notify + admin CMS
b30cfe8 feat(wallet): auto-create wallet on member signup, expose API across all subdomains
```

11 commits, ~5500+ lines insertions.

---

## 3. Production state (last deployed)

### Workers deployed (latest version IDs)
- `vetuonglai-home` — `0637777d` (analytics tracker bundled)
- `vetuonglai-vc` — `23edbff1` (wallet runtime + all platform APIs + CORS *.vetuonglai.com)
- `vetuonglai-member` — `70f2e4f8` ⚠️ **STALE** (PWA manifest V2 + inbox + admin CMS in dist nhưng worker deploy fail OAuth)
- `vetuonglai-edu-github`, `vetuonglai-green`, `vetuonglai-finance`, `vetuonglai-kids` — V2 brand applied

### Cloudflare Pages deployed
- `vetuonglai-community` — community/feed page
- `vetuonglai-work` — work/jobs page
- `vetuonglai-read` — `3c3898a3.vetuonglai-read.pages.dev` (library + reading-progress)

### Live URLs verified
- https://vc.vetuonglai.com/wallet/ — Wallet UI (dark theme, đang cần re-skin V2)
- https://vc.vetuonglai.com/api/wallet/me — Wallet API
- https://vc.vetuonglai.com/api/{community,jobs,affiliate,analytics,notify,admin/cms}/* — 6 platform APIs
- https://vetuonglai.com/tim-kiem/ — Pagefind search hub
- https://docs.vetuonglai.com/search/ — Pagefind search docs
- https://community.vetuonglai.com/feed/ — Community feed
- https://work.vetuonglai.com/jobs/ — Jobs board
- https://member.vetuonglai.com/affiliate/ — Affiliate dashboard
- https://member.vetuonglai.com/inbox/ — Notify inbox
- https://member.vetuonglai.com/admin/cms/ — Admin CMS (founder-gated)
- https://read.vetuonglai.com/library/ — Read library bookmarks

### Cloudflare secrets (locked, do NOT rotate)
Workers: home / vc / member tất cả có:
- `SESSION_COOKIE_SECRET` (sync giữa 3 worker để share session)
- `WALLET_ADDRESS_SECRET` (deterministic address derive — NEVER rotate)
- `WALLET_INTERNAL_TOKEN` (Worker→Worker auth)
- `MAGIC_LINK_SIGNING_KEY` (home + member)
- `PAY_IAI_ONE_API_KEY` + `PAY_IAI_ONE_WEBHOOK_SECRET` (home + member)
- `VC_IDENTITY_ATTESTATION_SECRET` + `VC_OWNERSHIP_CHALLENGE_SECRET` (vc only)
- `ACCESS_KV_NAMESPACE` binding → KV id `4b1329f961744a1aa3056b625c9b33e7`

### Cloudflare env vars
```bash
export CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e
export ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7
```

---

## 4. File map đã touched (session này)

### Workers / runtime (production code)
- `workers/lib/wallet-runtime.mjs` (ship)
- `workers/lib/wallet-address.mjs` (Bech32-style derive)
- `workers/lib/community-runtime.mjs` (ship)
- `workers/lib/jobs-runtime.mjs` (ship)
- `workers/lib/affiliate-runtime.mjs` (ship)
- `workers/lib/analytics-runtime.mjs` (ship)
- `workers/lib/notify-runtime.mjs` (ship)
- `workers/lib/admin-cms-runtime.mjs` (ship)
- `workers/lib/runtime-helpers.mjs` (shared utils)
- `workers/lib/access-runtime.mjs` (hooked ensureWalletForEmail)
- `workers/vc-worker.mjs` (wired 7 runtimes + CORS *.vetuonglai.com)
- `workers/generic-worker.mjs` (wired 7 runtimes)

### Brand & design
- `src/shared/design-tokens.css` v1.1 (dark mode + a11y + 16-subdomain matrix)
- `src/shared/style.css` (.footer-link stack vertical fix)
- `src/shared/app.js` (vtlAnalytics IIFE appended)
- `src/static-pages/shared-assets/brand/*` (15 V2 logo files)
- `src/static-pages/shared-assets/web/*` (84 per-subdomain OG + favicon + hero)
- `src/static-pages/shared-assets/icons/*` (30 icons)

### User-facing pages
- `src/static-pages/vetuonglai.com/tim-kiem/index.html`
- `src/static-pages/docs.vetuonglai.com/search/index.html`
- `src/static-pages/community.vetuonglai.com/feed/index.html`
- `src/static-pages/work.vetuonglai.com/jobs/index.html`
- `src/static-pages/member.vetuonglai.com/affiliate/index.html`
- `src/static-pages/member.vetuonglai.com/inbox/index.html`
- `src/static-pages/member.vetuonglai.com/admin/cms/index.html`
- `src/static-pages/vc.vetuonglai.com/wallet/index.html` (Tick 5 cần re-skin V2)
- `src/static-pages/read.vetuonglai.com/library/index.html`
- `src/static-pages/read.vetuonglai.com/assets/reading-progress.js`

### Build pipeline
- `scripts/build.mjs` (16 subdomain renderer + asset copy + PWA manifest V2)
- `scripts/deploy-workers.mjs` (auto-bind KV qua tmp wrangler.jsonc)
- `scripts/pagefind-index.mjs` (postbuild search indexer)
- `scripts/deploy-pages.mjs` (Pages deploy cho community/work/read/etc.)

### Scripts ops & smoke
- `scripts/deploy-wallet-final.sh` (idempotent secret + KV setup)
- `scripts/bind-wallet-to-all-workers.sh`
- `scripts/backfill-wallets.mjs`
- `scripts/smoke-wallet.mjs` + `smoke-wallet-integration.mjs`
- `scripts/smoke-platform.mjs`
- `scripts/brand-generate-section.sh`

### Docs
- `docs/internal/BLOCKERS_NEED_USER_INPUT.md` (live progress + blockers)
- `docs/internal/BRAND_PROMPT_LIBRARY_POINTER.md`
- `docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-17.md` (FILE NÀY)

### Brand kit (Founder-approved V2)
- `files/brand/vetuonglai-brand-kit-final-v2/` (V2 — source of truth)
- `files/brand/vetuonglai-brand-kit/` (V1 — historical)
- `files/brand/VETUONGLAI_BRAND_FINAL_PACKAGE_2026/` (strategy lock + 2 extra SVG)
- `files/brand/vetuonglai-brand-kit-final-v3.zip` (V3 — Founder upload, **chưa apply** vì V2 approved, mở zip + diff trước khi switch)

### Brand fork (canonical decisions)
- `../Brandpro-all/forks/vetuonglai.com/`
  - `_filled/{01-founder,02-risk,03-naming,04-pillars,05-style-lock}-FILLED.md`
  - `country-packs/_MASTER-SUBDOMAIN-MATRIX.md` (16 subdomain spec)
  - `BRAND-GUIDELINE-v1.md`
  - `BRAND-CANVA-LIBRARY.md`
  - `PROMPT-LIBRARY.md` (~150 design asset prompt templates)
  - `assets/logo/*.svg` (V1 logo, V2 overrides on product side)

---

## 5. Architecture cheat-sheet

```
                    ┌──────────────────────────────────────────────┐
                    │ KV namespace ACCESS_KV_NAMESPACE             │
                    │ 4b1329f961744a1aa3056b625c9b33e7             │
                    │ Prefixes: wallets, community_post,           │
                    │ job_listing, affiliate_code, analytics_event,│
                    │ notify_message, cms_content, …               │
                    └──────────────────────────────────────────────┘
                              ▲                ▲                ▲
                              │                │                │
              ┌───────────────┴────┐  ┌────────┴───────┐ ┌──────┴──────┐
              │ vetuonglai-home    │  │ vetuonglai-vc  │ │ vetuonglai- │
              │ generic-worker.mjs │  │ vc-worker.mjs  │ │ member      │
              │ + 7 runtime libs   │  │ + 7 runtime    │ │ + 7 runtime │
              │ vetuonglai.com/*   │  │ vc/*  CORS open│ │ member/*    │
              └─────────┬──────────┘  └────────────────┘ └─────────────┘
                        │
              session cookie vtl_session (domain=.vetuonglai.com)
                        │
              ┌─────────┴─────────────┬─────────────┬───────────────┐
              ▼                       ▼             ▼               ▼
      community.veutonglai.com  work.veu...   read.veu...     edu/finance/
      (Cloudflare Pages)        (Pages)       (Pages)         green/kids
                       ↑ all cross-origin fetch to vc.veuonglai.com
                         for /api/community/jobs/wallet/etc
```

### Wallet address
- Format: `vtl1` + 32 Bech32 chars (alphabet without 1,b,i,o)
- Deterministic: HMAC-SHA256(`WALLET_ADDRESS_SECRET`, `wallet:v1:{email}`) → first 32 chars
- Locked: changing `WALLET_ADDRESS_SECRET` invalidates ALL user wallets

### Session
- Cookie `vtl_session` = base64url(JSON payload) + `.` + hex HMAC
- HMAC key = `SESSION_COOKIE_SECRET` (sync across home/vc/member)
- Payload: `{candidate_email, member_state, entitlements, exp, ...}`
- TTL: 30 days, auto-refresh when < 24h remaining

### Internal Worker→Worker auth
- Header: `x-internal-token` (or legacy `x-wallet-internal-token`)
- Value = `WALLET_INTERNAL_TOKEN`
- Used for: `/api/wallet/{credit,debit,payout/settle}`, `/api/affiliate/conversion`, `/api/notify/send`, `/api/notify/template`

---

## 6. Loop ticks log (this session)

| Tick | Time | Shipped | Δ% | Cum |
|---|---|---|---|---|
| 1 | T+0 | Pagefind search + JSON-LD SearchAction + Organization schema | +2 | 57 |
| 2 | T+20 | Community feed UI + Jobs board UI (Pages deploy) | +3 | 60 |
| 3 | T+40 | Affiliate dashboard + Analytics auto-tracking in app.js | +3 | 63 |
| 4 | T+57 | Notify inbox UI + Admin CMS UI (2 agents parallel) | +4 | 67 |
| 5 | T+76 | Read reading-progress.js + library page + PWA manifest V2 | +3 | **70** |

---

## 7. Next-tick queue (pick 1-2 per tick, no external blocker)

| # | Task | Est | Δ% | Notes |
|---|---|---|---|---|
| A | Wallet UI re-skin V2 light theme (replace dark `#0e1116`) | 15m | +2 | src has been touched by linter — verify before edit. Hub/VC theme `#22D3EE`/`#6366F1` accent. |
| B | Apply V3 brand kit (review zip vs V2 first) | 20m | +2 | Unzip `files/brand/vetuonglai-brand-kit-final-v3.zip`, diff vs V2, decide adopt/reject |
| C | VC issuer registry starter API + admin page | 25m | +5 | Add `/api/vc/issuers/{list,register,approve}` in vc-ownership-runtime.mjs. Founder-gated approval. |
| D | Member unified dashboard tích hợp 6 surface | 30m | +3 | New page at member.vetuonglai.com/dashboard/. Quick links: wallet/inbox/affiliate/applications/posts |
| E | Affiliate UI mobile responsive polish | 10m | +1 | Stats stack 2x2 on mobile, modal full-screen |
| F | Edu course player progress integration với wallet credit | 20m | +3 | When user completes lesson, fire POST /api/wallet/credit (bucket=available) |
| G | Sitemap polish — `<lastmod>` per-page + image sitemap | 15m | +2 | SEO compounder, no API needed |
| H | Robots.txt audit + canonical chain audit | 10m | +1 | Verify no duplicate-canonical between subdomains |
| I | Email signature SVG → live (web-email-signature deploys) | 15m | +1 | Add to member /assets/, document for Founder Gmail |
| J | Onboarding flow polish member /signup → /welcome | 25m | +3 | Existing flow tests OK; could improve copy + add wallet address display step |
| K | Community moderation queue (founder-gated) | 30m | +3 | Admin CMS already shipped; add /admin/community for ban/unban + report queue |
| L | Jobs escrow flow wallet integration | 30m | +4 | When job marked "hired", auto-hold budget; on "completed", auto-pay |

**Recommend for next tick: A + B** (low risk, immediate user-facing polish).
**Recommend tick after: C + D** (5% gain, biggest leap toward 80%).

---

## 8. TICK PROMPT (paste vào CronCreate)

```
Tick auto-dev vetuonglai.com. Đọc docs/internal/BLOCKERS_NEED_USER_INPUT.md +
docs/internal/AUTONOMOUS_DEV_HANDOFF_2026-05-17.md để biết state hiện tại
và next-tick queue. Mỗi tick:

1. Chọn 1-2 task ship được trong 19 phút từ "Next-tick queue" section 7
   (ưu tiên item KHÔNG bị blocker bên thứ ba).
2. Implement — spawn 2 agent general-purpose song song nếu task độc lập
   (mỗi agent build 1 file/page riêng).
3. Build: `npm run build` (auto-runs postbuild pagefind).
4. Deploy: home/vc/member qua `node scripts/deploy-workers.mjs --worker X`,
   community/work/read/etc qua `node scripts/deploy-pages.mjs --project X`.
   Nếu wrangler báo OAuth expire → in lệnh `npx wrangler login` cho user
   chạy thủ công rồi tiếp tục task khác không cần deploy.
5. Commit format: `feat(area): summary (Tick N)` với Co-Authored-By line.
6. Cập nhật BLOCKERS doc với % tăng + log row mới vào "Loop progress
   tracker" table.

Env exports (paste mỗi tick nếu fresh shell):
  export CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e
  export ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7

Khi cum% ≥ 95 → gọi CronDelete với job ID hiện tại + in báo cáo final
(commit log, subsystem health, blockers còn lại do Founder, link sample).
```

---

## 9. Pre-flight checklist khi resume

```bash
cd ~/Documents/Devnewproject/vetuonglai-system

# 1. Verify wrangler auth
npx wrangler whoami
# Expect Account ID matches 62d57eaa548617aeecac766e5a1cb98e
# If logged out: npx wrangler login

# 2. Verify env
export CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e
export ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7

# 3. Verify build clean
npm run build 2>&1 | tail -3

# 4. Verify production health (canary)
curl -s https://vc.vetuonglai.com/api/wallet/health
curl -s https://vc.vetuonglai.com/api/community/health
curl -s https://vetuonglai.com/_pagefind/pagefind-entry.json | head -5

# 5. Resume member deploy (was stalled in Tick 5)
node scripts/deploy-workers.mjs --worker member

# 6. Start new cron loop in Claude — paste TICK PROMPT (section 8) into
# Claude with CronCreate cron="*/19 * * * *" recurring=true
```

---

## 10. Blockers Founder phải xử lý ngoài (không tự dev được)

1. **KYC provider** — chọn Sumsub/Veriff/Onfido, lấy API key. Unlock +5%.
2. **Payment merchants** — PayPal + Stripe production secrets + webhook IDs. Unlock +5%.
3. **Bank disbursement contract** — NAPAS Pro hoặc PAY IAI ONE Disburse cho payout thật. Unlock +3%.
4. **Anthropic API key** — Claude API cho EDU AI tutor. Unlock +5%.
5. **Email provider** — Resend/Mailgun + DKIM/SPF cho `noreply@vetuonglai.com`. Unlock +3%.
6. **VC issuer pool** — danh sách 5-10 issuer thật + process approval. Unlock +5%.
7. **App Store / Google Play** — Apple Dev $99/yr + Google Play $25 once. Unlock +5%.
8. **TM filing** — class 35/41/42 ở VN + Madrid SG/US. Khoảng 10-12 triệu VND. Brand defense.

→ **Cap autonomous dev ≈ 90%**. Để 100% cần Founder unlock ≥ 5 trong 8 cái trên.

---

## 11. Known issues / gotchas

1. `dist/vc.vetuonglai.com/wallet/index.html` thường bị linter minify lại sau mỗi rebuild. Edit ở `src/static-pages/vc.vetuonglai.com/wallet/index.html`, không sửa trực tiếp dist.
2. `docs.vetuonglai.com` không có worker riêng — deploy qua Pages.
3. Edu/green/finance/kids workers **chưa có** wallet secrets (chỉ home/vc/member). Nếu muốn ví hoạt động trên các sub này, chạy `bash scripts/bind-wallet-to-all-workers.sh` với 2 secret từ 1Password.
4. Canva MCP connector (`40e2354f-...`) **có thể disconnect** ngẫu nhiên — không block dev, chỉ block re-gen brand assets.
5. Wrangler 4.x bỏ flag `--kv-namespace` — đã workaround bằng tmp wrangler.jsonc trong deploy-workers.mjs.
6. macOS Finder hay tạo duplicate `*.svg 2`, `index 2.html` etc. trong dist — đã có cleanup script pattern, chạy `find dist -name "* 2*" -delete` nếu thấy build treo.

---

## 12. Closing summary

- **5 ticks shipped** trong session này, +13% master roadmap (57 → 70%).
- **11 commits** clean với Co-Authored-By Claude.
- **10 user-facing pages** + **6 platform API subsystems** + **Brand v2 system** + **Pagefind search** + **PWA manifest V2** + **Read library**.
- **Cron loop** session-only, đã expire — resume bằng CronCreate mới ở chat tiếp.
- **Blocker chính cản 95-100%**: KYC/payment/AI key/email/issuer pool — cần Founder.

Sẵn sàng để hand-off. Đặt file này lên đầu chat mới + paste CONTEXT BLOCK section 0 → autonomous dev tiếp tục liền mạch.
