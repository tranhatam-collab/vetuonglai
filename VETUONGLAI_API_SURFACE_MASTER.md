# VETUONGLAI API SURFACE MASTER

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này khóa mặt bằng API cho dev. Không viết code, nhưng xác định contract mong muốn để FE, BE, data và infra cùng hiểu một cách.

## Nguyên tắc API

- rõ public và protected
- response shape thống nhất
- error shape thống nhất
- có pagination nếu là list lớn
- có schema validation cho request và response

## Auth endpoints

- `POST /api/auth/magic-link`
- `POST /api/auth/verify`
- `POST /api/auth/logout`
- `GET /api/auth/session`

## User profile endpoints

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/:id` cho admin hoặc owner role phù hợp

## Assessment endpoints

- `POST /api/assessments`
- `GET /api/assessments/:id`
- `GET /api/users/me/assessment-summary`

## Course endpoints

- `GET /api/courses`
- `GET /api/courses/:slug`
- `POST /api/courses` admin
- `PATCH /api/courses/:id` admin

## AI Tutor endpoints

- `POST /api/ai/chat`
- `GET /api/ai/context/:userId` nếu cần route nội bộ / admin / debug an toàn
- `POST /api/ai/project-suggest` nếu tách riêng project generation

## Lesson endpoints

- `GET /api/lessons/:slug`
- `POST /api/lessons` admin
- `PATCH /api/lessons/:id` admin

## Progress endpoints

- `GET /api/progress`
- `POST /api/progress`
- `PATCH /api/progress/:id`

## Payment endpoints

- `POST /api/payment/checkout`
- `POST /api/payment/webhook`
- `GET /api/payment/status/:sessionId`

## VC endpoints

- `POST /api/vc/issue`
- `GET /api/vc/verify`
- `GET /api/vc/records/:code`

## Story endpoints

- `GET /api/stories`
- `GET /api/stories/:slug`
- `POST /api/stories` admin or moderated flow

## Community endpoints

- `GET /api/community/groups`
- `POST /api/community/join`
- `GET /api/community/me`

## Search endpoints

- `GET /api/search?q=`

## Admin endpoints

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/courses`
- `GET /api/admin/credentials`

## Audit endpoints

- `GET /api/admin/audit`

## Response shape

Response nên theo form:

```json
{
  "ok": true,
  "data": {},
  "meta": {}
}
```

## Error shape

Error nên theo form:

```json
{
  "ok": false,
  "error": {
    "code": "string_code",
    "message": "human readable message"
  }
}
```

## Pagination rules

List APIs nên có:

- `page`
- `pageSize`
- `total`
- `hasNext`

## Security rules

- auth cho private routes
- admin role cho admin routes
- webhook phải verify signature
- không expose secret-related info trong error response
