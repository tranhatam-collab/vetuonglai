# VETUONGLAI_HOMEPAGE_CONTENT.md
**Phiên bản:** 1.0 — APPROVED WITH CONDITIONS
**Ngày phát hành:** 27/04/2026
**Trạng thái:** ✅ Duyệt có điều kiện — ready for dev implementation
**Phạm vi:** `vetuonglai.com` — Homepage content + signup + multi-channel registration spec
**Founder Sign-off:** Tâm (Ha Tam Tran)

---

## ⚠️ Compatibility note (2026-04-28)

This file is a **master strategy file** but is no longer the only source of truth for public copy. Read it together with:

- `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md` — public/member/internal split, vocabulary rules.
- `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` — 6 pathways × 7 tiers (replaces the legacy 6-tier model below).
- `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` — referral wording, public vocabulary, anti-MLM statement.

Binding rules when implementing this file in production:

1. **Tier model** — wherever this file says "6-tier" or lists `Free / Explorer / Learner / Builder / Contributor / Partner`, dev must implement the **7-tier model** from PATHWAY_AND_TIER_FRAMEWORK §2 and may present it as the **3-cluster public view** (Khám phá / Tạo giá trị / Cộng tác sâu) from §7. Legacy → new mapping is in §5 of that file.
2. **Affiliate wording** — wherever this file says `Affiliate single-tier`, public render must use **`Giới thiệu minh bạch (1 cấp)` / `Transparent referral (single-tier)`**. The internal identifier `affiliate_single_tier` may stay in code/data only, never in public UI.
3. **Anti-MLM statement** — any homepage section that mentions referral / contributor / collaboration must include the VI+EN anti-MLM statement from MAPPING_LOCK §4.3.
4. **Earning / income wording** — homepage must not show income numbers, payout details, or commission tables (already enforced by §0 of this file).

The body below is preserved as the founder-approved strategy. Where it conflicts with the four rules above, the four rules win.

---

## 0. ĐIỀU KIỆN DUYỆT (CỨNG)

1. ❌ **KHÔNG public claim thu nhập** — homepage tuyệt đối không có "$X/tháng"
2. ❌ **KHÔNG có "Invest Now" CTA** — không có invest button trên homepage
3. ❌ **KHÔNG affiliate multi-tier language** — chỉ single-tier nếu mention
4. ✅ **PHẢI có disclaimer footer** — link sang docs cho mọi điều có thể tạo confusion
5. ✅ **PHẢI bilingual VI/EN** từ ngày launch
6. ✅ **PHẢI mobile-first** — 1 màn hình mobile xem được toàn bộ định hướng

---

## 1. NGUYÊN TẮC THIẾT KẾ HOMEPAGE

### 1.1 Triết lý

> **Homepage không phải sales page. Homepage là cánh cửa.**
>
> Vào nhanh, hiểu nhanh, đăng ký nhanh, tự khám phá thêm trong docs.

### 1.2 3 nguyên tắc cứng

1. **Ngắn gọn:** 1 màn hình mobile (~600px height) hiển thị được tagline + 3 cards + signup CTA
2. **Trung thực:** Không hype, không "earn $1000/month", không tô vẽ tương lai
3. **Mở rộng:** Mọi chi tiết đầy đủ ở docs.vetuonglai.com — homepage chỉ teaser

### 1.3 Mobile-first layout

```
┌─────────────────────────────┐
│  [LOGO]    [VI/EN] [SIGNIN] │ ← Header
├─────────────────────────────┤
│                             │
│      [TAGLINE — 1 dòng]     │ ← Hero
│      [SUB-LINE — 2 dòng]    │
│                             │
│   [Đăng ký miễn phí ▶]      │
│   [Tìm hiểu thêm]           │
├─────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ Cá  │ │ Gia │ │ Đối │   │ ← 3 Product Cards
│  │ Nhân│ │ Đình│ │ Tác │   │
│  └─────┘ └─────┘ └─────┘   │
├─────────────────────────────┤
│   [6-tier Journey Visual]   │ ← Timeline
├─────────────────────────────┤
│   [Mini Signup Form Inline] │ ← Inline form
├─────────────────────────────┤
│   [Footer with legal]       │ ← Footer
└─────────────────────────────┘
```

---

## 2. TAGLINE — 5 OPTIONS CHO FOUNDER CHỌN

### 2.1 Tagline Options (Vietnamese)

#### Option A — Hành Động (Action-oriented)
> **"Học đúng. Làm được. Chứng minh giá trị. Mở ra tương lai."**
>
> Sub-line: *Một hệ giúp bạn từng bước xây tương lai có thể xác minh được.*

**Phù hợp với:** Người Việt yêu hành động cụ thể, không thích hứa hẹn

#### Option B — Định Hướng (Direction-oriented)
> **"Hệ sống, học, làm việc và tạo giá trị có thể xác minh."**
>
> Sub-line: *Bắt đầu miễn phí. Tự xây tương lai bằng đầu ra thật.*

**Phù hợp với:** Định vị nghiêm túc, hợp với docs philosophy

#### Option C — Mời Gọi (Invitation-oriented)
> **"Bắt đầu miễn phí. Tạo đầu ra thật. Mở cơ hội từng bước."**
>
> Sub-line: *Không hứa hẹn. Chỉ trao công cụ để bạn tự bước tới.*

**Phù hợp với:** Tone friendly, dễ tiếp cận

#### Option D — Cam Kết (Honesty-oriented)
> **"Không hứa hẹn. Chỉ trao công cụ để bạn tự xây tương lai."**
>
> Sub-line: *Học, làm, chứng minh, mở rộng — từng bước, có proof.*

**Phù hợp với:** Differentiate khỏi hype platforms

#### Option E — Định Vị Toàn Cầu (Global-positioning)
> **"Future Living OS — từ Việt Nam, cho mọi người."**
>
> Sub-line: *Học có thể xác minh. Làm việc có thể chứng minh. Phát triển có thể đo lường.*

**Phù hợp với:** Position toàn cầu, Vietnam Advantage

### 2.2 English Equivalents

| Option | English Tagline |
|--------|----------------|
| A | *"Learn properly. Work effectively. Prove your value. Build your future."* |
| B | *"An ecosystem to live, learn, work, and create verifiable value."* |
| C | *"Start free. Build real outputs. Unlock opportunities, step by step."* |
| D | *"No promises. Just tools to build your own future."* |
| E | *"Future Living OS — from Vietnam, for everyone."* |

### 2.3 Đề xuất của tôi

**Founder chọn 1 trong 5.** Khuyến nghị cá nhân:
- **Option D** nếu muốn nhấn mạnh khác biệt với MMO/MLM platforms
- **Option B** nếu muốn nghiêm túc, dài hạn
- **Option E** nếu muốn position quốc tế từ đầu

Có thể test A/B 2 options khi launch nếu founder không chắc.

---

## 3. HERO SECTION (ABOVE THE FOLD)

### 3.1 Tiếng Việt

```html
<section class="hero">
  <h1 class="tagline">[CHỌN 1 TRONG 5 TAGLINE]</h1>
  <p class="sub-line">[SUB-LINE TƯƠNG ỨNG]</p>
  
  <div class="cta-group">
    <a href="/signup" class="btn-primary">
      Đăng ký miễn phí ▶
    </a>
    <a href="https://docs.vetuonglai.com" class="btn-secondary">
      Tìm hiểu thêm
    </a>
  </div>
  
  <p class="trust-line">
    Bắt đầu miễn phí. Không cam kết thu nhập. Không bán hàng hóa.
  </p>
</section>
```

### 3.2 English

```html
<section class="hero">
  <h1 class="tagline">[CHOSEN TAGLINE]</h1>
  <p class="sub-line">[CORRESPONDING SUB-LINE]</p>
  
  <div class="cta-group">
    <a href="/signup" class="btn-primary">
      Start Free ▶
    </a>
    <a href="https://docs.vetuonglai.com" class="btn-secondary">
      Learn More
    </a>
  </div>
  
  <p class="trust-line">
    Free to start. No income guarantees. No physical goods.
  </p>
</section>
```

### 3.3 Wording rules cho hero

❌ **KHÔNG được dùng:**
- "Earn $X/month"
- "Get rich"
- "Financial freedom"
- "Passive income"
- "Make money fast"
- "Build a downline"
- "Network marketing"
- "Investment opportunity"

✅ **Được dùng:**
- "Start free"
- "Learn", "Work", "Prove"
- "Verifiable"
- "Build your future"
- "Real outputs"
- "Step by step"

---

## 4. 3 PRODUCT CARDS

### 4.1 Layout

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│      🌱         │ │      🏠         │ │      🤝         │
│                 │ │                 │ │                 │
│  Hành Trình     │ │  Hành Trình     │ │  Hành Trình     │
│  Cá Nhân        │ │  Gia Đình       │ │  Đối Tác        │
│                 │ │                 │ │                 │
│  Personal       │ │  Family         │ │  Partner        │
│  Journey        │ │  Journey        │ │  Journey        │
│                 │ │                 │ │                 │
│  [Mô tả 1 dòng] │ │  [Mô tả 1 dòng] │ │  [Mô tả 1 dòng] │
│                 │ │                 │ │                 │
│  Free → $99/y   │ │  $9–$19/m       │ │  Free → Invite  │
│                 │ │                 │ │                 │
│  [Khám phá ▶]   │ │  [Khám phá ▶]   │ │  [Khám phá ▶]   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 4.2 Card content (Vietnamese)

#### Card 1 — Hành Trình Cá Nhân

```
🌱 Hành Trình Cá Nhân
Personal Journey

Cho cá nhân muốn học, làm, xây hồ sơ verifiable.

✓ Hồ sơ miễn phí + cộng đồng
✓ Chuyên môn sâu chỉ $3–$9
✓ Annual: $99/năm — toàn quyền truy cập
✓ Loyalty cap năm 9 — giá không tăng

[Khám phá Cá Nhân ▶]
```

#### Card 2 — Hành Trình Gia Đình

```
🏠 Hành Trình Gia Đình
Family Journey

Cho phụ huynh + con + người thân.

✓ Phụ huynh quản lý 100%
✓ Kids tuân COPPA + GDPR-K + PDPD
✓ Family Starter $9/tháng (2 người)
✓ Family Plus $19/tháng (4 người)

[Khám phá Gia Đình ▶]
```

#### Card 3 — Hành Trình Đối Tác

```
🤝 Hành Trình Đối Tác
Partner Journey

Cho người vừa học vừa muốn cộng tác.

✓ Tham gia miễn phí
✓ Creator Pro $9/tháng — tools đầy đủ
✓ Giới thiệu minh bạch (1 cấp) — không đa cấp
✓ Cơ hội cộng tác sau khi qualified*

[Khám phá Đối Tác ▶]

*Yêu cầu: hoàn thành chương trình + có proof + 90 ngày platform.
 Thu nhập là khả năng tham khảo, không cam kết.
```

### 4.3 Card content (English)

[Same structure, English text — for brevity, mirror the VI version]

### 4.4 Quy tắc cứng cho cards

- Mỗi card max 5 lines mô tả
- Pricing rõ ràng (không "Contact us for pricing")
- Disclaimer cho card 3 (Đối Tác) bắt buộc — vì có mention earning
- CTA dẫn sang docs hoặc subdomain riêng, KHÔNG dẫn thẳng vào checkout

---

## 5. JOURNEY VISUAL TIMELINE

> **Implementation rule (2026-04-28):** the legacy 6-tier wording below is preserved for context. Dev must render the **7-tier model** (Free → Learner → Builder → Verified Contributor → Paid Collaborator → Project Lead → Investor-ready) or the **3-cluster public view** (Khám phá / Tạo giá trị / Cộng tác sâu) from `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`.

### 5.1 Visual concept (legacy reference — do not ship verbatim)

```
   ●──────●──────●──────●──────●──────●
   1      2      3      4      5      6
  Free   Learner Builder Verified Paid    Project
                        Contrib  Collab  Lead

  Đăng    Học    Có      Có      Có thù  Dẫn dắt
  ký      có     đầu     proof   lao     dự án
  miễn   cấu    ra      được     theo    theo
  phí    trúc           xác      task    project
                        minh
```

### 5.2 Wording bên dưới timeline

```
Bạn đi từ trái sang phải, từng bước.
Mỗi tầng có quyền lợi riêng. Không skip tầng. Không shortcut.

* Earning chỉ mở sau khi đạt tầng 4 (Builder) + 90 ngày + đủ điều kiện.
  Mức thu nhập là khả năng tham khảo, không cam kết.

[Xem chi tiết 6 tầng ▶ docs.vetuonglai.com/contributor]
```

### 5.3 English

```
You progress left to right, step by step.
Each tier has its own benefits. No skipping. No shortcuts.

* Earning unlocks only at Tier 4 (Builder) + 90 days + eligibility.
  Income references are illustrative, not guarantees.

[See full 6-tier guide ▶ docs.vetuonglai.com/contributor]
```

---

## 6. INLINE MINI SIGNUP FORM (CTA SECTION)

### 6.1 Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   Sẵn sàng bắt đầu hành trình của bạn? │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │ Email của bạn                   │  │
│   └─────────────────────────────────┘  │
│                                         │
│   ── HOẶC ──                            │
│                                         │
│   [G Google] [🍎 Apple] [f Facebook]    │
│   [in LinkedIn] [📱 Phone OTP]          │
│                                         │
│   [Đăng ký miễn phí ▶]                  │
│                                         │
│   Bằng cách đăng ký, bạn đồng ý với     │
│   [Terms] và [Privacy].                 │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 Form spec

```javascript
// Mini signup form
{
  fields: [
    {
      type: "email",
      name: "email",
      placeholder: "Email của bạn / Your email",
      required: true,
      validation: "email"
    }
  ],
  oauth_providers: [
    "google",
    "apple",
    "facebook",
    "linkedin",
    "phone_otp"  // SMS or Zalo for VN
  ],
  cta: "Đăng ký miễn phí / Start Free",
  consent_text: "Bằng cách đăng ký, bạn đồng ý với Terms và Privacy.",
  redirect_after: "/onboarding/step-2-goals"
}
```

### 6.3 Quy tắc

- Form trên homepage **chỉ thu email hoặc OAuth** — bước 2 (Goals) sẽ hiện ở /onboarding
- Không hỏi phone trên homepage (giữ friction thấp)
- Không hỏi tài chính, business info ở bước 1
- Auto-detect language từ browser

---

## 7. MULTI-CHANNEL REGISTRATION SPEC ĐẦY ĐỦ

### 7.1 OAuth providers (ưu tiên thứ tự)

| Provider | Priority | Region | Note |
|----------|----------|--------|------|
| **Google** | 1 | Global | Phổ biến nhất |
| **Apple** | 2 | Global (esp. iOS) | Required cho iOS app |
| **Facebook** | 3 | VN + Global | VN users yêu Facebook |
| **LinkedIn** | 4 | Professional segment | Cho creator/freelancer |
| **Phone OTP** | 5 | VN + emerging markets | SMS hoặc Zalo |
| **Email + password** | 6 | Fallback | Always available |

### 7.2 OAuth scope (data requested)

#### Google
```
scopes: ["openid", "email", "profile"]
data_received: email, name, profile_picture
```

#### Apple
```
scopes: ["name", "email"]
data_received: email, name (only on first signin)
note: Apple may relay email — handle with care
```

#### Facebook
```
scopes: ["email", "public_profile"]
data_received: email, name, profile_picture
note: Facebook may not return email if user signed up with phone
```

#### LinkedIn
```
scopes: ["r_liteprofile", "r_emailaddress"]
data_received: email, name, headline, profile_url
note: Used for creator/freelancer positioning
```

### 7.3 Phone OTP flow (Vietnam-specific)

```
1. User nhập số điện thoại
2. System detect VN/+84 → offer Zalo OTP first, SMS fallback
3. User nhận OTP (6-digit, expire 5 min)
4. User nhập OTP
5. Account created with phone as primary identifier
6. Optional: link email later in onboarding
```

**Provider khuyến nghị:** Twilio Verify (global), eSMS / VietGuys (VN)

### 7.4 Social Verification Links (Sau đăng ký, optional)

Sau khi user đã có account, có thể liên kết các social platforms để build verified profile:

| Platform | Verification Method | VC badge |
|----------|--------------------|----------|
| Facebook profile | OAuth + profile URL | "Facebook verified" |
| LinkedIn profile | OAuth + profile URL | "LinkedIn verified" |
| YouTube channel | YouTube API + channel claim | "YouTube creator" |
| TikTok profile | TikTok Display API | "TikTok creator" |
| Instagram | Instagram Basic Display API | "Instagram creator" |
| X / Twitter | Twitter API v2 | "X verified" |
| GitHub | OAuth + commits check | "Developer verified" |
| Personal website | Meta tag verification | "Domain verified" |

**Process:**
1. User → Settings → Linked Accounts
2. Click "Add [Platform]"
3. OAuth flow hoặc verification token
4. System verify → add badge to VC profile

### 7.5 KYC progression

```
┌────────────┐   verify    ┌────────────┐   verify    ┌────────────┐
│  Free      │ ──email──▶  │  Verified  │ ──ID────▶   │  KYC Basic │
│  Member    │             │  Member    │             │  (cho      │
│            │             │            │             │  payout)   │
└────────────┘             └────────────┘             └────────────┘

   $0/$0           $0 (free upgrade)              required if earning
```

---

## 8. FOOTER (CỐ ĐỊNH MỌI PAGE)

### 8.1 Layout

```
─────────────────────────────────────────
                                         
  Về Tương Lai                           
  Future Living OS từ Việt Nam           
                                         
  ┌─ Sản phẩm ─┐  ┌─ Cộng đồng ─┐       
  │ Cá Nhân    │  │ Cộng tác    │       
  │ Gia Đình   │  │ Creator     │       
  │ Đối Tác    │  │ Mentor      │       
  │ Pricing    │  │ Forum       │       
  └────────────┘  └─────────────┘       
                                         
  ┌─ Pháp lý ─┐  ┌─ Liên hệ ─┐         
  │ Terms     │  │ Support    │         
  │ Privacy   │  │ Legal      │         
  │ Refund    │  │ DPO        │         
  │ Disclaimer│  │ Compliance │         
  │ Kids      │  │ Press      │         
  └───────────┘  └────────────┘         
                                         
  ─────────────────────────────────     
                                         
  © 2026 Vetuonglai. All rights reserved.
                                         
  [VI/EN switcher]                       
                                         
  ⚠️ Disclaimer: Vetuonglai không cam kết
  thu nhập. Mọi mức thu nhập là khả năng 
  tham khảo. Mọi đầu tư có rủi ro. Đọc   
  thêm tại docs.vetuonglai.com/legal     
                                         
─────────────────────────────────────────
```

### 8.2 Footer content (Vietnamese)

```html
<footer>
  <section class="footer-brand">
    <h3>Về Tương Lai</h3>
    <p>Future Living OS từ Việt Nam, cho mọi người.</p>
  </section>

  <nav class="footer-nav">
    <div class="footer-col">
      <h4>Sản phẩm</h4>
      <a href="/products#personal">Hành Trình Cá Nhân</a>
      <a href="/products#family">Hành Trình Gia Đình</a>
      <a href="/products#partner">Hành Trình Đối Tác</a>
      <a href="https://docs.vetuonglai.com/pricing">Giá & Thành viên</a>
    </div>

    <div class="footer-col">
      <h4>Cộng đồng</h4>
      <a href="https://docs.vetuonglai.com/contributor">Cộng tác viên</a>
      <a href="https://docs.vetuonglai.com/creator">Creator Program</a>
      <a href="https://docs.vetuonglai.com/work">Work Opportunities</a>
      <a href="https://community.vetuonglai.com">Forum</a>
    </div>

    <div class="footer-col">
      <h4>Pháp lý</h4>
      <a href="https://docs.vetuonglai.com/legal/tos">Terms of Service</a>
      <a href="https://docs.vetuonglai.com/legal/privacy">Privacy Policy</a>
      <a href="https://docs.vetuonglai.com/legal/refund">Refund Policy</a>
      <a href="https://docs.vetuonglai.com/legal/income">Income Disclaimer</a>
      <a href="https://docs.vetuonglai.com/legal/invest">Investment Disclosure</a>
      <a href="https://docs.vetuonglai.com/kids">Kids Safety</a>
    </div>

    <div class="footer-col">
      <h4>Liên hệ</h4>
      <a href="mailto:support@vetuonglai.com">Support</a>
      <a href="mailto:legal@vetuonglai.com">Legal</a>
      <a href="mailto:dpo@vetuonglai.com">DPO (Privacy)</a>
      <a href="mailto:compliance@vetuonglai.com">Compliance</a>
      <a href="mailto:kids-safety@vetuonglai.com">Kids Safety</a>
    </div>
  </nav>

  <section class="footer-trust">
    <a href="https://trust.iai.one" target="_blank" rel="noopener">
      Verified by Trust.iai.one ✓
    </a>
  </section>

  <section class="footer-disclaimer">
    <p class="small-print">
      <strong>Tuyên bố miễn trừ trách nhiệm:</strong>
      Vetuonglai không cam kết bất kỳ mức thu nhập cụ thể nào. 
      Mức thu nhập đề cập trên platform là khả năng tham khảo, 
      phụ thuộc vào kỹ năng, thời gian, chất lượng đóng góp và 
      nhu cầu thị trường. Mọi đầu tư có rủi ro, bao gồm khả năng 
      mất vốn. Vetuonglai không phải nhà tư vấn đầu tư đăng ký.
      <a href="https://docs.vetuonglai.com/legal">Đọc đầy đủ →</a>
    </p>
  </section>

  <section class="footer-bottom">
    <p>© 2026 Vetuonglai. All rights reserved.</p>
    <select class="lang-switcher">
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇬🇧 English</option>
    </select>
  </section>
</footer>
```

### 8.3 Footer content (English)

[Mirror VI version with English text]

---

## 9. VIETNAM ADVANTAGE MESSAGING (OPTIONAL SECTION)

### 9.1 Vị trí

**Khuyến nghị:** Đặt section này **bên dưới 6-tier timeline**, **trước inline signup form**.

**Có thể skip nếu:** muốn homepage tối giản hơn.

### 9.2 Content (Vietnamese)

```html
<section class="vietnam-advantage">
  <h2>🇻🇳 Xây từ Việt Nam, hướng toàn cầu</h2>
  
  <p>
    Tận dụng lợi thế Việt Nam — chi phí cạnh tranh, talent trẻ chất lượng cao, 
    văn hóa làm việc đã được chứng minh — để tạo ra giá trị verifiable 
    có thể export ra thị trường global.
  </p>
  
  <div class="advantage-grid">
    <div>
      ⏰ Múi giờ APAC<br>
      Thuận lợi cho remote work với khách hàng Á-Mỹ
    </div>
    <div>
      🤖 AI Made in Vietnam<br>
      Tận dụng FPT AI, VinAI ecosystem
    </div>
    <div>
      📚 Chất lượng đã chứng minh<br>
      FPT, VNG, CMC outsource toàn cầu
    </div>
    <div>
      🌱 Định vị Trust Layer<br>
      Verifiable infrastructure xuất khẩu
    </div>
  </div>
  
  <p class="small-note">
    Cộng tác viên Việt Nam có thể tận dụng những lợi thế này để xây dựng 
    thu nhập tham khảo. <em>Không cam kết — phụ thuộc kỹ năng và nỗ lực.</em>
  </p>
</section>
```

### 9.3 Content (English)

```html
<section class="vietnam-advantage">
  <h2>🇻🇳 Built from Vietnam, for the world</h2>
  
  <p>
    Leveraging Vietnam's competitive cost, young high-quality talent, 
    and proven work culture to create verifiable value that exports 
    to global markets.
  </p>
  
  <div class="advantage-grid">
    <div>
      ⏰ APAC timezone<br>
      Convenient for remote work with Asia-US clients
    </div>
    <div>
      🤖 AI Made in Vietnam<br>
      Powered by FPT AI, VinAI ecosystem
    </div>
    <div>
      📚 Proven quality<br>
      FPT, VNG, CMC trusted by global brands
    </div>
    <div>
      🌱 Trust Layer positioning<br>
      Exporting verifiable infrastructure
    </div>
  </div>
  
  <p class="small-note">
    Vietnamese contributors can leverage these advantages to build 
    reference-level income. <em>Not guaranteed — depends on skills and effort.</em>
  </p>
</section>
```

---

## 10. INCOME DISCLAIMER PLACEMENT RULES

### 10.1 Bắt buộc hiển thị

Income disclaimer phải xuất hiện ở các vị trí sau (homepage):

1. ✅ **Card 3 — Đối Tác** (vì có mention earning) — small print bên dưới card
2. ✅ **6-tier Timeline** (vì mention "earning" ở tier 4-6) — small print
3. ✅ **Vietnam Advantage section** (vì mention "thu nhập tham khảo") — small print
4. ✅ **Footer** (mọi page) — full disclaimer
5. ✅ **Trust line dưới hero CTA** (1 dòng nhắc nhở: "Không cam kết thu nhập")

### 10.2 Wording ngắn (cho cards/sections)

**Tiếng Việt:**
> *Mức thu nhập tham khảo, không cam kết. Phụ thuộc kỹ năng, thời gian, chất lượng đóng góp và nhu cầu thị trường.*

**English:**
> *Income references are illustrative, not guarantees. Depends on skills, time, contribution quality, and market demand.*

### 10.3 Wording đầy đủ (cho footer)

**Tiếng Việt:**
> ⚠️ **Tuyên bố miễn trừ trách nhiệm:** Vetuonglai không cam kết bất kỳ mức thu nhập cụ thể nào. Mức thu nhập đề cập trên platform là khả năng tham khảo, phụ thuộc vào kỹ năng, thời gian, chất lượng đóng góp và nhu cầu thị trường. Mọi đầu tư có rủi ro, bao gồm khả năng mất vốn. Vetuonglai không phải nhà tư vấn đầu tư đăng ký. [Đọc đầy đủ →](https://docs.vetuonglai.com/legal)

**English:**
> ⚠️ **Disclaimer:** Vetuonglai does not guarantee any specific income level. Income references on the platform are illustrative, depending on skills, time, contribution quality, and market demand. All investments carry risk, including potential loss of capital. Vetuonglai is not a registered investment advisor. [Read full →](https://docs.vetuonglai.com/legal)

### 10.4 KHÔNG hiển thị disclaimer ở

- Card 1 (Cá Nhân) và Card 2 (Gia Đình) — không mention earning
- Hero section chính — giữ ngắn gọn (chỉ trust line)

---

## 11. SEO & METADATA

### 11.1 Page metadata

```html
<head>
  <!-- Vietnamese -->
  <title>Về Tương Lai — Học, Làm, Chứng Minh Giá Trị | Vetuonglai</title>
  <meta name="description" content="Hệ giúp bạn học đúng, làm được, chứng minh giá trị verifiable. Bắt đầu miễn phí. Không hứa thu nhập. Không bán hàng hóa.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Về Tương Lai — Future Living OS">
  <meta property="og:description" content="Học có thể xác minh. Làm việc có thể chứng minh. Phát triển có thể đo lường.">
  <meta property="og:image" content="https://vetuonglai.com/og-image.png">
  <meta property="og:url" content="https://vetuonglai.com">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:locale:alternate" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@vetuonglai">
  
  <!-- Hreflang -->
  <link rel="alternate" hreflang="vi" href="https://vetuonglai.com/vi">
  <link rel="alternate" hreflang="en" href="https://vetuonglai.com/en">
  <link rel="alternate" hreflang="x-default" href="https://vetuonglai.com">
  
  <!-- Schema.org structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vetuonglai",
    "alternateName": "Về Tương Lai",
    "url": "https://vetuonglai.com",
    "logo": "https://vetuonglai.com/logo.png",
    "description": "Future Living OS từ Việt Nam, cho mọi người.",
    "sameAs": [
      "https://facebook.com/vetuonglai",
      "https://linkedin.com/company/vetuonglai",
      "https://twitter.com/vetuonglai"
    ]
  }
  </script>
</head>
```

### 11.2 SEO content rules

- H1: 1 tagline duy nhất
- H2: Section headers (3 product cards, 6-tier, etc.)
- Image alt text bilingual
- Page load < 2s on 3G mobile
- Mobile-friendly (Google PageSpeed > 90)

---

## 12. PERFORMANCE & UX REQUIREMENTS

### 12.1 Performance targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| Total Page Size | < 1MB on first load |

### 12.2 Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader friendly
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible

### 12.3 Mobile-first

- Test breakpoints: 320px, 375px, 414px, 768px, 1024px, 1440px
- Touch targets ≥ 44×44px
- No horizontal scroll
- Form inputs đủ lớn để tap

### 12.4 Browser support

- Chrome / Edge / Firefox / Safari (last 2 versions)
- iOS Safari 13+
- Android Chrome 80+
- IE 11: NOT supported (graceful degradation only)

---

## 13. TECH STACK SUGGESTION

### 13.1 Frontend

```
Framework: Next.js 15 hoặc Astro
Styling: Tailwind CSS v4
Language: TypeScript
i18n: next-intl hoặc Astro i18n
Forms: react-hook-form + zod validation
OAuth: NextAuth.js / Auth.js
Analytics: Plausible (privacy-first) hoặc GA4 với consent
```

### 13.2 Hosting

```
Static: Cloudflare Pages
Edge functions: Cloudflare Workers
Image optimization: Cloudflare Images
CDN: Cloudflare global
Domain: vetuonglai.com (cloudflare DNS)
```

### 13.3 Monitoring

- Sentry: error tracking
- Cloudflare Analytics: traffic
- Plausible: privacy-friendly analytics
- Lighthouse CI: performance regression

---

## 14. CONTENT MANAGEMENT

### 14.1 Hard-coded vs CMS

**Hard-coded (không cần CMS):**
- Tagline (founder approve, ít đổi)
- 3 product cards (đổi theo product strategy)
- Footer links (rare changes)
- Legal disclaimers (lawyer-reviewed only)

**CMS (cho content team):**
- Blog/news (V2)
- Featured stories
- Testimonials (sau khi có thật)
- Updates / changelog

### 14.2 Update workflow

```
1. Content draft
2. Founder review (cho substantive changes)
3. Legal review (cho disclaimer changes)
4. PR with diff
5. Auto-deploy on merge to main
6. Cache purge
```

---

## 15. ACCEPTANCE CRITERIA TRƯỚC KHI LAUNCH HOMEPAGE

### 15.1 Content

- [ ] Tagline final (1 trong 5 options chosen)
- [ ] Sub-line approved
- [ ] 3 product cards với pricing rõ
- [ ] 6-tier timeline visual
- [ ] Inline signup form
- [ ] Vietnam Advantage section (optional)
- [ ] Footer full với legal links
- [ ] Disclaimer present everywhere required
- [ ] Bilingual VI + EN
- [ ] All Vietnamese diacritics đúng
- [ ] All English grammar reviewed

### 15.2 Tech

- [ ] OAuth providers tested (Google, Apple, Facebook, LinkedIn, Phone OTP)
- [ ] Form validation working
- [ ] Responsive: 320px → 1440px
- [ ] Performance targets met
- [ ] Accessibility WCAG 2.1 AA
- [ ] SEO metadata complete
- [ ] Analytics + consent configured
- [ ] Error tracking active

### 15.3 Compliance

- [ ] No public income claims
- [ ] No multi-tier affiliate language
- [ ] No "Invest Now" CTA
- [ ] Income disclaimer present
- [ ] Investment disclaimer in footer
- [ ] Kids policy linked
- [ ] Privacy policy + cookie consent
- [ ] Terms accessible

### 15.4 Founder sign-off

- [ ] Tagline chosen
- [ ] All copy approved
- [ ] Final visual review
- [ ] Mobile preview approved
- [ ] Legal team approved
- [ ] Final go/no-go from founder

---

## 16. POST-LAUNCH MONITORING

### 16.1 Metrics to track (week 1)

- Total signups (Free Member)
- Signup conversion rate (visit → signup)
- OAuth provider distribution
- Bounce rate
- Time on page
- Card click-through rate (Personal vs Family vs Partner)
- Docs link clicks
- Language preference (VI vs EN)
- Geo distribution (VN vs international)
- Mobile vs desktop ratio

### 16.2 A/B test ideas (post-launch, sau 1 tháng baseline)

- 2 taglines (nếu founder không chắc 100%)
- Card order (Personal first vs Partner first)
- CTA copy ("Start Free" vs "Sign up")
- Hero image (illustrative vs photo vs none)

### 16.3 Feedback collection

- Post-signup survey (optional, 1 question)
- Live chat trong dashboard (sau 30 giây nếu user idle)
- Email follow-up week 1: "Cần help gì không?"

---

## 17. INVEST.VETUONGLAI.COM REFERENCE

⚠️ **Quan trọng:** Homepage có thể mention hệ có invest subdomain trong tương lai, **NHƯNG**:

- ❌ KHÔNG có "Invest Now" button
- ❌ KHÔNG có "Become an investor" CTA
- ❌ KHÔNG có email capture cho "interested investors"
- ❌ KHÔNG có expected returns

✅ **Có thể nói:**
- "Cơ hội đầu tư khởi nghiệp có thể mở cho thành viên đủ điều kiện sau 90+ ngày" (chỉ trong docs hoặc Card 3 small print)
- Link sang docs.vetuonglai.com/invest cho ai muốn đọc

✅ **URL chính thức:** `invest.vetuonglai.com` (KHÔNG phải invest.iai.one)

---

## 18. INTERACTION VỚI CÁC SUBDOMAIN KHÁC

### 18.1 Các CTA dẫn đi đâu

```
[Đăng ký miễn phí] → member.vetuonglai.com/signup
[Tìm hiểu thêm]    → docs.vetuonglai.com
[Khám phá Cá Nhân] → docs.vetuonglai.com/products#personal
[Khám phá Gia Đình] → docs.vetuonglai.com/products#family
[Khám phá Đối Tác]  → docs.vetuonglai.com/products#partner
[6-tier guide]     → docs.vetuonglai.com/contributor
[Start Learning]   → edu.vetuonglai.com (sau khi đăng ký)
[Personal Path]    → learn.vetuonglai.com (sau khi đăng ký)
[Work Opportunities] → work.vetuonglai.com (sau khi qualified)
[Trust verify]     → trust.iai.one (external link)
```

### 18.2 Auth state-aware homepage

```
Logged out:
  → Show: full homepage (hero, cards, signup form)
  
Logged in (Free Member):
  → Show: dashboard preview, recommended next steps
  → Hide: signup form
  → Replace CTA: "Vào dashboard" / "Continue Journey"
  
Logged in (Verified+):
  → Redirect to learn.vetuonglai.com (personal dashboard)
  → Or show: "Welcome back, [name]"
```

---

## 19. LAUNCH CHECKLIST CUỐI

Trước khi launch homepage, tick từng item:

### 19.1 Pre-launch

- [ ] Tagline final approved
- [ ] All copy reviewed (VI + EN)
- [ ] Legal review pass (disclaimer, terms link)
- [ ] OAuth providers integrated + tested
- [ ] Analytics configured (with consent)
- [ ] Cookie consent banner ready
- [ ] Privacy policy live
- [ ] Terms of Service live
- [ ] Income Disclaimer page live
- [ ] Investment Risk Disclosure page live
- [ ] Kids Safety page live
- [ ] Refund Policy page live
- [ ] Domain DNS configured (vetuonglai.com)
- [ ] SSL certificate active
- [ ] CDN configured

### 19.2 Launch day

- [ ] Deploy homepage
- [ ] Verify all links work
- [ ] Test signup flow end-to-end (3 OAuth providers minimum)
- [ ] Mobile test (real device)
- [ ] Performance test (Lighthouse)
- [ ] SEO submitted (Google Search Console, Bing Webmaster)
- [ ] Social meta cards verified (Facebook, LinkedIn, Twitter)
- [ ] Monitoring active (Sentry, analytics)

### 19.3 Post-launch (week 1)

- [ ] Daily metrics review
- [ ] Bug triage
- [ ] User feedback collection
- [ ] First 100 signups manual review (spam check)
- [ ] Founder weekly review

---

## 20. SUMMARY — 1 PAGE

**Homepage vetuonglai.com là cánh cửa, không phải sales page.**

✅ **Phải có:**
- 1 tagline rõ (1 trong 5 options)
- 3 product cards (Personal / Family / Partner)
- 6-tier journey timeline
- Inline signup form (email + 5 OAuth providers)
- Footer với legal links + full disclaimer
- Bilingual VI/EN
- Mobile-first

❌ **KHÔNG được có:**
- Public income claims
- "Invest Now" CTA
- Multi-tier affiliate language
- "Get rich" / "Earn $X" / "Passive income"
- Pressure tactics
- Fake testimonials

⚠️ **Disclaimer ở:** Card 3, 6-tier timeline, Vietnam Advantage, Footer (full)

🇻🇳 **Vietnam Advantage:** Optional section, position từ VN cho global

🔒 **invest.vetuonglai.com:** KHÔNG có CTA trên homepage, chỉ mention trong docs

---

**File này LOCKED. Mọi thay đổi nội dung quan trọng cần Founder approve.**
**Version 1.0 — APPROVED WITH CONDITIONS — 27/04/2026**

---

## ✅ HOÀN TẤT BỘ 5 FILE CHIẾN LƯỢC

5 file cho team dev đã hoàn thành:

1. ✅ `VETUONGLAI_PRODUCT_STRATEGY.md` — Sản phẩm + tier + subdomain mapping
2. ✅ `VETUONGLAI_REVENUE_FOR_MEMBERS.md` — 7 channels + payout + KYC
3. ✅ `VETUONGLAI_INVEST_GATING_RULES.md` — 7 điều kiện + 4 giai đoạn + SEC compliance
4. ✅ `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` — 12 trang docs bilingual
5. ✅ `VETUONGLAI_HOMEPAGE_CONTENT.md` — Hero + 3 cards + signup + footer

**Trạng thái:** Tất cả APPROVED WITH CONDITIONS theo founder sign-off.

**Điều kiện cứng phải tuân:**
- Không public claim thu nhập
- Không multi-level affiliate
- Không mở invest trước 90 ngày + KYC + proof
