# VTL Team 1 — pay.iai.one Blockers and Requests

Version: 1.1
Date: 2026-04-16
Status: cutover_blocked_until_4_runtime_items_green
Owner: Team 1

## Verified From Live

Team 1 re-check from production:
- `https://pay.iai.one/openapi.json` contains `POST /api/v1/checkout/session`.
- Calling route without API key returns `401 API_KEY_REQUIRED`.
- Calling route with invalid API key returns `403 API_KEY_INVALID`.

## What Team 1 Still Needs From Team Pay

1. Rotated production handoff key for `vetuonglai-member` (`x-api-key`) in secure channel.
2. `VETUONGLAI_PRODUCT_CATALOG_JSON` set and confirmed active in live runtime.
3. payOS runtime secrets set and confirmed:
   - `PAYOS_CLIENT_ID`
   - `PAYOS_API_KEY`
   - `PAYOS_CHECKSUM_KEY`
4. Two successful live checkout proofs:
   - `annual-access`
   - one specialist pack (at least `g1`)
   Include response sample with real `checkout_url` and `session_id`.
5. Outbound webhook dispatcher turned on to Team 1 endpoint:
   - target: `https://member.vetuonglai.com/api/access/webhooks/pay/iai-one`
   - signature headers + retry policy + idempotency behavior confirmed.
6. Full UAT replay package:
   - 6 payload samples (subscription activated/renewed/past_due/cancelled, order captured/refunded)
   - 6 curl replay commands
   - expected response matrix (2xx/4xx handling).
7. Error code table + retry/duplicate policy finalized (contract-level, not draft).

## Team 1 Next Actions After Receiving Items Above

1. Add `pay.iai.one` gateway support in member access runtime (checkout resolve + webhook ingestion).
2. Replace/defer PayPal gate checks for this phase while keeping non-payment mobile policy unchanged.
3. Update smoke/check contracts and deploy Team 1 runtime.
4. Run end-to-end verification from homepage purchase hub to member entitlement transitions.

## Cutover Gate Decision (2026-04-16)

Team 1 decision: **do not cutover yet**.

Reason:
- handoff is still below 7/7 complete,
- and runtime cutover is blocked until 4 critical items are green.

## 4 Critical Runtime Items Still Blocking Cutover

1. Rotated production `x-api-key` delivered via secure channel.
2. `VETUONGLAI_PRODUCT_CATALOG_JSON` active in live runtime.
3. payOS secrets active in live runtime (`PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`).
4. Outbound webhook dispatcher live to `https://member.vetuonglai.com/api/access/webhooks/pay/iai-one`.

## Post-Blocker Sequence

After the 4 items above are done:
1. collect 2 live checkout proofs (`annual-access` + `g1`),
2. finalize 6 real UAT webhook payloads + replay evidence,
3. only then open Team 1 cutover gate.
