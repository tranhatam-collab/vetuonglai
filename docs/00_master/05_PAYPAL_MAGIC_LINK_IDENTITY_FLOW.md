# 05_PAYPAL_MAGIC_LINK_IDENTITY_FLOW.md

## Mục đích của file

File này khóa luồng kỹ thuật chuẩn cho Future Access Pass theo trục:

- `candidate_email`
- PayPal subscription checkout
- webhook verification
- member provisioning
- magic-link login
- entitlement activation
- renewal, grace period, expiry, cancellation, refund handling

Đây là file source of truth dùng chung cho:

- product
- backend
- auth
- ops
- legal
- content
- growth

---

## 0. Phạm vi và trạng thái triển khai

### 0.1 Trạng thái roadmap

- Scope thanh toán đang **defer khỏi release non-payment hiện tại** theo quyết định vận hành.
- Tuy nhiên toàn bộ logic ở file này phải được khóa sẵn để khi mở payment không tạo drift giữa team.

### 0.2 Nguyên tắc triển khai

- Không ship payment flow nửa vời.
- Không claim public là “đã mở pass” nếu chưa có webhook provisioning chạy thật.
- Không mở entitlement dựa vào client redirect/success page.

---

## 1. Nguyên tắc kiến trúc bắt buộc

### 1.1 Identity != Entitlement

- Magic link chỉ xác định danh tính và tạo session.
- Entitlement chỉ được quyết định ở backend bằng runtime truth từ payment + account state.

### 1.2 Backend webhook là nguồn sự thật duy nhất

Chỉ webhook hợp lệ mới được dùng để:

- activate member
- set subscription state
- grant/revoke entitlement
- ghi audit chính thức

Không được dùng làm nguồn sự thật:

- query params `success=true`
- frontend thank-you page
- local storage
- user self-report

### 1.3 Idempotency bắt buộc

Mọi xử lý webhook/provisioning phải idempotent để tránh cấp quyền lặp.

---

## 2. Product taxonomy và mã chuẩn

### 2.1 Taxonomy

- `PASS` = subscription access (Future Access Pass)
- `PACK` = one-time specialist add-on
- `PROGRAM` = cohort/deep guided experience
- `PARTNER` = quyền nâng cao có duyệt

### 2.2 Pricing rule

- Year 1: `3 USD`
- Year 2+: `99 USD/year`

### 2.3 Product code đề xuất

- `FUTURE_ACCESS_PASS_ANNUAL`
- `SPECIALIST_PACK_<pack_id>`

---

## 3. State machine tổng

### 3.1 Candidate/member states

- `candidate_created`
- `checkout_initiated`
- `payment_pending`
- `provision_pending`
- `member_active`
- `grace_period`
- `expired`
- `cancel_at_period_end`
- `canceled`
- `revoked_refunded`

### 3.2 Subscription states

- `trialing` (optional)
- `active`
- `past_due`
- `grace`
- `expired`
- `canceled`
- `refunded` / `chargeback`

### 3.3 Entitlement states

- `granted`
- `grace`
- `revoked`

---

## 4. Luồng chuẩn end-to-end

### 4.1 First purchase happy path

1. User click CTA: `Mở toàn bộ hệ của bạn`.
2. FE gọi API tạo `candidate` bằng email.
3. Backend trả checkout URL PayPal subscription.
4. User thanh toán trên PayPal.
5. PayPal gửi webhook về backend.
6. Backend verify chữ ký webhook + kiểm tra idempotency key.
7. Backend upsert member + subscription.
8. Backend grant entitlement `future_access_member`.
9. Backend gửi magic link đến email candidate.
10. User click magic link -> login -> tạo session.
11. Dashboard tải profile + entitlements + next steps.

### 4.2 Renewal success

1. PayPal renewal charge thành công.
2. Webhook renewal success đến backend.
3. Backend kéo dài `expires_at`, giữ `active`.
4. Entitlement được renew liên tục, không gián đoạn session.

### 4.3 Renewal fail + grace

1. Renewal thất bại.
2. Backend set `grace_period` (đề xuất 7 ngày).
3. UI hiển thị cảnh báo + CTA renew.
4. Nếu pay lại trong grace -> quay về `active`.
5. Hết grace chưa thanh toán -> `expired`, entitlement revoke.

### 4.4 Cancel at period end

1. User tắt auto-renew.
2. State = `cancel_at_period_end`.
3. Vẫn giữ quyền đến `expires_at`.
4. Đến hạn -> `canceled` + revoke entitlement.

### 4.5 Refund/chargeback

1. Webhook refund/chargeback hợp lệ.
2. Backend set subscription `refunded`/`chargeback`.
3. Entitlement chuyển `revoked_refunded` theo policy.
4. Ghi audit + hiển thị disclosure rõ cho user.

---

## 5. Candidate email contract

### 5.1 Bắt buộc lưu

- `candidate_id`
- `candidate_email`
- `source_domain`
- `source_page`
- `utm_context` (optional)
- `created_at`
- `checkout_provider`
- `provider_checkout_ref`

### 5.2 Quy tắc

- Candidate email phải normalized (lowercase, trimmed).
- Candidate không tự động có quyền member.
- Candidate record có TTL chống pending vô hạn.
- Email mismatch phải vào flow confirm, không auto-merge rủi ro.

---

## 6. PayPal integration contract

### 6.1 Provider mode

- Dùng PayPal Subscription (không one-time order cho Pass).
- Tách rõ plan intro year và renewal year theo subscription logic.

### 6.2 Webhook bắt buộc xử lý

- subscription activated
- payment completed
- payment failed
- subscription canceled
- subscription expired
- refund / dispute

### 6.3 Verification bắt buộc

- Verify signature mỗi webhook request.
- Reject event không verify được.
- Log đầy đủ `event_id`, `event_type`, `received_at`, `verification_status`.

### 6.4 Idempotency

- Khóa xử lý theo `provider_event_id`.
- Nếu event đã xử lý -> return success idempotent, không chạy provisioning lại.

---

## 7. Normalized payment event model

Mọi gateway event phải map về model nội bộ:

- `payment.subscription.activated`
- `payment.subscription.renewed`
- `payment.subscription.payment_failed`
- `payment.subscription.canceled`
- `payment.subscription.expired`
- `payment.subscription.refunded`

Trục quyết định entitlement chỉ dùng normalized events.

---

## 8. Provisioning contract

Sau webhook hợp lệ:

1. Resolve candidate/member identity.
2. Upsert member record.
3. Upsert subscription record.
4. Grant/revoke entitlement theo state.
5. Gửi magic link khi chuyển sang active lần đầu.
6. Emit audit event + telemetry event.

### 8.1 Provisioning must be atomic

- Nếu update subscription fail -> rollback entitlement changes.
- Nếu gửi magic link fail -> retry queue, không rollback member active.

### 8.2 Retry policy

- Retry theo backoff cho tác vụ tạm lỗi.
- Dead-letter queue cho event thất bại quá ngưỡng.
- Có reconciliation job chạy định kỳ.

---

## 9. Magic-link auth contract

### 9.1 Token rules

- one-time token
- short TTL
- invalid sau khi dùng
- chống replay

### 9.2 Login behavior

- Không password flow cho luồng này.
- Sau login phải hydrate:
  - profile
  - subscription status
  - entitlements
  - next steps

### 9.3 Cross-domain session

- Session cần dùng được xuyên các domain member-ready.
- Logout phải thu hồi session toàn hệ.
- Mọi trang protected phải xác thực server-side.

---

## 10. Entitlement matrix

### 10.1 Core entitlements

- `public_access` (always)
- `future_access_member` (pass active/grace policy)
- `specialist_pack_access:<pack_id>`
- `verified_builder`
- `partner_access`

### 10.2 Rule theo trạng thái pass

#### Pass `active`

- mở member layer core domains
- mở dashboard cá nhân
- mở recommendation và cross-domain visibility

#### Pass `grace`

- có thể giữ member core có cảnh báo (policy quyết định)
- bắt buộc hiển thị renewal CTA

#### Pass `expired` / `canceled`

- revoke `future_access_member`
- giữ login để renew
- giữ public content access

#### Pack purchased nhưng pass expired

- pack ownership vẫn lưu
- UI nêu rõ cần active pass để dùng full workflow toàn hệ

---

## 11. API contracts tối thiểu

### 11.1 Candidate + checkout

- `POST /api/member/candidate`
- `POST /api/payment/pass/checkout`

### 11.2 Webhook

- `POST /api/payment/webhooks/paypal`

### 11.3 Session + profile

- `GET /api/member/session/current`
- `GET /api/member/entitlements`
- `GET /api/member/dashboard`

### 11.4 Renewal/status

- `GET /api/member/subscription/status`
- `POST /api/member/subscription/renew`
- `POST /api/member/subscription/cancel`

---

## 12. UX states và copy chuẩn

### 12.1 Payment success, provisioning pending

- “Thanh toán của bạn đã được ghi nhận. Hệ thống đang kích hoạt quyền truy cập.”

### 12.2 Email mismatch

- “Chúng tôi cần xác nhận lại email dùng để mở hệ.”

### 12.3 Grace period

- “Quyền truy cập của bạn sắp hết hạn. Gia hạn để tiếp tục hành trình.”

### 12.4 Expired

- “Quyền truy cập của bạn đã hết hạn. Bạn có thể gia hạn để tiếp tục.”

### 12.5 No entitlement

- “Nội dung này cần quyền truy cập tương ứng.”

---

## 13. Observability và audit bắt buộc

### 13.1 Logs

- webhook receive/verify/result
- provisioning start/success/fail
- entitlement grant/revoke
- magic link send success/fail

### 13.2 Metrics

- checkout init rate
- payment success rate
- webhook verify fail rate
- provisioning latency
- magic-link login success rate
- grace->renew conversion rate

### 13.3 Audit fields

- `actor`
- `member_id`
- `provider`
- `provider_event_id`
- `action`
- `status_before`
- `status_after`
- `timestamp`

---

## 14. Security và compliance

- Verify webhook signatures 100%.
- Secrets chỉ lấy từ secure runtime, không hard-code.
- Không log full token hoặc PII nhạy cảm.
- Rate-limit webhook endpoint chống abuse.
- Enforce CSRF/anti-replay cho session layer.
- Có alert khi tỉ lệ webhook verify fail tăng bất thường.

---

## 15. Runbook xử lý sự cố

### 15.1 Webhook delay

- Giữ user ở trạng thái `provision_pending` có thông báo.
- Chạy reconciliation job theo provider subscription id.

### 15.2 Provisioning fail

- Retry tự động.
- Nếu vượt ngưỡng -> tạo incident ticket + manual replay event.

### 15.3 Duplicate events

- Idempotency guard chặn cấp quyền lặp.
- Ghi log “duplicate_ignored”.

### 15.4 Manual recovery

- Chỉ ops role được phép manual grant/revoke.
- Mọi thao tác manual phải có audit reason.

---

## 16. Test plan bắt buộc

### 16.1 Kỹ thuật

- unit test cho event mapping/idempotency
- integration test webhook -> provisioning -> entitlement
- e2e test checkout -> login -> dashboard

### 16.2 Cases tối thiểu

- first purchase success
- webhook signature invalid
- duplicate webhook event
- renewal success
- renewal fail + grace
- expired revoke
- refund revoke
- magic-link expired token

### 16.3 Smoke commands (khi mở scope payment)

- `npm run build`
- `npm run check`
- `npm run test`
- `npm run smoke:access-runtime`
- `npm run cloudflare:smoke:endpoints`

---

## 17. Definition of done

Luồng PayPal + magic-link + entitlement chỉ được coi là hoàn tất khi tất cả điều kiện sau đều pass:

1. Capture candidate email trước checkout.
2. Tạo subscription checkout thành công.
3. Webhook verify chữ ký thành công.
4. Provisioning cập nhật member/subscription đúng.
5. Entitlement `future_access_member` được cấp đúng lúc.
6. Magic link gửi và login thành công.
7. Dashboard phản ánh đúng trạng thái member.
8. Renewal/grace/expired xử lý đúng state transitions.
9. Audit log đầy đủ và truy vết được.
10. Ít nhất 2 domain core đọc entitlement đúng ở production runtime.

---

## 18. Phân công team đề xuất

### Team 1 (Backend + Ops)

- checkout API
- webhook verification
- provisioning pipeline
- secrets + runtime rollout

### Team 2 (Frontend + UX)

- candidate email capture UI
- pending/success/error screens
- member dashboard states
- renew/cancel UX flows

### Team 3 (QA + Runtime + Governance)

- contract tests
- production smoke + parity checks
- legal/trust wording checks
- incident runbook validation

---

## 19. Legal/trust copy guardrails

Được dùng:

- “Mở quyền truy cập hệ theo năm”
- “Member access được duy trì khi subscription còn hiệu lực”

Không được dùng:

- “Mua một lần dùng mãi”
- “Mở vĩnh viễn”
- “Trả 3 USD là có mọi thứ trọn đời”

---

## 20. Kết luận

Luồng PayPal + magic-link chỉ có giá trị thật khi 4 lớp được nối kín:

- payment
- webhook provisioning
- identity session
- entitlement runtime

Thiếu một lớp, hệ sẽ tạo trải nghiệm sai và trust drift.

Khi mở lại scope payment sau giai đoạn defer, team phải triển khai đúng file này trước khi công bố public claims liên quan Future Access Pass.
