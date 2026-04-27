# VTL PAY GATEWAY BRIEF — `pay.iai.one` (VN PRIORITY)

Version: 1.0
Date: 2026-04-16
Status: handoff_to_team_pay
Owner: Team 1 (Platform) + Team Pay

## Mục tiêu

Ưu tiên cổng thanh toán nội địa Việt Nam qua `pay.iai.one` cho hệ `vetuonglai.com`.

## Scope quyết định

1. `pay.iai.one` là gateway ưu tiên cho thị trường VN.
2. PayPal được **defer** ở phase này (không là điều kiện chặn triển khai phase pay.iai.one).
3. Không bật checkout trong app mobile. Checkout tiếp tục đi qua homepage purchase hub.

## Yêu cầu Team Pay (bắt buộc)

## 1) API tạo checkout session

Team Pay cung cấp endpoint server-to-server:

`POST https://pay.iai.one/api/v1/checkout/session`

Request tối thiểu:
- `intent`: `annual-access` hoặc `specialist-pack`
- `pack`: `g1..g9` (bắt buộc khi `intent=specialist-pack`)
- `candidate_email`
- `entry` (domain nguồn: `hub|edu|life|finance|invest|green|member|work|market|vc`)
- `source` (route/surface key)
- `lang` (`vi|en`)
- `return_url`
- `cancel_url`
- `metadata` (object: `slug`, `campaign`, `ref`, `device`, ...)

Response tối thiểu:
- `checkout_url`
- `session_id`
- `provider_ref`
- `expires_at`

## 2) Webhook về member runtime

Team Pay gửi webhook vào endpoint Team 1 (sẽ expose):

`POST https://member.vetuonglai.com/api/access/webhooks/pay/iai-one`

Yêu cầu webhook:
- HMAC SHA256 signature (`x-pay-signature`, `x-pay-timestamp`)
- `event_id` duy nhất (idempotency key)
- retry có backoff nếu nhận non-2xx
- timeout không quá 10s

Event types bắt buộc:
- `subscription.activated`
- `subscription.renewed`
- `subscription.past_due`
- `subscription.cancelled`
- `order.captured`
- `order.refunded`

Payload fields bắt buộc:
- `event_id`
- `event_type`
- `occurred_at`
- `candidate_email`
- `subscription_id` hoặc `order_id`
- `amount`
- `currency`
- `status`
- `intent`
- `pack` (nếu có)
- `metadata` (`entry`, `source`, `slug`, `ref`)

## 3) Mapping sản phẩm

Team Pay cần gửi bảng mapping chính thức:
- `annual-access` -> `plan_code`
- `g1..g9` -> `pack_code`
- currency cho VN (`VND`) và nếu có cross-border (`USD`)

## 4) Môi trường/secret bàn giao cho Team 1

Team Pay phải cung cấp:
- `PAY_IAI_ONE_BASE_URL`
- `PAY_IAI_ONE_API_KEY` (hoặc `CLIENT_ID/CLIENT_SECRET`)
- `PAY_IAI_ONE_WEBHOOK_SECRET`
- `PAY_IAI_ONE_ANNUAL_PLAN_CODE`
- `PAY_IAI_ONE_PACK_CODE_MAP_JSON`
- `PAY_IAI_ONE_TIMEOUT_MS` (khuyến nghị)

## 5) Test/UAT bàn giao

Team Pay cần bàn giao đầy đủ:
1. sandbox account + credentials
2. 6 webhook mẫu đúng event types
3. 6 lệnh curl replay webhook
4. danh sách mã lỗi + thông điệp lỗi chuẩn
5. SLA retry và chính sách duplicate events

## Điều kiện nghiệm thu (Done)

Chỉ xem là done khi:
1. Team 1 gọi được API tạo checkout session với `annual-access` và ít nhất 1 pack (`g1`).
2. Team 1 nhận và verify được đủ 6 webhook event types.
3. Event mapping lên member states/entitlements chạy đúng:
   - subscription active -> `annual_active`
   - order captured -> `pack_owner`
   - refund/cancel/past_due -> revoke/transition theo policy
4. Flow end-to-end đi qua homepage purchase hub ổn định.

## Ghi chú chuyển tiếp

- PayPal sẽ cập nhật sau theo phase riêng.
- Khi Team Pay bàn giao xong contract `pay.iai.one`, Team 1 sẽ patch runtime/check gates để bỏ chặn PayPal trong phase hiện tại.
