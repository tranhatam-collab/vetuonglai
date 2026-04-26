# GATEWAY SYSTEM — FILE 15
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 15_paywall_unlock_strategy.md
**Tên:** Chiến lược Gateway 2 USD Lifetime + Flow kỹ thuật

### 15.1 Triết lý định giá

```
2 USD không phải giá vé xem nội dung.
2 USD là khoản đầu tư tượng trưng để:
  → Lọc người nghiêm túc khỏi người tò mò
  → Tạo commitment tâm lý ("tôi đã quyết định")
  → Mở toàn bộ hệ sinh thái vĩnh viễn
  → Bắt đầu hành trình cá nhân hóa

Người không sẵn sàng trả 2 USD = chưa sẵn sàng
  → Không phải target audience của VTL
  → Đây là filter tự nhiên, không phải rào cản
```

### 15.2 Tên gọi chính thức

```
KHÔNG dùng:
  ❌ "Paywall"
  ❌ "Mua quyền truy cập"
  ❌ "Trả phí để xem"
  ❌ "Premium membership"

DÙNG:
  ✅ "Future Access Gateway"
  ✅ "Kích hoạt hành trình"
  ✅ "Mở Tương Lai của bạn"
  ✅ "Bước vào hệ"
  ✅ "2 USD — một lần — mãi mãi"
```

### 15.3 Kiến trúc 4 lớp truy cập

```
LAYER 0 — DISCOVER (Public, Google index)
────────────────────────────────────────────
Mọi subdomain đều có:
  • Teaser 1–3 dòng đánh trúng pain point
  • Demo mini (30–60s video hoặc interactive)
  • 1–2 bài blog/guide hoàn chỉnh miễn phí (SEO anchor)
  • Social proof: số VC badges, số users, stories thật
  → KHÔNG cần login, KHÔNG cần trả tiền

LAYER 1 — HOOK (Demo, chưa cần trả tiền)
────────────────────────────────────────────
  • Demo course: bài đầu tiên xem được
  • Demo AI: 3 câu hỏi miễn phí
  • Demo job board: xem listing nhưng không apply
  • Demo market: xem sản phẩm nhưng không mua full
  → Tạo curiosity → dẫn tự nhiên đến Gate

LAYER 2 — GATE (2 USD, một lần)
────────────────────────────────────────────
  CTA: "Mở toàn bộ Tương Lai của bạn — 2 USD"
  → Click → Payment page
  → Thanh toán → Magic link gửi email
  → Click magic link → Unlock vĩnh viễn
  → Dashboard cá nhân hóa xuất hiện

LAYER 3 — FULL ACCESS (Sau unlock)
────────────────────────────────────────────
  • Toàn bộ nội dung tất cả subdomain
  • Dashboard + Journey Engine
  • AI Tutor cơ bản
  • Job board apply
  • VC claim
  → Upsell Pro/Elite/Partner theo hành trình
```

### 15.4 Cấu trúc content theo lớp (mỗi subdomain)

```
edu.vetuonglai.com/khoa-hoc/[slug]/

LAYER 0 (public):
  • Title + meta description (SEO)
  • Mô tả khóa học 200 từ
  • Bài 1 xem hoàn toàn miễn phí
  • Teaser: "Sau khóa học này, bạn sẽ..."
  • Demo: video trailer 60s

LAYER 1 (hook — không login):
  • Preview bài 2: xem 2 phút đầu
  • AI Tutor: hỏi 3 câu về chủ đề

LAYER 2 (gate):
  • Blur overlay sau bài 1
  • CTA: "Mở toàn bộ khóa học này và
          tất cả nội dung VTL — 2 USD"

LAYER 3 (unlocked):
  • Toàn bộ bài học
  • AI Tutor không giới hạn
  • Output submission
  • VC claim flow
```

### 15.5 Flow kỹ thuật chi tiết

```
BƯỚC 1: User vào bất kỳ trang nào
  → Check cookie/JWT is_unlocked
  → Nếu true: hiển thị full content
  → Nếu false: hiển thị LAYER 0 + LAYER 1

BƯỚC 2: User click CTA "Mở Tương Lai"
  → Redirect: member.vetuonglai.com/unlock/
  → Lưu: utm_source, referring_page, intent

BƯỚC 3: Payment page
  → Email input (lưu intent trước khi pay)
  → Chọn phương thức: MoMo / VNPay / Stripe
  → Hiển thị: "2 USD = 50.000 VNĐ — một lần — mãi mãi"
  → Confirm → Redirect payment gateway

BƯỚC 4: Payment success
  → Webhook nhận từ gateway
  → api.vetuonglai.com/webhook/payment-success
  → Tạo user account (nếu chưa có)
  → Set is_unlocked: true (permanent)
  → Set JWT token + refresh token
  → Gửi magic link về email

BƯỚC 5: Magic link click
  → Validate token (expire 24h)
  → Set session cookie toàn hệ (*.vetuonglai.com)
  → Redirect: member.vetuonglai.com/welcome/
  → Welcome dashboard + Journey Engine

BƯỚC 6: Subsequent visits
  → Check JWT từ member. (SSO)
  → Tự động unlock mọi subdomain
  → Không cần login lại
```

### 15.6 Xử lý edge cases

```
CASE 1: Thanh toán thành công nhưng không nhận email
  → Trang sau payment: "Kiểm tra email + Resend button"
  → Resend giới hạn 3 lần / 24h
  → Support: link chat trực tiếp

CASE 2: Magic link hết hạn (> 24h)
  → Trang: "Link đã hết hạn"
  → CTA: "Gửi lại link mới" (verify bằng email)

CASE 3: Muốn dùng email khác
  → Support flow: verify payment → đổi email

CASE 4: Refund request
  → Policy: refund trong 7 ngày nếu chưa dùng > 30 phút
  → Sau refund: thu hồi is_unlocked
  → Log để chống abuse

CASE 5: Share magic link cho người khác
  → Magic link 1-time use (1 device per link)
  → Sau click đầu tiên: invalidate link
  → Session gắn với email, không phải device
```
