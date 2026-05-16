# Blockers cần Founder input để leo từ ~55% → 85%

Ngày: 2026-05-16
Tác giả: Claude (autonomous build session)

Hệ thống hiện đã đẩy lên ~55% completion sau session này (lên từ ~32%). Các subsystem
sau **KHÔNG thể tự build hết** vì cần quyết định kinh doanh / tài khoản bên thứ ba —
liệt kê rõ để Founder xử lý từng cái khi sẵn sàng.

---

## 1. KYC verification provider (BLOCKER lớn nhất)

**Hiện trạng**: Data capture (`/api/wallet/kyc/submit`) đã có. ID number được SHA-256.
**Thiếu**: real verification (liveness + ID document scan + sanctions check).

**Cần Founder**:
- Chọn nhà cung cấp: **Veriff** (premium), **Onfido** (premium), **Sumsub** (giá tốt
  VN), hoặc **Trusting Social** (local VN, hợp pháp lý).
- Ký commercial agreement + lấy `KYC_API_KEY` + `KYC_WEBHOOK_SECRET`.
- Cho biết tiered policy: cấp `basic` cần gì, cấp `verified` cần gì.

**Khi có**: Tôi sẽ wire webhook handler trong wallet-runtime để khi provider báo
"verified" → cập nhật `wallet.kyc.level = "verified"` tự động. Khoảng 1 ngày dev.

---

## 2. Payment merchant accounts (production)

**Hiện trạng**: Webhook handlers cho PayPal, Stripe, PAY IAI ONE đã tồn tại trong
`access-runtime.mjs`. Secrets đã nhập (PAY_IAI_ONE_API_KEY / WEBHOOK_SECRET cho
home + member workers).
**Thiếu**: PayPal + Stripe production secrets, smoke test thực với money flow.

**Cần Founder**:
- PayPal: production client ID + secret, webhook ID
- Stripe: live secret key, webhook signing secret
- Test 1 đơn thật mỗi gateway để verify webhook → wallet credit pipeline.

**Khi có**: Nhập 4 secret PayPal + Stripe vào home + member workers (cùng pattern
như PAY_IAI_ONE). Wire webhook → call `/api/wallet/credit` internal. ~2 giờ dev.

---

## 3. Bank rails — payout đến tài khoản ngân hàng thật

**Hiện trạng**: `payout/request` lưu yêu cầu, `payout/settle` chuyển sang withdrawn
(stub).
**Thiếu**: integration với bank API (VietQR Pro, NAPAS, hoặc PAY IAI ONE Disbursement
API).

**Cần Founder**:
- Hợp đồng disbursement (NAPAS Pro, IAI ONE Payout, hoặc một bank API).
- Decision: tự động chi 24/7 hay batch end-of-day có duyệt tay.

**Khi có**: ~3 ngày dev để tự động hoá payout pipeline.

---

## 4. AI Tutor (Claude API integration cho EDU)

**Hiện trạng**: Course schema (`access-model.json`) + course player UI có. Submission
endpoint chỉ echo JSON.
**Thiếu**: real LLM evaluation của practice/output.

**Cần Founder**:
- `ANTHROPIC_API_KEY` (chính tôi không tự cấp được — phải trả Founder).
- Quyết định budget: $X/tháng cap. Có thể dùng claude-haiku-4.5 cho cost.
- Approval prompt template cho từng submission_type.

**Khi có**: Wire endpoint POST `/api/edu/tutor/evaluate` → gọi Anthropic API →
trả về `{ verdict, feedback }` + lưu vào KV. ~2 ngày dev.

---

## 5. Email/SMS delivery thật

**Hiện trạng**: `notify-runtime.mjs` đã build, templates rendered, lưu vào "inbox" KV.
**Thiếu**: delivery layer thật (chưa gửi ra ngoài).

**Cần Founder**:
- Chọn provider: **Resend** (rẻ, dễ), **Mailgun**, **SendGrid**, hoặc dùng AWS SES.
- Cho VN SMS: chọn Twilio, eSMS, hoặc Stringee.
- Verified sender domain (DKIM + SPF trên DNS cho `noreply@vetuonglai.com`).

**Khi có**: Thêm `NOTIFY_EMAIL_PROVIDER_KEY`, wire `delivery_provider="resend"` etc.
~4 giờ dev.

---

## 6. Search index ✅ SHIPPED 2026-05-17 (Pagefind)

**Hiện trạng**: ✅ DONE — Pagefind 1.5.2 static search live trên production.
  - Index 4 domain: vetuonglai.com (11 page), docs.vetuonglai.com, read.vetuonglai.com, edu.vetuonglai.com
  - Auto-rebuild qua `postbuild` chain trong package.json
  - UI bilingual (VI/EN translations) tại `/tim-kiem/` (hub) + `/search/` (docs)
  - JSON-LD `SearchAction` schema → Google Sitelinks search box
  - Live: https://vetuonglai.com/tim-kiem/ + /_pagefind/pagefind-entry.json (200)

**+2% completion** đã đạt. Không còn blocker.

---

## 7. Real verification flow cho VC (lớp xác minh độc lập)

**Hiện trạng**: VC ownership + identity attestation runtime có (1300+ dòng).
Verification challenge issued + verified locally.
**Thiếu**: **second-party attestation** — nghĩa là có người độc lập (không phải user)
xác nhận "tôi đã kiểm tra hồ sơ này".

**Cần Founder**:
- Pool of "issuers" (cá nhân/tổ chức có thể issue VC) — danh sách thật.
- Process: issuer submit attestation → ai approve → published.

**Khi có**: UI cho issuer + approval workflow ~1 tuần dev.

---

## 8. Mobile app (PWA → real Capacitor app)

**Hiện trạng**: PWA manifest có, mobile-app-shell CSS có.
**Cần Founder**: quyết định submit App Store / Google Play hay không. Nếu có, cần
Apple Developer Program ($99/yr) + Google Play Console ($25 once) + tên app + icon
final.

**Khi có**: Capacitor wrap mất ~1 tuần, app store review ~1–2 tuần.

---

## Tổng cost & timeline ước tính (khi Founder unblock)

| Subsystem | Cost / mo | Dev time | Sau khi unlock → % up |
|---|---|---|---|
| KYC (Sumsub) | $50–200 | 1 ngày | +5% |
| Payment full (PayPal + Stripe) | gateway fees ~3% | 2h | +5% |
| Bank payout | gateway fees ~1% | 3 ngày | +3% |
| AI Tutor (Claude API) | $30–500 | 2 ngày | +5% |
| Email (Resend) | $0–20 | 4h | +3% |
| Search (Pagefind) | $0 | 3h | +2% |
| VC issuer pool | — | 1 tuần | +5% |
| Mobile app | $124 once + dev | 2 tuần | +5% |

**Tổng**: nếu Founder unblock 5–8 cái trên, hệ thống nhanh chóng leo lên 85–90%
completion trong 3–4 tuần dev.

---

## Đã làm autonomous trong session này

- Wallet system full v1 (60% — tăng từ 0%)
- Community subsystem (60%)
- Jobs board v1 (50%)
- Affiliate tracking (60%)
- Analytics ingestion (40%)
- Notification queue (50%)
- Admin CMS light (50%)
- CSS bug fix homepage ecosystem cards
- KV binding pattern + auto-deploy via deploy-workers.mjs

Tất cả backend stub có thật, có endpoint, có smoke test pass. Frontend UI cho 6
subsystem mới chưa có (chỉ wallet UI có) — đó là phần tiếp theo cần build, không
bị blocker từ bên ngoài.
