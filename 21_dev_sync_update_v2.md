# GATEWAY SYSTEM — FILE 21
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 21_dev_sync_update_v2.md
**Tên:** Đồng bộ cập nhật toàn bộ team DEV (merge V2.1 + Gateway)

### 21.1 Những gì THAY ĐỔI so với V2.0

```
THAY ĐỔI LỚN:

1. Authentication flow
   TRƯỚC: Clerk SSO thuần túy, đăng ký free
   SAU:   Magic link sau payment 2 USD
   IMPACT: Cần thêm payment → magic link flow
           Trước Clerk setup: payment gateway trước

2. Content access control
   TRƯỚC: Public hoàn toàn
   SAU:   4-layer (Public → Hook → Gate → Full)
   IMPACT: Mọi page component cần check is_unlocked
           Blade/overlay component cho locked content

3. JWT payload
   TRƯỚC: { userId, level, vc_badges }
   SAU:   { userId, level, vc_badges,
             is_unlocked, plan, unlocked_at }
   IMPACT: Update tất cả auth middleware

4. Cookie scope
   TRƯỚC: Per-subdomain
   SAU:   domain: .vetuonglai.com (cross-subdomain)
   IMPACT: SSO thực sự cross-domain, 1 cookie dùng toàn hệ
```

### 21.2 Database changes

```sql
-- THÊM VÀO TABLE users:
ALTER TABLE users ADD COLUMN is_unlocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN unlocked_at TIMESTAMP;
ALTER TABLE users ADD COLUMN plan VARCHAR(20) DEFAULT 'free';
  -- plan values: 'free' | 'gateway' | 'pro' | 'elite' | 'partner'

-- TABLE MỚI: payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_vnd INTEGER,
  gateway VARCHAR(20), -- 'vnpay'|'momo'|'stripe'|'zalopay'
  gateway_txn_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending'|'success'|'failed'|'refunded'
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- TABLE MỚI: magic_links
CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  purpose VARCHAR(20), -- 'unlock'|'login'
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INDEX cần thiết:
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_unlocked ON users(is_unlocked);
CREATE INDEX idx_magic_links_token ON magic_links(token);
CREATE INDEX idx_payments_email ON payments(email);
```

### 21.3 API endpoints mới

```
POST /api/unlock/initiate
  Body: { email }
  Response: { status: 'existing'|'new', redirect_url }

POST /api/unlock/payment-intent
  Body: { email, gateway: 'vnpay'|'momo'|'stripe' }
  Response: { payment_url, order_id }

POST /api/webhook/payment (xem File 18)

GET  /api/magic/[token]
  Response: Redirect với Set-Cookie vtl_session

POST /api/magic/resend
  Body: { email }
  Response: { sent: true, next_resend_at }

GET  /api/auth/check
  Headers: Cookie vtl_session
  Response: { authenticated, is_unlocked, plan, user_id }
```

### 21.4 Frontend components mới

```
Components cần build:

1. <GatewayOverlay />
   Props: content_type, referring_url
   Hiển thị: blur + teaser + CTA button
   Variants: soft (blur 40%) | hard (blur 100%)

2. <TeaserBlock />
   Props: subdomain, custom_message?
   Hiển thị: 3 dòng teaser + CTA
   Used on: hero section mọi trang

3. <DemoWidget />
   Props: demo_type (course|job|ai|market|vc)
   Hiển thị: demo tương ứng từng sub

4. <UnlockCTA />
   Props: size (sm|md|lg), variant (primary|sticky)
   Hiển thị: button dẫn đến /unlock/
   Sticky variant: fixed bottom khi scroll

5. <PaymentFlow />
   Steps: Email → Select gateway → Success
   Handles: VNPay/MoMo/Stripe redirect

6. <MagicLinkWaiting />
   Hiển thị: Sau payment, đang chờ click link
   Features: Resend button (60s cooldown)

7. <WelcomeDashboard />
   Hiển thị: Lần đầu sau unlock
   Sections: Journey intro + 4 quick starts
```

## 21.5 Liên kết sang bộ 3 file dev hoàn chỉnh

Để tránh nhồi quá nhiều nội dung vào một file sync, chi tiết triển khai đã được tách sang:

- `DEV_FILE_01_TECH_ARCHITECTURE_AND_DATABASE.md`
- `DEV_FILE_02_GATEWAY_SYSTEM_AND_FRONTEND.md`
- `DEV_FILE_03_ROUTING_SEO_AND_DEPLOYMENT.md`

`21_dev_sync_update_v2.md` giữ vai trò file đồng bộ thay đổi.
Ba file trên là bộ triển khai chi tiết cho team dev.
