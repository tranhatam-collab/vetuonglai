# 10_DEV_EXECUTION_SEQUENCE_MASTER.md

## Mục đích của file

Khóa thứ tự triển khai cho toàn bộ hệ để 3 team dev không đi lệch ưu tiên và không mở scope sai thứ tự.

---

## 1. Nguyên tắc sequencing

1. Runtime truth trước, mở feature sau.
2. Identity/entitlement core trước growth/commercial layers.
3. Core domains trước expansion domains.
4. Mobile V1 bám web runtime, không tạo backend fork.

---

## 2. Execution phases

## Phase 0 — Alignment baseline

- chốt value map + status matrix + trust rules
- khóa naming/docs standards
- chốt telemetry vocabulary

Gate:
- docs master đồng bộ
- cross-team sync report cập nhật

## Phase 1 — Access runtime core (non-payment ready)

- member domain cutover
- session/current ổn định
- routing contract ổn định
- runtime truth không drift

Gate:
- `npm run smoke:access-runtime`
- `npm run cloudflare:smoke:endpoints`

## Phase 2 — Mobile PWA foundation

- app shell tại `member/.../app`
- manifest + service worker + offline fallback
- mobile nav + responsive baseline

Gate:
- installable PWA pass
- relaunch session pass

## Phase 3 — Mobile auth + dashboard

- magic-link/session flow mobile
- dashboard states `visitor/pending/active/pack_owner`
- route guards theo entitlement

Gate:
- session restore pass
- dashboard state render pass

## Phase 4 — EDU + VC mobile core

- edu list/detail/player mobile-first
- VC quick verify
- deep-link commerce CTA về hub

Gate:
- EDU open/continue pass
- VC verify open pass

## Phase 5 — Core web hardening

- root/member/edu/vc parity
- disclosure/trust wording lock
- telemetry + audit fields lock

Gate:
- provider-status green
- policy-bindings green
- routing-contract green

## Phase 6 — Wave 1 subdomains

- life/finance/invest/green
- teaser + member depth + runtime status

Gate:
- teaser contract pass
- runtime status đúng matrix

## Phase 7 — Wave 2 subdomains

- community/work/market/ai
- entitlement-aware navigation
- operations playbooks

Gate:
- content-depth matrix pass
- legal/trust review pass

## Phase 8 — Platform consolidation

- api/admin surfaces
- ops dashboards
- release runbooks và incident runbooks

Gate:
- production smoke bundle pass
- release readiness sign-off

---

## 3. Team ownership by phase

### Team 1 (Platform/Runtime)

- Phase 1, 5, 8 owner
- hỗ trợ phase 2-4 về API/runtime contracts

### Team 2 (Product/Frontend/Mobile)

- Phase 2, 3, 4, 6, 7 owner

### Team 3 (Trust/QA/Governance)

- gate owner xuyên suốt cho phase 0-8
- ký release non-payment

---

## 4. Daily operating cadence

- 09:00 ICT: plan/owner check
- 13:30 ICT: blocker resolution
- 18:00 ICT: readiness snapshot

Artifact bắt buộc:
- cross-team sync report
- day board
- runtime truth board

---

## 5. Stop-the-line conditions

Dừng rollout nếu xảy ra 1 trong các lỗi:

- entitlement sai domain
- payment/provisioning claim bị publish khi chưa live
- trust language vi phạm policy
- route dẫn user vào host 502/không usable

---

## 6. Command gates (tham chiếu)

```bash
npm run build
npm run check
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run verify:team-app:day1:local
npm run verify:team-app:day1:prod
```

---

## 7. Definition of done

Execution sequence chỉ được xem là xong khi:

1. phase gates pass theo đúng thứ tự
2. không mở wave mới khi wave trước chưa đạt gate
3. báo cáo runtime truth trùng với thực tế production
4. team 1/2/3 không có contract drift

