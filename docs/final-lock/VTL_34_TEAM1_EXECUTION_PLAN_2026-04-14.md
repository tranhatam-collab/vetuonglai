# VTL TEAM 1 EXECUTION PLAN

Phiên bản: 1.1
Ngày: 2026-04-14
Trạng thái: release_ready
Owner: Team 1

## Mục tiêu

Hoàn tất lane platform/runtime của Team 1 theo sequence mới:

- `P0`: runtime truth + access truth
- `P1`: auth + entitlement + submission/review/VC contracts

## Cổng tiền phát triển

File kế hoạch đã tồn tại và đủ nội dung: `có`.

## Phạm vi

1. access/runtime monitoring
2. member cutover promotion
3. runtime truth update + evidence

## Danh sách việc

1. giữ xanh các smoke gate: `provider-status`, `policy-bindings`, `routing-contract`
2. hoàn tất `magic link auth -> session -> entitlement` theo `35_ENTITLEMENT_AND_ACCESS_CONTROL_SPEC`
3. hoàn tất state machine cho `submission -> review -> VC candidate`
4. chạy lại `npm run cloudflare:promote:member` sau khi Ops hoàn tất secrets + DNS
5. nếu bị chặn, công bố blocker evidence vào cross-team report
6. giữ ổn định persistence path `ACCESS_KV_NAMESPACE`
7. thực thi runbook cutover trong `docs/final-lock/VTL_25_MEMBER_SECRET_CHECKLIST_2026-04-10.md`

## Ảnh chụp thực thi gần nhất (2026-04-14 11:50 ICT)

- `npm run smoke:access-runtime`: pass
- `npm run cloudflare:smoke:endpoints`: pass for required endpoints
- `npm run build && npm run check`: pass
- `npm run cloudflare:promote:member`: bị chặn ở strict secret gate (thiếu 7 secret bắt buộc)

## Ảnh chụp thực thi gần nhất (2026-04-21 17:09 ICT)

- `npm run cloudflare:promote:member`: pass
- runtime truth hiện tại:
  - `member.vetuonglai.com`
  - `status: live`
  - `requiredPublic: true`
- `npm run smoke:access-runtime`: pass sau khi cập nhật expectation của Team 1 theo runtime truth mới
- `npm run verify:team3:parity`: `go`
  - suite: `6/6` pass
- diễn giải:
  - cutover path của Team 1 cho `member` đã đóng
  - parity path của Team 3 đã đóng
  - phần còn lại trong lane này chỉ còn QA/PM signoff và cleanup/handoff của Team 2

## Ảnh chụp lane thanh toán gần nhất (2026-04-16)

- `pay.iai.one` route `/api/v1/checkout/session` verified live.
- auth behavior verified (`401 API_KEY_REQUIRED`, `403 API_KEY_INVALID`).
- gate cutover của Team 1 vẫn đang đóng:
  - chờ `x-api-key` đã rotate qua secure channel
  - chờ `VETUONGLAI_PRODUCT_CATALOG_JSON`
  - chờ payOS runtime secrets
  - chờ outbound webhook dispatcher tới member endpoint

## Ảnh chụp runtime gần nhất (2026-04-17 02:14 ICT)

- public DNS is now live for `member.vetuonglai.com` and `www.member.vetuonglai.com` on public resolvers:
  - `172.67.222.247`
  - `104.21.25.54`
- forced route check confirms non-www member worker is serving publicly:
  - `curl --resolve ... https://member.vetuonglai.com/api/index.json` -> `200`
- `www.member.vetuonglai.com` is not healthy yet at custom-domain/TLS layer:
  - forced HTTPS route still fails with TLS handshake error
- both live workers now list the 4 phase secrets:
  - `SESSION_COOKIE_SECRET`
  - `MAGIC_LINK_SIGNING_KEY`
  - `PAY_IAI_ONE_API_KEY`
  - `PAY_IAI_ONE_WEBHOOK_SECRET`
- `GET https://vetuonglai.com/api/access/provider-status.json` and forced member `provider-status` still report:
  - `session.ready: false`
  - `memberDomainRequiredPublic: false`
  - `memberDomainStatus: staged_public`
  - `persistenceMode: memory`
- diễn giải:
  - DNS của non-www member không còn là blocker
  - `www` vẫn chưa khỏe ở lớp TLS/custom-domain
  - runtime session vẫn chưa nhìn thấy binding hợp lệ của `MAGIC_LINK_SIGNING_KEY` tại thời điểm thực thi

## Kiểm tra production payment gần nhất (2026-04-17 01:47 ICT)

- `GET https://vetuonglai.com/api/access/provider-status.json`
  - `gateways.annualAccess.pay.productionReady: true`
  - `gateways.annualAccess.pay.webhookReady: true`
  - `gateways.specialistPacks.pay.productionReady: true`
  - `session.ready: false`
- `POST https://vetuonglai.com/api/access/route/normalize`
  - normalizes `gateway=payos` to `gateway=pay`
- live checkout smoke results:
  - `annual-access` -> `403 API_KEY_INVALID`
  - `specialist-pack g1` -> `403 API_KEY_INVALID`
- diễn giải:
  - patch payment routing đã live
  - upstream `pay.iai.one` từ chối `PAY_IAI_ONE_API_KEY` hiện tại
  - `session.ready: false` nghĩa là `MAGIC_LINK_SIGNING_KEY` chưa nhìn thấy được ở live home runtime, bất kể pay gateway đang báo ready

## Retest production gần nhất (2026-04-17 02:14 ICT)

- redeployed both live workers after secret verification:
  - `vetuonglai-home` current version `7f31e4bd-c3f0-4090-97de-863e2d75559f`
  - `vetuonglai-member` current version `16db3164-b8b8-47cf-855a-1220c4f022f5`
- live checkout smoke still fails upstream after redeploy:
  - `annual-access` -> `403 API_KEY_INVALID`
  - `specialist-pack g1` -> `403 API_KEY_INVALID`
- các blocker cutover ở thời điểm này là:
  - wrong or unauthorized `PAY_IAI_ONE_API_KEY` for tenant/site `vetuonglai-member`
  - `www.member.vetuonglai.com` custom-domain/TLS is not healthy yet
  - runtime visibility mismatch for `MAGIC_LINK_SIGNING_KEY` (`session.ready: false`)
- rule hành động của Team 1:
  - không chạy `cloudflare:promote:member` cho đến khi 3 blocker này cùng được gỡ

## Retest production gần nhất (2026-04-17 11:58 ICT)

- reran both live flows directly against `https://vetuonglai.com/api/access/checkout/resolve`
- current `provider-status` is improved:
  - `session.ready: true`
  - `annualAccess.pay.productionReady: true`
  - `annualAccess.pay.webhookReady: true`
  - `specialistPacks.pay.productionReady: true`
- annual access retest:
  - HTTP status from Team 1 runtime: `202`
  - upstream status: `201`
  - `sessionId: pi_58b685785a844490904a56275f3b7d2d`
  - `checkoutUrl: ""`
  - `providerRef: ""`
- specialist-pack `g1` retest:
  - HTTP status from Team 1 runtime: `202`
  - upstream status: `201`
  - `sessionId: pi_dbfbadcbdb2549c39dce9f1bb7d3be58`
  - `checkoutUrl: ""`
  - `providerRef: ""`
- diễn giải:
  - Team 1 đã gỡ được gate `session.ready=false` trước đó
  - blocker payOS `214` không còn là symptom runtime active ở phía Team 1 trong lần retest này
  - blocker production hiện tại là upstream tạo được checkout session nhưng không trả `checkoutUrl` usable cho cả hai flow
- rule hành động của Team 1:
  - chưa được coi pay lane là pass cho đến khi cả `annual-access` và `g1` trả về `checkoutUrl` không rỗng

## Phụ thuộc

- Ops: inject required member secrets
- Ops: DNS/custom-domain readiness for `member.vetuonglai.com`

## Command gates

```bash
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run cloudflare:promote:member
npm run cloudflare:verify:runtime
```

## Tiêu chí hoàn tất

- promote member succeeds
- runtime truth updated with evidence
- no contract drift after promote

## Checklist phase 2 (2026-04-16)

1. giữ xanh các runtime gate bắt buộc trước mọi lần promote/deploy
2. xác nhận các mobile contract endpoint (`session/current`, `routing-contract`, `contracts/index`) vẫn ổn định
3. không mở economy/runtime mới trước khi `login -> học -> nộp -> review -> VC -> dashboard` chạy end-to-end
4. công bố blocker evidence ngay trong ngày nếu phụ thuộc Ops vẫn còn chặn member cutover
5. bám `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md` làm board chính cho cycle hiện tại
