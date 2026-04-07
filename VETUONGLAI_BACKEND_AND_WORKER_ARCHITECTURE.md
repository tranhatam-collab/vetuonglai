# VETUONGLAI BACKEND AND WORKER ARCHITECTURE

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này dành cho BE và infra để thống nhất cách sử dụng Cloudflare Worker, API layer, storage, webhook, auth và observability.

## Cloudflare Worker architecture

Hiện tại hệ thống đang có model hybrid giữa Pages và Workers.

Target nguyên tắc:

- Worker dùng cho API, routing cần logic, webhook và special handling
- Pages dùng cho static app delivery nếu phù hợp
- domain nào Worker-fronted phải được ghi rõ trong infra docs

## API gateway logic

Nếu dùng Worker làm API gateway thì cần tách rõ:

- public endpoints
- auth endpoints
- admin endpoints
- webhook endpoints

## KV / R2 / Stream usage

- KV: config nhẹ, cache, flags nếu thực sự cần
- R2: pdf, images, workbook, uploaded assets
- Stream: video learning content

## Route design

Routes phải rõ theo namespace:

- `/api/auth/*`
- `/api/courses/*`
- `/api/progress/*`
- `/api/payment/*`
- `/api/vc/*`
- `/api/admin/*`

## Webhook design

Webhook cần có:

- signature verification
- idempotency handling
- retry-safe design
- audit logging

## Auth design

Ưu tiên model:

- magic link hoặc passwordless
- session có thời hạn rõ ràng
- role-based access cho admin

## VC service integration

VC phải được xem như service nghiệp vụ riêng, dù là cùng deploy trong cùng account.

Cần có boundary rõ giữa:

- issuing logic
- verification logic
- record storage / lookup

## Access control

Cần có tối thiểu các role:

- guest
- user
- moderator
- admin
- trust issuer nếu cần

## Queue / cron nếu cần

Nếu có retry, reminder hay indexing, cần có queue hoặc cron rõ mục đích.

Không dùng cron chỉ để sửa thiếu logic request-time.

## Error handling

- log đủ context
- không lộ secret
- error shape thống nhất
- retry với những path an toàn retry

## Observability

Cần theo dõi:

- API errors
- webhook failures
- verify failures
- auth failures
- route anomalies
