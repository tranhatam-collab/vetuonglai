# VETUONGLAI_REVENUE_FOR_MEMBERS.md
**Phiên bản:** 1.0 — APPROVED WITH CONDITIONS
**Ngày phát hành:** 27/04/2026
**Trạng thái:** ✅ Duyệt có điều kiện — ready for dev implementation
**Phạm vi:** Toàn bộ hệ thống tạo thu nhập cho thành viên Về Tương Lai
**Founder Sign-off:** Tâm (Ha Tam Tran)

---

## 0. ĐIỀU KIỆN DUYỆT (CỨNG — KHÔNG ĐƯỢC PHÁ)

1. ❌ **KHÔNG public claim thu nhập** — mọi con số $/tháng chỉ hiện sau đăng ký, có disclaimer cứng
2. ❌ **KHÔNG multi-level affiliate** — single-tier only, tuyệt đối không cấp 2+
3. ❌ **KHÔNG mở earning cho user trước khi có proof** — phải qua tầng 4 (Builder) trở lên
4. ❌ **KHÔNG mở Phase 2 channels trước khi V2 launch** — Phase 1 chỉ 3 channels
5. ❌ **KHÔNG cho trẻ em (Kids tier) earning** — tuyệt đối, không exception

---

## 1. TRIẾT LÝ HỆ KIẾM TIỀN

### 1.1 Nguyên tắc cốt lõi

> **Người dùng KHÔNG kiếm tiền từ việc đăng ký, từ việc giới thiệu, hoặc từ tham gia.**
> **Người dùng kiếm tiền từ giá trị thật họ tạo ra — và chỉ sau khi đã có proof.**

### 1.2 Chuỗi giá trị bất biến

```
Đăng ký free → Trải nghiệm → Học chương trình → Tạo đầu ra
       ↓
Đầu ra được verify → Earn microtask → Build portfolio → Earn full
```

**Không skip bước. Không shortcut.**

### 1.3 3 lằn ranh đỏ pháp lý phải tránh

#### Ranh 1 — FTC Pyramid Scheme (US)
- Doanh thu phải đến từ **end-user thật mua sản phẩm thật**
- KHÔNG từ recruitment fees
- KHÔNG từ "đăng ký tham gia"

#### Ranh 2 — Nghị định 40/2018 (VN)
- Affiliate **chỉ 1 cấp**
- KHÔNG chia commission theo cấp 2/3/n

#### Ranh 3 — FTC Income Claims (US)
- KHÔNG public "Bạn có thể kiếm $X/tháng"
- Con số chỉ hiện sau đăng ký + disclaimer
- Phải dựa trên dữ liệu thật của contributor existing

---

## 2. ĐIỀU KIỆN MỞ EARNING CHO USER

User phải đạt **TẤT CẢ** các điều kiện sau mới được mở earning channels:

### 2.1 Điều kiện cho Phase 1 channels (V1+ sau 90 ngày platform)

1. ✅ Đăng ký thành viên (Member Passport)
2. ✅ Verify email + phone
3. ✅ Verify ít nhất 1 social link (LinkedIn, GitHub, hoặc personal website)
4. ✅ Hoàn thành 1 chương trình training trên `edu.vetuonglai.com`
5. ✅ Có ít nhất 1 proof/credential từ VC system
6. ✅ Đạt tầng **Builder** (tầng 4) — xem PRODUCT_STRATEGY Phần 6
7. ✅ Đọc + click confirm Income Disclaimer
8. ✅ Đăng ký KYC basic nếu sẽ nhận payout > $25/tháng

### 2.2 Điều kiện thêm cho Phase 2 channels (V2+)

Tất cả điều kiện Phase 1 + thêm:

9. ✅ Ký Independent Contractor Agreement (electronic signature)
10. ✅ KYC nâng cao nếu payout > $600/năm (US 1099 threshold)
11. ✅ Có 3+ proof/credentials trong portfolio
12. ✅ Đạt tầng **Contributor** (tầng 5)

### 2.3 Điều kiện cho Partner tier (cao nhất)

Tất cả điều kiện Phase 2 + thêm:

13. ✅ Đã earn $1,000+ qua hệ
14. ✅ 6+ tháng hoạt động ổn định
15. ✅ Invitation từ admin (không tự apply)
16. ✅ Business profile verified (nếu là doanh nghiệp)

---

## 3. PHASE 1 — 3 CHANNELS MỞ TRƯỚC

### 3.1 Channel 1: Creator Revenue Share

**Mô tả:** User tạo nội dung trên platform → khi nội dung được mua/view → chia sẻ doanh thu.

**Áp dụng cho:**
- Bài viết trên `read.vetuonglai.com` (Read Future) — V2
- Mini products trên `edu.vetuonglai.com` (V1)
- Templates / packs trên `market.vetuonglai.com` — V3

**Revenue share rates (V1):**

| Vai trò | Share | Note |
|---------|-------|------|
| Author chính | 35–50% | Creator |
| Researcher (nếu có) | 10–20% | Co-creator |
| Editor | 10–15% | Reviewer |
| Designer (nếu có) | 5–10% hoặc fixed | Optional |
| Platform | 20–30% | Hệ thống |

**Ví dụ — Mini product $9:**
- Author: $4.05 (45%)
- Editor: $1.35 (15%)
- Platform: $2.70 (30%)
- Affiliate (nếu có): $0.90 (10%)

**Điều kiện:**
- Author phải có credential từ chương trình "Verifiable Portfolio Foundation"
- Content phải pass review nội bộ
- Author tự khai thuế (Independent Contractor)

**Payout:**
- Cycle: 30 ngày
- Hold: 14 ngày sau giao dịch (xử lý refund)
- Min payout: $25
- Provider: Wise / PayPal / Stripe Connect / VN bank

### 3.2 Channel 2: VC Bounties

**Mô tả:** Hệ thống có nhu cầu cụ thể (verify content, kiểm duyệt, beta test, dịch thuật, hỗ trợ cộng đồng) → đăng bounty với rate cố định → user qualified apply → hoàn thành nhận payout.

**Loại bounty (V1):**

| Loại bounty | Rate đề xuất | Skill required |
|-------------|------------|----------------|
| Content review (1 bài) | $3–$10 | Reading skill + program completion |
| Dịch thuật VI↔EN (500 từ) | $10–$30 | Bilingual + verified |
| Beta testing 1 feature | $5–$20 | Member verified |
| Community moderation (10 hours) | $30–$80 | 3+ proof + good standing |
| Verify proof submissions | $1–$5/proof | VC trained |
| Bug report (verified) | $5–$50 | Tech-aware |

**Quy trình:**
1. Admin đăng bounty với spec rõ
2. Qualified user apply
3. Admin assign 1 user
4. User hoàn thành → submit
5. Admin verify → payout

**Anti-abuse:**
- Mỗi bounty có deadline
- Không assign nhiều bounty cùng lúc cho 1 user
- Quality score affect future eligibility

**Payout:**
- Cycle: 15 ngày (faster than revenue share để encourage participation)
- Hold: 7 ngày
- Min payout: $25 (accumulate nếu chưa đủ)

### 3.3 Channel 3: Affiliate Single-Tier (1 cấp)

⚠️ **CRITICAL: Single-tier ONLY. Code review phải confirm không có cấp 2.**

**Mô tả:** User giới thiệu khách hàng mới mua gói → nhận commission lần đầu.

**Commission rates:**

| Loại sản phẩm referee mua | Commission | Recurring? |
|--------------------------|-----------|-----------|
| Free signup | $0 (chỉ điểm thưởng) | N/A |
| Mini product $3–$9 | 10–15% lần đầu | Không |
| Mini product $29–$99 | 15–20% lần đầu | Không |
| Annual Membership $99 | 20% năm đầu = $19.80 | 5–10% năm 2 nếu user còn active |
| Cohort $99–$299 | 15% lần đầu | Không |
| Business Member $29/tháng | 15% tháng đầu = $4.35 | 5% tháng 2–6 |

**Quy tắc cứng (LOCKED):**

❌ **KHÔNG được phép:**
- Cấp 2+ (referee A giới thiệu B → A không nhận commission từ giới thiệu của B)
- Self-referral (dùng tài khoản khác giới thiệu chính mình)
- Cookie stuffing
- Affiliate cho user chưa qualified
- Promote bằng claim sai sự thật ("Đăng ký để kiếm $5,000/tháng")

✅ **Được phép:**
- Share link affiliate cá nhân
- Viết review trung thực có affiliate link (FTC: phải disclose)
- Talk về kinh nghiệm thật của mình
- Mời friends qua direct message (1-on-1)

**Điều kiện affiliate:**
- Member tầng 3+ (Learner)
- Verify email + phone
- Đọc + accept Affiliate Terms
- Cookie window: 30 ngày
- Min payout: $25
- Hold: 30 ngày sau referee thanh toán (xử lý refund)

**Anti-abuse:**
- Auto-detect duplicate IP / device
- Manual review nếu commission > $100/tháng
- Suspend account nếu có spam complaint

---

## 4. PHASE 2 — 4 CHANNELS MỞ Ở V2 (CHỜ)

⚠️ **KHÔNG mở Phase 2 channels trước V2 launch. KHÔNG exception.**

### 4.1 Channel 4: Coaching / Consulting Marketplace

**Mở:** V2 (Months 7+)

**Mô tả:** Contributor có chuyên môn → mở slot tư vấn 1-on-1 → khách hàng book qua hệ → platform thu fee.

**Pricing model:**
- Coach tự set rate (suggest $20–$200/giờ)
- Platform fee: 15% trên mỗi booking
- Minimum session: 30 phút

**Điều kiện coach:**
- Tầng Contributor+
- 5+ proof/credentials
- Approved bởi admin sau review
- Có specialization rõ (writing, AI, finance, etc.)

### 4.2 Channel 5: Skills Mentorship Program

**Mở:** V2

**Mô tả:** Contributor giỏi → mentor cho người mới qua cohort hoặc 1-on-1 dài hạn.

**Pricing model:**
- Cohort fee shared: Mentor 40% / Reviewer 15% / Facilitator 15% / Platform 20% / Scholarship 10%
- 1-on-1 mentorship: $50–$200/tháng (mentor set), platform 15%

**Điều kiện mentor:**
- Tầng Contributor+ với 3+ months active
- 5+ học viên có review tốt
- Pass "Mentor Ethics" mini-program
- Approved bởi admin

### 4.3 Channel 6: Co-creation Projects

**Mở:** V2

**Mô tả:** Hệ thống gom nhu cầu thị trường (research, content series, mini-product) → mời contributors phù hợp join project → chia sẻ doanh thu.

**Revenue share:**
- Lead: 30–40%
- Team members: 10–25% mỗi người
- Platform: 20–30%
- Tổng team không quá 5–7 người

**Điều kiện:**
- Tầng Contributor+
- Match skill với project
- Cam kết deadline

### 4.4 Channel 7: Enterprise Talent Pool

**Mở:** V2 phase 2 (sau khi có business clients đầu tiên)

**Mô tả:** Doanh nghiệp cần nhân sự ngắn hạn → tuyển từ pool VC-verified contributors → contributor làm trực tiếp với doanh nghiệp.

**Pricing model:**
- Doanh nghiệp trả contributor trực tiếp (không qua hệ)
- Platform thu placement fee 10–20% từ doanh nghiệp lần đầu
- Contributor không trả % về platform (vì làm trực tiếp với doanh nghiệp)

**Điều kiện contributor:**
- Tầng Partner (cao nhất)
- 3+ months active Contributor
- Skills rõ ràng có proof
- Independent Contractor Agreement với doanh nghiệp riêng

**Pháp lý:**
- Hệ chỉ là platform giới thiệu
- Hợp đồng giữa contributor và doanh nghiệp là direct
- Worker classification: Independent Contractor (tránh AB5 / EU Platform Directive)

---

## 5. 7 NHÓM CONTRIBUTORS

### 5.1 Nhóm A — Writers / Editors / Translators

**Phù hợp sub:** `read`, `docs`, `community`, `business`

**Cách kiếm tiền:**
- Viết bài dài được duyệt
- Bản tóm tắt sách/chuyên đề
- Biên tập bài người khác
- Dịch Việt-Anh / Anh-Việt
- Case study doanh nghiệp
- Newsletter, video script

**Mức tham khảo (chỉ trong file nội bộ này, KHÔNG public):**
- Người mới: $5–$30/bài ngắn
- Có kỹ năng: $30–$150/bài/chuyên đề
- Senior/editor: $200–$1,000/tháng nếu đều việc
- Lead content: $1,000–$3,000/tháng nếu có traffic + revenue share

### 5.2 Nhóm B — Researchers

**Phù hợp:** `finance`, `invest`, `ai`, `business`, `green`, `market`

**Cách kiếm tiền:**
- Research thị trường / đối thủ / chính sách
- Tổng hợp dữ liệu ngành
- Due diligence checklist
- Báo cáo rủi ro
- Future trend brief
- Fact-checking

**Mức tham khảo:**
- Research task nhỏ: $10–$50
- Report chuyên đề: $50–$300
- Retainer: $300–$2,000/tháng
- Research lead: $1,000–$5,000/tháng nếu sâu

### 5.3 Nhóm C — AI Operators

**Phù hợp:** `ai`, `work`, `docs`, `business`

**Cách kiếm tiền:**
- Prompt workflow
- Chatbot nội bộ cho doanh nghiệp nhỏ
- Automation đơn giản
- AI document analysis
- Trợ lý research
- SOP, content multi-format

**Mức tham khảo:**
- Task nhỏ: $10–$100
- Workflow pack: $29–$199
- Setup AI assistant: $100–$1,000
- Retainer AI ops: $300–$3,000/tháng

### 5.4 Nhóm D — Educators / Mentors / Coaches

**Phù hợp:** `edu`, `learn`, `kids`, `community`, `member`

**Cách kiếm tiền:**
- Dẫn cohort học nhỏ
- Mentor học viên
- Chấm bài / review đầu ra
- Tổ chức buổi thực hành
- Hỗ trợ phụ huynh ở Kids
- Facilitator cộng đồng

**Mức tham khảo:**
- Review bài: $3–$20/bài
- Buổi nhóm: $20–$100/buổi
- Cohort nhỏ: $100–$1,000/chương trình
- Mentor ổn định: $500–$3,000/tháng

**Quy tắc đặc biệt cho Kids mentor:**
- Không nhắn riêng trẻ (luôn có phụ huynh tham gia)
- Không xin số điện thoại / contact info trẻ
- Không gặp offline 1-1 với trẻ chưa có phụ huynh đồng ý

### 5.5 Nhóm E — Freelancers

**Phù hợp:** `work`, `market`, `vc`, `member`

**Cách kiếm tiền:**
- Brief từ hệ
- Landing page, slide design
- Video ngắn, sales page
- Notion/Sheet system
- Newsletter setup, automation
- Customer support, data entry verifiable

**Mức tham khảo:**
- Microtask: $5–$30
- Brief nhỏ: $30–$200
- Dự án vừa: $200–$1,500
- Retainer: $300–$5,000/tháng

### 5.6 Nhóm F — Community Builders

**Phù hợp:** `community`, `read`, `edu`, `member`

**Cách kiếm tiền:**
- Dẫn nhóm đọc / học
- Cộng đồng địa phương
- Ambassador
- Referral chất lượng
- Workshop
- Onboarding người mới

**Mức tham khảo:**
- Referral hợp lệ: $1–$20/user
- Community session: $20–$200
- Local lead: $100–$1,000/tháng
- Growth partner: $1,000–$5,000/tháng

**KHÔNG được:**
- Spam mạng xã hội
- Hứa thu nhập
- Claim sai sự thật

### 5.7 Nhóm G — Small Businesses / Creators / Experts

**Phù hợp:** `business`, `market`, `vc`, `docs`, `trust`

**Cách kiếm tiền:**
- Bán khóa / chuyên đề verified
- Dịch vụ tư vấn
- Template / SOP
- Report chuyên ngành
- Credential cho học viên
- Dùng VTL làm kênh phân phối

**Mức tham khảo:**
- Template: $9–$99
- Chuyên đề: $19–$199
- Dịch vụ: $100–$5,000
- Training doanh nghiệp: $500–$20,000

**Pháp lý:**
- Không bán sản phẩm y tế / tài chính rủi ro nếu chưa có giấy phép
- Refund policy rõ
- Verified business profile

---

## 6. MỨC THU NHẬP THAM KHẢO (CHỈ HIỆN SAU ĐĂNG KÝ)

### 6.1 Wording cứng (LOCKED)

**Hiển thị ở đâu:** CHỈ trong logged-in member dashboard, KHÔNG public homepage.

**Wording bắt buộc:**

> ⚠️ **Khả năng tham khảo, không phải cam kết.**
>
> Một số cộng tác viên làm việc thường xuyên, có kỹ năng rõ, hồ sơ xác minh và đầu ra chất lượng có thể đặt mục tiêu xây dựng thu nhập trong khoảng tham khảo dưới đây theo thời gian.
>
> **Đây không phải cam kết thu nhập.** Thu nhập thực tế phụ thuộc vào:
> - Kỹ năng cá nhân
> - Thời gian đầu tư
> - Chất lượng đầu ra
> - Nhu cầu thị trường
> - Mức độ tham gia
>
> Vetuonglai không bảo đảm bất kỳ mức thu nhập cụ thể nào.

### 6.2 3 mức tham khảo (hiển thị 3 cards trong dashboard)

#### 🌱 Mức cơ bản: $300–$800/tháng
**Đối tượng:** Người mới làm part-time
**Hoạt động:** 5–10h/tuần
**Cách đạt:**
- Viết 4–8 bài/tháng
- Làm 5–10 microtasks
- Dẫn 1 nhóm nhỏ
- Bán 20–50 mini products qua nội dung thật

**Skill requirement:** Cơ bản, đã hoàn thành 1 chương trình

#### 🌳 Mức tích cực: $1,000–$3,000/tháng
**Đối tượng:** Người làm thường xuyên
**Hoạt động:** 20–30h/tuần
**Cách đạt:**
- Có 1 kỹ năng rõ ràng (writing/research/AI/design/mentor)
- Nhận 2–4 project nhỏ/tháng
- Có portfolio xác minh
- Có 1–2 mini product bán đều
- Có cộng đồng nhỏ hoặc kênh cá nhân
- Làm reviewer/mentor cho hệ
- Có credential và lịch sử giao việc

**Skill requirement:** Verified Contributor, multiple credentials

#### 🌲 Mức chuyên gia: $3,000–$5,000+/tháng
**Đối tượng:** Partner level
**Hoạt động:** Full-time
**Cách đạt:**
- Chuyên môn sâu trong 1+ lĩnh vực
- Có team nhỏ
- Có business clients
- Sản phẩm/chương trình doanh thu đều
- Vai trò Partner, không chỉ freelancer
- Xác minh cá nhân/doanh nghiệp đầy đủ
- Retainer dài hạn với multiple clients

**Skill requirement:** Partner tier, $1,000+ earned, 6+ months active

### 6.3 Vietnam Advantage note (chỉ trong dashboard cho VN users)

> 🇻🇳 **Lợi thế contributor Việt Nam:**
> - Chi phí sinh hoạt thấp → cùng $1,000/tháng có sức mua cao
> - Múi giờ APAC thuận lợi cho remote work
> - Văn hóa chất lượng đã được chứng minh qua FPT/VNG
> - AI literacy đang lên với AI Made in Vietnam
>
> Nhiều contributor Việt Nam có thể đạt mức thu nhập tham khảo nhanh hơn nếu tận dụng được lợi thế này. Tuy nhiên vẫn không phải cam kết.

---

## 7. PAYOUT SYSTEM

### 7.1 Payout providers

| Provider | Currency | Min payout | Fee | Phù hợp |
|----------|---------|-----------|-----|---------|
| **Wise** | USD/EUR/VND | $25 | $1–$5 | International contributors |
| **PayPal** | USD | $25 | 2% (max $20) | US/EU contributors |
| **Stripe Connect** | USD | $25 | $0.25 + 0.25% | US contributors |
| **VN Bank Transfer** | VND | 600,000 VND | 0–1% | VN contributors |
| **PayOS** (B2C wallet) | VND | 600,000 VND | 0% | VN contributors có wallet |

### 7.2 Payout cycle

| Channel | Cycle | Hold period |
|---------|-------|-------------|
| Creator Revenue Share | 30 ngày | 14 ngày sau giao dịch |
| VC Bounties | 15 ngày | 7 ngày sau verify |
| Affiliate | 30 ngày | 30 ngày sau referee thanh toán (xử lý refund) |
| Coaching/Mentorship (V2) | 15 ngày | 7 ngày sau session |
| Co-creation (V2) | Per milestone | Per project agreement |
| Enterprise Talent Pool (V2) | Direct (contributor ↔ business) | N/A |

### 7.3 KYC tiers

| Earnings annually | KYC required |
|------------------|--------------|
| $0 – $25 | None (chưa qualified payout) |
| $25 – $600 | Basic: name + DOB + ID number |
| $600 – $20,000 | Standard: ID document + address proof |
| $20,000+ | Enhanced: source of funds + tax ID + AML check |

**Lưu ý US contributors:**
- > $600/năm = phải có W-9 form (US person) hoặc W-8BEN (non-US)
- Hệ phát 1099-NEC nếu đủ ngưỡng

**Lưu ý VN contributors:**
- Theo Nghị định 117/2025: hệ withhold thuế thu nhập cá nhân nếu vượt ngưỡng
- Contributor tự khai hoặc hệ kê khai theo hợp đồng cộng tác viên độc lập

### 7.4 Anti-fraud rules

**Auto-flag cho admin review:**
- Same IP/device cho >3 accounts
- Affiliate > 50 referrals trong 7 ngày
- Refund rate > 20% trên referrals
- KYC mismatch
- Suspicious activity pattern

**Hold/freeze conditions:**
- Spam complaint → 30 ngày freeze + investigation
- Chargeback → reverse commission + warning
- Fraudulent referral → forfeit commission + ban
- Identity verification fail → suspend payout

---

## 8. INDEPENDENT CONTRACTOR FRAMEWORK

### 8.1 Pháp lý cứng

**Contributor là Independent Contractor, KHÔNG phải Employee.**

### 8.2 Điều khoản phải có trong agreement

```
1. Independent Contractor Status
   - Contributor là independent, không phải employee
   - Hệ không kiểm soát giờ làm
   - Hệ không bắt buộc tools cụ thể
   - Contributor có thể làm việc cho nhiều platforms khác

2. Tax Responsibility
   - Contributor tự khai thuế
   - Hệ không withhold trừ khi luật bắt buộc
   - Issue 1099-NEC (US) hoặc tương đương theo từng quốc gia

3. No Income Guarantee
   - Hệ không đảm bảo thu nhập
   - Mọi mức thu nhập là khả năng tham khảo

4. Termination
   - Có thể chấm dứt bởi 1 trong 2 bên với 30 ngày notice
   - Vi phạm code of conduct = chấm dứt ngay

5. Intellectual Property
   - Content tạo cho hệ: hệ có rights để publish
   - Personal portfolio: contributor giữ rights
   - Cụ thể trong từng brief/contract

6. Dispute Resolution
   - Mediation trước
   - Arbitration nếu mediation thất bại
   - Jurisdiction: theo entity hệ ở quốc gia tương ứng

7. Anti-Discrimination & Code of Conduct
   - Không discrimination
   - Không harassment
   - Không misrepresentation
```

### 8.3 Worker classification compliance

**US (AB5 / California ABC test):**
- A: Free from control of hiring entity ✅
- B: Work outside hiring entity's usual course of business ⚠️ (cần lawyer review)
- C: Customarily engaged in independent trade ✅

**EU (Platform Workers Directive 2024):**
- 5 indicators of employee status — phải đảm bảo không match
- Nếu ≥2 indicators match → có thể bị reclassified

**VN:**
- Hợp đồng cộng tác viên độc lập (theo Bộ luật Lao động 2019, không phải hợp đồng lao động)
- Thuế thu nhập cá nhân theo từng giao dịch

---

## 9. CƠ CHẾ CHIA TIỀN CHI TIẾT

### 9.1 Mini Product ($9 example)

```
Total: $9.00
├── Author chính: $4.05 (45%)
├── Editor: $1.35 (15%)
├── Platform: $2.70 (30%)
└── Affiliate (nếu có): $0.90 (10%)

Note: Nếu không có affiliate → 10% tăng vào platform
```

### 9.2 Cohort ($99 × 20 = $1,980)

```
Total: $1,980
├── Mentor/lead: $792 (40%)
├── Reviewer: $297 (15%)
├── Facilitator/community: $297 (15%)
├── Platform: $396 (20%)
└── Scholarship/bonus pool: $198 (10%)
```

### 9.3 Brief / Project ($500 example)

```
Khách trả: $500
├── Người làm chính: $375–$425 (75–85%)
├── Reviewer/QA: $25–$50 (5–10%)
└── Platform: $50–$100 (10–20%)

Note: Platform fee tùy theo brief origin:
- Brief từ external client (hệ sourced): 20%
- Brief từ internal need: 15%
- Direct to contributor (sau khi qualified): 10%
```

### 9.4 Affiliate ($99 annual referral)

```
Referee mua $99 annual:
├── Affiliate (referrer): $19.80 (20%) năm đầu
├── Recurring năm 2: $4.95–$9.90 (5–10%) nếu referee còn active
├── Platform: $79.20 (80%) năm đầu

Single-tier ONLY:
- Referrer A → Referee B → Referee C (nếu B refer C):
  - A nhận từ B (1 cấp)
  - A KHÔNG nhận gì từ C
  - B nhận từ C nếu B là affiliate
```

---

## 10. INCOME DISCLAIMER (CỨNG)

### 10.1 Wording bắt buộc

```
INCOME DISCLAIMER

The income information shown on this platform is for reference only and 
based on data from existing contributors. It does not constitute a 
guarantee or promise of any specific income level.

Actual income depends on individual factors including but not limited to:
- Skills and expertise
- Time invested
- Quality of work output
- Market demand
- Level of engagement
- Personal circumstances

Vetuonglai does not guarantee any specific income amount. Past 
performance of other contributors does not predict your future earnings.

You are an Independent Contractor responsible for your own taxes, 
business expenses, and financial decisions.

By accepting this disclaimer, you acknowledge that you understand 
these terms and accept that any income mentioned is a reference range, 
not a guarantee.

[ ] I understand and accept this disclaimer
```

### 10.2 Vietnamese version

```
TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM VỀ THU NHẬP

Thông tin thu nhập hiển thị trên nền tảng này chỉ là khả năng tham khảo, 
dựa trên dữ liệu của cộng tác viên hiện tại. Đây KHÔNG phải cam kết hay 
hứa hẹn bất kỳ mức thu nhập cụ thể nào.

Thu nhập thực tế phụ thuộc vào các yếu tố cá nhân bao gồm nhưng không giới hạn:
- Kỹ năng và chuyên môn
- Thời gian đầu tư
- Chất lượng đầu ra
- Nhu cầu thị trường
- Mức độ tham gia
- Hoàn cảnh cá nhân

Vetuonglai không bảo đảm bất kỳ mức thu nhập cụ thể nào. Hiệu suất quá 
khứ của cộng tác viên khác không dự đoán thu nhập tương lai của bạn.

Bạn là Cộng Tác Viên Độc Lập, có trách nhiệm với thuế, chi phí kinh 
doanh và quyết định tài chính của riêng mình.

Bằng cách chấp nhận tuyên bố này, bạn xác nhận đã hiểu các điều khoản 
và chấp nhận rằng mọi thu nhập được đề cập chỉ là khoảng tham khảo, 
không phải cam kết.

[ ] Tôi hiểu và chấp nhận tuyên bố này
```

### 10.3 Hiển thị ở đâu

**BẮT BUỘC hiển thị tại:**
- Member dashboard (trước khi xem income references)
- Page giới thiệu earning channels
- Trước khi enroll vào contributor program
- Trang affiliate program
- Trang cohort/mentor program

**KHÔNG cần hiển thị tại:**
- Public homepage (vì homepage không có income claim)
- Free content pages (vì không liên quan)

---

## 11. ANTI-MLM SAFEGUARDS (TECHNICAL)

### 11.1 Database constraints

```sql
-- Affiliate table
CREATE TABLE affiliates (
  user_id UUID PRIMARY KEY,
  referrer_id UUID REFERENCES affiliates(user_id),
  -- referrer_id can ONLY be 1 level deep
  -- NEVER store grandparent / great-grandparent
  ...
);

-- Commission table
CREATE TABLE commissions (
  id UUID PRIMARY KEY,
  affiliate_user_id UUID NOT NULL,
  referee_user_id UUID NOT NULL,
  -- Constraint: referee.referrer_id MUST = affiliate_user_id
  -- This means commission only flows from direct referee
  CHECK (
    (SELECT referrer_id FROM affiliates WHERE user_id = referee_user_id) 
    = affiliate_user_id
  ),
  ...
);
```

### 11.2 Code review checklist

Mọi PR đụng affiliate logic phải pass:

- [ ] Không có recursion trên referrer chain
- [ ] Không tính commission từ "grandchild" referrer
- [ ] Không có "team override" hoặc "matching bonus"
- [ ] Không có "rank advancement" logic
- [ ] Schema constraint không cho phép multi-level

### 11.3 Marketing copy review

Mọi page mention earning phải pass:

- [ ] Không có "build a team"
- [ ] Không có "downline"
- [ ] Không có "binary"
- [ ] Không có "matrix"
- [ ] Không có "rank up by recruiting"
- [ ] Có income disclaimer
- [ ] Single-tier only language

---

## 12. ROADMAP RỌLLOUT EARNING

### V1 First 90 Days (TRUST BUILDING)

⛔ **NO earning channels open.**

Mục đích:
- Build initial member base
- Create first 5–10 verified contributors qua VC system
- Stress-test platform without payouts

### V1 Day 91+ (PHASE 1 OPEN)

✅ **Open: Creator Revenue Share + VC Bounties + Affiliate single-tier**

Conditions:
- 100+ free members
- 10+ verified contributors
- Income disclaimer fully implemented
- KYC basic flow ready
- Wise/PayPal integration tested

### V2 Launch (PHASE 2 OPEN)

✅ **Add: Coaching + Mentorship + Co-creation**

Conditions:
- V1 metrics met (1,000+ members, $X revenue)
- Contractor agreement fully drafted by lawyer
- Tax compliance verified per jurisdiction
- Anti-fraud system live

### V2 Phase 2 (Months 12+)

✅ **Add: Enterprise Talent Pool**

Conditions:
- 5+ business clients onboarded
- Talent pool of 50+ verified contributors
- Direct contracting flow legal-reviewed

### V3 (Months 19+)

⏸️ **Earning channels stable. Focus on scaling.**
- Marketplace public
- Cross-border tax compliance
- Multi-currency payout
- Possibly: revenue-sharing on infrastructure (B2B API)

---

## 13. METRICS & MONITORING

### 13.1 Earning health metrics (track monthly)

- Total payouts paid (USD + VND)
- Number of contributors with positive earnings
- Median earnings per active contributor
- Top 10 / 90th percentile earnings
- Affiliate conversion rate (signups → paid)
- Refund rate on referrals
- Spam complaint rate
- KYC completion rate

### 13.2 Anti-abuse metrics

- Duplicate device/IP rate
- Self-referral attempts blocked
- Multi-tier scheme attempts (should be 0)
- Income claim violations on user-generated content (should be 0)
- Chargeback rate

### 13.3 Compliance dashboard

- 1099-NEC issued count (US)
- VN tax withheld count
- COPPA compliance for Kids tier (zero earning detected = pass)
- GDPR data deletion requests processed

---

## 14. ACCEPTANCE CRITERIA TRƯỚC KHI MỞ EARNING

Trước khi enable bất kỳ earning channel nào:

**Legal:**
- [ ] Independent Contractor Agreement final, lawyer-reviewed
- [ ] Income Disclaimer in 2 languages, lawyer-reviewed
- [ ] Affiliate Terms drafted
- [ ] Tax handling per jurisdiction documented
- [ ] AML/KYC policy documented

**Tech:**
- [ ] Affiliate single-tier constraint enforced at DB level
- [ ] Code review checklist applied to all PRs
- [ ] Wise/PayPal/Stripe integrations tested with real money (sandbox first)
- [ ] Anti-fraud detection live
- [ ] KYC flow integrated

**Process:**
- [ ] Admin review process for high-value transactions
- [ ] Support team trained on dispute handling
- [ ] Refund/chargeback handling documented
- [ ] Founder approval per phase rollout

---

**File này LOCKED. Mọi thay đổi cần Founder approve bằng văn bản.**
**Version 1.0 — APPROVED WITH CONDITIONS — 27/04/2026**
