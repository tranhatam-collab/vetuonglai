# VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md

**Version:** 1.1
**Date:** 2026-04-28
**Status:** MASTER LOCK - DEV IMPLEMENTATION BRIDGE
**Scope:** Mapping layer from strategy files to production implementation
**Audience:** Founder, Dev, Product, Content, Compliance, Legal

**Changelog:**
- 1.1 (2026-04-28): Add §1 references to PATHWAY_AND_TIER_FRAMEWORK and FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE; add §13 Pathway × Tier bridge; add §14 FTC bridge; reframe `/contributor/` six-tier wording as legacy with mapping to new 7-tier model.

---

## 0. Purpose

This file is the bridge between the five approved strategy files and actual public implementation.

It exists because the strategy files contain three types of material:

1. Public-safe content.
2. Member-gated content.
3. Internal-only implementation, fraud, payout, legal, and operations detail.

Dev teams must not publish the five strategy files verbatim.

---

## 1. Source Files Under This Lock

The following files are approved as strategy inputs:

- `docs/00_master/VETUONGLAI_PRODUCT_STRATEGY.md`
- `docs/00_master/VETUONGLAI_REVENUE_FOR_MEMBERS.md`
- `docs/00_master/VETUONGLAI_INVEST_GATING_RULES.md`
- `docs/00_master/VETUONGLAI_DOCS_PUBLIC_CONTENT.md`
- `docs/00_master/VETUONGLAI_HOMEPAGE_CONTENT.md`

Supplementary master locks (must be applied together with the five files above):

- `docs/00_master/VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` — locks 6 pathways × 7 tiers and the cross-mapping.
- `docs/00_master/VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` — locks referral/affiliate vocabulary, disclosure wording, and audit rules.

This mapping lock decides what parts may appear in:

- Public homepage.
- Public docs.
- Logged-in member dashboard.
- Admin/internal tools.

---

## 2. Master Public Positioning

### VI

Về Tương Lai là một hệ giúp con người học đúng, làm thật, tạo ra đầu ra có thể xác minh và từng bước mở ra cơ hội cộng tác dài hạn.

### EN

Vetuonglai is a system that helps people learn correctly, produce real outputs, build verifiable proof, and gradually access meaningful collaboration opportunities.

### Required Sequence

```text
Learn -> Build -> Verify -> Collaborate
```

Do not use a public sequence that starts with earning, payout, referral, commission, or investment.

---

## 3. Public / Member / Internal Split

### 3.1 Public Homepage

Allowed:

- Tagline.
- Three product cards: Personal Journey, Family Journey, Partner Journey.
- Free signup CTA.
- Docs link.
- Short trust/disclaimer line.
- Learn / Build / Verify / Collaborate sequence.

Not allowed:

- Income numbers.
- Payout details.
- Commission tables.
- Affiliate wording as a selling point.
- Investment CTA.
- Invest navigation as a primary action.

### 3.2 Public Docs

Allowed:

- Product map.
- Pricing principles.
- Membership registration flow.
- Contributor overview.
- Work opportunity overview.
- Verification policy.
- Kids safety policy.
- Invest education and gating rules.
- Legal disclaimers.

Not allowed:

- Detailed income benchmarks.
- Full payout provider table.
- Anti-fraud thresholds.
- KYC threshold details that help abuse.
- Detailed commission rates as a public acquisition hook.
- Any investment offer, waitlist, or payment form.

### 3.3 Logged-In Member Dashboard

Allowed after user accepts required disclaimers:

- Income reference ranges.
- Detailed earning pathways.
- Payout provider options.
- Contributor eligibility checklist.
- Single-tier referral benefit details.
- Microtask and bounty application guidance.

Required before showing income reference ranges:

- User is logged in.
- User accepts Income Disclaimer.
- UI clearly states income is not guaranteed.

### 3.4 Admin / Internal Only

Internal only:

- Fraud detection thresholds.
- Manual review triggers.
- Payout freeze rules.
- KYC escalation thresholds.
- Legal jurisdiction playbooks.
- Worker classification risk details.
- Payment processor risk notes.

---

## 4. Vocabulary Rules

### 4.1 Public Forbidden Terms

Do not use these in public homepage or public acquisition copy:

- Earn money fast.
- Guaranteed income.
- Passive income.
- Financial freedom.
- Get rich.
- Downline.
- Commission tree.
- Multi-level.
- Network marketing.
- Investment opportunity.
- Invest now.
- ROI.
- Expected returns.

### 4.2 Public Replacement Terms

Use these instead:

- Learn correctly.
- Build real outputs.
- Verifiable proof.
- Collaboration opportunities.
- Contributor program.
- Verified collaborator.
- Transparent referral benefit.
- Project-based work.
- Revenue share after qualification.
- Educational investment content.

### 4.3 Affiliate Wording

Public wording:

- `Giới thiệu minh bạch`
- `Quyền lợi giới thiệu hợp lệ`
- `Transparent referral benefit`

Internal wording may use:

- `affiliate_single_tier`
- `referral_commission`

Mandatory public statement:

VI:

> Đây không phải mô hình kinh doanh đa cấp và không có cấu trúc hoa hồng nhiều tầng.

EN:

> This is not a multi-level marketing model and does not involve tiered commission structures.

---

## 5. Homepage Implementation Mapping

### 5.1 Hero

Use one founder-selected tagline from `VETUONGLAI_HOMEPAGE_CONTENT.md`.

Recommended default for implementation:

VI:

> Học đúng. Làm được. Chứng minh giá trị. Mở ra tương lai.

EN:

> Learn properly. Work effectively. Prove your value. Build your future.

CTA:

- Primary: `Đăng ký miễn phí` / `Start Free`
- Secondary: `Tìm hiểu cách hệ hoạt động` / `See how it works`

### 5.2 Three Product Cards

#### Personal Journey

Public-safe message:

VI: Cho cá nhân muốn học, làm, xây hồ sơ và tạo đầu ra có thể xác minh.  
EN: For individuals who want to learn, build a profile, and create verifiable outputs.

#### Family Journey

Public-safe message:

VI: Cho phụ huynh và gia đình muốn bắt đầu lộ trình học an toàn, có người lớn đồng hành.  
EN: For parents and families who want a safe learning journey with adult guidance.

#### Partner Journey

Public-safe message:

VI: Cho người muốn từng bước mở cơ hội cộng tác sau khi có đầu ra và bằng chứng.  
EN: For people who want to gradually access collaboration opportunities after building outputs and proof.

Do not show:

- `earning`
- `affiliate`
- `commission`
- `payout`
- income numbers

---

## 6. Docs Implementation Mapping

Public docs V1 should include these pages:

- `/products/`
- `/pricing/`
- `/membership/`
- `/contributor/`
- `/work/`
- `/legal/`
- `/kids/`
- `/verification/`
- `/faq/`
- `/invest/` as education/gating only

Pages that need special filtering:

### `/contributor/`

Allowed:

- Tier overview (see Pathway × Tier framework).
- Conditions before collaboration.
- Contributor groups.
- No income guarantee.
- No MLM statement.

Tier wording rule:

- The legacy "six tiers" wording (Free / Explorer / Learner / Builder / Contributor / Partner)
  used in the older strategy files is **deprecated for new copy**.
- New public copy must follow the 7-tier model defined in
  `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §2 and may present it as the
  3-cluster public view from §7 of that file (Khám phá / Tạo giá trị / Cộng tác sâu).
- When older copy is referenced, apply the cũ→mới mapping in §5 of that file.

Not allowed publicly:

- Commission rate table.
- Income reference cards.
- Detailed payout provider table.

### `/payout/`

Public V1 should either be absent or summary-only.

If present, show:

- Payout exists only for qualified contributors.
- No guaranteed payout.
- Details available after login and policy acceptance.

### `/invest/`

Allowed:

- Education.
- Risk warnings.
- Due diligence framework.
- Gate conditions.

Not allowed:

- Invest now.
- Join waitlist.
- Deal list.
- Expected return.
- Payment.
- Solicitation.

---

## 7. Product / Domain Mapping For V1

### 7.1 V1 Public Domains

- `vetuonglai.com`: public homepage and ecosystem map.
- `member.vetuonglai.com`: signup, identity, access, dashboard.
- `edu.vetuonglai.com`: content catalog, programs, lessons, mini topics.
- `vc.vetuonglai.com`: proof, credential, verification layer.
- `work.vetuonglai.com`: light work preview and manual brief listing.
- `docs.vetuonglai.com`: public operating manual.

### 7.2 Learn Domain Decision

`learn.vetuonglai.com` is defined in strategy as a personal learning OS, but it is not in the current registry.

V1 implementation decision:

```text
Do not create learn.vetuonglai.com in V1.
Implement personal learning dashboard under member.vetuonglai.com/app/learn/.
Keep learn.vetuonglai.com reserved for V2 after founder approval.
```

Rationale:

- Fewer new domains.
- Less registry churn.
- Member dashboard is the natural home for personal progress.
- Edu remains the content/catalog layer.

---

## 8. Invest Lock For Dev

Required immediate registry rule:

```text
invest.primaryNav = false
```

Public navigation must not treat `invest.vetuonglai.com` as a main entry point.

Allowed wording:

- `Giáo dục đầu tư và rủi ro`
- `Investment education and risk`

Forbidden wording:

- `Invest now`
- `Cơ hội đầu tư`
- `ROI`
- `Lợi nhuận`
- `Expected returns`
- `Join investor waitlist`

No payment form, no checkout, no deal list, no waitlist until separate founder + legal approval.

---

## 9. Kids Lock For Dev

Kids must remain parent-led.

Public and product rules:

- Parent registers.
- Parent manages child profile.
- No child earning.
- No child referral.
- No public child profile.
- No leaderboard.
- No direct advertising to children.
- No private 1:1 messaging between mentor and child without parent visibility.

---

## 10. Required Data Registry

Dev should implement product strategy through data, not hard-coded copy.

Required file:

```text
src/data/product-strategy-registry.json
```

Minimum fields:

- `id`
- `phase`
- `host`
- `publicVisible`
- `memberGated`
- `internalOnly`
- `requiresProof`
- `requires90Days`
- `forbiddenPublicTerms`
- `allowedPublicCtas`
- `disclaimers`

---

## 11. Release Checklist

Every PR touching homepage, docs, products, contributor, pricing, work, payout, invest, or kids must pass:

- [ ] No public income claim.
- [ ] No public income numbers.
- [ ] No multi-tier referral/affiliate logic.
- [ ] No investment CTA.
- [ ] `invest` not exposed as primary homepage CTA.
- [ ] Contributor wording uses collaboration/value/proof framing.
- [ ] Kids has no earning/referral/public-profile path.
- [ ] Public docs do not include internal anti-fraud thresholds.
- [ ] All relevant pages include VI/EN content.
- [ ] Pathway × Tier hard gates respected (no earning < Tier 4, no project < Tier 5, no invest < Tier 7).
- [ ] No legacy "Explorer" / "Partner" tier wording introduced in new copy.
- [ ] Every referral link is wrapped with disclosure component and ships with `disclosure_text`.
- [ ] Anti-MLM statement present on pages that mention referral/contributor/collaboration.
- [ ] No forbidden public terms from §14.1 leaked into dist HTML.
- [ ] Build/check/QA pass.

---

---

## 13. Pathway × Tier Bridge

This section is the binding bridge to `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`.
For full detail, read that file. The rules below are mandatory in code and content.

### 13.1 Two independent axes

- Pathway (horizontal): Learn / Read / Work / Build / Verify / Belong.
- Tier (vertical, 7 nấc): Free / Learner / Builder / Verified Contributor /
  Paid Collaborator / Project Lead / Investor-ready.

Pathway and Tier are independent. Do not merge them into a single ladder.

### 13.2 Hard gates (mirror of §4 in framework)

- No earning UI before Tier 4 (Verified Contributor).
- No project leadership UI before Tier 5 (Paid Collaborator).
- No invest pathway UI before Tier 7 (Investor-ready), and Tier 7 is not
  automatic right to invest.
- No tier skipping. No tier purchase. Tier is a result, not a package.
- Kids cannot leave Tier 1–2 within the kids framework.

### 13.3 Legacy → new tier mapping

Use the cũ→mới mapping table in `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §5
when reading any older strategy file (PRODUCT_STRATEGY, DOCS_PUBLIC_CONTENT,
HOMEPAGE_CONTENT, INVEST_GATING_RULES, REVENUE_FOR_MEMBERS).

Quick reference:

- "Explorer" (legacy) → fold into Tier 1 Free (onboarding state, not a tier).
- "Contributor" (legacy) → Tier 4 Verified Contributor.
- "Partner" (legacy) → split functionally into Tier 5 Paid Collaborator,
  Tier 6 Project Lead, or Tier 7 Investor-ready depending on context.

### 13.4 Public presentation rule

Public copy may collapse 7 tiers into 3 clusters for readability:

- Khám phá / Discover — Tier 1–2.
- Tạo giá trị / Create value — Tier 3–4.
- Cộng tác sâu / Deep collaboration — Tier 5–7.

Public copy must not list income numbers, must not show "Earn" / "Invest"
CTA, and must not call a tier a "package".

---

## 14. FTC Disclosure & Referral Compliance Bridge

This section is the binding bridge to
`VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md`. For full detail,
read that file. The rules below are mandatory in code and content.

### 14.1 Public vocabulary

- Forbidden public: `affiliate`, `affiliate program`, `affiliate system`,
  `MLM`, `multi-level`, `downline`, `upline`, `commission tree`,
  `passive income`, `get rich`, `đổi đời`, `thu nhập đảm bảo`,
  `kiếm tiền dễ dàng`, `earn money fast`, `invest now`, `ROI`,
  `expected returns`.
- Required public: `contributor program`, `giới thiệu minh bạch (1 cấp)` /
  `transparent referral (single-tier)`, `revenue share`,
  `material connection disclosure`.

### 14.2 Internal identifiers may stay

Database / code may continue to use:

- `affiliate_single_tier`
- `affiliate_candidate`
- `affiliate_active`
- `affiliate_id`
- `referral_commission`
- `partner_access:<tier>`

These identifiers must never render to public UI. The render layer must
substitute the public-safe wording from §14.1 and from the FTC lock §3.

### 14.3 Disclosure wording (default)

VI:

> Liên kết này có thể mang lại lợi ích cho người giới thiệu. Bạn không trả thêm phí khi đăng ký qua liên kết này.

EN:

> This link may provide a benefit to the person who shared it. You do not pay extra when you sign up through this link.

Short forms and placement rules: see FTC lock §4–§6.

### 14.4 Component contract

- Every referral link rendered in product UI must be wrapped by a
  `<ReferralDisclosure/>` component (or equivalent), placed near the link,
  visible without expanding "see more", in the same cluster as the CTA.
- Every API response that returns a referral URL must also return a
  `disclosure_text` field. Clients must not display the URL without the
  text.
- Audit job: scan dist HTML for forbidden public terms in §14.1.

### 14.5 Anti-MLM mandatory statement

Pages that mention referral, contributor program, revenue share, or
collaboration must include the statement from §4.3 in both VI and EN.

---

## 15. Final Lock

Về Tương Lai does not sell dreams.

Về Tương Lai builds a system where users learn, build, verify, and gradually access meaningful opportunities.

This lock must be followed before implementing the five strategy files in public UI.
