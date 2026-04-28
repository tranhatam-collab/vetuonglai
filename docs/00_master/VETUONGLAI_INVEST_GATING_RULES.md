# VETUONGLAI_INVEST_GATING_RULES.md
**Phiên bản:** 1.0 — APPROVED WITH CONDITIONS
**Ngày phát hành:** 27/04/2026
**Trạng thái:** ✅ Duyệt có điều kiện — gated implementation
**Phạm vi:** `invest.vetuonglai.com` — investment subdomain
**Founder Sign-off:** Tâm (Ha Tam Tran)

---

## ⚠️ Compatibility note (2026-04-28)

This file governs `invest.vetuonglai.com` — the most legally sensitive surface. Read together with:

- `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md` §8 — `invest.primaryNav = false`, no payment form, no checkout, no deal list, no waitlist.
- `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` — invest pathway opens at Tier 7 (Investor-ready). Legacy "Builder (tier 4)" gate in this file is the **earning** floor, not the **invest** floor; invest requires the higher Tier 7 plus the conditions in this file.
- `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` §7 — no public income/invest claims, no "Invest now" CTA, no ROI / expected returns wording.

Binding rules:

1. Public surface for `invest.*` is education-only.
2. Tier 7 (Investor-ready) is **not** an automatic right to invest. Specific opportunities still pass through KYC + jurisdiction + accreditation checks per Section 3 below.
3. Anti-MLM statement applies to any contributor-related copy that touches invest education.

---

## 0. ĐIỀU KIỆN DUYỆT (CỨNG)

1. ❌ **KHÔNG mở invest trước 90 ngày user gắn bó** — không exception
2. ❌ **KHÔNG có "Invest Now" CTA public** — invest là cổng sau cùng
3. ❌ **KHÔNG public expected returns** — bất kỳ con số nào
4. ❌ **KHÔNG dùng `invest.iai.one`** — chỉ `invest.vetuonglai.com`
5. ✅ **PHẢI có accredited investor verification cho US persons**
6. ✅ **PHẢI có legal opinion từ securities lawyer trước khi nhận tiền**

---

## 1. TRIẾT LÝ INVEST GATING

### 1.1 Định vị

> **invest.vetuonglai.com là cổng sau cùng, không phải điểm vào.**
>
> Nó tồn tại để giáo dục, không phải gọi vốn. Để chuẩn bị, không phải bán cơ hội.

### 1.2 Vì sao gate chặt

**Lý do pháp lý (cứng):**
- US SEC: Nhận tiền đầu tư công khai = securities offering, cần register hoặc qualify exemption
- VN: Luật Chứng khoán + Decree 155/2020 — gọi vốn công khai cần ĐKDN/UBCKNN
- EU: MiFID II + Prospectus Regulation
- Penalty nếu vi phạm: hàng triệu USD + criminal liability

**Lý do triết học:**
- User chưa hiểu hệ → dễ bị FOMO
- User chưa có proof → không phải target audience phù hợp
- Investment cần thấu hiểu, không phải emotion

### 1.3 4 giai đoạn rollout

```
Giai đoạn 1: EDUCATION (V3 launch)
  ↓ (sau khi V3 ổn định)
Giai đoạn 2: CASE STUDIES + DUE DILIGENCE
  ↓ (sau khi pháp lý sẵn sàng)
Giai đoạn 3: WAITLIST FOR QUALIFIED USERS
  ↓ (sau khi có legal structure)
Giai đoạn 4: REAL INVESTMENT OPPORTUNITIES (qualified only)
```

**Mỗi giai đoạn cần founder approve riêng. Không skip.**

---

## 2. 7 ĐIỀU KIỆN CỨNG ĐỂ USER VÀO INVEST GATE

User phải đạt **TẤT CẢ** mới được vào `invest.vetuonglai.com`:

### 2.1 Điều kiện cơ bản (Giai đoạn 1+)

1. ✅ **Đăng ký Member 90 ngày trở lên** (không phải 30/60 — đã chốt 90)
2. ✅ **Hoàn thành ít nhất 1 chương trình** trên `edu.vetuonglai.com`
3. ✅ **Có ít nhất 1 proof/credential** từ VC system
4. ✅ **Đạt tầng Builder (tầng 4) trở lên** — xem PRODUCT_STRATEGY Phần 6
5. ✅ **Đọc + click confirm Investment Risk Disclosure**
6. ✅ **Đủ tuổi pháp lý:** ≥18 tuổi (US/VN/EU). Một số quốc gia ≥21

### 2.2 Điều kiện thêm (Giai đoạn 3+ — Waitlist)

7. ✅ **KYC nâng cao:** ID document + address proof + source of funds
8. ✅ **Không có hành vi spam/refund abuse** trong 90 ngày qua
9. ✅ **Đối với US persons: Accredited Investor verification** (SEC Reg D)
10. ✅ **Đối với VN persons: Tuân Luật Chứng khoán** — qualified investor nếu có

### 2.3 Điều kiện thêm (Giai đoạn 4 — Real Investment)

11. ✅ **Đọc + sign Private Placement Memorandum (PPM)** hoặc tương đương
12. ✅ **Cooling-off period 14 ngày** sau khi xem opportunity
13. ✅ **Wire transfer only** — không card, không e-wallet
14. ✅ **AML check passed**

---

## 3. ACCREDITED INVESTOR VERIFICATION (US)

### 3.1 SEC Reg D 506(c) requirements

US persons muốn invest phải qualify **Accredited Investor** theo Rule 501:

**Cá nhân:**
- Net worth > $1M (excluding primary residence), OR
- Income > $200K/năm (cá nhân) hoặc $300K/năm (vợ chồng) trong 2 năm gần nhất, có dự kiến tiếp tục, OR
- Có Series 7, 65, hoặc 82 license

**Tổ chức:**
- Total assets > $5M
- Hoặc tất cả equity owners đều accredited

### 3.2 Verification methods

Hệ phải verify **trực tiếp**, không chỉ self-certification (Reg D 506(c)):

| Method | Chấp nhận |
|--------|-----------|
| Tax returns (2 năm) | ✅ |
| W-2 hoặc bank statements | ✅ |
| CPA/lawyer letter | ✅ |
| Brokerage statements | ✅ |
| Credit report | ✅ (cho net worth) |
| 3rd party verification service | ✅ Recommended |

**3rd party services (đề xuất tích hợp):**
- VerifyInvestor.com
- EarlyIQ
- Parallel Markets
- iCapital

### 3.3 Verification flow

```
1. User trên Giai đoạn 3+ click "I am a US person"
2. Redirect to 3rd party verification service
3. User upload documents
4. 3rd party verify → return status
5. Hệ store verification result + expiry (5 năm theo SEC)
6. User unlocked for Giai đoạn 4 opportunities
```

### 3.4 Non-US persons

- VN persons: Theo Luật Chứng khoán 2019 + Decree 155/2020
- EU persons: MiFID II categorization (retail / professional)
- UK persons: FCA HNW + Sophisticated Investor exemption
- Other: Per local law — case-by-case

---

## 4. GIAI ĐOẠN 1 — EDUCATION (V3 LAUNCH)

### 4.1 Nội dung được phép

Trang `invest.vetuonglai.com` ở Giai đoạn 1 chỉ có:

✅ **Được phép:**
- Bài học về đầu tư cơ bản
- Giải thích các loại đầu tư (stocks, bonds, startup equity, etc.)
- Cảnh báo rủi ro (FOMO, scam, market volatility)
- Case studies công khai (success + failure)
- Due diligence framework
- "How to evaluate a startup" content
- Risk tolerance assessment quiz

❌ **KHÔNG được phép:**
- Bất kỳ "Invest Now" CTA nào
- Pitch của startup cụ thể
- Expected returns
- Email capture cho "interested investors"
- "We're raising" hay "Become an investor"

### 4.2 Nội dung mẫu (cho dev biết build gì)

**Page structure cho Giai đoạn 1:**

```
/invest
├── /education
│   ├── /basics — Investment 101
│   ├── /risks — Why investing is risky
│   ├── /scams — How to spot fraud
│   ├── /due-diligence — DD framework
│   └── /case-studies — Real examples
├── /assessment
│   └── Risk tolerance quiz
└── /resources
    └── External links (SEC.gov, etc.)
```

**KHÔNG có:**
- /invest/opportunities
- /invest/deals
- /invest/waitlist
- /invest/apply

### 4.3 Disclaimer hiển thị mọi page

```
⚠️ EDUCATIONAL CONTENT ONLY

This content is for educational purposes only and does not constitute 
investment advice, an offer to sell securities, or a solicitation of 
an offer to buy securities.

Vetuonglai is NOT a registered investment advisor, broker-dealer, or 
licensed financial professional.

You should consult with qualified professionals before making any 
investment decisions.

Past performance does not guarantee future results.
All investments carry risk, including the potential loss of principal.
```

```
⚠️ CHỈ NỘI DUNG GIÁO DỤC

Nội dung này chỉ phục vụ mục đích giáo dục, KHÔNG phải lời khuyên đầu tư, 
chào bán chứng khoán, hay mời gọi mua chứng khoán.

Vetuonglai KHÔNG phải nhà tư vấn đầu tư đăng ký, công ty chứng khoán, 
hay chuyên gia tài chính có giấy phép.

Bạn nên tham khảo ý kiến chuyên gia có giấy phép trước khi quyết định đầu tư.

Hiệu suất quá khứ không đảm bảo kết quả tương lai.
Mọi khoản đầu tư đều có rủi ro, bao gồm khả năng mất vốn gốc.
```

---

## 5. GIAI ĐOẠN 2 — CASE STUDIES + DUE DILIGENCE

### 5.1 Mở khi nào

Sau khi Giai đoạn 1 ổn định (ít nhất 6 tháng), founder approve, lawyer review.

### 5.2 Nội dung được thêm

✅ **Mở rộng:**
- Detailed case studies (anonymized hoặc public deals)
- Investment terms glossary
- "What questions to ask before investing"
- DD checklist tools (interactive)
- Past startup analyses (educational, not promoting)

❌ **Vẫn KHÔNG được:**
- Specific deal pitches
- "Apply to invest" forms
- Email capture for investors

### 5.3 User unlock requirement

Để vào Giai đoạn 2 content:
- Đạt 7 điều kiện cơ bản (Phần 2.1)
- Pass Risk Tolerance Quiz từ Giai đoạn 1
- Click acknowledge "I understand this is educational only"

---

## 6. GIAI ĐOẠN 3 — WAITLIST FOR QUALIFIED USERS

### 6.1 Mở khi nào

**Pre-conditions (cứng):**
- Pháp lý structure cho real investment đã sẵn sàng
- Lawyer đã review legal entity cho investment vehicle
- Có ít nhất 1 PPM template được lawyer-drafted
- Founder đã ký approve mở Giai đoạn 3
- Compliance officer được hire (nếu cần)

### 6.2 Nội dung được thêm

✅ **Cho qualified users:**
- "Express interest" form (KHÔNG phải invest form)
- Curated opportunity previews (anonymized hoặc preview only)
- 1-on-1 call request với compliance officer
- Educational deep dives về specific opportunity types

⚠️ **Quan trọng:**
- "Express interest" KHÔNG phải commit to invest
- Không có wire instructions
- Không có "Invest Now" button
- User vẫn có thể withdraw bất kỳ lúc nào

### 6.3 Waitlist data

User trên waitlist phải provide:
- Verified accredited investor status (US) hoặc tương đương
- Investment range của interest ($1K–$5K, $5K–$25K, $25K–$100K, $100K+)
- Sectors of interest (vetted list)
- Timeline (interested in 3 months / 6 months / 1 year)
- Source of funds disclosure

### 6.4 Communication rules

**Hệ KHÔNG được:**
- Email mass push specific deals
- Cold call users on waitlist
- Pressure tactics ("Limited spots!" / "Closing soon!")

**Hệ ĐƯỢC:**
- Newsletter educational
- Monthly market commentary
- Opt-in updates
- 1-on-1 if user requests

---

## 7. GIAI ĐOẠN 4 — REAL INVESTMENT OPPORTUNITIES

### 7.1 Pre-conditions tuyệt đối

Trước khi bất kỳ user thật nào invest:

- [ ] **Legal entity** for investment vehicle (LP, SPV, hoặc tương đương)
- [ ] **Securities counsel** retained
- [ ] **Reg D filing** (US) — Form D submitted to SEC
- [ ] **State Blue Sky** filings (states với investors)
- [ ] **PPM** (Private Placement Memorandum) drafted by counsel
- [ ] **Subscription agreement** drafted
- [ ] **Escrow account** (nếu có)
- [ ] **AML compliance officer**
- [ ] **VN compliance** nếu có VN investors (UBCKNN registration nếu cần)
- [ ] **EU compliance** nếu có EU investors (MiFID + Prospectus Regulation)
- [ ] **Founder + Board approval** với written resolution

### 7.2 Subscription flow (when ready)

```
1. Qualified user reviews opportunity (chỉ qualified mới thấy)
2. Click "Request Investment Documents"
3. Lawyer/admin review user's accredited status
4. Send PPM + Subscription Agreement (digital)
5. User reviews — 14-day cooling-off period (mandatory)
6. User signs subscription agreement
7. AML check final
8. Wire transfer to escrow (NEVER credit card / e-wallet)
9. Confirmation + receipt
10. Hold period theo terms (typically 1+ năm cho startup equity)
```

### 7.3 Wording cứng

**Trên opportunity page (cho qualified users):**

```
🔒 PRIVATE PLACEMENT — QUALIFIED INVESTORS ONLY

This investment opportunity is offered under SEC Rule 506(c) of 
Regulation D and is available only to accredited investors who have 
verified their status.

This is NOT an offer to the general public.
This is NOT a solicitation outside this gated portal.

By accessing this content, you acknowledge:
- You are a verified accredited investor
- You understand investments may result in total loss
- You have read and accept the Risk Disclosure
- You will conduct your own due diligence
- This information is confidential

Past performance does not guarantee future results.
No expected returns are guaranteed.
```

### 7.4 KHÔNG được làm tuyệt đối

- ❌ Public marketing of specific deals
- ❌ "Limited time" pressure tactics
- ❌ Guaranteed returns language
- ❌ Comparison to "safe" investments
- ❌ Testimonials of returns
- ❌ Affiliate commission cho referring investors
- ❌ Crypto / token sales (separate legal regime)

---

## 8. PHÁP LÝ TOÀN CẦU PER JURISDICTION

### 8.1 🇺🇸 United States

**Federal:**
- SEC Securities Act 1933 + Exchange Act 1934
- Reg D Rule 506(b) — chỉ accredited, không advertising
- Reg D Rule 506(c) — chỉ accredited verified, có thể advertise
- Reg CF — crowdfunding, retail allowed but limits
- Reg A+ — mini-IPO, more reporting
- Investment Advisers Act 1940
- AML / BSA — KYC required

**State:**
- Blue Sky laws — phải file ở states có investors
- Section 4(a)(2) hoặc Reg D 506 covered securities có federal preemption

**Tax:**
- Form 1099-B nếu có gains
- K-1 nếu LP structure

### 8.2 🇻🇳 Việt Nam

**Federal:**
- Luật Chứng khoán 2019 (sửa đổi)
- Nghị định 155/2020 — chi tiết thi hành
- Nghị định 156/2020 — xử phạt vi phạm
- Thông tư 96/2020 — chào bán riêng lẻ
- Luật Đầu tư 2020 — đầu tư từ nước ngoài

**Phân loại investor:**
- Nhà đầu tư chứng khoán chuyên nghiệp (nếu có)
- Public offering — UBCKNN registration

**KYC:**
- CCCD/Passport
- Source of funds
- Tax registration

**Lưu ý:** VN không có khái niệm "accredited investor" giống US. Phân loại theo:
- Tổ chức được cấp phép (banks, securities companies, insurance)
- Cá nhân có kinh nghiệm đầu tư + tài chính nhất định

### 8.3 🇪🇺 European Union

**Framework:**
- MiFID II (Markets in Financial Instruments Directive)
- Prospectus Regulation (EU 2017/1129)
- AIFMD (Alternative Investment Fund Managers Directive) cho fund structure
- AML 5/6 Directive

**Investor categorization:**
- Retail (most protected)
- Professional (less protected, opt-up possible)
- Eligible counterparty (least protected)

**Cross-border:**
- Passport / notification để market across EU
- Reverse solicitation exemption nếu user tự liên hệ

### 8.4 🇬🇧 United Kingdom

**Framework (post-Brexit):**
- FCA (Financial Conduct Authority)
- Financial Services and Markets Act 2000
- High Net Worth Individual exemption
- Sophisticated Investor exemption

### 8.5 🇨🇦 Canada

**Framework:**
- Securities Act per province
- Accredited Investor exemption
- NI 45-106 — Prospectus Exemptions

### 8.6 🇸🇬 Singapore

**Framework:**
- Securities and Futures Act
- Accredited Investor + Institutional Investor + Expert Investor categories

### 8.7 🇦🇺 Australia

**Framework:**
- Corporations Act 2001
- Sophisticated Investor exemption
- Wholesale Investor

---

## 9. TECHNICAL IMPLEMENTATION

### 9.1 Subdomain access control

```javascript
// Middleware cho invest.vetuonglai.com
function investGateMiddleware(req, res, next) {
  const user = req.user;
  
  // Public không vào được
  if (!user) return res.redirect('/login');
  
  // Check 7 điều kiện cứng
  const eligibility = checkInvestEligibility(user);
  
  if (!eligibility.passed) {
    return res.render('invest/locked', {
      missing: eligibility.missing,
      // Gợi ý: hoàn thành chương trình, gắn bó thêm, etc.
    });
  }
  
  // Stage routing
  switch (user.invest_stage) {
    case 'education':
      return next(); // Giai đoạn 1
    case 'case_studies':
      return user.completed_quiz ? next() : redirectQuiz();
    case 'waitlist':
      return user.kyc_advanced ? next() : redirectKYC();
    case 'qualified':
      return user.accredited_verified ? next() : redirectVerify();
    default:
      return res.render('invest/welcome');
  }
}
```

### 9.2 Eligibility check function

```javascript
function checkInvestEligibility(user) {
  const requirements = {
    member_90_days: user.created_at < (Date.now() - 90 * 24 * 60 * 60 * 1000),
    completed_program: user.completed_programs.length >= 1,
    has_proof: user.vc_credentials.length >= 1,
    builder_tier: user.tier_level >= 4,
    age_18: user.dob && (Date.now() - user.dob) >= 18 * 365 * 24 * 60 * 60 * 1000,
    no_abuse: !user.has_recent_violations(90),
    accepted_disclosure: user.accepted_invest_disclosure_at !== null
  };
  
  const failed = Object.keys(requirements).filter(key => !requirements[key]);
  
  return {
    passed: failed.length === 0,
    missing: failed,
    requirements: requirements
  };
}
```

### 9.3 Database schema

```sql
CREATE TABLE invest_eligibility (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  member_since DATE NOT NULL,
  programs_completed INT DEFAULT 0,
  vc_credentials_count INT DEFAULT 0,
  tier_level INT DEFAULT 1,
  age_verified BOOLEAN DEFAULT FALSE,
  no_violations_90d BOOLEAN DEFAULT FALSE,
  disclosure_accepted_at TIMESTAMPTZ,
  
  -- KYC
  kyc_basic_passed BOOLEAN DEFAULT FALSE,
  kyc_advanced_passed BOOLEAN DEFAULT FALSE,
  kyc_advanced_passed_at TIMESTAMPTZ,
  
  -- Accredited (US)
  is_us_person BOOLEAN,
  accredited_verified BOOLEAN DEFAULT FALSE,
  accredited_verified_at TIMESTAMPTZ,
  accredited_expires_at TIMESTAMPTZ, -- 5 years per SEC
  accredited_method VARCHAR(50), -- 'verifyinvestor', 'cpa_letter', etc.
  
  -- Stage
  current_stage VARCHAR(20) DEFAULT 'locked', -- 'locked', 'education', 'case_studies', 'waitlist', 'qualified'
  stage_unlocked_at TIMESTAMPTZ,
  
  -- Audit
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_stage CHECK (current_stage IN ('locked', 'education', 'case_studies', 'waitlist', 'qualified'))
);

CREATE INDEX idx_invest_stage ON invest_eligibility(current_stage);
CREATE INDEX idx_accredited_expires ON invest_eligibility(accredited_expires_at) 
  WHERE accredited_verified = TRUE;
```

### 9.4 Audit log

```sql
CREATE TABLE invest_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'viewed_education', 'completed_quiz', 'requested_kyc', etc.
  stage_before VARCHAR(20),
  stage_after VARCHAR(20),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON invest_audit_log(user_id);
CREATE INDEX idx_audit_action ON invest_audit_log(action);
```

---

## 10. RISK DISCLOSURE FORMAT

### 10.1 Required wording (English)

```
INVESTMENT RISK DISCLOSURE

Before accessing investment-related content on Vetuonglai, please read 
and acknowledge the following:

1. INVESTMENTS ARE RISKY
   All investments carry risk, including the potential complete loss of 
   capital. Past performance does not guarantee future results.

2. NO GUARANTEES
   No investment is guaranteed. Vetuonglai does not promise any specific 
   returns, profits, or outcomes.

3. NOT FINANCIAL ADVICE
   Vetuonglai is NOT a registered investment advisor, broker-dealer, 
   or licensed financial professional. Content is for educational 
   purposes only.

4. STARTUP INVESTMENTS ARE ESPECIALLY RISKY
   - Most startups fail
   - Investments may be illiquid (cannot easily sell)
   - Long hold periods (5–10+ years possible)
   - No secondary market guaranteed
   - Dilution may occur
   - Information may be limited

5. YOUR DUE DILIGENCE
   You are responsible for your own research and decisions. Consult 
   qualified professionals (lawyer, CPA, financial advisor) before 
   investing.

6. SUITABILITY
   Only invest amounts you can afford to lose. Investments should be 
   part of a diversified portfolio.

7. ACCREDITED INVESTOR STATUS (US)
   Only accredited investors may participate in private placements 
   under Rule 506(c). Verification required.

8. JURISDICTION
   Investments are subject to laws of relevant jurisdictions. Some 
   opportunities may not be available in your country.

9. NO TAX ADVICE
   Vetuonglai does not provide tax advice. Tax implications vary by 
   jurisdiction and personal situation.

10. CONFLICTS OF INTEREST
    Vetuonglai may have relationships with investment opportunities 
    presented. All material conflicts will be disclosed.

By clicking "I Acknowledge", you confirm that you have read, understood, 
and accept these terms.

[ ] I Acknowledge
```

### 10.2 Vietnamese version

```
TUYÊN BỐ RỦI RO ĐẦU TƯ

Trước khi truy cập nội dung liên quan đầu tư trên Vetuonglai, vui lòng 
đọc và xác nhận các điều sau:

1. ĐẦU TƯ CÓ RỦI RO
   Mọi khoản đầu tư đều có rủi ro, bao gồm khả năng mất hoàn toàn vốn. 
   Hiệu suất quá khứ không đảm bảo kết quả tương lai.

2. KHÔNG CAM KẾT
   Không có khoản đầu tư nào được đảm bảo. Vetuonglai không hứa hẹn 
   bất kỳ lợi nhuận, kết quả cụ thể nào.

3. KHÔNG PHẢI TƯ VẤN TÀI CHÍNH
   Vetuonglai KHÔNG phải nhà tư vấn đầu tư đăng ký, công ty chứng khoán, 
   hay chuyên gia tài chính có giấy phép. Nội dung chỉ phục vụ mục đích 
   giáo dục.

4. ĐẦU TƯ KHỞI NGHIỆP CÓ RỦI RO ĐẶC BIỆT
   - Hầu hết startup thất bại
   - Đầu tư có thể không thanh khoản
   - Thời gian giữ dài (5–10+ năm)
   - Không có thị trường thứ cấp đảm bảo
   - Có thể bị pha loãng
   - Thông tin có thể hạn chế

5. THẨM ĐỊNH CỦA BẠN
   Bạn chịu trách nhiệm cho nghiên cứu và quyết định của mình. Tham 
   khảo chuyên gia có giấy phép (luật sư, kế toán, tư vấn tài chính) 
   trước khi đầu tư.

6. PHÙ HỢP
   Chỉ đầu tư số tiền bạn có thể mất. Đầu tư nên là một phần của danh 
   mục đa dạng.

7. PHÂN LOẠI NHÀ ĐẦU TƯ
   Một số cơ hội chỉ dành cho nhà đầu tư đã được xác minh đủ điều kiện 
   theo luật từng quốc gia.

8. PHẠM VI ÁP DỤNG
   Đầu tư tuân theo luật của các quốc gia liên quan. Một số cơ hội có 
   thể không khả dụng tại nước bạn.

9. KHÔNG TƯ VẤN THUẾ
   Vetuonglai không tư vấn thuế. Tác động thuế khác nhau theo quốc gia 
   và hoàn cảnh cá nhân.

10. XUNG ĐỘT LỢI ÍCH
    Vetuonglai có thể có mối quan hệ với cơ hội đầu tư được trình bày. 
    Mọi xung đột lợi ích trọng yếu sẽ được công bố.

Bằng cách click "Tôi xác nhận", bạn xác nhận đã đọc, hiểu, và chấp 
nhận các điều khoản này.

[ ] Tôi xác nhận
```

### 10.3 Acknowledgment storage

```sql
CREATE TABLE invest_disclosures_accepted (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  disclosure_version VARCHAR(20) NOT NULL, -- 'v1.0', 'v1.1', etc.
  language VARCHAR(5) NOT NULL, -- 'en', 'vi'
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  UNIQUE(user_id, disclosure_version)
);
```

User phải re-accept khi disclosure được cập nhật.

---

## 11. ADMIN CONTROLS

### 11.1 Admin actions

Admin (founder + compliance officer) có thể:

- View user's invest stage progression
- Manually approve/deny stage advancement
- Review accredited investor verification
- Audit user activity on invest subdomain
- Lock/unlock specific users from invest access
- Export compliance reports

### 11.2 Admin dashboard

```
/admin/invest
├── /users — list users by stage
├── /verifications — pending accredited verifications
├── /waitlist — current waitlist
├── /opportunities — manage opportunities (Giai đoạn 4)
├── /reports — compliance reports
└── /audit — audit log
```

### 11.3 Compliance reports (monthly)

- Total users on each stage
- Accredited investor count
- Waitlist size and demographics
- Educational content engagement
- Disclosure acceptance rate
- Any flagged activity

---

## 12. EMERGENCY PROCEDURES

### 12.1 Khi nào shut down invest subdomain

Trong các tình huống sau, shut down `invest.vetuonglai.com` ngay:

- SEC inquiry/investigation
- VN UBCKNN inquiry
- EU regulator inquiry
- Cybersecurity incident affecting investor data
- Founder/CEO không sẵn sàng review
- Lawyer rút khỏi engagement

### 12.2 Shutdown procedure

```
1. Disable subdomain access (return 503)
2. Email all users on waitlist explaining temporary suspension
3. Hold all pending wires
4. Internal review with counsel
5. Reopen only after counsel approval
```

---

## 13. ACCEPTANCE CRITERIA TRƯỚC KHI MỞ TỪNG GIAI ĐOẠN

### Giai đoạn 1 (Education)
- [ ] All educational content lawyer-reviewed
- [ ] Disclaimer present on every page
- [ ] Subdomain access control working
- [ ] 7 điều kiện cứng enforced

### Giai đoạn 2 (Case Studies)
- [ ] Giai đoạn 1 stable for 6+ months
- [ ] Risk Tolerance Quiz built
- [ ] Case studies vetted (anonymized hoặc public deals only)
- [ ] No specific deal pitches

### Giai đoạn 3 (Waitlist)
- [ ] Securities counsel retained
- [ ] Legal entity for investment vehicle planned
- [ ] Accredited investor verification 3rd party integrated
- [ ] KYC nâng cao flow tested
- [ ] Founder + lawyer approve mở Giai đoạn 3

### Giai đoạn 4 (Real Investment)
- [ ] All Giai đoạn 3 conditions met
- [ ] PPM template lawyer-drafted
- [ ] Reg D 506(c) Form D filed (US)
- [ ] State Blue Sky filings done
- [ ] AML compliance officer hired
- [ ] Escrow account setup
- [ ] Subscription agreement template ready
- [ ] 14-day cooling-off period built in
- [ ] Wire transfer flow tested
- [ ] Founder + Board + Lawyer approve mở Giai đoạn 4

---

## 14. METRICS & MONITORING

### 14.1 Track monthly

- Total users by invest stage
- Stage progression rates
- Average time in each stage
- Accredited investor verifications
- Waitlist conversion to qualified
- Disclosure acceptance rates
- Educational content engagement

### 14.2 Compliance flags

- Stage advancement without all requirements met
- Disclosure not accepted but stage advanced
- Accredited verification expired but user still in qualified stage
- Failed AML check attempts
- Suspicious activity patterns

---

## 15. REMINDER — 3 CÁI KHÔNG ĐƯỢC LÀM

Mặc dù tất cả mọi thứ trên đã rõ, nhắc lại 3 cái KHÔNG ĐƯỢC LÀM tuyệt đối:

1. ❌ **KHÔNG public "Invest with us" CTA bất kỳ đâu** — kể cả homepage, kể cả docs
2. ❌ **KHÔNG hứa returns** — không "expected ROI", không "guaranteed", không "stable"
3. ❌ **KHÔNG nhận tiền trước khi đủ pháp lý** — không exception, kể cả "friendly investor"

---

**File này LOCKED. Mọi thay đổi cần Founder + Lawyer approve bằng văn bản.**
**Version 1.0 — APPROVED WITH CONDITIONS — 27/04/2026**
