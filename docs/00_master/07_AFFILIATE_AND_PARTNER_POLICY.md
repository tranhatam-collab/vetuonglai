# 07_AFFILIATE_AND_PARTNER_POLICY.md

## Mục đích của file

File này khóa policy Affiliate/Partner cho toàn hệ để tránh:
- mở sai quyền referral
- overpromise thu nhập
- biến hệ thành mô hình multi-tier rủi ro

Đây là source of truth cho product, legal, content, growth, dev, ops.

---

## 1. Nguyên tắc sống còn

1. Affiliate không nằm ở public layer.
2. Affiliate không tự mở khi user chỉ mua Pass.
3. Partner là lớp duyệt theo điều kiện, không phải quyền mặc định.
4. Chỉ chấp nhận `direct referral`, cấm đa tầng (MLM).

---

## 2. Định nghĩa tầng quyền

### 2.1 `future_access_member`

- Được học và dùng member core.
- Chưa có quyền referral payout.

### 2.2 `affiliate_candidate`

- Đã đăng ký nguyện vọng referral.
- Chưa được cấp link kiếm hoa hồng.

### 2.3 `affiliate_active`

- Đủ compliance và policy gates.
- Có referral code/link hợp lệ.

### 2.4 `partner_access`

- Được duyệt theo tier partner.
- Có quyền mở rộng (co-brand, curated campaigns, advanced tools) theo hợp đồng.

---

## 3. Eligibility cho affiliate

User chỉ được chuyển `affiliate_active` khi đủ tất cả:

1. Pass active hợp lệ.
2. Có specialist activity đủ ngưỡng (ownership hoặc completion theo policy).
3. Không có fraud/refund abuse flag.
4. KYC/compliance (nếu market yêu cầu).
5. Đồng ý Affiliate Terms và Disclosure Rules.

---

## 4. Commission model (được phép)

### 4.1 Mô hình

- First-order direct commission.
- Không commission nhiều tầng.
- Không thưởng vì recruit team dưới.

### 4.2 Payout cycle

- Theo kỳ đối soát cố định (ví dụ T+30 hoặc theo legal/finance policy).
- Payout chỉ phát sinh cho giao dịch qua fraud/risk checks.

### 4.3 Hold/review

- Có quyền giữ payout nếu phát hiện vi phạm copy/traffic policy.

---

## 5. Content/claim rules bắt buộc

### 5.1 Được dùng

- “quyền referral theo điều kiện”
- “mở khi đạt tiêu chuẩn hệ thống”
- “hoa hồng theo policy và đối soát”

### 5.2 Không được dùng

- “mua xong có link ngay”
- “ai cũng kiếm được tiền”
- “thu nhập đảm bảo”
- “tuyển người là có tiền”
- “không cần làm gì vẫn có hoa hồng”

---

## 6. Traffic policy

### 6.1 Cấm

- spam email/inbox không đồng ý
- click fraud/self-referral
- brand bidding trái phép
- dùng claim sai sự thật
- tạo FOMO thu nhập

### 6.2 Cho phép

- nội dung giáo dục đúng trust language
- review có disclosure rõ
- chia sẻ case thật có bằng chứng

---

## 7. Tracking và audit

### 7.1 Bắt buộc log

- affiliate_state_change
- referral_click
- attributed_order
- payout_status_change
- violation_flag

### 7.2 Audit fields

- actor
- affiliate_id
- old_state/new_state
- reason_code
- timestamp
- reviewer

---

## 8. Violation ladder

### Level 1

- cảnh báo + yêu cầu sửa copy

### Level 2

- tạm khóa referral link

### Level 3

- hủy affiliate quyền + hold/revoke payout theo policy

---

## 9. Partner policy

### 9.1 Partner tiers

- `partner_basic`
- `partner_curated`
- `partner_strategic`

### 9.2 Yêu cầu tối thiểu

- hồ sơ minh bạch
- fit với trust DNA của hệ
- không xung đột legal/compliance

### 9.3 Quyền theo hợp đồng

- co-brand campaign
- curated access
- sponsor initiatives
- reporting dashboard giới hạn theo role

---

## 10. API / entitlement contract

Entitlements liên quan:

- `affiliate_candidate`
- `affiliate_active`
- `partner_access:<tier>`

Không được mở các entitlement này từ frontend-only logic.

---

## 11. Definition of done

Policy Affiliate/Partner chỉ được xem là xong khi:

1. Có state machine rõ và được backend enforce.
2. Copy guardrails áp vào tất cả landing/referral surfaces.
3. Payout flow có review/hold logic.
4. Audit logs đủ cho legal kiểm tra.
5. Không có ngôn ngữ MLM/overpromise trên public assets.

