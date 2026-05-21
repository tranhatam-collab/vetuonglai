# Team Update — 2026-05-21

**Từ:** Claude (AI Build Agent)
**Đến:** Dev team + Founder
**Chủ đề:** Trạng thái hệ sinh thái — những gì đã xong, còn lại phải làm gì

---

## ✅ ĐÃ XONG (hoàn tất trong session này)

### 1. Thay thế Resend bằng mail.iai.one trên toàn bộ vetuonglai-system

**File thay đổi:** `workers/lib/notify-runtime.mjs`

Trước đây, toàn bộ 26 email template trong notify-runtime sử dụng Resend:
```js
// CŨ — đã bị xóa hoàn toàn
const RESEND_API_URL = "https://api.resend.com/emails";
async function deliverViaResend(env, record) { ... }
```

Bây giờ dùng mail.iai.one:
```js
// MỚI — mail.iai.one là duy nhất
async function deliverViaMailIAI(env, record) {
  // POST https://mail.iai.one/_mail/v1/send
  // Authorization: Bearer env.MAIL_API_KEY
  // x-workspace-id: env.MAIL_API_WORKSPACE_ID
}
```

Secrets cần có trên worker (đã set từ session 2026-05-20):
- `MAIL_API_KEY` ✅
- `MAIL_API_BASE_URL` ✅ (`https://mail.iai.one/_mail/v1`)
- `MAIL_API_WORKSPACE_ID` ✅ (`vetuonglai.com`)

**Không cần và không dùng nữa:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

Smoke test 7/7 pass sau fix:
```
=== GET /health → 200 ✅ ===
=== POST /send (payment_success) → 202 ✅ ===
=== POST /send (welcome EN) → 202 ✅ ===
=== POST /send (magic_link) → 202 ✅ ===
=== POST /send (with MAIL_API_KEY) → 202 ✅ ===
=== POST /send (no token) → 401 ✅ ===
=== POST /send (bad email) → 422 ✅ ===
✅ ALL SMOKE CHECKS COMPLETE
```

---

### 2. Google OAuth routes thêm vào generic-worker.mjs

Routes mới trên `vetuonglai.com` (vetuonglai-home worker):
- `GET /api/auth/google/start` — redirect đến Google OAuth
- `GET /api/auth/google/callback` — validate state, tạo vtl_session cookie, redirect đến member dashboard

Signup page cập nhật: `member.vetuonglai.com/signup` — nút Google OAuth trỏ đúng URL.

Workers đã deploy: vetuonglai-home (8f643519), vetuonglai-member (a85320e9)

---

### 3. Auth pages có mặt đầy đủ trên toàn hệ sinh thái

Tất cả site cần đăng nhập đều có **Google OAuth button + form** trên trang auth:

| Site | Auth page | Google | Form |
|------|-----------|--------|------|
| tramsaigon.com | /sign-in/ + 7 ngôn ngữ | ✅ | ✅ |
| tueban.com | /auth/ | ✅ | ✅ magic link |
| iaifoundation.com | /sign-in/ | ✅ | ✅ magic link |
| member.vetuonglai.com | /signup | ✅ | ✅ magic link |
| nhachung.org | /dang-ky | ✅ | ✅ |
| omdala.com | /login | ✅ | ✅ |
| lamviec.muonnoi.org | /vi-vn/login + /register | ✅ | ✅ |

---

### 4. tueban.com — hoàn tất cấu hình (session này)

- 8/8 secrets set trên `tueban-api` worker ✅
- Resend → mail.iai.one trong `apps/api/src/auth.ts` ✅
- Frontend auth page `/auth/index.html` tạo mới với Google + magic link ✅
- D1 migrations 0001–0003 applied ✅
- Seed data 32 tables ✅

---

### 5. iaifoundation.com — tạo trang sign-in mới

File: `/Users/tranhatam/Documents/Devnewproject/iaifoundation.com/sign-in/index.html`
- Google OAuth button: `https://api.iaifoundation.com/v1/auth/google/start`
- Magic link form: `https://api.iaifoundation.com/v1/auth/magic-link/request`
- Deployed to iaifoundation-com Pages ✅

---

## ⚠️ FOUNDER PHẢI LÀM (3 việc) — không có Claude không làm được

### 1. Thêm redirect URIs vào Google Console

Vào: https://console.cloud.google.com → Credentials → IAI ONE client → Edit → Authorized redirect URIs

Thêm 3 URI sau (chưa có):
```
https://tueban-api.tranhatam.workers.dev/api/auth/google/callback
https://vetuonglai.com/api/auth/google/callback
https://api.lamviec.muonnoi.org/v1/auth/google/callback
```

**Ảnh hưởng nếu chưa làm:** Google OAuth bị lỗi `redirect_uri_mismatch` trên tueban.com, vetuonglai.com, lamviec.muonnoi.org

---

### 2. vetuonglai.com — cần secrets cho payment & AI (còn ~6%)

Set trên workers `vetuonglai-home` + `vetuonglai-member` qua Cloudflare dashboard hoặc wrangler:
```bash
# Stripe live keys
wrangler secret put STRIPE_SECRET_KEY --name vetuonglai-home
wrangler secret put STRIPE_WEBHOOK_SECRET --name vetuonglai-home

# PayPal live keys
wrangler secret put PAYPAL_CLIENT_ID --name vetuonglai-home
wrangler secret put PAYPAL_CLIENT_SECRET --name vetuonglai-home
wrangler secret put PAYPAL_WEBHOOK_ID --name vetuonglai-home

# AI Tutor
wrangler secret put ANTHROPIC_API_KEY --name vetuonglai-edu-github

# KYC (khi chọn provider xong)
wrangler secret put KYC_API_KEY --name vetuonglai-home
wrangler secret put KYC_WEBHOOK_SECRET --name vetuonglai-home
```

---

### 3. Kiểm tra và kích hoạt GOOGLE_CLIENT_ID trên vetuonglai-home

Secrets Google OAuth đã được set từ session 2026-05-21 (muonnoi-org dedicated client):
- `GOOGLE_CLIENT_ID` = `1027333387020-6c80olge9ppvvimcc5h04k5p9d4cjqhd.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` = set
- `GOOGLE_REDIRECT_URI` = `https://vetuonglai.com/api/auth/google/callback`

Nhưng trong Google Console, client này đang ở **Testing mode** với test users `tranhatam@gmail.com` + `tranhatam66@gmail.com` — cần **publish** ra External khi launch.

---

## 🛠️ DEV TEAM PHẢI LÀM

### 1. Deploy lại sau khi build xong

Build đang chạy (source có thay đổi). Sau khi build xong:
```bash
cd vetuonglai-system
ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7 \
  node scripts/deploy-workers.mjs --workers vetuonglai-home
ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7 \
  node scripts/deploy-workers.mjs --workers vetuonglai-member
```

Hoặc deploy tất cả 7 workers:
```bash
ACCESS_KV_NAMESPACE_ID=4b1329f961744a1aa3056b625c9b33e7 \
  node scripts/deploy-workers.mjs
```

### 2. Kiểm tra smoke test sau deploy

```bash
# Test form email (đã hoạt động từ session trước)
curl -X POST https://vetuonglai.com/api/email/forms/submit \
  -H "Content-Type: application/json" \
  -d '{"type":"contact","name":"Test","email":"test@gmail.com","message":"hello"}'
# Expected: 202

# Test notify send
curl -X POST https://vetuonglai.com/api/notify/send \
  -H "Content-Type: application/json" \
  -H "x-wallet-internal-token: <WALLET_INTERNAL_TOKEN>" \
  -d '{"recipient_email":"test@vetuonglai.com","template":"welcome","lang":"vi","vars":{"first_name":"Test","wallet_address":"vtl_test"}}'
# Expected: 202

# Test notify health
curl https://vetuonglai.com/api/notify/health
# Expected: {"status":"notify_ok","delivery":"mail_iai_one_active",...}
```

### 3. Không cần làm với Resend nữa

- **Xóa** secrets `RESEND_API_KEY` và `RESEND_FROM_EMAIL` trên vetuonglai-home + vetuonglai-member nếu có
- `workers-projects.json` đã cập nhật, không còn list Resend trong requiredSecrets
- mail.iai.one đảm nhiệm hoàn toàn: form emails + magic link + notify (26 templates)

---

## 📊 TRẠNG THÁI TỔNG THỂ HỆ SINH THÁI

### Email provider: mail.iai.one — dùng cho toàn bộ

| Site | Form email | Magic link | Notify/Welcome |
|------|-----------|------------|----------------|
| vetuonglai.com | ✅ | ✅ | ✅ (fixed session này) |
| member.vetuonglai.com | ✅ | ✅ | ✅ |
| tueban.com | ✅ | ✅ | ✅ |
| tramsaigon.com | ✅ | ✅ | ✅ (welcome email) |
| nhachung.org | ✅ | ✅ | — |
| omdala.com | ✅ | ✅ | — |
| iaifoundation.com | ✅ | ✅ | — |
| lamviec.muonnoi.org | ✅ | ✅ | — |
| muonnoi.org | — | ✅ | — |

### Google OAuth: IAI ONE shared client (hầu hết sites)

| Site | Backend routes | Frontend button | Callback URI in Console |
|------|----------------|-----------------|------------------------|
| tramsaigon.com | ✅ | ✅ | ✅ |
| nhachung.org | ✅ | ✅ | ✅ |
| omdala.com | ✅ | ✅ | ✅ |
| iaifoundation.com | ✅ | ✅ | ✅ |
| muonnoi.org | ✅ | — | ✅ |
| tranhatam.com | ✅ | — | ✅ |
| lamviec.muonnoi.org | ✅ | ✅ | ❌ FOUNDER PHẢI THÊM |
| tueban.com | ✅ | ✅ | ❌ FOUNDER PHẢI THÊM |
| vetuonglai.com | ✅ | ✅ | ❌ FOUNDER PHẢI THÊM |

---

## TỔNG KẾT

**Xong chưa?** Về email → **✅ XIN KẾT**. Resend đã bị xóa hoàn toàn khỏi vetuonglai-system. mail.iai.one là sole provider.

**Còn lại duy nhất chưa xong:** 3 Google Console redirect URIs (Founder phải làm — Claude không có quyền vào Google Console), và các live payment/KYC secrets.

---
*Generated: 2026-05-21 by Claude Build Agent*
*Commit: ad793a3 — feat: replace Resend with mail.iai.one in notify-runtime*
