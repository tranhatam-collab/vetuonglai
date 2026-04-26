# 24_API_SPEC_FULL_V1.md

Status: LOCKED (Non-negotiable)
Scope: API V1 tối thiểu cho vòng lõi `member -> edu -> submission -> vc -> dashboard`
Áp dụng cho: BE · FE · AI · QA · Ops
Quyết định từ nhà sáng lập: Ông Trần Hà Tâm đã ký. Không được thay đổi. Không được thiếu nội dung.

---

## 1) Nguyên tắc chung

- REST đơn giản
- Không over-engineering
- Response nhất quán
- Identity khác Entitlement
- Mọi endpoint thay đổi state phải có log / evidence

### Response chuẩn

```json
{
  "success": true,
  "data": {}
}
```

### Error chuẩn

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mô tả lỗi"
  }
}
```

---

## 2) Auth

### `POST /api/auth/magic-link`

Mục đích: gửi magic link đăng nhập.

Request:

```json
{
  "email": "user@example.com",
  "locale": "vi"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "sent"
  }
}
```

### `POST /api/auth/verify`

Mục đích: xác thực token magic link và tạo session.

Request:

```json
{
  "token": "magic_link_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "ready": true
    }
  }
}
```

---

## 3) User

### `GET /api/user/profile`

Mục đích: lấy hồ sơ thành viên.

### `GET /api/user/journey`

Mục đích: lấy stage hiện tại, next step, progress summary.

---

## 4) Courses

### `GET /api/courses`

Mục đích: danh sách course public / member tùy entitlement.

### `GET /api/courses/:courseId`

Mục đích: chi tiết một course.

### `GET /api/lesson/:id`

Mục đích: chi tiết lesson.

---

## 5) Progress

### `POST /api/progress/start`

Mục đích: đánh dấu bắt đầu lesson.

Request:

```json
{
  "lessonId": "uuid"
}
```

### `POST /api/progress/complete`

Mục đích: đánh dấu hoàn thành lesson.

Request:

```json
{
  "lessonId": "uuid",
  "completionType": "watch|read|submit_required"
}
```

Rule:

- nếu lesson yêu cầu submission thì `complete` không đủ để pass end-state

---

## 6) Submission

### `POST /api/submission`

Mục đích: nộp output cho lesson.

Request:

```json
{
  "lessonId": "uuid",
  "content": "Nội dung bài nộp",
  "attachments": []
}
```

### `GET /api/submission/:id`

Mục đích: xem trạng thái một submission.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "submitted",
    "reviewStatus": "pending"
  }
}
```

---

## 7) Review

### `POST /api/submission/:id/review`

Mục đích: AI / peer / editor review.

Request:

```json
{
  "decision": "approved",
  "notes": "Phản hồi review"
}
```

Rule trạng thái:

- `submitted`
- `in_review`
- `approved`
- `rejected`

---

## 8) VC

### `POST /api/vc/claim`

Mục đích: tạo claim hoặc candidate cho VC sau khi đủ điều kiện.

### `GET /api/vc/:id`

Mục đích: lấy chi tiết credential.

### `GET /api/v/:code`

Mục đích: verify public record.

---

## 9) Journey

### `GET /api/journey/next-step`

Mục đích: trả về hành động tiếp theo tốt nhất cho user.

Response ví dụ:

```json
{
  "success": true,
  "data": {
    "stage": "learn",
    "nextStep": "submit_project",
    "message": "Bạn đã hoàn thành bài học. Bước tiếp theo là nộp output để vào review."
  }
}
```

---

## 10) Entitlement

### `GET /api/access`

Mục đích: trả về entitlement hiện tại.

Response ví dụ:

```json
{
  "success": true,
  "data": {
    "identity": {
      "userId": "uuid"
    },
    "entitlements": [
      "public_access",
      "future_access_member"
    ]
  }
}
```

---

## 11) Rule cuối

API V1 chỉ phục vụ core loop. Không được nhảy sang economy, wallet, affiliate khi loop lõi chưa ổn.
