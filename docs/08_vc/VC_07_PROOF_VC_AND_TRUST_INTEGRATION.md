# VC_07_PROOF_VC_AND_TRUST_INTEGRATION

## Mục đích
Chốt contract trust cho `vc.vetuonglai.com`: VC là lớp xác minh độc lập, nhận dữ liệu nội bộ và mirror runtime từ `nft.iai.one`, đồng thời phát hành bằng chứng sở hữu 2 lớp cho tài sản số.

## Trạng thái
- status: live_runtime_verified
- owner: team_vc_runtime
- last_updated: 2026-04-15

## Runtime integration đã xác nhận

### 1) Cầu nối `nft.iai.one` -> VC
- `src/data/system.json`: khai báo `nftBridge.registryUrl = https://nft.iai.one/api/asset-registrations` và `verifyUrl = https://vc.vetuonglai.com`.
- `scripts/build.mjs`: trang VC runtime merge local certificates với payload mirror từ `vcRecords` hoặc `registrations[].vcRecord`.
- `workers/vc-worker.mjs`: mọi request `/api/vc/*` đi qua runtime bảo vệ ownership trước khi fallback static assets.

### 2) Vai trò trust
- `nft.iai.one`: bridge/source metadata cho tài sản số.
- `vc.vetuonglai.com`: trust root độc lập để verify record và ownership ID, không phụ thuộc app nguồn.

## Bảo vệ sở hữu 2 lớp mức mạnh nhất

### Layer 1: Real user verification
- Bắt buộc session cookie hợp lệ (`SESSION_COOKIE_SECRET`).
- Bắt buộc gọi `POST /api/vc/identity/attest` với `identity_token` đã verify.
- Token identity phải có:
  - `verification_status` = verified/success/passed.
  - `assurance_level >= 2`.
  - `exp` còn hiệu lực.

### Layer 2: Cryptographic ownership challenge
- `POST /api/vc/ownership/challenge/request` tạo challenge token + signing message.
- `POST /api/vc/ownership/challenge/verify` yêu cầu chữ ký số từ private key của chủ sở hữu.
- Hỗ trợ profile chữ ký theo JWK hợp lệ (ECDSA P-256 hoặc RSA-PSS SHA-256).

### Kết quả xác minh
- Cấp `ownershipId` dạng `VTL-OWN-YYYYMMDD-XXXXXXXXXXXX`.
- Record trả về có:
  - `verification.level = STRONG_2_LAYER`.
  - Layer L1 + L2 đều `verified`.
  - `anchors.ownershipDigestSha256`.
  - `anchors.registryLookupUrl` để tra công khai.

### Hỗ trợ file không giới hạn
- Runtime công bố `acceptedMimeTypes = "*/*"`.
- `acceptedFileTypes = "all"`.
- Không dùng whitelist theo loại file; hệ xác minh theo hash SHA-256 + chữ ký challenge.

## Entitlement và chính sách miễn phí VC
- `GET /api/vc/protection/eligibility` kiểm tra quyền dùng VC protection.
- Các state được bao gồm miễn phí: `annual_active`, `pack_owner`, `program_user`, `partner`.
- Khi đủ điều kiện: billing trả `plan = included_with_membership`, `amount = 0`.
- Khi chưa đủ: trả `membership_required_for_vc_protection` và hướng dẫn đi qua purchase hub ở `vetuonglai.com`.

## API contract hiện hành
- `GET /api/vc/security/status`
- `GET /api/vc/protection/eligibility`
- `POST /api/vc/identity/attest`
- `POST /api/vc/ownership/challenge/request`
- `POST /api/vc/ownership/challenge/verify`
- `GET /api/vc/ownership/verify?ownership_id=...`

## Smoke gate bắt buộc trước release
- `npm run smoke:access-runtime`
- `npm run smoke:vc-ownership-runtime`

Tiêu chí pass:
- luồng free account + member runtime state chạy đúng.
- luồng ownership 2 lớp trả `STRONG_2_LAYER`.
- billing của member đủ điều kiện là `amount: 0`.

## Không được claim sai
- Không claim `nft.iai.one` là trust root chính.
- Không claim có bảo vệ ownership nếu chưa có cả L1 và L2.
- Không claim “AI tự xác thực ownership” khi chưa có chữ ký cryptographic hợp lệ.
