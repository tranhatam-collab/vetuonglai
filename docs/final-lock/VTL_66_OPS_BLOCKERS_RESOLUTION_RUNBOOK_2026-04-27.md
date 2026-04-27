# VTL 66 — Ops Blockers Resolution Runbook

Phiên bản: 1.0
Ngày: 2026-04-27
Trạng thái: ready_to_execute
Owner: Team 1 / Ops

## 0. Tổng quan

Runbook này hướng dẫn gỡ 4 blocker còn lại để đưa Team 1 từ 82% lên 100%.

### Blockers

| # | Blocker | Script | Cần từ bên ngoài |
|---|---------|--------|------------------|
| B0 | Secret migration | `ops-inject-secrets.mjs` | Secret values |
| B0 | Zone activation | `ops-verify-zone-activation.mjs` | Nameserver change |
| B1 | Wave D DNS | `ops-setup-wave-d-dns.mjs` | CLOUDFLARE_API_TOKEN |
| B3 | Payment gate | `ops-test-payment-checkout.mjs` | Rotated API key |

## 1. Chuẩn bị

```bash
# Copy template và điền giá trị thật
cp .env.secrets.template .env.secrets
# Edit .env.secrets với giá trị thật
```

Giá trị cần điền:

| Secret | Dùng cho | Nguồn |
|--------|----------|-------|
| `SESSION_COOKIE_SECRET` | home, member | Founder/Ops secure storage |
| `MAGIC_LINK_SIGNING_KEY` | home, member | Founder/Ops secure storage |
| `PAY_IAI_ONE_API_KEY` | home, member | Team Pay rotated key |
| `PAY_IAI_ONE_WEBHOOK_SECRET` | home, member | Team Pay |
| `VC_IDENTITY_ATTESTATION_SECRET` | vc | Founder/Ops secure storage |
| `VC_OWNERSHIP_CHALLENGE_SECRET` | vc | Founder/Ops secure storage |
| `CLOUDFLARE_API_TOKEN` | all scripts | Cloudflare Dashboard |

## 2. Thực hiện — theo thứ tự

### Bước 1: Inject secrets

```bash
# Kiểm tra trước
node scripts/ops-inject-secrets.mjs --dry-run

# Inject thật
node scripts/ops-inject-secrets.mjs --env-file .env.secrets
```

Kết quả mong đợi: `Total: 11 | OK: 11 | Failed: 0`

### Bước 2: Zone activation

```bash
# Kiểm tra trạng thái zone
export CLOUDFLARE_API_TOKEN=your_token_here
node scripts/ops-verify-zone-activation.mjs
```

Nếu zone vẫn `pending`:
1. Đăng nhập vào domain registrar
2. Đổi nameservers từ:
   - `davina.ns.cloudflare.com` + `justin.ns.cloudflare.com`
3. Sang:
   - `barbara.ns.cloudflare.com` + `patrick.ns.cloudflare.com`
4. Chờ propagation (thường 1-24 giờ)
5. Chạy lại verify

### Bước 3: Wave D DNS

```bash
# Kiểm tra trước
node scripts/ops-setup-wave-d-dns.mjs --dry-run

# Tạo DNS records thật
node scripts/ops-setup-wave-d-dns.mjs

# Verify propagation
node scripts/ops-verify-zone-activation.mjs
```

### Bước 4: Deploy workers với strict secrets

```bash
# Deploy home, member, vc workers với route
node scripts/deploy-workers.mjs --worker home --strict-secrets
node scripts/deploy-workers.mjs --worker member --strict-secrets
node scripts/deploy-workers.mjs --worker vc --strict-secrets
```

### Bước 5: Deploy Wave D Pages

```bash
# Deploy thật
node scripts/deploy-wave-d-pages.mjs --branch main

# Verify live
node scripts/verify-wave-d-public-publish.mjs
```

### Bước 6: Payment checkout test

```bash
# Test với API key
export PAY_IAI_ONE_API_KEY=your_rotated_key
node scripts/ops-test-payment-checkout.mjs
```

Kết quả mong đợi: `Payment gate: GREEN`

### Bước 7: Smoke test toàn bộ

```bash
npm run check
node scripts/smoke-access-runtime.mjs
npm run verify:planned-safe:wave:release
node scripts/verify-total-system-release-gate.mjs
```

## 3. Sau khi tất cả green

1. Cập nhật `cloudflare/domain-runtime-truth.json`:
   - Wave D domains: `planned_public` -> `live`
   - Wave C domains (`life`, `invest`): `planned_public` -> `live`
2. Cập nhật VTL_65 Wave E skeleton từ `preparation_only` sang `release_candidate`
3. Team 5 ký release gate
4. Chỉ sau đó mới dọn account cũ

## 4. Rollback

Nếu bất kỳ bước nào fail:
- KHÔNG tiếp tục các bước sau
- Ghi lại error output
- Quay về trạng thái trước đó
- Report vào channel `vtl-team1-runtime-release`
