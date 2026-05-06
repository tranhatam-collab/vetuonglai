# VETUONGLAI — DOCS AND HOMEPAGE PUBLIC COPY PLAN 2026

**Status:** `FOUNDER_LOCK_2026-05-06`
**Authority:** Implements `docs/final-lock/VTL_75_FOUNDER_FINAL_APPROVAL_MEMO_2026-05-06.md` §1.3, §1.8, §5, §6.4.
**Reads from:** Public Positioning layer (forbidden lexicon, 5 red lines, microcopy library, public/post-login boundary), Product Architecture (11 product lines, 3 passes, pricing matrix, invest gate), Contributor Economy (channels, splits, disclosure rules).
**Supersedes (in part):** `VETUONGLAI_HOMEPAGE_CONTENT.md` §1-§16; `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` §1-§14; `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md` §10 release-checklist copy items.
**Audience:** content/copy team, designers, engineers building landing pages, SEO/marketing, legal review of public surface, release-gate verifiers.

---

## 0. Purpose

This file is the **public-surface assembly plan**. It tells the system:

- exactly what blocks appear on the homepage in V1 (in order),
- exactly what pages exist on `docs.vetuonglai.com` (sitemap),
- which legal documents are canonical (12) and which are recommended supporting (3 — Founder open item, see §11),
- which microcopy strings belong on which surface,
- which tracking/analytics may run on which page (privacy posture),
- how the public-lexicon verifier proves the surface is clean before deploy.

Every prior copy doc reads from this plan after V1.

---

## 1. V1 homepage — block sequence

The V1 homepage at `vetuonglai.com/` (and its `/en/` counterpart) is **assembled from these blocks, in this order, no others**. Each block is described by its purpose, allowed copy variants, and forbidden patterns.

### 1.1 Block sequence

| Order | Block | Required? | Source of copy |
|---|---|---|---|
| 1 | Header / nav | required | §2 |
| 2 | Hero (brand + tagline + Free signup CTA) | required | §3 |
| 3 | Three-path purchase row (Free / Mini / Annual $99) | required | §4 |
| 4 | What Vetuonglai does — 3-step diagram | required | §5 |
| 5 | The 5 commitments (one-line + link to docs) | required | §6 |
| 6 | Read featured (essays + Book 2 layered free portion) | required (V1) | §7 |
| 7 | Edu featured (1-2 mini-products $3-$9 + 1 program highlight) | required (V1) | §7 |
| 8 | Trust block (docs link + material connection link + invest education link) | required | §8 |
| 9 | FAQ — 6 short Qs (no income claim, no invest claim, no contributor sign-up CTA) | required | §9 |
| 10 | Footer | required | §10 |

### 1.2 Forbidden V1 homepage blocks

These do not appear on the V1 homepage in any position (above or below fold):

- Family Passport CTA block.
- Partner Passport CTA block.
- Contributor sign-up CTA block.
- Invest CTA block / waitlist form.
- "Earn $X" headline.
- Any countdown.
- "Join 10,000+ members" social proof unless figure is published and auto-updated from transparency page.
- Testimonials with income figure attached.
- Lifestyle imagery (luxury goods, exotic locations, aspirational portraits implying wealth).

---

## 2. Header / nav

### 2.1 Layout

- Left: brand wordmark (text-only or simple logo, never with subtitle "make money easy" or similar).
- Center: primary nav links — `Sản phẩm` / `Products`, `Học` / `Edu`, `Đọc` / `Read`, `Cẩm nang vận hành` / `Operating manual` (= docs).
- Right: language switcher (VI / EN), `Đăng nhập` / `Log in`, `Đăng ký miễn phí` / `Sign up free` (button).

### 2.2 Forbidden in header

- "Invest" link in primary nav (per `invest.primaryNav = false`).
- "Become a contributor" / "Trở thành đối tác" link in V1.
- "Pricing" as a top-level link (pricing is reachable from Products and from the Annual Pass card, but not as a primary header link in V1 to avoid leading with money).
- Any urgency/scarcity microcopy.

### 2.3 Mobile

- Hamburger menu collapses primary nav.
- Sign-up button stays visible on mobile (top right).
- Language switcher inside hamburger.

---

## 3. Hero block

### 3.1 Layout (above-fold)

- Brand wordmark.
- Tagline subtitle:
  - VI: **"Học đúng. Làm thật. Chứng minh giá trị."**
  - EN: **"Learn well. Build real. Verify value."**
- Single supporting sentence (≤ 25 VI words / ≤ 22 EN words):
  - VI: *"Vetuonglai là cẩm nang vận hành để bạn học một kỹ năng thật, chứng minh được giá trị, và để tiền theo sau — không hứa thu nhập."*
  - EN: *"Vetuonglai is an operating system to learn one real skill, prove its value, and let money follow as a consequence — no income promises."*
- Primary CTA: `Đăng ký miễn phí` / `Sign up free`.
- Secondary CTA: `Xem các gói` / `View options` (anchors to block 3).
- Quiet visual: simple typography, no people-with-money imagery, no money emoji, no graphs of "growth".

### 3.2 Forbidden hero variants

- "Earn $X / month with Vetuonglai" — forbidden.
- "Đổi đời với Vetuonglai" — forbidden.
- "Join 10,000+ members earning today" — forbidden.
- Auto-rotating banners with multiple promises — forbidden (single, stable hero).
- Dark patterns (pre-checked email opt-ins, hidden price disclosure) — forbidden.

---

## 4. Three-path purchase row

This block is the V1 homepage's **only** purchase-decision block. It presents three cards:

### 4.1 Card 1 — Free Member

- Title (VI): "Thành viên Miễn phí"
- Title (EN): "Free Member"
- Price line (VI): "$0 / mãi mãi"
- Price line (EN): "$0 / forever"
- 3 bullets (VI): "Truy cập docs đầy đủ", "Đọc bài viết miễn phí", "Tham gia Edu cơ bản"
- 3 bullets (EN): "Full docs access", "Read free essays", "Basic Edu access"
- CTA: `Đăng ký miễn phí` / `Sign up free`

### 4.2 Card 2 — Mini products $3-$9

- Title (VI): "Sản phẩm nhỏ — $3-$9"
- Title (EN): "Mini products — $3-$9"
- Price line: "$3-$9 / một lần"
- 3 bullets (VI): "Mua từng sản phẩm rời", "Không cần đăng ký gói", "Hoàn tiền 14 ngày"
- 3 bullets (EN): "Buy individual items", "No subscription required", "14-day refund"
- CTA: `Khám phá sản phẩm nhỏ` / `Browse mini products` (links to `edu.vetuonglai.com` + `read.vetuonglai.com` Mini grid)

### 4.3 Card 3 — Annual Member Passport

- Title (VI): "Hộ chiếu Thành viên — $99 / năm"
- Title (EN): "Member Passport — $99 / year"
- Launch banner (only while active): VI "Giảm 30% năm đầu — $69 (giới hạn 1.000 thành viên đầu hoặc 90 ngày)" / EN "30% off Year 1 — $69 (first 1,000 members or 90 days)"
- 4 bullets (VI): "Truy cập đầy đủ Edu, Read, VC", "Tham gia chương trình tính phí", "Tạo hồ sơ năng lực được xác minh", "Hoàn tiền 14 ngày — không hỏi lý do"
- 4 bullets (EN): "Full access to Edu, Read, VC", "Paid program access", "Build verified credentials profile", "14-day refund — no questions asked"
- CTA: `Trở thành Thành viên — $99/năm` / `Become a Member — $99/year`
- Tertiary link (small): `Xem ladder nhiều năm và hoàn tiền` / `See multi-year ladder + refund detail` → `/pricing/`

### 4.4 Forbidden in this block

- Family Passport card.
- Partner Passport card.
- Per-month price equivalents framed as "starting from $X / month" — V1 displays annual price prominently.
- Testimonials inside the card.
- "Most popular" / "Best value" stickers — neutral display.

---

## 5. Three-step explainer

A simple visual: **Học đúng → Làm thật → Chứng minh giá trị** (Learn well → Build real → Verify value). One sentence per step (≤ 18 VI words / ≤ 16 EN words):

### 5.1 Step 1 — Học đúng / Learn well

- VI: "Bạn chọn một kỹ năng thật và học có cấu trúc trên Edu."
- EN: "Pick one real skill and learn it with structure on Edu."

### 5.2 Step 2 — Làm thật / Build real

- VI: "Bạn áp dụng kỹ năng vào sản phẩm hoặc bài viết thật, có người duyệt."
- EN: "Apply the skill to a real product or essay reviewed by peers."

### 5.3 Step 3 — Chứng minh giá trị / Verify value

- VI: "Năng lực của bạn được xác minh bởi VC, ghi vào hồ sơ thành viên."
- EN: "Your capability is verified by VC and recorded in your member profile."

### 5.4 Forbidden

- Adding a 4th step that says "and earn".
- Replacing any step with a money outcome.
- Animated counters (e.g., "$X earned by members this month").

---

## 6. Five commitments block

A single horizontal row (or vertical on mobile) listing the 5 red lines, one line each, with a single link below to the full text.

### 6.1 Display (VI)

> 5 cam kết: không hứa thu nhập • giới thiệu 1 cấp • không thu phí trẻ em • không công bố ROI • không bán dữ liệu.
> [Xem chi tiết tại `docs.vetuonglai.com/about/`]

### 6.2 Display (EN)

> 5 commitments: no income promise • single-tier referral • no fees from children • no expected returns • no data sales.
> [Read the full statement at `docs.vetuonglai.com/about/`]

### 6.3 Forbidden

- Expanding the 5 to 7 or 8 with marketing additions.
- Showing 4 of 5 to save space (the list is whole-or-not-shown).
- Linking to a sales page rather than the docs operating-manual page.

---

## 7. Featured content blocks (Read + Edu)

V1 surfaces 1 featured Read block and 1 featured Edu block.

### 7.1 Read featured

- 1 essay (free) with author name + read time + link.
- Layered Book 2 (Tận cùng một cuộc sống) with the 10/20/70 model: Layer 0 (free metadata + foreword), Layer 1 (free first chapter excerpt), and a clear price for Layer 2 (paid). No income claim about the book.
- CTA: `Đọc thêm trên Read` / `More on Read` → `read.vetuonglai.com`.

### 7.2 Edu featured

- 1 Mini product ($3-$9) with title + price + duration.
- 1 program highlight (paid) with title + outline summary + price.
- CTA: `Xem chương trình học` / `Browse programs` → `edu.vetuonglai.com`.

### 7.3 Forbidden

- Income claim attached to either.
- "X people enrolled this month" without auditable source.
- Auto-rotating featured carousel (use a single static feature per block in V1).

---

## 8. Trust block

A horizontal row with three icons + one-line links each. Neutral wording, no urgency.

### 8.1 The three links

1. `Cẩm nang vận hành` / `Operating manual` → `docs.vetuonglai.com`
2. `Tiết lộ quan hệ lợi ích` / `Material connection disclosure` → `docs.vetuonglai.com/legal/material-connection/`
3. `Giáo dục đầu tư (cổng có điều kiện sau 90+ ngày)` / `Investment education (gated after 90+ days)` → `docs.vetuonglai.com/invest/`

### 8.2 Forbidden

- "Invest now" / "Apply for investor access" — the third link is education, not a CTA.
- Replacing the docs link with a "Why join us" sales page.
- Social media follow icons in this block (social can go in footer; trust block is for legal/operational trust artifacts).

---

## 9. FAQ block — 6 short questions

The V1 homepage FAQ is exactly 6 Qs. Each answer ≤ 60 VI words / ≤ 50 EN words.

### 9.1 Q1 — Vetuonglai là gì? / What is Vetuonglai?

VI: *"Vetuonglai là cẩm nang vận hành cho phát triển năng lực cá nhân: học một kỹ năng thật trên Edu, chứng minh giá trị qua VC, và (tùy chọn) đóng góp trên Read hoặc các surface khác. Tiền có thể đến sau như hệ quả, không phải lời hứa."*

EN: *"Vetuonglai is an operating system for personal capability development: learn one real skill on Edu, verify value through VC, and optionally contribute on Read or other surfaces. Money may follow as a consequence, never as a promise."*

### 9.2 Q2 — Có phải affiliate không? / Is this an affiliate program?

VI: *"Không. Hệ chỉ có giới thiệu minh bạch 1 cấp, không có downline, không có cấp 2. Mọi giới thiệu được tiết lộ công khai theo quy định FTC và Nghị định 40/2018."*

EN: *"No. The system has only single-tier transparent referral — no downline, no level 2. All referrals are publicly disclosed under FTC rules and Vietnam Decree 40/2018."*

### 9.3 Q3 — Hộ chiếu Gia đình / Đối tác có không? / Family / Partner Passport?

VI: *"Có. Hộ chiếu Gia đình mở vào Phase V2 (sau khi hệ ổn định), Hộ chiếu Đối tác mở vào Phase V3. Trong V1 chúng tôi tập trung vào Hộ chiếu Thành viên cá nhân và sản phẩm nhỏ."*

EN: *"Yes. Family Passport opens in Phase V2 (after stability), Partner Passport opens in Phase V3. In V1 we focus on personal Member Passport and mini products."*

### 9.4 Q4 — Đầu tư có không? / Can I invest?

VI: *"Cổng đầu tư là bước cuối cùng và có điều kiện chặt: ≥ 90 ngày là thành viên, đạt tầng cao trong hệ, KYC, và xác minh nhà đầu tư đủ điều kiện theo luật. Hiện đang giáo dục, không có CTA, không có waitlist."*

EN: *"The investment gate is the last step with hard conditions: ≥ 90-day member, high pathway tier, KYC, and qualified-investor verification per law. Currently education only — no CTA, no waitlist."*

### 9.5 Q5 — Hoàn tiền thế nào? / Refund policy?

VI: *"14 ngày hoàn tiền tự động cho mọi gói cá nhân và sản phẩm nhỏ. Không hỏi lý do. Hoàn vào phương thức thanh toán gốc trong vòng 5-7 ngày làm việc."*

EN: *"14-day automatic refund on any personal pass or mini product. No questions asked. Refunds to original payment method within 5-7 business days."*

### 9.6 Q6 — Vetuonglai có hứa thu nhập không? / Do you promise income?

VI: *"Không. Vetuonglai không hứa thu nhập, không nói 'đổi đời', không có 'thu nhập thụ động'. Thu nhập thực tế của thành viên đóng góp phụ thuộc vào kỹ năng, thời gian, chất lượng đóng góp, và nhiều yếu tố khác."*

EN: *"No. Vetuonglai does not promise income, does not claim 'life-changing earnings', does not offer 'passive income'. Actual member income depends on skill, time, contribution quality, and many other factors."*

### 9.7 Forbidden FAQ Qs in V1

- Any Q whose answer requires showing an income figure.
- Any Q phrased as "How much can I earn?".
- Any Q about invest with answer beyond §9.4's neutral statement.
- Any Q about contributor sign-up (V1 has no public contributor sign-up).

---

## 10. Footer

### 10.1 Sections

- Brand line + small logo.
- Bilingual link list — `Sản phẩm`, `Học`, `Đọc`, `Tài liệu pháp lý`, `Liên hệ`.
- Legal links — `Điều khoản`, `Quyền riêng tư`, `Cookies`, `Hoàn tiền`, `Tiết lộ quan hệ lợi ích`.
- Compliance line — entity legal name + registered address (VN + US if dual entity).
- Tagline (small): `Học đúng. Làm thật. Chứng minh giá trị.` / `Learn well. Build real. Verify value.`
- Social media icons (optional, at bottom).
- Language switcher (mirrors header).

### 10.2 Forbidden in footer

- Any income claim, even small.
- Any countdown.
- Any "Invest now" / "Apply for investor" link.
- Pre-checked newsletter opt-in.

---

## 11. `docs.vetuonglai.com` — sitemap and section copy plan

Per Memo §1.8, docs is the **operating manual**, neutral in tone, no sales urgency, no scarcity. It uses only the microcopy CTAs in Public Positioning §7.

### 11.1 Canonical sitemap (V1)

| Path | Purpose |
|---|---|
| `/` | What Vetuonglai is + the 5 commitments + tagline |
| `/about/` | Brand statement, Vietnam Advantage, leadership, mission |
| `/products/` | Neutral one-line per product line; link to subdomain |
| `/membership/` | Member, Family, Partner Passports explained |
| `/pricing/` | Full pricing detail (annual ladder, family, partner, mini) |
| `/contributor/` | Contributor program (single-tier, Builder gate, terms) — V2+ for sign-up; V1 explanation only |
| `/income/` | Income Disclaimer + post-login link to historical reference ranges |
| `/invest/` | Invest education only (7 conditions, 4 stages, no CTA) |
| `/kids/` | Kids surface explainer + COPPA + Luật Trẻ em |
| `/trust-system/` | Pathway, tier, VC, transparency model |
| `/verification/` | VC + Builder gate explained |
| `/work/` | Work-light (Member capability) — career profile + services lite |
| `/legal/` | Index of canonical legal documents (12) + recommended supporting (3) |
| `/legal/tos/` | Terms of Service |
| `/legal/privacy/` | Privacy Policy |
| `/legal/cookies/` | Cookie Policy |
| `/legal/refund/` | Refund Policy |
| `/legal/material-connection/` | FTC material connection disclosure standard |
| `/legal/contractor/` | Contributor / contractor classification |
| `/legal/income/` | Income Disclaimer (canonical full text) |
| `/legal/invest/` | Investment Risk Disclosure (canonical full text) |
| `/legal/kids/` | COPPA + Luật Trẻ em statements |
| `/legal/spam/` | Anti-spam policy |
| `/legal/dmca/` | DMCA / IP takedown policy |
| `/legal/conduct/` | Code of Conduct |
| `/faq/` | Long FAQ (≥ 20 Qs) — operating-manual depth, not sales |
| `/getting-started/` | First-7-day checklist for a new member |
| `/changelog/` | Version log of policy changes (transparency) |
| `/support/` | Contact, refund flow, dispute mechanism |

### 11.2 Forbidden on docs

- Animated CTAs.
- Income figure on any page outside `/income/` post-login portion.
- Invest CTA on any page (including `/invest/`).
- "Limited time" / countdown.
- Auto-rotating testimonials.
- Sales-team chat widgets.

### 11.3 Tone rules

- VI primary; EN parallel; no machine-translated EN.
- Plain, direct, neutral. No marketing superlatives.
- No emojis except where a system status icon is functionally needed.
- Always prefer the operational verb: "explained", "disclosed", "documented", "recorded" over marketing verbs ("transform", "unleash", "skyrocket").

---

## 12. The 12 canonical legal documents

These are the **always-present, always-public** legal documents at the indicated paths. The list is exhaustive for V1 + V2 launch readiness.

| # | Path | Title | Owner |
|---|---|---|---|
| 1 | `/legal/tos/` | Terms of Service | Team 3 + counsel |
| 2 | `/legal/privacy/` | Privacy Policy | Team 3 + counsel |
| 3 | `/legal/cookies/` | Cookie Policy | Team 3 + counsel |
| 4 | `/legal/refund/` | Refund Policy | Team 3 |
| 5 | `/legal/material-connection/` | FTC Material Connection Disclosure | Team 3 + counsel |
| 6 | `/legal/contractor/` | Contractor / Independent Worker Classification | Team 3 + counsel |
| 7 | `/legal/income/` | Income Disclaimer | Team 3 + counsel |
| 8 | `/legal/invest/` | Investment Risk Disclosure | Team 3 + securities counsel |
| 9 | `/legal/kids/` | COPPA + Luật Trẻ em Disclosure | Team 3 + counsel |
| 10 | `/legal/spam/` | Anti-Spam Policy | Team 3 |
| 11 | `/legal/dmca/` | DMCA / IP Takedown Policy | Team 3 |
| 12 | `/legal/conduct/` | Code of Conduct | Team 3 |

### 12.1 Versioning

- Each legal doc has a `last_updated_at` and a `version` (semver-like: `2026.05.06`).
- Material changes trigger a `/changelog/` entry and (for privacy/TOS material changes) email notification to all members.
- Old versions remain accessible at `/legal/<doc>/v/<version>/`.

### 12.2 Bilingual rule

Every legal doc has VI and EN versions, both legally binding within their respective jurisdictional scope (VN regulators read VI; US regulators read EN). Where the two diverge in nuance, both versions are evaluated; the entity-of-record agreement specifies which controls per dispute jurisdiction.

---

## 13. Recommended supporting documents (3 — open item §11)

Per Memo §8 open items, the Founder lock for the **3 recommended supporting documents** is pending Founder input. Working candidates (subject to Founder selection):

| Candidate | Path (working) | Purpose |
|---|---|---|
| Editorial Standards (Read) | `/legal/editorial/` or `read.vetuonglai.com/standards/` | Editorial review criteria for Read essays + books |
| Contributor Code of Conduct | `/legal/contributor-conduct/` | Conduct rules for active contributors (separate from general `/legal/conduct/`) |
| Data Subject Request (DSAR) workflow | `/legal/dsar/` | GDPR / CCPA / Nghị định 13/2023 access + deletion request procedure |

These are recommended but not strictly mandatory for V1 minimum-viable legal compliance. Founder picks the final 3 (may replace any with another candidate). Whichever 3 are picked, they are added to `/legal/` index alongside the canonical 12.

---

## 14. Microcopy — full library (V1 surfaces)

Public Positioning §7 owns the canonical microcopy. This section catalogs the exact instances each string appears in V1.

### 14.1 Sign-up CTAs — instances

| String | Where it appears in V1 |
|---|---|
| `Đăng ký miễn phí` / `Sign up free` | Header (right), Hero primary CTA, Block 4 Card 1 |
| `Trở thành Thành viên — $99/năm` / `Become a Member — $99/year` | Block 4 Card 3, `/pricing/` Annual Pass card |
| `Khám phá sản phẩm nhỏ` / `Browse mini products` | Block 4 Card 2, Block 7 Edu featured |
| `Đăng nhập` / `Log in` | Header (right), end of footer link list |

### 14.2 Browse CTAs — instances

| String | Where |
|---|---|
| `Đọc sách` / `Browse books` | Block 7 Read featured CTA, header `Đọc` link |
| `Đọc bài viết` / `Browse essays` | Block 7 Read featured tail link |
| `Xem chương trình học` / `Browse programs` | Block 7 Edu featured CTA, header `Học` link |
| `Xem các gói` / `View options` | Hero secondary CTA (anchors to Block 4) |
| `Xem chi tiết các gói` / `View pricing detail` | Block 4 Card 3 tertiary link → `/pricing/` |

### 14.3 Trust CTAs — instances

| String | Where |
|---|---|
| `Đọc cẩm nang vận hành` / `Read the operating manual` | Block 8 link 1 |
| `Xem 5 cam kết` / `See our 5 commitments` | Block 6 link |
| `Tiết lộ quan hệ lợi ích` / `Material connection disclosure` | Block 8 link 2, footer legal column |
| `Tuyên bố về thu nhập` / `Income disclaimer` | Footer legal column, post-login income surface |
| `Tuyên bố rủi ro đầu tư` / `Investment risk disclosure` | `/legal/invest/`, `/invest/` body link |
| `Quyền riêng tư & dữ liệu` / `Privacy & data` | Footer legal column |

### 14.4 Forbidden microcopy in V1 — verifier list

The deploy gate `verify-public-lexicon.mjs` (Team 5 to build, see §16) checks `dist/**/*.html` for the following forbidden strings (case-insensitive, with/without diacritics):

- `kiếm tiền`, `kiem tien`
- `thu nhập thụ động`, `passive income`
- `đổi đời`, `doi doi`
- `làm giàu`, `lam giau`, `get rich`, `become rich`
- `đảm bảo thu nhập`, `guaranteed income`
- `affiliate program`, `affiliate marketing` (the bare word "affiliate" requires manual review to allow only in legacy code identifiers, never in HTML body)
- `MLM`, `multi-level`, `network marketing`, `downline`, `upline`
- `marketplace` as a product label (allow in long-form prose explaining what we are not, with manual review)
- `ROI`, `expected return`, `lợi nhuận kỳ vọng`, `expected ROI`
- `Invest now`, `Đầu tư ngay`, `Become an investor`, `Trở thành nhà đầu tư`
- `Cơ hội đầu tư` (forbidden as CTA wording — manual review for body prose use)
- `Join investor waitlist`, `Đăng ký danh sách nhà đầu tư`
- `cheap labor`, `low-cost outsource`, `nhân công giá rẻ`
- `iai.one` (any subdomain)

A hit on any of the above in `dist/` blocks the deploy. CI/release-gate must run this verifier before any deploy of `vetuonglai.com`, `docs.*`, `edu.*`, `read.*`, `kids.*` (V2+), or any other public surface.

---

## 15. Privacy and analytics posture

### 15.1 Public surface — minimal collection

- First-party analytics only (server logs, a privacy-first analytics tool that does not set third-party tracking cookies).
- No Google Analytics by default; no Meta Pixel by default; no LinkedIn Insight by default.
- A cookie banner appears on first visit, GDPR-compliant for EU traffic and Nghị định 13/2023-compliant for VN traffic.
- Consent is opt-in (not opt-out) for any non-essential cookies/trackers.

### 15.2 Post-login surface — purpose-bound collection

- Member-tied analytics for product improvement and the member's own dashboard.
- Member can export and delete their data via `/legal/dsar/` (or whichever path is chosen for the DSAR doc).

### 15.3 Forbidden tracking

- Re-targeting pixels firing on the V1 homepage.
- Heatmap tools that capture individual session replays without explicit consent.
- A/B test tools that ship to live without the change being reflected in `/changelog/`.
- Tracking children on Kids surface in any way.

---

## 16. Release-gate verifiers (this layer's deploy gates)

The following verifiers must pass before any V1 public deploy:

### 16.1 `verify-public-lexicon.mjs`
Reads `dist/**/*.html` (excluding admin/post-login routes), scans for forbidden strings (§14.4). Fails on any hit.

### 16.2 `verify-homepage-block-sequence.mjs`
Reads `dist/index.html` (VI + `/en/index.html` EN). Asserts the 10 required blocks (§1.1) appear in order; asserts no forbidden block (§1.2) is present.

### 16.3 `verify-legal-docs-completeness.mjs`
Asserts each of the 12 canonical legal docs (§12) exists at the canonical path with VI + EN versions, with `last_updated_at` and `version` set.

### 16.4 `verify-microcopy-canon.mjs`
Reads `dist/**/*.html`. Asserts every CTA string matches one in the microcopy library (§14). Fails on any unrecognized CTA wording (catches drift).

### 16.5 `verify-invest-surface-clean.mjs`
Reads any HTML that mentions "invest" / "đầu tư". Asserts no invest CTA, no waitlist form, no expected-return figure on any public surface; asserts the invest-page neutral tagline (Public Positioning §8.2) is present on `invest.*/index` and `docs.*/invest/index`.

### 16.6 `verify-bilingual-parity.mjs`
Asserts every page in `vetuonglai.com/` has a counterpart in `/en/`, and vice versa; asserts language switcher present on each.

### 16.7 Aggregation
The total release gate (`verify-total-system-release-gate.mjs`) must include all six of the above as required steps for V1 public deploy. Failure of any one blocks deploy.

---

## 17. Reconciliations forced by this lock

### 17.1 `VETUONGLAI_HOMEPAGE_CONTENT.md`
- §3 tagline candidates A-E: replaced by single locked tagline (§3 of this doc).
- §17-§18 invest reference / CTA list: align with §8 of this doc (no invest CTA, neutral education link only).
- §1-§16 block sequence: replaced by §1-§10 of this doc.

### 17.2 `VETUONGLAI_DOCS_PUBLIC_CONTENT.md`
- §1-§14: replaced by §11 sitemap + §12 legal canon + §13 recommended supporting (pending Founder pick) of this doc.
- §3 cam kết: replaced by Public Positioning §2 + §6 of this doc.
- §10 phase table: align Marketplace row → Contributor Studio (V3); align learn row to V2.

### 17.3 `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md`
- §10 release checklist: extend to include the 6 verifiers in §16 of this doc.
- §7.1: confirm `learn.*` V2 (already correct), add `studio.*` V3 (per Product Architecture).

---

## 18. Definition of Done — public copy plan layer

This layer is "done for V1" when:

- ✅ Homepage built per §1 (10 blocks, in order, no forbidden blocks).
- ✅ Hero locked tagline (§3) + locked supporting sentence rendered identically VI + EN.
- ✅ Three-path purchase row (§4) is the only purchase block on the homepage; no Family/Partner CTA above-fold.
- ✅ Three-step explainer (§5) renders with the locked verb sequence.
- ✅ 5 commitments block (§6) shows all 5; links to docs `/about/`.
- ✅ Read + Edu featured (§7) renders with no income claim.
- ✅ Trust block (§8) renders 3 links exactly; invest is education-only.
- ✅ FAQ block (§9) renders 6 Qs exactly with locked answers.
- ✅ Footer (§10) carries entity legal name + 5 legal links + tagline.
- ✅ Docs sitemap (§11) deployed; tone (§11.3) followed.
- ✅ 12 canonical legal docs (§12) live with VI + EN + version.
- ✅ 3 recommended supporting docs (§13) — pending Founder lock; track as open item.
- ✅ Microcopy canon (§14) is the only source for public CTAs; verifier passes.
- ✅ Privacy posture (§15) implemented; cookie banner GDPR + Nghị định 13/2023 compliant.
- ✅ All 6 release-gate verifiers (§16) green in `reports/`.

When all 14 boxes pass, this layer is V1-complete. V2 expansion (Family CTA on homepage, contributor public sign-up funnel) reopens this doc for §1 block sequence revision under a separate Founder go-decision.

— end of public copy plan layer —
