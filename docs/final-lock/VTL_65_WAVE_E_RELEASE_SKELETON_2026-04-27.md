# VTL RELEASE SKELETON — WAVE E FULL SYSTEM READINESS

Phiên bản: 0.1-skeleton
Ngày: 2026-04-27
Mốc chốt: chưa ký — skeleton only
Trạng thái: preparation_only / release_blocked
Owner điều phối: Team 1
Phạm vi: toàn hệ — chốt cuối trước khi tuyên bố hệ sẵn sàng

## 0. Mục đích

File này là release skeleton cho Wave E.

Mục tiêu:

- liệt kê toàn bộ điều kiện để Wave E được ký release
- cho QA / PM / Ops / 5 team một checklist rõ ràng
- không ai được ký release chỉ vì skeleton này tồn tại

File này KHÔNG có quyền tuyên bố hệ đã sẵn sàng.

## 1. Điều kiện tiên quyết (prerequisites)

Wave E chỉ được mở ký release khi TẤT CẢ các điều kiện sau đã có evidence:

### 1.1 Wave C promotion

- [ ] `life.vetuonglai.com` runtime truth đổi từ `planned_public` sang `live`
- [ ] `invest.vetuonglai.com` runtime truth đổi từ `planned_public` sang `live`
- [ ] Team 5 ký nhận promotion evidence

### 1.2 Wave D public publish

- [ ] DNS mở cho 5 host: `work`, `market`, `community`, `ai`, `business`
- [ ] `deploy-wave-d-pages.mjs --branch main` pass thật (không dry-run)
- [ ] Team 5 live verify pass cho 5 host
- [ ] Rollback pack sẵn sàng và đã test

### 1.3 Cloudflare account migration

- [ ] Secret migration hoàn tất cho `vetuonglai-home`, `vetuonglai-member`, `vetuonglai-vc`
- [ ] Zone mới activated (không còn `pending`)
- [ ] Worker routes attached và custom-domain runtime proof pass
- [ ] Account cũ cleanup signoff

### 1.4 Payment production gate

- [ ] `pay.iai.one` trả `checkoutUrl` non-empty cho annual-access
- [ ] `pay.iai.one` trả `checkoutUrl` non-empty cho specialist pack (g1)
- [ ] Rotated production API key đã inject
- [ ] 2 live checkout proofs thu thập
- [ ] 6 UAT webhook replay payloads thu thập
- [ ] Webhook dispatcher `member.vetuonglai.com/api/access/webhooks/pay/iai-one` live

### 1.5 Cross-team parity

- [ ] Team 1: `100% / 0%`
- [ ] Team 2: `100% / 0%`
- [ ] Team 3: `100% / 0%`
- [ ] Team 4: `100% / 0%`
- [ ] Team 5: `100% / 0%`

## 2. Verify commands cho Wave E

```bash
# Core
npm run build
npm run check

# Wave gates
npm run verify:planned-safe:wave:release
node scripts/verify-wave-c-life-invest-hardening.mjs
node scripts/deploy-wave-d-pages.mjs --dry-run

# Cross-team
npm run verify:team3:parity
node scripts/verify-total-system-release-gate.mjs

# Access runtime
node scripts/smoke-access-runtime.mjs

# Member domain
node scripts/inspect-member-domain.mjs
```

## 3. Release signoff format

Khi tất cả prerequisites đã có evidence, Team 5 tạo release report với format:

```
wave: E
decision: GO / NO-GO
evidence_count: <số>
blockers_remaining: <số>
signed_by: Team 5
date: <ISO>
```

Team 1 chỉ được cập nhật file này từ `skeleton` sang `release_candidate` khi Team 5 xác nhận `blockers_remaining: 0`.

## 4. Rollback plan

Nếu Wave E release gặp sự cố:

1. Revert runtime truth cho domain bị ảnh hưởng về `planned_public`
2. Chạy `deploy-wave-d-pages.mjs` với rollback branch
3. Notify tất cả 5 team qua channel tương ứng
4. Team 3 cập nhật go/no-go report

## 5. Trạng thái hiện tại

Cập nhật: 2026-04-28

- Wave C: `hardening_ready / promotion_blocked`
- Wave D: `LIVE` — verify-wave-d-public-publish 10/10 PASS, `publish_ready: true`
- Cloudflare account migration: zone ACTIVE, 12 Pages DEPLOYED, 7 Workers script-only DEPLOYED
- Wave E: `preparation_only / secret_migration_blocked`
- Tổng hệ: `~88% / ~12%`

Blocker còn lại:

- `vetuonglai-home`, `vetuonglai-member`, `vetuonglai-vc` thiếu secrets (11 giá trị)
- vc.vetuonglai.com trả 403 — prelive blocked tại VC endpoints
- payment gate vẫn `LOCK_RETAINED_WITH_REASON` (chưa có rotated API key)

Không được tự tăng phần trăm hoặc đổi trạng thái nếu chưa có verify/evidence mới.
