# 12_RUNTIME_TRUTH_MASTER.md

## Mục đích của file

File này là nguồn sự thật vận hành (runtime truth) cho toàn hệ `*.vetuonglai.com`, để mọi team luôn biết:

- cái gì đang chạy thật
- cái gì đang preview/beta
- cái gì còn planned

Mục tiêu:
- tránh overpromise ở front-end/content
- tránh underbuild ở backend/runtime
- đồng bộ founder statement với production reality

---

## 1. Nguyên tắc runtime truth

1. Không claim “live” nếu user public chưa dùng end-to-end.
2. Không claim “planned” nếu public surface đã có giá trị thật.
3. Mọi thay đổi trạng thái phải có bằng chứng runtime.
4. Runtime truth là tài liệu vận hành, không phải marketing copy.

---

## 2. Trạng thái chuẩn

- `LIVE`: public usable end-to-end
- `BETA`: usable nhưng chưa hoàn thiện toàn flow
- `MEMBER_PREVIEW`: public có teaser/pilot, phần sâu mở trong member
- `PLANNED`: chưa có public usable surface
- `INTERNAL`: nội bộ/ops/admin

---

## 3. Current snapshot (2026-04-14)

### 3.1 Public core

- `vetuonglai.com`: LIVE
- `vc.vetuonglai.com`: LIVE
- `green.vetuonglai.com`: LIVE
- `finance.vetuonglai.com`: LIVE
- `edu.vetuonglai.com`: BETA
- `life.vetuonglai.com`: MEMBER_PREVIEW
- `invest.vetuonglai.com`: MEMBER_PREVIEW

### 3.2 Planned destinations

- `member.vetuonglai.com`: PLANNED/BLOCKED BY CUTOVER (khi chưa promote fully)
- `work.vetuonglai.com`: PLANNED
- `market.vetuonglai.com`: PLANNED

### 3.3 Long-term/internal layers

- `community`, `stories`, `mission`, `healing`, `family`, `foundation`, `labs`, `ai`, `live`, `tools`, `affiliate`, `api`, `admin`: PLANNED/INTERNAL theo từng wave

### 3.4 VC trust runtime contract (critical)

- `vc.vetuonglai.com` là trust layer độc lập để verify credential/asset record.
- `nft.iai.one` hiện ở trạng thái BRIDGE: dùng mirror metadata/runtime record, không thay thế trust root của VC.
- Ownership protection ở VC đã chạy theo mô hình 2 lớp:
  - Layer 1: session + real identity attestation (`/api/vc/identity/attest`).
  - Layer 2: cryptographic challenge signature (`/api/vc/ownership/challenge/*`).
- Ownership record hợp lệ phải trả `verification.level = STRONG_2_LAYER`.
- Hệ hỗ trợ mọi định dạng file qua hash-based verification (`acceptedMimeTypes = "*/*"`).
- Chính sách phí: user có member state đủ điều kiện (`annual_active`, `pack_owner`, `program_user`, `partner`) dùng VC protection với chi phí thêm bằng `0`.

---

## 4. Runtime truth record schema

Mỗi feature/domain phải có record:

- `id`
- `surface`
- `owner_team`
- `status`
- `public_url`
- `proof_type` (smoke/log/screenshot/endpoint)
- `last_verified_at`
- `known_risks`
- `next_action`

---

## 5. Bằng chứng nâng trạng thái

Domain/feature chỉ được nâng status khi có đủ:

1. host public truy cập được
2. flow chính dùng được end-to-end
3. smoke test pass
4. copy/disclosure đã sync legal/trust
5. owner team ký xác nhận

---

## 6. Runtime board cadence

- cập nhật 3 lần/ngày: 09:00, 13:30, 18:00 ICT
- publish trong cross-team sync report
- mọi incident phải ghi delta ngay trong ngày

---

## 7. Drift detection rules

Drift xảy ra khi 1 trong các điều kiện:

- nav dẫn vào domain 502 hoặc không usable
- content claim mạnh hơn runtime thật
- entitlement logic khác copy UX
- team report khác kết quả smoke

Khi drift xảy ra:
- tạo incident runtime truth
- chặn publish/campaign liên quan
- rollback claim hoặc fix runtime trong cùng sprint

---

## 8. Non-payment release guardrails

Trong release non-payment:

- không public claims “pass/payment live”
- không route user vào checkout như production flow
- vẫn giữ readiness specs cho payment ở file 05

---

## 9. Ownership

- Team 1: runtime signals + endpoint health
- Team 2: UI/status parity với runtime
- Team 3: governance + trust/legal parity
- Ops: secrets/DNS/cutover records

---

## 10. Definition of done

Runtime truth được xem là đạt khi:

- trạng thái tất cả domain được cập nhật có chứng cứ
- không có mâu thuẫn giữa docs, UI, runtime
- founder/public messaging bám đúng board
- drift incidents < ngưỡng cho phép trong 2 sprint liên tiếp
