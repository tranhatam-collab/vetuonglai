# GATEWAY SYSTEM — FILE 18
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 18_payment_magiclink_integration.md
**Tên:** Spec Thanh toán + Magic Link + SSO Unlock

### 18.1 Payment flow spec

```
TRANG /unlock/ (member.vetuonglai.com/unlock/)

Step 1 — Email capture:
  Input: Email
  Button: "Tiếp tục"
  Note: "Email này sẽ là tài khoản của bạn mãi mãi"
  → Validate email format
  → Check: email đã unlock chưa?
    → Nếu rồi: "Email này đã được kích hoạt. Đăng nhập →"
    → Nếu chưa: → Step 2

Step 2 — Payment selection:
  Hiển thị: "2 USD = 50.000 VNĐ — Một lần — Mãi mãi"
  Options:
    [MoMo]    [VNPay]    [ZaloPay]
    [Thẻ quốc tế / Stripe]
  Note nhỏ: "Thanh toán bảo mật. Hoàn tiền trong 7 ngày."
  → User chọn → Redirect payment gateway

Step 3 — Payment gateway:
  VNPay: redirect vnpay.vn với order_info
  MoMo: deeplink hoặc QR
  Stripe: Stripe Checkout (hosted)
  → Return URL: member.vetuonglai.com/unlock/success/
  → Cancel URL: member.vetuonglai.com/unlock/

Step 4 — Payment success page:
  Hiển thị:
    ✅ "Thanh toán thành công!"
    "Magic link đã được gửi đến [email]"
    "Kiểm tra hộp thư (kể cả Spam)"
    [Resend button — active sau 60s]
    [Cần hỗ trợ? Chat ngay]
```

### 18.2 Magic link spec

```
EMAIL MAGIC LINK:

Subject: "Tương lai của bạn đang chờ — Click để vào"

Body:
  "Xin chào,

  Bạn đã chính thức bước vào Về Tương Lai.

  [CTA Button: MỞ TƯƠNG LAI CỦA TÔI]

  Link này có hiệu lực trong 24 giờ.
  Sau khi click, bạn sẽ được unlock
  toàn bộ hệ thống mãi mãi.

  Nếu bạn không yêu cầu điều này,
  hãy bỏ qua email này."

Technical spec:
  Token: JWT signed, expire 24h
  Payload: { email, unlocked_at, token_id }
  One-time use: sau khi click → invalidate token
  URL: member.vetuonglai.com/magic/[token]
```

### 18.3 SSO cross-domain spec

```
SAU KHI MAGIC LINK CLICK:

1. Validate JWT token
2. Create/update user record:
   { email, is_unlocked: true, unlocked_at, plan: "gateway" }
3. Issue session tokens:
   - Access token (JWT, 1h)
   - Refresh token (HttpOnly cookie, 30 ngày)
4. Set cross-domain cookie:
   Domain: .vetuonglai.com (dot prefix = all subdomains)
   Name: vtl_session
   Secure: true, SameSite: Lax
5. Redirect: member.vetuonglai.com/welcome/

SUBSEQUENT REQUESTS (mọi subdomain):
  → Check vtl_session cookie
  → Validate với api.vetuonglai.com/auth/verify
  → Response: { valid: true, user_id, plan, vc_badges[] }
  → Render full content

AUTO-REFRESH:
  → Access token sắp hết → dùng refresh token
  → Refresh token hết → redirect /unlock/login/
  → /unlock/login/: nhập email → gửi magic link mới (free)
```

### 18.4 Webhook handler spec

```
POST api.vetuonglai.com/webhook/payment

Headers: X-Webhook-Signature (verify HMAC)

Body variants:
  VNPay:  { vnp_TxnRef, vnp_ResponseCode, vnp_Amount, ... }
  MoMo:   { orderId, resultCode, amount, ... }
  Stripe: { type: "checkout.session.completed", ... }

Handler logic:
  1. Verify signature
  2. Extract email + amount
  3. Verify amount = 2 USD (hoặc 50.000 VNĐ)
  4. Check idempotency (tránh double-process)
  5. Update DB: users.is_unlocked = true
  6. Trigger: send_magic_link(email)
  7. Trigger: analytics.track("gateway_unlocked")
  8. Return 200 OK

Retry logic:
  → Nếu email send fail: retry 3 lần mỗi 5 phút
  → Nếu vẫn fail: alert team + manual send
```
