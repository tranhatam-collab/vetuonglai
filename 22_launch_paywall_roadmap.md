# GATEWAY SYSTEM — FILE 22
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 22_launch_paywall_roadmap.md
**Tên:** Lộ trình triển khai Gateway (Phase 1–2)

### 22.1 Sprint plan

```
SPRINT 1 — Backend Foundation (Tuần 1–2)
─────────────────────────────────────────
  □ Database schema: users + payments + magic_links
  □ API: /unlock/initiate + /unlock/payment-intent
  □ Webhook handler: VNPay + MoMo (ưu tiên VN)
  □ Magic link service: generate + validate + invalidate
  □ SSO cookie: cross-domain .vetuonglai.com
  □ Auth middleware: check is_unlocked mọi route

SPRINT 2 — Frontend Gateway (Tuần 3–4)
─────────────────────────────────────────
  □ /unlock/ page: email → payment selection
  □ /unlock/success/ page: magic link sent
  □ /magic/[token] handler: validate + set cookie
  □ <GatewayOverlay /> component (soft + hard)
  □ <TeaserBlock /> cho 12 subdomain
  □ <UnlockCTA /> sticky component

SPRINT 3 — Demo Kit (Tuần 5–6)
─────────────────────────────────────────
  □ Demo: edu. (video 60s + AI Tutor 3 queries)
  □ Demo: vc. (interactive verify widget)
  □ Demo: work. (3 job cards mockup)
  □ Demo: ai. (live AI query — 3/day/IP)
  □ Demo: market. (3 product previews)
  □ Demo: community. (read-only thread)

SPRINT 4 — Content Layer & SEO (Tuần 7–8)
─────────────────────────────────────────
  □ 12 SEO anchor articles (1 per subdomain)
  □ Apply teaser formula cho mọi existing page
  □ Schema markup cho tất cả trang public
  □ Submit sitemap Google Search Console
  □ Test Lighthouse score > 90 mỗi subdomain

SPRINT 5 — Testing & Launch (Tuần 9–10)
─────────────────────────────────────────
  □ E2E test: payment flow (cả 3 gateway)
  □ E2E test: magic link (valid + expired + used)
  □ E2E test: cross-domain SSO
  □ Test trên 5 browsers + iOS + Android
  □ Soft launch: 50 user beta
  □ Collect feedback, fix critical bugs
  □ Public launch
```

### 22.2 Go/No-go checklist trước launch

```
TECHNICAL:
  □ Payment thật test với VNPay sandbox
  □ Payment thật test với MoMo sandbox
  □ Payment thật test với Stripe test mode
  □ Magic link gửi email < 30 giây
  □ SSO hoạt động trên tất cả subdomain
  □ is_unlocked persistent sau 30 ngày
  □ Refund flow hoạt động
  □ SSL certificate toàn bộ *.vetuonglai.com

CONTENT:
  □ 12 teaser blocks đã viết + approve
  □ 12 SEO anchor articles đã publish
  □ 8 demo kits hoàn chỉnh
  □ Email magic link đã test (không vào spam)
  □ Welcome dashboard content hoàn chỉnh

LEGAL:
  □ Terms cập nhật: đề cập Gateway 2 USD
  □ Refund policy cụ thể: 7 ngày
  □ Privacy: payment data lưu như thế nào
  □ Đăng ký cổng thanh toán hợp lệ (NHNN)

ANALYTICS:
  □ Track: gateway_page_view
  □ Track: payment_initiated
  □ Track: payment_success / failed
  □ Track: magic_link_clicked
  □ Track: first_content_view (after unlock)
  □ Funnel dashboard setup
```

### 22.3 KPI theo dõi sau launch

```
FUNNEL METRICS (daily):
  Teaser impressions → CTA clicks     (target: 5–10%)
  CTA clicks → Payment initiated      (target: 30–50%)
  Payment initiated → Payment success (target: 70–85%)
  Payment success → Magic link click  (target: 90%+)
  Magic link click → First action     (target: 80%+)

BUSINESS METRICS (weekly):
  Daily new unlocks
  Revenue ($2 × new unlocks)
  Refund rate (target: < 5%)
  Time to first action after unlock (target: < 10 phút)

RETENTION METRICS (monthly):
  30-day return rate after unlock
  Upgrade rate: gateway → Pro/Elite
  NPS of unlocked users
```
