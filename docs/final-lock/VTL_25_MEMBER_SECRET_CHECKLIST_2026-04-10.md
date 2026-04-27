# VTL Member Secret Checklist

Version: 1.1
Date: 2026-04-16
Status: waiting_ops_secrets_and_dns
Owner: Team 1
Target worker: `vetuonglai-member`

## Purpose

Provide one ordered cutover checklist so Ops and Team 1 can promote `member.vetuonglai.com` to required-public without runtime-truth drift.

## Current Snapshot (2026-04-21 Team 3 parity refresh)

Current cutover contract for `vetuonglai-member` now has to be read in `2` layers:

1. **Strict member worker gate** must match the live worker contract in `cloudflare/workers-projects.json`.
2. **Provider-specific secrets** for deferred gateways must stay separate from the strict gate so Ops does not chase the wrong cutover minimum.

Strict member worker contract currently requires:
- `SESSION_COOKIE_SECRET`
- `MAGIC_LINK_SIGNING_KEY`
- `PAY_IAI_ONE_API_KEY`
- `PAY_IAI_ONE_WEBHOOK_SECRET`

Provider-specific follow-up secrets for PayPal / Stripe remain a separate enablement layer:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`
- `PAYPAL_WEBHOOK_ID_ORDERS`
- `STRIPE_WEBHOOK_SECRET`

DNS/custom-domain cutover for `member.vetuonglai.com` is still a hard gate before runtime truth may flip to `requiredPublic=true`.

## Preconditions

1. `wrangler whoami` is authenticated to the correct Cloudflare account.
2. Worker `vetuonglai-member` exists.
3. Secret values are provided from secure Ops storage.
4. DNS/custom-domain cutover plan is approved by Ops.

## Step 1 — Complete Strict-Gate Required Secrets

Run these commands in order on `vetuonglai-member`:

```bash
wrangler secret put MAGIC_LINK_SIGNING_KEY --name vetuonglai-member
wrangler secret put PAY_IAI_ONE_API_KEY --name vetuonglai-member
wrangler secret put PAY_IAI_ONE_WEBHOOK_SECRET --name vetuonglai-member
```

Note:
- `SESSION_COOKIE_SECRET` must exist before strict deployment.
- This step follows the strict worker contract, not the deferred PayPal / Stripe layer.

## Step 2 — Verify Secret Readiness

```bash
wrangler secret list --name vetuonglai-member --format json
```

Expected: all strict-gate secret names are present:
- `SESSION_COOKIE_SECRET`
- `MAGIC_LINK_SIGNING_KEY`
- `PAY_IAI_ONE_API_KEY`
- `PAY_IAI_ONE_WEBHOOK_SECRET`

## Step 2B — Optional Provider Enablement (Do Not Block Strict Cutover)

Only add these when the corresponding provider path is being enabled in runtime:

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID_SUBSCRIPTIONS`
- `PAYPAL_WEBHOOK_ID_ORDERS`
- `STRIPE_WEBHOOK_SECRET`

These are not the minimum strict-gate requirement for the current `pay.iai.one`-first member cutover path.

## Step 3 — Pass Strict Deploy Gate

```bash
npm run cloudflare:deploy:workers:strict -- --worker member
```

Expected:
- no missing-secret error
- member worker deploy completes.

## Step 4 — DNS/Custom-Domain Cutover

Ops completes DNS/custom-domain for:
- `member.vetuonglai.com`
- (optional parity) `www.member.vetuonglai.com`

Verify:

```bash
dig +short member.vetuonglai.com
curl -I https://member.vetuonglai.com/api/index.json
```

Expected:
- DNS resolves publicly.
- endpoint returns HTTP response (not host resolution failure).

## Step 5 — Run Promotion Command

After Step 1-4 are green:

```bash
npm run cloudflare:promote:member
```

This command performs:
1. build
2. check
3. strict member deploy
4. endpoint smoke
5. member endpoint reachability check
6. runtime truth flip (`requiredPublic=true`)
7. runtime verify

## Step 6 — Post-Promote Reporting

Update:
- `docs/final-lock/VTL_24_RELEASE_READINESS_REPORT_2026-04-10.md`
- `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`

Include:
- command evidence
- pass/fail summary
- final runtime truth state for member domain

## Failure Handling

1. If strict deploy fails:
- rerun `wrangler secret list` and compare against the strict-gate required list.

2. If DNS still unresolved:
- do not run promotion.
- keep member staged (`requiredPublic=false`).

3. If promotion fails before runtime flip:
- do not force manual runtime truth change.
- log blocker evidence to cross-team sync report.

## Ops Handoff Message (copy/paste)

```text
Team Ops giúp Team 1 hoàn tất cutover member theo thứ tự sau:
1) Bảo đảm worker `vetuonglai-member` có đủ strict-gate secrets:
   SESSION_COOKIE_SECRET
   MAGIC_LINK_SIGNING_KEY
   PAY_IAI_ONE_API_KEY
   PAY_IAI_ONE_WEBHOOK_SECRET
2) Nếu đang bật thêm provider deferred, set tiếp các secrets PayPal / Stripe ở lớp riêng, không trộn vào strict-gate minimum.
3) Verify secret list đã đủ strict-gate contract.
4) Hoàn tất DNS/custom-domain để member.vetuonglai.com resolve public.
5) Báo Team 1 ngay khi xong để chạy:
   npm run cloudflare:deploy:workers:strict -- --worker member
   npm run cloudflare:promote:member
6) Không flip requiredPublic thủ công trước khi promote pass hoàn chỉnh.
```
