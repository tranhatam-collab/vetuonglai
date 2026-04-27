# VC_09_RUNTIME_TRUTH_AND_STATUS

## Mục đích
Ghi lại trạng thái runtime thật của `vc.vetuonglai.com` cho luồng verify, mirror tài sản số, và ownership protection 2 lớp.

## Trạng thái
- status: live_with_verified_runtime_contract
- owner: team_vc_runtime
- last_updated: 2026-04-15

## Runtime snapshot (2026-04-15, ICT)

### 1) Domain và luồng dữ liệu
- VC domain: `https://vc.vetuonglai.com`
- Nguồn dữ liệu:
  - local registry: `/api/certificates.json`
  - NFT mirror: `https://nft.iai.one/api/asset-registrations`
- Verify record:
  - route `/v/:code`
  - endpoint ownership: `/api/vc/ownership/verify?ownership_id=...`

### 2) Security contract
- Bảo vệ ownership: `STRONG_2_LAYER` (L1 real-user + L2 cryptographic signature).
- Hỗ trợ mọi loại file: `*/*` (hash-based verification).
- Policy VC miễn phí cho member đủ điều kiện:
  - `annual_active`
  - `pack_owner`
  - `program_user`
  - `partner`

### 3) Endpoint trạng thái mong đợi
- `GET /api/vc/security/status` -> `vc_security_status`
- `GET /api/vc/protection/eligibility` -> `vc_protection_eligibility` (hoặc `session_required`)
- `POST /api/vc/identity/attest` -> `identity_attested_real`
- `POST /api/vc/ownership/challenge/request` -> `ownership_challenge_created` hoặc `membership_required_for_vc_protection`
- `POST /api/vc/ownership/challenge/verify` -> `ownership_verified`
- `GET /api/vc/ownership/verify` -> `ownership_verified` hoặc `ownership_not_found`

## Secrets và bindings bắt buộc
- `SESSION_COOKIE_SECRET`
- `VC_IDENTITY_ATTESTATION_SECRET`
- `VC_OWNERSHIP_CHALLENGE_SECRET`

Khuyến nghị:
- `VC_OWNERSHIP_RECORD_TTL_SECONDS`
- `VTL_ENV`

Optional:
- `ACCESS_KV_NAMESPACE` (nếu dùng KV persistence thay vì memory fallback)

## Bằng chứng kiểm thử gần nhất
- `npm run smoke:access-runtime` -> pass
- `npm run smoke:vc-ownership-runtime` -> pass

Kết quả xác minh chính:
- free account từ `vetuonglai.com` có thể tạo session `pending_member`.
- sau khi member state được nâng, VC protection trả billing `amount: 0`.
- ownership verification trả `verification.level = STRONG_2_LAYER`.

## Rủi ro mở cần theo dõi
- `npm run build` hiện có thể treo trong môi trường local sandbox (không output, CPU 0) nên `smoke:mobile-pwa` có thể fail do thiếu artifact `dist/member.vetuonglai.com/app/index.html`.
- Rủi ro này không làm thay đổi logic runtime ownership 2 lớp, nhưng ảnh hưởng full local verification pipeline nếu chưa có dist đầy đủ.
