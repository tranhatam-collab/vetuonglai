# VETUONGLAI_DOCS_PUBLIC_CONTENT.md
**Phiên bản:** 1.0 — APPROVED WITH CONDITIONS
**Ngày phát hành:** 27/04/2026
**Trạng thái:** ✅ Duyệt có điều kiện — content ready for publication
**Phạm vi:** `docs.vetuonglai.com` — public documentation
**Founder Sign-off:** Tâm (Ha Tam Tran)

---

## 0. ĐIỀU KIỆN DUYỆT (CỨNG)

1. ❌ **KHÔNG public claim thu nhập** — toàn bộ docs không có "kiếm $X/tháng" public
2. ❌ **KHÔNG có "Invest Now" CTA** — chỉ giáo dục về đầu tư có gate
3. ❌ **KHÔNG affiliate multi-tier language** — chỉ single-tier
4. ✅ **PHẢI có disclaimer** ở mọi trang nói về earning hoặc investment
5. ✅ **PHẢI có VI + EN versions** từ ngày launch

---

## 1. CẤU TRÚC DOCS

### 1.1 Tổng quan 12 trang

```
docs.vetuonglai.com/
├── /                       — Welcome / Tổng quan
├── /products               — Product Map (3 master passes + 9 nhóm)
├── /pricing                — Pricing & Membership
├── /membership             — Cách đăng ký & verify
├── /contributor            — Contributor Economy
├── /payout                 — Payout Policy
├── /work                   — Work & Opportunities
├── /creator                — Creator Program
├── /invest                 — Investment Gate Policy
├── /legal                  — Legal & Risk
├── /kids                   — Kids Safety Policy
├── /verification           — Verification Policy (VC stack)
└── /faq                    — Frequently Asked Questions
```

### 1.2 Multi-language

Mỗi trang có 2 versions:
- `/[page]/vi` — Vietnamese (default)
- `/[page]/en` — English

Auto-detect language từ:
- User's account preference (logged in)
- Browser Accept-Language header
- Country geolocation (fallback)

---

## 2. TRANG /  — WELCOME / TỔNG QUAN

### 2.1 Tiếng Việt

```markdown
# Về Tương Lai — Tổng Quan

## Định hướng

Về Tương Lai là một hệ giúp bạn **học đúng, làm được, chứng minh giá trị** 
và từng bước mở ra cơ hội thu nhập, phát triển lâu dài.

Mọi đầu ra đều **xác minh được**. Không hứa hẹn. Không bán hàng hóa. 
Không tô vẽ tương lai — chỉ trao công cụ để bạn tự xây tương lai mình.

## Bạn có thể làm gì ở đây?

- **Đăng ký miễn phí** — tạo hồ sơ thành viên, chọn hướng đi phù hợp
- **Trải nghiệm** — đọc, học, thử các sản phẩm nhỏ với chi phí thấp
- **Học sâu** — tham gia chương trình có kèm thực hành và đánh giá
- **Tạo đầu ra thật** — xây portfolio, có proof xác minh
- **Cộng tác** — nhận brief, làm dự án, kiếm thu nhập sau khi đủ điều kiện
- **Phát triển dài hạn** — trở thành Partner, mở cơ hội kinh doanh

## Chuỗi giá trị

```
Đăng ký free → Trải nghiệm → Học/Thực hành → Có đầu ra
       ↓
Được xác minh → Cộng tác → Doanh thu → Đầu tư (sau khi đủ điều kiện)
```

## Bắt đầu như thế nào?

1. [Đăng ký miễn phí](https://member.vetuonglai.com/signup)
2. Chọn hướng đi phù hợp với mục tiêu của bạn
3. Trải nghiệm 1 sản phẩm nhỏ ($3–$9) hoặc đọc nội dung free
4. Tham gia chương trình học sâu
5. Tạo đầu ra, xác minh, mở cơ hội

## Khám phá thêm

- [Bản đồ sản phẩm](/products) — 3 hành trình + 9 nhóm sản phẩm
- [Giá & Thành viên](/pricing) — Free, Mini, Annual
- [Cộng tác viên](/contributor) — Cách tạo thu nhập trong hệ
- [Câu hỏi thường gặp](/faq)
```

### 2.2 English

```markdown
# Vetuonglai — Overview

## Our Direction

Vetuonglai is an ecosystem that helps you **learn properly, work effectively, 
prove your value**, and gradually open opportunities for income and 
long-term growth.

Every output is **verifiable**. No empty promises. No physical goods. 
No fairytale futures — just tools for you to build your own future.

## What You Can Do Here

- **Register for free** — create your member profile, choose your path
- **Explore** — read, learn, try mini products at low cost
- **Learn deeply** — join programs with practice and evaluation
- **Create real outputs** — build a portfolio with verifiable proof
- **Collaborate** — accept briefs, work on projects, earn income after qualifying
- **Grow long-term** — become a Partner, unlock business opportunities

## Value Chain

```
Free signup → Explore → Learn/Practice → Create output
       ↓
Get verified → Collaborate → Earn → Invest (when qualified)
```

## Getting Started

1. [Sign up free](https://member.vetuonglai.com/signup)
2. Choose a path matching your goals
3. Try a mini product ($3–$9) or read free content
4. Join a deep learning program
5. Create outputs, get verified, unlock opportunities

## Explore Further

- [Product Map](/products) — 3 journeys + 9 product clusters
- [Pricing & Membership](/pricing) — Free, Mini, Annual
- [Contributors](/contributor) — How to create income in the ecosystem
- [FAQ](/faq)
```

---

## 3. TRANG /products — PRODUCT MAP

### 3.1 Tiếng Việt

```markdown
# Bản Đồ Sản Phẩm

## 3 Hành Trình Chính

### 🌱 Hành Trình Cá Nhân (Personal Journey)
Cho cá nhân muốn học, làm, xây hồ sơ.

| Tier | Giá | Bạn nhận được |
|------|-----|---------------|
| Free | $0 | Hồ sơ thành viên + đọc miễn phí + cộng đồng |
| Mini | $3–$9 (lẻ) | Chuyên môn sâu 1 lĩnh vực bạn chọn |
| Annual | $99/năm | Toàn quyền truy cập + lộ trình cá nhân hóa |
| Loyalty | $99/năm cố định | Cho thành viên gắn bó từ năm 9 |

### 🏠 Hành Trình Gia Đình (Family Journey)
Cho phụ huynh + con + người thân.

| Tier | Giá | Bạn nhận được |
|------|-----|---------------|
| Family Free | $0 | 1 phụ huynh + 1 trẻ — bài mẫu |
| Family Starter | $9/tháng hoặc $89/năm | 2 người — Kids tier basic |
| Family Plus | $19/tháng hoặc $189/năm | 4 người — Kids + parent learning |

**Quy tắc cứng cho trẻ em:**
- Không kiếm tiền
- Không public profile
- Không quảng cáo trực tiếp
- Phụ huynh quản lý 100%

### 🤝 Hành Trình Đối Tác (Partner Journey)
Cho người vừa học vừa muốn kiếm thu nhập.

| Tier | Giá | Bạn nhận được |
|------|-----|---------------|
| Creator Free | $0 | Tham gia + chia sẻ + affiliate single-tier |
| Creator Pro | $9/tháng | Training Creator Skills + tools |
| Creator Annual | $99/năm | Full creator toolkit + revenue share |
| Partner | Mời riêng | Tier cao nhất — qua promotion |

## 9 Nhóm Sản Phẩm Theo Phase

### Phase V1 — Đang triển khai
- **Member Passport** — Đăng ký, hồ sơ
- **Edu / Learning** — Curriculum + chương trình
- **Verifiable Credentials** — Proof + verify
- **Work** — Cơ hội việc làm (light version)

### Phase V2 — Sắp ra mắt
- **Read Future** — Tri thức dài hạn
- **Kids Future** — Học an toàn cho trẻ
- **AI Practical Toolkit** — Workflow AI thực tế
- **Community / Cohort** — Học cùng tiến

### Phase V3 — Tương lai
- **Finance Anti-scam**
- **Green Impact OS**
- **Business Growth**
- **Marketplace**
- **Investment Gate** *(có điều kiện chặt)*

## Hệ Thống Subdomains

| Subdomain | Vai trò |
|-----------|--------|
| member.vetuonglai.com | Đăng ký + hồ sơ |
| edu.vetuonglai.com | Nội dung học (curriculum) |
| learn.vetuonglai.com | Lộ trình cá nhân (dashboard) |
| vc.vetuonglai.com | Verifiable credentials |
| work.vetuonglai.com | Cơ hội cộng tác |
| read.vetuonglai.com | Đọc chuyên sâu *(V2)* |
| kids.vetuonglai.com | Kids learning *(V2)* |
| ai.vetuonglai.com | AI tools *(V2)* |
| community.vetuonglai.com | Cộng đồng *(V2)* |
| invest.vetuonglai.com | Giáo dục đầu tư *(V3, gated)* |

## Lộ Trình Đề Xuất

**Cho người mới:**
1. Đăng ký Personal Free
2. Đọc free content + 1 bài mẫu
3. Mua 1 mini product $3–$9 phù hợp nhu cầu
4. Hoàn thành 1 chương trình
5. Nhận credential
6. Apply Verified Contributor (sau 90 ngày)

**Cho phụ huynh:**
1. Đăng ký Family Free
2. Cùng con thử bài mẫu
3. Quyết định tier phù hợp
4. Family Starter hoặc Family Plus

**Cho creator/freelancer:**
1. Đăng ký Partner Free
2. Hoàn thành "Verifiable Portfolio Foundation"
3. Mở Creator Pro để có tools
4. Apply briefs khi đủ điều kiện
```

### 3.2 English

[Same structure, translated content — for brevity, use VI version above as template]

---

## 4. TRANG /pricing — PRICING & MEMBERSHIP

### 4.1 Tiếng Việt

```markdown
# Giá & Thành Viên

## Triết lý giá

Chúng tôi tin vào **giá hợp lý**, **không ép mua**, và **giá trị thật**.

- Bắt đầu **miễn phí**
- Trải nghiệm chuyên môn sâu chỉ với **$3–$9**
- Nâng cấp **$99/năm** cho toàn quyền truy cập
- **Loyalty cap** vĩnh viễn cho thành viên gắn bó

## 3 Tầng Giá

### Tầng A — Free (Miễn phí)

✅ Bao gồm:
- Tài khoản thành viên
- Đọc miễn phí một số bài
- Bài học mẫu các chương trình
- Truy cập cộng đồng (basic)
- Newsletter

### Tầng B — Mini Products $3–$9 (Mua lẻ)

Mua đúng nhu cầu, không ràng buộc subscription.

| Loại | Giá | Ví dụ |
|------|-----|-------|
| Read Deep Topic | $3 | 1 bài deep-dive về chủ đề bạn quan tâm |
| Anti-scam Checklist | $5 | Checklist nhận diện lừa đảo |
| Prompt Pack | $5 | AI prompts ready-to-use |
| Workflow Pack | $9 | AI workflow templates |
| Portfolio Starter | $9 | Hướng dẫn xây portfolio verifiable |
| Kids Parent Starter | $9 | Lộ trình cho phụ huynh |
| Bundle | $29 | Bundle theo chủ đề |
| Cohort | $99–$299 | 4-week có mentor |

**Mua 1 lần, dùng vĩnh viễn.** Có thể nâng cấp lên Annual với credit.

### Tầng C — Annual Membership ($99/năm)

✅ Bao gồm:
- Toàn quyền truy cập 9 nhóm sản phẩm
- Lộ trình cá nhân hóa
- Ưu tiên cohort
- Verified Contributor eligibility (sau khi qualified)
- Discount theo cam kết dài hạn

### Cam kết dài hạn — Tiết kiệm thật sự

| Cam kết | Tổng | Tiết kiệm |
|---------|------|-----------|
| 1 năm | $99 | Giá chuẩn |
| 2 năm | ≈$181.50 | Giảm 1 tháng/năm |
| **3 năm** | **≈$247.50** | **Giảm 2 tháng/năm** |
| 5 năm | ≈$371.25 | Giảm 3 tháng/năm |
| **9+ năm** | **$99/năm vĩnh viễn** | **Loyalty cap không tăng** |

**Loyalty:** Thành viên gia hạn liên tục từ năm 9 trở đi giữ giá $99/năm 
mãi mãi, dù giá thị trường có thay đổi.

### Tầng D — Business Member ($29/tháng)

Cho cá nhân có dịch vụ / doanh nghiệp nhỏ:
- Invoice tools
- Business profile public
- Verified Contribution API access
- Team seats (nâng cấp lên Enterprise)

### Tầng E — Enterprise (Custom)

Cho tổ chức:
- Custom integration
- API access
- White-label verification
- Dedicated support

[Liên hệ](/contact) để nhận quote.

## Hoàn tiền

- **7 ngày hoàn tiền** cho Annual nếu chưa dùng > 20% nội dung
- **3 ngày hoàn tiền** cho Mini products nếu chưa download/access
- Không hoàn tiền cho Cohort sau khi đã bắt đầu (theo policy cohort)

## Câu hỏi thường gặp

**Q: Mini $3–$9 có phải subscription không?**
A: Không. Đây là **mua lẻ một lần**, dùng vĩnh viễn cho gói đó.

**Q: $99/năm có tự động gia hạn không?**
A: Có, nhưng bạn có thể tắt auto-renew trong dashboard.

**Q: Loyalty cap năm 9 có chắc chắn vĩnh viễn không?**
A: Có. Đây là cam kết của chúng tôi cho thành viên gắn bó.
```

### 4.2 English

[Same structure, translated content]

---

## 5. TRANG /membership — CÁCH ĐĂNG KÝ & VERIFY

### 5.1 Tiếng Việt

```markdown
# Đăng Ký Thành Viên

## 3 bước đơn giản

### Bước 1 — Identity (Định danh)

Chọn cách đăng ký phù hợp với bạn:

- 📧 Email + mật khẩu
- 📱 Số điện thoại + OTP (SMS hoặc Zalo)
- 🔗 Đăng ký nhanh qua:
  - Google
  - Apple
  - Facebook
  - LinkedIn
  - X / Twitter
  - TikTok

### Bước 2 — Goals (Mục tiêu)

Cho chúng tôi biết bạn muốn gì:

- **Loại tài khoản:**
  - Cá nhân
  - Phụ huynh
  - Creator
  - Freelancer
  - Doanh nghiệp
  - Tổ chức giáo dục

- **Mục tiêu chính:**
  - Học kỹ năng mới
  - Đọc / nghiên cứu
  - Làm việc online
  - Cộng tác / xây thương hiệu
  - Đầu tư (sau khi đủ điều kiện)

- **Lĩnh vực quan tâm:** AI, Green, Finance, Kids, Business, Read, Work...

### Bước 3 — Path (Lộ trình)

Hệ thống gợi ý lộ trình phù hợp:
- Sản phẩm đầu tiên nên thử
- Chương trình phù hợp
- Cộng đồng nên tham gia

## Verify (Xác minh)

Sau đăng ký, bạn có thể nâng cấp lên **Verified Member** miễn phí bằng cách:

- ✅ Verify email
- ✅ Verify phone
- ✅ Liên kết ít nhất 1 social account verified

### Liên kết mạng xã hội

Sau khi đăng ký, bạn có thể liên kết:
- Facebook profile
- LinkedIn profile
- YouTube channel
- TikTok profile
- Instagram
- X / Twitter
- GitHub
- Personal website / blog

Mỗi link được verify qua oEmbed hoặc OAuth, đưa vào hồ sơ Verified Contribution.

## Quyền lợi theo tier

| Quyền | Free | Verified | Pro | Business |
|-------|------|----------|-----|----------|
| Hồ sơ cơ bản | ✅ | ✅ | ✅ | ✅ |
| Verify badge | — | ✅ | ✅ | ✅ |
| Portfolio public | — | — | ✅ | ✅ |
| Progress tracker | — | — | ✅ | ✅ |
| Proof credits | — | — | ✅ | ✅ |
| Business profile | — | — | — | ✅ |
| Invoice tools | — | — | — | ✅ |
| Verification API | — | — | — | ✅ |

## Đăng ký bây giờ

[👉 Bắt đầu miễn phí](https://member.vetuonglai.com/signup)
```

### 5.2 English

[Translated equivalent]

---

## 6. TRANG /contributor — CONTRIBUTOR ECONOMY

### 6.1 Tiếng Việt

```markdown
# Cộng Tác Viên — Tạo Giá Trị, Nhận Thu Nhập

> ⚠️ **Lưu ý quan trọng:** Trang này mô tả các cơ hội cộng tác chung. 
> **Không cam kết thu nhập.** Mức thu nhập thực tế phụ thuộc vào kỹ năng, 
> thời gian, chất lượng đầu ra và nhu cầu thị trường.

## Triết lý

Bạn không kiếm tiền từ việc đăng ký. Bạn kiếm tiền từ **giá trị thật** 
bạn tạo ra — sau khi đã có proof.

## 6 Tầng Hành Trình

```
Tầng 1: Free Member (đăng ký free)
       ↓
Tầng 2: Explorer (trải nghiệm)
       ↓
Tầng 3: Learner (học chương trình)
       ↓
Tầng 4: Builder (có đầu ra + proof) ← Có thể nhận microtask
       ↓
Tầng 5: Contributor (cộng tác chính thức)
       ↓
Tầng 6: Partner (uy tín cao, dự án lớn)
```

## 7 Nhóm Cộng Tác Viên

### ✍️ Nhóm Writers / Editors / Translators
- Viết bài, biên tập, dịch thuật
- Case study, newsletter, video script
- Phù hợp nếu bạn yêu chữ nghĩa

### 🔍 Nhóm Researchers
- Research thị trường, đối thủ, chính sách
- Due diligence checklist
- Future trend brief

### 🤖 Nhóm AI Operators
- Prompt workflow
- AI assistant setup cho doanh nghiệp
- Automation đơn giản

### 🎓 Nhóm Educators / Mentors
- Dẫn cohort
- Mentor học viên
- Chấm bài / review

### 💼 Nhóm Freelancers
- Landing page, slide design
- Notion/Sheet system, automation
- Customer support, microtask

### 👥 Nhóm Community Builders
- Dẫn nhóm đọc / học
- Ambassador
- Local community lead

### 🏢 Nhóm Small Businesses / Creators
- Bán khóa học verified
- Dịch vụ tư vấn
- Templates, SOPs

[Xem chi tiết từng nhóm sau khi đăng ký](https://member.vetuonglai.com/signup)

## Phase rollout — Khi nào mở channels nào?

### Phase 1 — Mở sau 90 ngày platform launch
- ✍️ Creator Revenue Share (chia sẻ doanh thu nội dung)
- 🎯 VC Bounties (bounty có rate cố định)
- 🔗 Affiliate Single-tier (chia sẻ 1 cấp, không đa cấp)

### Phase 2 — Mở khi V2 launch
- 🎓 Coaching / Consulting Marketplace
- 🌱 Skills Mentorship Program
- 🤝 Co-creation Projects
- 🏢 Enterprise Talent Pool

## Điều kiện mở Earning

Để bắt đầu kiếm thu nhập trong hệ, bạn cần:

1. ✅ Đăng ký + verify email + phone + 1 social
2. ✅ Hoàn thành ít nhất 1 chương trình trên edu
3. ✅ Có ít nhất 1 proof/credential từ VC system
4. ✅ Đạt tầng **Builder** (tầng 4)
5. ✅ Đọc + accept Income Disclaimer
6. ✅ KYC cơ bản nếu payout > $25/tháng

## Affiliate — Chỉ 1 cấp

⚠️ **Quan trọng:** Affiliate của Về Tương Lai là **single-tier (1 cấp)**.

- Bạn giới thiệu A → A đăng ký + mua → bạn nhận commission
- A giới thiệu B → bạn **KHÔNG** nhận gì từ B
- Không có "tổ chức cấp 2", "downline", hay "matrix"

**Đây là lựa chọn có ý thức** để tránh rủi ro pháp lý đa cấp và 
giữ trust cho cộng đồng.

### Commission rates

| Sản phẩm referee mua | Commission |
|---------------------|-----------|
| Mini product $3–$9 | 10–15% lần đầu |
| Mini product $29–$99 | 15–20% lần đầu |
| Annual Membership $99 | 20% năm đầu = $19.80 |
| Cohort $99–$299 | 15% lần đầu |
| Business Member | 15% tháng đầu + 5% tháng 2–6 |

## Mức thu nhập tham khảo

> ⚠️ Để xem mức thu nhập tham khảo và lộ trình chi tiết, vui lòng 
> [đăng ký miễn phí](https://member.vetuonglai.com/signup) và đọc 
> trong dashboard sau khi accept Income Disclaimer.

## Tài liệu phải đọc trước khi cộng tác

- [Payout Policy](/payout)
- [Independent Contractor Agreement](/legal#contractor)
- [Anti-Spam Policy](/legal#spam)
- [Tax Responsibility Guide](/legal#tax)
```

### 6.2 English

[Translated equivalent]

---

## 7. TRANG /payout — PAYOUT POLICY

### 7.1 Tiếng Việt

```markdown
# Chính Sách Thanh Toán

## Tóm tắt

| Channel | Cycle | Hold | Min payout |
|---------|-------|------|-----------|
| Creator Revenue Share | 30 ngày | 14 ngày | $25 |
| VC Bounties | 15 ngày | 7 ngày | $25 |
| Affiliate | 30 ngày | 30 ngày | $25 |
| Coaching (V2) | 15 ngày | 7 ngày | $25 |

## Providers

| Provider | Currency | Fee | Phù hợp |
|----------|---------|-----|---------|
| Wise | USD/EUR/VND | $1–$5 | International |
| PayPal | USD | 2% (cap $20) | US/EU |
| Stripe Connect | USD | $0.25 + 0.25% | US |
| Bank Transfer VN | VND | 0–1% | VN contributors |
| PayOS | VND | 0% | VN có wallet |

## KYC Requirements

| Earnings/năm | KYC level |
|-------------|-----------|
| $0 – $25 | None |
| $25 – $600 | Basic (name + DOB + ID number) |
| $600 – $20,000 | Standard (ID document + address proof) |
| $20,000+ | Enhanced (source of funds + tax ID + AML) |

## Tax Responsibility

Bạn là **Cộng Tác Viên Độc Lập** (Independent Contractor):
- Bạn tự khai thuế
- Hệ thống không withhold trừ khi luật bắt buộc
- US contributors > $600/năm: nhận 1099-NEC
- VN contributors: tuân Nghị định 117/2025

[Xem chi tiết tại Tax Guide](/legal#tax)

## Anti-fraud

Hệ tự động flag:
- Same IP/device cho >3 accounts
- Affiliate > 50 referrals trong 7 ngày
- Refund rate > 20% trên referrals
- Suspicious activity patterns

## Dispute resolution

Nếu có tranh chấp về payout:
1. Liên hệ support trong 30 ngày
2. Mediation trước khi escalate
3. Arbitration nếu cần (theo Independent Contractor Agreement)
```

### 7.2 English

[Translated equivalent]

---

## 8. TRANG /work — WORK & OPPORTUNITIES

### 8.1 Tiếng Việt

```markdown
# Cơ Hội Việc Làm

## Triết lý Work

`work.vetuonglai.com` không phải Upwork hay Fiverr. Nó là **pipeline** 
từ học → có proof → nhận việc → tăng uy tín.

## Loại công việc V1

### Microtask ($5–$30)
- Content review (1 bài)
- Dịch thuật ngắn
- Beta testing
- Verify proof submissions
- Bug report

### Brief nhỏ ($30–$200)
- Landing page
- Slide design
- Notion setup
- Newsletter setup
- Short video

### Project vừa ($200–$1,500)
- Website / no-code build
- Automation system
- Documentation sprint
- Multi-content campaign

### Retainer ($300–$5,000/tháng)
- AI ops
- Content creation regular
- Community management
- Customer success

## Cách apply (V1 — manual)

1. Vào [work.vetuonglai.com](https://work.vetuonglai.com) (sau khi đăng ký)
2. Browse brief listings
3. Click "Apply" → submit portfolio + proposal
4. Admin review → assign
5. Hoàn thành → submit
6. Verify → payout theo policy

## Cách apply V2 (sắp ra mắt)
- Auto-matching theo skill
- Real-time notification
- Direct messaging với client
- Milestone-based payment

## Vietnam Advantage

> 🇻🇳 Contributor Việt Nam có lợi thế:
> - Chi phí sinh hoạt thấp
> - Múi giờ APAC thuận lợi
> - Văn hóa chất lượng đã chứng minh qua FPT, VNG
> - AI literacy đang lên với AI Made in Vietnam

Nhiều contributor VN có thể đạt mức thu nhập tham khảo nhanh hơn nếu 
tận dụng được lợi thế này.

⚠️ **Vẫn không phải cam kết.** Thu nhập thực tế phụ thuộc nhiều yếu tố.

## Điều kiện apply

- Tầng Builder+ (đã có proof)
- Verified Contributor (sau khi qualified)
- Skills match brief
- Có portfolio xác minh
```

### 8.2 English

[Translated equivalent]

---

## 9. TRANG /creator — CREATOR PROGRAM

### 9.1 Tiếng Việt

```markdown
# Creator Program

## Cho ai?

Creator Program phù hợp với bạn nếu:
- Bạn yêu sáng tạo nội dung
- Bạn muốn vừa học vừa kiếm thu nhập
- Bạn muốn xây personal brand verifiable

## Quyền lợi

### Creator Free ($0)
- Tham gia Creator community
- Nhận affiliate single-tier link
- Đọc Creator resources cơ bản

### Creator Pro ($9/tháng)
- Training "Creator Skills Foundation"
- Access Creator toolkit
- Ưu tiên tham gia Creator events
- Submit content for revenue share

### Creator Annual ($99/năm)
- Full Creator toolkit
- Revenue share rate cao hơn (50% vs 35%)
- Priority brief assignment
- Annual creator retreat (online)

### Partner (Mời riêng)
- Tier cao nhất
- Custom revenue share
- Dedicated support
- Co-create products with platform

## Revenue Share Structure

Khi nội dung của bạn được mua/view:

| Vai trò | Share |
|---------|-------|
| Author chính (Creator Pro) | 35% |
| Author chính (Creator Annual) | 50% |
| Editor (nếu có) | 10–15% |
| Researcher (nếu có) | 10–20% |
| Platform | 20–30% |

## Process

1. Đăng ký Creator (Free/Pro/Annual)
2. Hoàn thành "Verifiable Portfolio Foundation"
3. Submit ý tưởng nội dung
4. Pass review
5. Tạo nội dung
6. Edit + verify
7. Publish
8. Receive revenue share monthly

## Quy tắc cứng

- Nội dung phải gốc, không AI thô
- Không vi phạm copyright
- Không spam
- Không claim sai sự thật
- Phải có proof / sources cho fact claims

## Disclaimer

> ⚠️ Tham gia Creator Program không đảm bảo thu nhập. Doanh thu phụ thuộc 
> vào chất lượng nội dung, traffic, và market demand.
```

### 9.2 English

[Translated equivalent]

---

## 10. TRANG /invest — INVESTMENT GATE POLICY (PUBLIC)

### 10.1 Tiếng Việt

```markdown
# Đầu Tư — Cổng Có Điều Kiện

> ⚠️ **GIÁO DỤC ĐẦU TƯ — KHÔNG PHẢI CHÀO BÁN**
>
> Vetuonglai KHÔNG phải nhà tư vấn đầu tư đăng ký. Nội dung trong invest 
> subdomain chỉ phục vụ mục đích giáo dục. Vetuonglai KHÔNG mời gọi 
> đầu tư công khai.

## Tại sao gate chặt?

`invest.vetuonglai.com` là **cổng sau cùng**, không phải điểm vào.

Lý do:
- **Pháp lý:** Đầu tư công khai cần tuân SEC (US), Luật Chứng khoán (VN), 
  MiFID (EU). Vi phạm có thể bị truy tố.
- **Triết học:** User chưa hiểu hệ → dễ bị FOMO. User chưa có proof → 
  không phải target audience phù hợp.

## 4 Giai đoạn Rollout

### Giai đoạn 1 — Education (V3 launch)
✅ Có:
- Bài học về đầu tư cơ bản
- Cảnh báo rủi ro, scam
- Case studies công khai
- Due diligence framework
- Risk tolerance assessment

❌ Không có:
- "Invest Now" button
- Pitch của startup cụ thể
- Email capture cho investors

### Giai đoạn 2 — Case Studies + Due Diligence
Sau khi Giai đoạn 1 ổn định 6+ tháng. Mở thêm:
- Detailed case studies (anonymized)
- Investment terms glossary
- DD checklist tools

### Giai đoạn 3 — Waitlist for Qualified Users
Sau khi pháp lý sẵn sàng. Mở thêm:
- "Express interest" form (cho qualified users)
- Curated opportunity previews
- 1-on-1 với compliance officer

### Giai đoạn 4 — Real Investment Opportunities
Chỉ khi:
- Securities counsel retained
- Reg D filing (US) hoặc tương đương
- PPM drafted
- AML compliance officer
- Founder + Board approval

## 7 Điều kiện Cứng để vào Invest Gate

User phải đạt **TẤT CẢ**:

1. ✅ Đăng ký Member ≥ **90 ngày**
2. ✅ Hoàn thành ít nhất 1 chương trình
3. ✅ Có ít nhất 1 proof/credential
4. ✅ Đạt tầng Builder (tầng 4)+
5. ✅ Đọc + accept Investment Risk Disclosure
6. ✅ Đủ tuổi pháp lý (≥18)
7. ✅ KYC nâng cao (cho Giai đoạn 3+)

**Cho US persons:** Phải verify Accredited Investor status (SEC Reg D 506(c))

## Cam kết của chúng tôi

❌ Không bao giờ:
- Public "Invest Now" CTA
- Hứa lợi nhuận
- Pitch deal qua email mass
- Pressure tactics ("Limited spots!")
- Crypto / token sales

✅ Luôn luôn:
- Education trước
- Risk disclosure đầy đủ
- 14-day cooling-off period
- Verified accredited investor only
- Wire transfer only (no card / e-wallet)

## Tài liệu pháp lý

- [Investment Risk Disclosure](/legal#invest-risk)
- [Subscription Agreement Template](/legal#subscription)
- [Private Placement Memorandum (PPM)](sample only)
- [AML / KYC Policy](/legal#kyc)

## Câu hỏi?

Liên hệ compliance@vetuonglai.com cho câu hỏi liên quan invest.

---

**Quan trọng:** Đầu tư có rủi ro, bao gồm khả năng mất toàn bộ vốn. 
Hiệu suất quá khứ không đảm bảo kết quả tương lai. Tham khảo chuyên 
gia có giấy phép trước khi quyết định đầu tư.
```

### 10.2 English

[Translated equivalent — must include all SEC-required disclaimers]

---

## 11. TRANG /legal — LEGAL & RISK

### 11.1 Tiếng Việt

```markdown
# Pháp Lý & Rủi Ro

## Documents

- [Terms of Service](/legal/tos)
- [Privacy Policy](/legal/privacy)
- [Cookie Policy](/legal/cookies)
- [Refund Policy](/legal/refund)
- [Affiliate Terms](/legal/affiliate)
- [Independent Contractor Agreement](/legal/contractor)
- [Income Disclaimer](/legal/income)
- [Investment Risk Disclosure](/legal/invest)
- [Kids Safety Policy](/legal/kids)
- [Anti-Spam Policy](/legal/spam)
- [DMCA Policy](/legal/dmca)
- [Code of Conduct](/legal/conduct)

## Disclaimers

### Income Disclaimer

> Mức thu nhập đề cập trên platform chỉ là khả năng tham khảo, không 
> phải cam kết. Phụ thuộc vào kỹ năng, thời gian, chất lượng đóng góp 
> và nhu cầu thị trường.

### Investment Disclaimer

> Vetuonglai không phải nhà tư vấn đầu tư. Nội dung chỉ phục vụ giáo dục. 
> Đầu tư có rủi ro, bao gồm mất toàn bộ vốn.

### Worker Classification

> Cộng tác viên là **Independent Contractor**, không phải nhân viên. 
> Tự khai thuế, tự chịu trách nhiệm.

## Compliance

### 🇺🇸 US Compliance
- FTC: Income claims, MLM rules, endorsement disclosure
- SEC: Reg D for investment opportunities
- AB5 (CA): Worker classification
- COPPA: Children under 13
- CCPA: California privacy

### 🇻🇳 VN Compliance
- Luật Trẻ em 2016: Bảo vệ trẻ em
- Nghị định 40/2018: Đa cấp (chúng tôi không vi phạm — single-tier only)
- Nghị định 117/2025: E-commerce, tax withholding
- PDPD: Personal data protection
- Thông tư 32/2025/TT-BTC: E-invoice
- Luật Chứng khoán 2019: Investment

### 🇪🇺 EU Compliance
- GDPR: Data protection
- Platform Workers Directive 2024
- DSA: Digital Services Act
- MiFID II: Financial services

## Báo cáo vi phạm

Email: legal@vetuonglai.com hoặc [Form báo cáo](/report)

## DPO Contact

Email: dpo@vetuonglai.com (cho GDPR + privacy concerns)
```

### 11.2 English

[Translated equivalent with US-specific legal references]

---

## 12. TRANG /kids — KIDS SAFETY POLICY

### 12.1 Tiếng Việt

```markdown
# Chính Sách An Toàn Cho Trẻ

## Triết lý

Chúng tôi đặt **an toàn của trẻ lên trên hết**. Không spin, không exception.

## Quy tắc cứng

❌ **Tuyệt đối không:**
- Cho trẻ kiếm tiền (zero, kể cả "thử nghiệm")
- Public profile của trẻ
- Quảng cáo trực tiếp cho trẻ
- Affiliate / referral cho trẻ
- Leaderboard / ranking công khai
- Thu data nhạy cảm
- Mentor 1-on-1 không có phụ huynh
- Communication ngoài platform

✅ **Luôn luôn:**
- Phụ huynh đăng ký + thanh toán + quản lý
- Verifiable parental consent
- Data minimization
- Quyền xóa / export data của phụ huynh
- Tuân COPPA + GDPR-K + PDPD

## Compliance

### COPPA (US, trẻ < 13)
- Verifiable parental consent trước khi thu data
- Limited data collection
- Parent right to review/delete
- No behavioral advertising

### GDPR-K (EU, trẻ < 16, một số quốc gia 13)
- Parental consent
- Data Protection Impact Assessment (DPIA)
- Right to erasure

### PDPD (VN, trẻ < 16)
- Sự đồng ý của cha mẹ/người giám hộ
- Bảo vệ dữ liệu cá nhân
- Quyền truy cập, chỉnh sửa, xóa

## Quy trình đăng ký Kids tier

1. Phụ huynh đăng ký tài khoản chính
2. Phụ huynh add Kids profile (verifiable consent)
3. Phụ huynh chọn lộ trình
4. Phụ huynh quản lý progress + access
5. Phụ huynh có thể xóa Kids profile bất kỳ lúc nào

## Nội dung Kids

- Curated by educators
- Reviewed for age-appropriateness
- No external links without parental approval
- No data collection beyond necessary

## Báo cáo concerns

Email: kids-safety@vetuonglai.com

Mọi báo cáo về safety của trẻ được ưu tiên cao nhất.
```

### 12.2 English

[Translated equivalent]

---

## 13. TRANG /verification — VERIFICATION POLICY (VC STACK)

### 13.1 Tiếng Việt

```markdown
# Verification Policy — Hồ Sơ Có Thể Xác Minh

## VC là gì?

**Verifiable Contribution (VC)** là hệ thống xác minh đóng góp, kỹ năng, 
và đầu ra của bạn — theo chuẩn W3C Verifiable Credentials Data Model v2.0.

## Tại sao quan trọng?

Trong tương lai, "tôi nói tôi giỏi" không đủ. Cần "tôi có proof tôi giỏi".

VC giúp bạn:
- Build verifiable portfolio
- Apply việc với credentials thật
- Export sang LinkedIn, Upwork, etc.
- Trust signal cho clients/partners

## VC tiers

### Free Proof
- Hồ sơ cơ bản
- Basic badges (verify email, phone, social)
- Limited credentials

### Pro Credential ($9–$19 hoặc trong Annual)
- Custom credential templates
- Verified portfolio
- Proof pack export
- Advanced badges

### Business API ($79/tháng)
- Verify endpoint cho doanh nghiệp
- Bulk verification
- Custom branding
- API access

### Enterprise (Custom)
- White-label verification
- SLA
- Dedicated support
- Cross-system integration

## Cryptographic Verifiable

VC dùng cryptographic signatures, không heavy blockchain:
- W3C VC Data Model v2.0 compliant
- Verifiable bằng public key
- Privacy-first: user control disclosure
- Không vendor lock-in

## Verify như thế nào?

Bất kỳ ai cũng có thể verify một credential:
1. Truy cập verification URL
2. Hệ check signature + issuer
3. Hiển thị: valid / expired / revoked
4. Optional: download proof JSON

## Issuer Registry

Chỉ verified issuers mới được issue credentials. Xem [Issuer Registry](https://trust.iai.one/issuers).

## Privacy

- Bạn control disclosure của mình
- Selective disclosure (chỉ share phần cần)
- Right to revoke / delete
- GDPR + CCPA + PDPD compliant
```

### 13.2 English

[Translated equivalent]

---

## 14. TRANG /faq — FREQUENTLY ASKED QUESTIONS

### 14.1 Tiếng Việt

```markdown
# Câu Hỏi Thường Gặp

## Đăng ký & Membership

**Q: Đăng ký có miễn phí không?**
A: Có, hoàn toàn miễn phí. Bạn có thể trải nghiệm nhiều phần của hệ với 
tài khoản Free Member.

**Q: $99/năm có tự động gia hạn không?**
A: Có. Bạn có thể tắt auto-renew trong dashboard bất kỳ lúc nào.

**Q: Có hoàn tiền không?**
A: Annual: 7 ngày hoàn tiền nếu chưa dùng > 20%. Mini products: 3 ngày 
nếu chưa download. Cohort: không hoàn sau khi bắt đầu.

**Q: Loyalty cap năm 9 có chắc chắn không?**
A: Có. Đây là cam kết của chúng tôi. Thành viên gắn bó liên tục từ năm 9 
giữ giá $99/năm vĩnh viễn.

## Earning

**Q: Tôi có thể kiếm bao nhiêu?**
A: Mức thu nhập tham khảo có trong dashboard sau khi đăng ký + accept 
Income Disclaimer. **Không cam kết.** Phụ thuộc nhiều yếu tố.

**Q: Affiliate có đa cấp không?**
A: **KHÔNG.** Single-tier only. Bạn chỉ nhận từ người bạn trực tiếp 
giới thiệu. Không có cấp 2.

**Q: Khi nào tôi có thể bắt đầu kiếm tiền?**
A: Sau khi: đăng ký + verify + hoàn thành 1 chương trình + có proof + 
90 ngày sau platform launch (Phase 1 channels).

**Q: Payout cycle thế nào?**
A: 15–30 ngày tùy channel. Min payout $25.

## Investment

**Q: Tôi có thể đầu tư khởi nghiệp qua Vetuonglai không?**
A: Hiện tại invest subdomain chỉ giáo dục. Tương lai có thể mở cho 
qualified users sau 90 ngày + KYC + accredited verification (US).

**Q: Vetuonglai có gọi vốn không?**
A: Hiện tại không gọi vốn công khai. Mọi cơ hội đầu tư trong tương lai 
sẽ qua gated portal cho qualified users only.

## Kids

**Q: Trẻ có kiếm tiền được không?**
A: **KHÔNG.** Chính sách cứng. Trẻ không kiếm tiền, không public profile, 
không affiliate — kể cả với phụ huynh đồng ý.

**Q: Phụ huynh kiểm soát thế nào?**
A: 100%. Phụ huynh đăng ký, thanh toán, quản lý progress, có quyền xóa 
Kids profile bất kỳ lúc nào.

## Pháp lý

**Q: Tôi là contributor — tôi có phải nhân viên không?**
A: **Không.** Bạn là Independent Contractor. Tự khai thuế, tự chịu 
trách nhiệm.

**Q: Vetuonglai có thuế ở Mỹ/VN/EU không?**
A: Có, theo từng entity và jurisdiction. Xem [Legal](/legal).

## Tech

**Q: Verifiable Credentials có chuẩn nào?**
A: W3C VC Data Model v2.0. Cryptographic, không heavy blockchain.

**Q: API có không?**
A: Có cho Business+ tier. Xem [API docs](https://developer.iai.one).

## Liên hệ

**Q: Cách liên hệ support?**
A: 
- General: support@vetuonglai.com
- Legal: legal@vetuonglai.com
- Privacy/DPO: dpo@vetuonglai.com
- Compliance/Invest: compliance@vetuonglai.com
- Kids safety: kids-safety@vetuonglai.com
```

### 14.2 English

[Translated equivalent]

---

## 15. PUBLISHING RULES

### 15.1 Quy tắc cứng

Mỗi page docs trước khi publish phải:

- [ ] Có disclaimer phù hợp (income / investment / risk)
- [ ] Pass legal review
- [ ] Bilingual (VI + EN)
- [ ] Last reviewed date hiển thị
- [ ] Linked với privacy + terms

### 15.2 Update process

- Minor edits (typo, formatting): admin có thể update
- Substantive changes (policy, terms): Founder approve + lawyer review
- Legal documents: chỉ lawyer-drafted, founder-signed

### 15.3 Version control

- Mỗi document có version number
- Changes log ở footer
- User được notify nếu Terms hoặc Privacy thay đổi

---

## 16. ACCEPTANCE CRITERIA TRƯỚC KHI PUBLISH

- [ ] All 12 pages drafted in VI + EN
- [ ] All disclaimers present where required
- [ ] Lawyer reviewed: TOS, Privacy, Refund, Income Disclaimer, Invest Disclosure
- [ ] No public income claims anywhere
- [ ] No "Invest Now" CTA anywhere
- [ ] Affiliate single-tier only language
- [ ] Kids policy COPPA + GDPR-K + PDPD compliant
- [ ] Founder signed off
- [ ] Last reviewed date visible
- [ ] Footer with all required links

---

**File này LOCKED. Mọi thay đổi nội dung quan trọng cần Founder approve.**
**Version 1.0 — APPROVED WITH CONDITIONS — 27/04/2026**
