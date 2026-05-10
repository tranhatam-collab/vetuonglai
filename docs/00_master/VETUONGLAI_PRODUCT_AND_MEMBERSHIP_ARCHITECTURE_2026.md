# VETUONGLAI — PRODUCT AND MEMBERSHIP ARCHITECTURE 2026

**Status:** `FOUNDER_LOCK_2026-05-06`
**Authority:** Implements `docs/final-lock/VTL_75_FOUNDER_FINAL_APPROVAL_MEMO_2026-05-06.md` §1.3, §1.4, §1.5, §1.6, §1.7, §5, §6.2, plus Group B (Q5-Q9), Group C (Q10-Q13), Group E (Q18-Q19) decisions.
**Reads from:** `VETUONGLAI_PUBLIC_POSITIONING_AND_COMPLIANCE_LAYER.md` (lexicon, 5 red lines, public/post-login boundary).
**Supersedes (in part):** `VETUONGLAI_PRODUCT_STRATEGY.md` §4.2 + §5; `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §0 ("9 nhóm" header); `VETUONGLAI_INVEST_GATING_RULES.md` §0+§2 (count reconciliation); `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md` §7.1 patches noted inline.
**Audience:** product, engineering, design, pricing, payment, access-control, release gate.

---

## 0. Purpose

This file is the **product topology lock**. It tells the system:

- which product lines exist, in which phase, on which subdomain,
- which Master Passes a member can hold, what each grants, what each costs,
- how pricing ladders, family/partner pricing, mini-products, and discounts compose,
- what the Investment Gate is at the architecture level, and what 7 hard conditions must clear before any real money flows,
- where Contributor Studio sits and how it relates to `read.*` and `work.*`,
- what each phase boundary (V1 / V2 / V3) means for what is built, what is shipped, what is deferred.

This file does not write public copy (that is the Public Positioning layer) and does not specify contributor/payout policy (that is the Contributor Economy doc). It specifies the architecture; the other layers consume it.

---

## 1. The 11 product lines (locked)

Founder lock: **11 product lines**. The legacy "9 nhóm" header in PS/DPC/PTF and the 13-item body in PS §5 are both wrong. The reconciliation:

- Work is not a product line — it is a capability bundled inside the Member Passport (career profile, services lite, single-tier referral link generator). The `work.vetuonglai.com` subdomain still exists for routing and capability surface, but Work does not occupy a slot in the 11-product count.
- Marketplace is not a product line — it is replaced by **Contributor Studio**, which is positioned as a curated extension of the contributor economy that crosses Read + Edu + Work surfaces (V3). The reserved `market.vetuonglai.com` is parked. The active subdomain is `studio.vetuonglai.com`.

### 1.1 Canonical product table

| # | Line (VI) | Line (EN) | Subdomain | Phase | Capability summary |
|---|---|---|---|---|---|
| 1 | Thành viên | Member | `member.vetuonglai.com` | V1 | Identity, dashboard, learning OS dashboard at `/app/learn/`, career profile, services lite, referral-link generator (single-tier), payout wallet, refund tracker, credentials wallet. Encapsulates the former "Work-light". |
| 2 | Học | Edu | `edu.vetuonglai.com` | V1 | Programs, mini-courses, mini-products $3-$9, completion to credential pipeline. Hosts the structured curriculum that VC validates. |
| 3 | Năng lực được xác minh | VC | `vc.vetuonglai.com` | V1 | Verified Credentials issuer; on-chain or signed-off-chain credentials per program completion or per builder milestone. Reads from Edu and Read; writes credentials to the member's wallet. |
| 4 | Đọc | Read | `read.vetuonglai.com` | V1 | Books (layered 10/20/70 publish per VTL_71), essays, creator economy 85/15. The protected book content stays local-only per Founder no-github-books rule (VTL_72). |
| 5 | Trẻ em | Kids | `kids.vetuonglai.com` | V2 | Family learning surface; COPPA + Luật Trẻ em compliant; parent-paid only, ages 13-17 with parent-linked account, under 13 requires verifiable parental consent. |
| 6 | Trợ lý AI Thực tiễn | AI Practical Toolkit | `ai.vetuonglai.com` | V2 | Practical AI tooling for members (writing assist, planning, learning), no AI-generated income claim, no AI-generated invest content. |
| 7 | Cộng đồng & Cohort | Community | `community.vetuonglai.com` | V2 | Cohort programs, peer accountability, mentorship pairings (single-tier). |
| 8 | Tài chính cá nhân Anti-scam | Finance | `finance.vetuonglai.com` | V3 | Personal financial literacy, anti-scam education, no investment advice, no ROI claim. |
| 9 | Tác động Xanh | Green Impact | `green.vetuonglai.com` | V3 | Sustainability skill paths, certified projects, transparent impact reporting. |
| 10 | Vận hành & Tăng trưởng Doanh nghiệp | Business Growth | `business.vetuonglai.com` | V3 | Operating playbooks for VN small-medium businesses, partner pass anchor surface. |
| 11 | Cổng Đầu tư | Invest | `invest.vetuonglai.com` | V3 cuối, gated | Education-only public surface; gated invest funnel post-90-day + KYC + 7 hard conditions. See §6. |

### 1.2 Subdomain capability map (extended, all known surfaces)

| Subdomain | Status in V1 | Notes |
|---|---|---|
| `vetuonglai.com` | Live | Primary marketing + brand homepage. |
| `member.vetuonglai.com` | V1 | Member dashboard + Work-light + learn dashboard at `/app/learn/`. |
| `edu.vetuonglai.com` | V1 | Programs + mini-products. |
| `vc.vetuonglai.com` | V1 | Credential issuer. |
| `read.vetuonglai.com` | V1 | Books + essays + creator economy. |
| `work.vetuonglai.com` | V1 (light, capability of Member) | Career profile / services lite — single subdomain, but **not a product line**. |
| `docs.vetuonglai.com` | V1 | Operating manual (no sales). |
| `learn.vetuonglai.com` | **V2 (defer)** | Per DIM §7.1 lock; in V1 the personal learning OS lives at `member.*/app/learn/`. Reserved name only. |
| `kids.vetuonglai.com` | V2 | Per Memo §1.5. |
| `ai.vetuonglai.com` | V2 | Per Memo §1.5. |
| `community.vetuonglai.com` | V2 | Per Memo §1.5. |
| `finance.vetuonglai.com` | V3 | Per Memo §1.5. |
| `green.vetuonglai.com` | V3 | Per Memo §1.5. |
| `business.vetuonglai.com` | V3 | Per Memo §1.5. |
| `studio.vetuonglai.com` | V3 (new) | **Contributor Studio**; replaces former Marketplace concept. |
| `market.vetuonglai.com` | Reserved, never linked | Old "Marketplace" name. Parked. |
| `invest.vetuonglai.com` | V3 cuối, gated | `invest.primaryNav = false` per DIM §8. |
| `invest.iai.one` | **Forbidden, never used** | Per Positioning §1.1 + IGR §0. |

### 1.3 Phase definitions (V1 / V2 / V3) at architecture level

**V1 — Foundation (Months 1-6).** Build and ship: Member, Edu, VC, Read, Work-light (under Member), Docs operating manual. Public homepage offers exactly 3 paid paths (Free Member, Mini products $3-$9, Annual Member Passport $99/year with 30% Y1 discount). No contributor public sign-up. No invest CTA. Goals from `PS:461` carry: 1,000 free / 100 paying / 10 verified contributors (post-login funnel).

**V2 — Expansion (Months 7-18).** Build and ship: Kids, AI Practical Toolkit, Community/Cohort, dedicated `learn.vetuonglai.com` (graduated from `/app/learn/`), public Family Passport CTA (post V1 trust validation), contributor public sign-up funnel (post-Builder gate). Goals: 10,000 free / 1,000 paying / 100 contributors > $100/month / 5-10 partners > $1,000/month.

**V3 — Maturity (Months 19+).** Build and ship: Finance, Green, Business, Contributor Studio (`studio.*`), Partner Passport public CTA, then **V3 cuối** = Invest gate opens for Stages 1-2 only (education + case study; real money requires §6 gate fully clear and Founder + securities-counsel signoff). Goals: scaled trust, full contributor economy, gated invest cohort.

V4+ (post-V3) is not specified in this lock. Any V4 entry requires a new Founder lock memo.

---

## 2. The 3 Master Passes (locked)

Master Passes are the **identity bundles** that grant access across product lines. They compose with mini-products (per-item purchases) and contributor program eligibility (separate gate, see Contributor Economy doc).

### 2.1 Pass table

| # | Pass (VI) | Pass (EN) | Phase | Annual price (USD) | Multi-year ladder |
|---|---|---|---|---|---|
| 1 | Hộ chiếu Thành viên | Member Passport | V1 | $99/yr (Y1 30% launch discount: $69, capped at first 1,000 paid or 90 days) | $99 / $181.50 / $247.50 / $371.25 / loyalty cap year 9+ |
| 2 | Hộ chiếu Gia đình | Family Passport | V2 (build-V1, public-CTA-V2) | $159/yr (LOCKED 2026-05-06; supersedes legacy $99) | Annual only at V1+V2 launch; multi-year ladder TBD V2 with Founder memo |
| 3 | Hộ chiếu Đối tác / Doanh nghiệp | Partner / Business Passport | V3 | from $1,200/yr per seat ladder | Custom; per-seat tiers locked V3 with sales+legal review |

### 2.2 Member Passport — ladder detail

| Term | Prepay (USD) | Effective per-year | Discount vs $99 |
|---|---|---|---|
| Year 1 | $99 (launch: $69 first 1,000 / 90d) | $99 | 0% (or 30% in launch window) |
| Year 2 prepay | $181.50 | $90.75 | ~8% |
| Year 3 prepay | $247.50 | $82.50 | ~17% |
| Year 5 prepay | $371.25 | $74.25 | ~25% |
| Year 9+ prepay | loyalty cap (no further increase from year 9) | locked | locked |

**Launch discount terms:**

- Applies to Year 1 of Member Passport only.
- 30% off; effective price $69.
- Capped at first 1,000 paid Member Passports or 90 days after public V1 launch, whichever first.
- Not stackable with Family or Partner pricing.
- Not stackable with referral discounts (single-tier referral pays the referrer in revenue share, not in price discount on the new member's purchase).
- Discount window status is shown on `/pricing/` with the auditable cap counter ("X / 1,000 đã đăng ký, còn Y ngày").

### 2.3 Family Passport — entitlement and pricing (LOCKED 2026-05-06)

- **Price: $159/year** (single locked figure; supersedes any prior `$99/year` Family wording in `PS §3.3` and the legacy `Starter $89/year for 2` in `PS:86`).
- ≤ 2 adults + ≤ 4 children, single household (verified by shared payment + shared address).
- Adults each have full Member entitlement.
- Children get Kids surface entitlement (V2+) under parent-linked accounts; ages 13-17 may interact with Edu and Read child-safe content; under 13 requires verifiable parental consent per COPPA + Luật Trẻ em.
- Family-only entitlement: parent dashboard for child progress + parental controls.
- Family Passport public CTA is **not on V1 homepage above-the-fold**; it appears only on `/pricing/` detail in V1, becomes a homepage block in V2.
- **Y1 launch discount does not apply to Family.** The 30% / 1,000-cap / 90-day window is Member Passport only (§2.2). Family is full-price at first sale.
- `$99/year` is reserved exclusively for **Member Passport (single seat)** until a future Founder memo authorizes its reuse for any other tier.

### 2.4 Partner / Business Passport — entitlement

- Per-seat licensing for businesses or partner organizations.
- Each seat = full Member entitlement + Business product line access (V3).
- Partner pricing requires sales + legal review per agreement; from $1,200/year minimum.
- Partner Passport public CTA appears only on `/pricing/business/` detail; it does not appear on the V1 homepage.
- Bulk seat ladder (10/25/100/500 seats) defined V3 by sales team.

### 2.5 Pass interaction rules

- A member may hold exactly one **personal-tier** pass at a time (Member or Family adult-slot).
- A member may simultaneously be enrolled under a Partner Passport seat (e.g., employer pays); when a member's personal pass exists alongside a Partner seat, the personal pass entitlements stack only where they extend Partner-only entitlements (e.g., personal Read creator economy participation not enabled by Partner alone).
- A member who downgrades cannot reclaim a launch discount.
- A member who refunds within the refund SLA returns to Free Member tier; the launch-discount slot is released back to the cap counter (i.e., a refunded slot becomes available for another buyer, and the counter does not advance net).

---

## 3. Mini products $3-$9 (V1 public path)

Mini products are the **second purchase path** alongside the Annual Pass on V1 homepage.

### 3.1 What qualifies as a Mini product

- Single-purchase digital item priced $3-$9 (USD; VND equivalent at PayOS rate at checkout).
- Hosted on `edu.vetuonglai.com` (mini-courses, templates) or `read.vetuonglai.com` (essays, single-chapter previews, sample stacks).
- Standalone access without Member Passport — but Member Passport may include or discount selected Minis.
- No subscription, no auto-renew. One-time purchase only at this tier.

### 3.2 Mini product rules

- Refund SLA: 14 days, no questions asked, automated refund within SLA.
- Material connection disclosure where any creator or contributor receives revenue share.
- No income claim attached to any Mini ("learn how to earn $X" forbidden).
- Mini product purchase grants the buyer a Free Member account if they do not already have one, on completion of checkout.

### 3.3 Mini product economics

- Creator share ≥ 85% / platform ≤ 15% (aligned with Read creator economy and Contributor Studio).
- Single-tier referral revenue share permitted: a referrer earns up to 20% of the platform's 15% (i.e., 3% of gross), never the creator's 85%.

---

## 4. Pricing structure (full)

### 4.1 Currency and rails

- Primary currency: USD ($).
- Vietnam users may pay in VND via PayOS at checkout-time exchange rate; receipt shows both.
- Other regions: USD card or domestic equivalents where rails support; refunds in original currency at original rate.
- No cash, no crypto, no card-on-file storage outside payment processor (Vetuonglai never stores raw card data).

### 4.2 Pricing matrix

| Product | Personal | Family | Partner |
|---|---|---|---|
| Free Member | $0 | n/a | n/a |
| Member Passport | $99/yr (Y1: $69 launch) | rolled into Family $159/yr (≤2 adults) | rolled into Partner per-seat |
| Family Passport | n/a | $159/yr (≤2 adults + ≤4 children) | n/a |
| Partner Passport | n/a | n/a | from $1,200/yr per seat |
| Mini products | $3-$9 each | included where bundled | included where bundled |
| Read books (paid layers) | per-book or stack pricing | included if Family bundled | included if Partner bundled |
| Edu programs | per-program pricing where program is paid; many included with Member | same | same |
| Kids (V2) | requires Family Passport for full entitlement | included | bulk via Partner if education partner |
| Contributor Studio (V3) | revenue-share, not subscription | n/a | seat-based access |
| Invest gate (V3, gated) | not a product purchase; PPM-based investment after 7 conditions clear | n/a | not applicable |

### 4.3 Forbidden pricing patterns

- No countdown pricing on public surface (per Positioning §3.1).
- No price increase scarcity ("price goes up tomorrow") on public surface.
- No price discrimination based on perceived geography/wealth signal beyond the published USD/VND rail rule.
- No hidden fees; checkout shows total before payment confirmation.
- No auto-renew without explicit per-checkout opt-in; member can disable auto-renew at any time post-purchase from dashboard.

### 4.4 Refund policy summary

- Free Member: no refund concept (no payment).
- Mini products: 14 days, automatic.
- Member Passport: 14 days from first Year 1 purchase, automatic.
- Family Passport: 14 days from first purchase, automatic; pro-rata refund on seat removal mid-term not provided in V1.
- Partner Passport: per-contract; minimum 14-day cooling-off honored in any case.
- Read books: 14 days from purchase, auto (per Read SLA).
- Edu programs: refund within 14 days OR before lesson 1 completion, whichever first.
- Multi-year prepay: refund window is 14 days from prepay; after window, no refund of remaining years (clearly disclosed at checkout).
- Invest: not applicable to refund concept; cooling-off is part of the gate (see §6).

Full text in `docs.vetuonglai.com/legal/refund/`.

---

## 5. Pathway and tier framework (membership progression)

### 5.1 Tier count

The framework is a **7-tier model** per `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` body. Earlier docs (PS, DPC, HC, RFM, IGR) reference a 6-tier name set; that is legacy. Lock: **7 tiers**, names per PTF §3 (canonical wording stays in PTF; renames forbidden without separate Founder memo).

### 5.2 Tier mapping to gates

| Tier | Internal name (per PTF) | Major gate it opens |
|---|---|---|
| 1 | (Entry / Curious) | Free member functions |
| 2 | (Learner) | Edu progress credentialing |
| 3 | (Practitioner / Builder-track) | Read creator participation gate |
| 4 | **Builder** | Contributor program eligibility (single-tier referral activation) |
| 5 | (Verified Builder) | Public-facing testimonial allowed (with disclosure) |
| 6 | (Mentor) | Mentorship single-tier pairings |
| 7 | (Steward) | Investment Gate clearance pre-condition (one of 7 conditions) |

**Critical:** Builder = Tier 4 is the **earning floor** (you can begin earning through single-tier referral / Contributor Studio after Builder). Tier 7 is the **invest floor** (one of the 7 hard conditions for Invest gate clearance, alongside the others in §6). The earlier IGR §2.1 wording "Đạt tầng Builder (tầng 4) trở lên" is correct as **earning** floor wording; the **invest** gate uses the higher Tier 7 reference inside the 7-condition checklist.

### 5.3 Tier acquisition rules

- Tiers cannot be purchased; this is a **hard rule** (per Positioning §1.4 + FTC §1.5).
- Tiers are earned by: program completions on Edu, credentials issued by VC, contributor outputs on Read, peer + reviewer attestations on Community (V2+), real services delivered on Work-light (Member capability).
- Tier downgrade is possible if attestations are revoked (e.g., a credential is rescinded for cause); downgrade follows due process documented in `docs.vetuonglai.com/trust-system/`.

---

## 6. Investment Gate — architecture-level definition

This section is the architecture-level lock. Public copy is in Positioning §8. Operational logic is in `VETUONGLAI_INVEST_GATING_RULES.md` (which must be reconciled to this lock; see §10 of this doc).

### 6.1 Public count: 7 hard conditions

Per Memo §1.7, the public-facing count of hard conditions is **7**, in this order:

1. Active membership ≥ 90 days continuous (no refund-and-resub games).
2. Reached pathway tier ≥ Builder (Tier 4) on at least one pathway with verifiable proof; AND reached Tier 7 (Steward) for invest-specific clearance.
3. Completed ≥ 1 program on `edu.vetuonglai.com` with credential issued by VC.
4. Click-confirmed Investment Risk Disclosure (timestamped, retained).
5. Enhanced KYC passed: government ID, address verification, source-of-funds attestation.
6. Jurisdictional eligibility verified — US: SEC Reg D Accredited Investor (verified via third party per 506(c) if used); VN: Luật Chứng khoán qualified investor; EU: deferred until separate legal opinion + counsel of record.
7. PPM signed + 14-day cooling-off observed + AML cleared + payment by wire transfer only (no card, no e-wallet).

### 6.2 Internal count: 14 sub-checks

The 7 public conditions decompose to 14 atomic boolean sub-checks at the gate logic layer. Public communication uses 7; engineering and audit log use 14. The 7→14 expansion:

| Public # | Sub-check (atomic boolean) |
|---|---|
| 1 | 1a. `member_active_streak_days >= 90` |
| 2 | 2a. `pathway_max_tier >= 4` (Builder, earning floor) |
| 2 | 2b. `pathway_invest_tier >= 7` (Steward, invest-specific) |
| 3 | 3a. `edu_program_completion_count >= 1` AND `vc_credential_issued = true` for that program |
| 4 | 4a. `investment_risk_disclosure_clickconfirmed_at` is set, ≥ 24 hours before condition 7 starts |
| 5 | 5a. `kyc_id_verified = true` |
| 5 | 5b. `kyc_address_verified = true` |
| 5 | 5c. `kyc_source_of_funds_attested = true` |
| 6 | 6a. `jurisdiction_resolved` ∈ {US, VN} (V3 launch); EU returns `gate_blocked_pending_eu_counsel` |
| 6 | 6b. (US) `accredited_investor_verified = true` per 506(b) self-cert or 506(c) third-party verification |
| 6 | 6b. (VN) `qualified_investor_verified = true` per Luật Chứng khoán |
| 7 | 7a. `ppm_signed_at` is set |
| 7 | 7b. `cooling_off_14d_completed = true` (i.e., now ≥ ppm_signed_at + 14 days) |
| 7 | 7c. `aml_check_passed = true` |
| 7 | 7d. `payment_method = wire_transfer` (card and e-wallet rejected) |

Total atomic sub-checks: 14. The boolean-fields contract at the API layer (`IGR §9`) keeps **7 fields** for stability; each of the 7 fields wraps the relevant sub-checks internally. Engineering must update IGR §2 narrative to reflect this 7-public / 14-internal model.

### 6.3 Invest staging

| Stage | What is open | Public surface |
|---|---|---|
| Stage 0 (V1, V2) | Nothing. Invest gate is closed. | `docs.vetuonglai.com/invest/` exists as education-only. |
| Stage 1 (V3 launch) | Education-only, with explicit "no investment available yet" notice. | `invest.vetuonglai.com` opens with education content. |
| Stage 2 (V3 + verified gate) | Case study + risk disclosure click-through. Members who clear conditions 1-4 may read deeper material. | Education + post-login deeper material; still no money. |
| Stage 3 (Waitlist) | Members who clear 1-6 may enter a private waitlist. No public capture form; invitations only via post-login dashboard. | Post-login only. |
| Stage 4 (Real investment) | Members who clear all 7 conditions may sign PPM and wire funds. | Document handoff, not a webpage form. |

Stages 1-2 require Founder authorization to open. Stages 3-4 require Founder + securities counsel of record + retained transfer agent signoff.

### 6.4 Forbidden architecture decisions

- No public payment form on `invest.*` for an investment offer (ever).
- No invest "checkout" page (ever).
- No deal list visible to non-gated visitors.
- No email capture labeled "investor".
- No "join investor waitlist" CTA on any public surface.
- `invest.iai.one` does not exist; any internal reference to it is a defect to be removed.
- `invest.vetuonglai.com` is never primary nav (`invest.primaryNav = false`).

### 6.5 Authorization to open invest

Real invest (Stage 4) opens only after **all** of the following are true and recorded:

- Founder explicit written go-decision.
- Securities counsel of record retained, with signed engagement letter.
- US Reg D filing (Form D) submitted and accepted where relevant.
- VN Luật Chứng khoán qualified-investor verification mechanism contracted and live.
- AML program documented and tested.
- PPM finalized and reviewed by counsel.
- Transfer agent / cap-table service contracted.
- Refund/cooling-off automation tested.

Until all 8 are recorded, gate logic returns `gate_blocked_pending_authorization` for any condition-7 attempt.

---

## 7. Contributor Studio — architecture position

Detailed contributor policy is in `VETUONGLAI_CONTRIBUTOR_ECONOMY_AND_EARNING_POLICY_2026.md`. This section locks the **architecture position** only.

- **Where it sits:** `studio.vetuonglai.com` (V3). Cross-references Read, Edu, Work-light surfaces to publish curated services, packs, and templates from verified Builder-tier-or-higher contributors.
- **What it is not:** an open marketplace; not a third-party storefront; not an affiliate aggregator.
- **Listing rule:** every listing is reviewed before publication; reviewer team is part of Team 3 (Governance/Trust/Legal).
- **Pricing rule:** creator sets price within a published band per category; platform may reject prices that mislead or violate the 5 red lines.
- **Revenue rule:** creator ≥85% / platform ≤15%, single-tier referral allowed taking up to 20% of the platform's 15% (i.e., 3% of gross), never of creator's 85%.
- **Phase rule:** Studio does not exist in V1 or V2. It opens in V3 alongside Finance/Green/Business. A V2-internal "services lite" exists inside Member Passport (Work-light); that is **not** Studio and does not use the Studio brand.

---

## 8. Phase boundary discipline (V1 / V2 / V3)

### 8.1 V1 launch checklist (architecture)

The V1 release is "ready" when:

- ✅ 7 V1 subdomains live: vetuonglai, member, edu, vc, read, work, docs.
- ✅ `learn.vetuonglai.com` parked (DNS reserved, no public content).
- ✅ Member Passport ($99 with launch $69) sellable end-to-end via PayOS (USD or VND at checkout rate).
- ✅ Free Member sign-up complete with welcome email rendering canonical tagline + 5 red lines.
- ✅ Mini products $3-$9 sellable via Edu and Read.
- ✅ Refund flow end-to-end (14 days, automatic) tested.
- ✅ Material connection disclosure auto-injected on any contributor-published surface.
- ✅ Income Disclaimer rendered wherever income reference appears (post-login).
- ✅ Read book layered publish (10/20/70) gate green per VTL_71 + book-publish-gate verifier 18/18.
- ✅ Public lexicon verifier returns zero forbidden strings in `dist/`.
- ✅ Pre-V1 legal opinions on file (US FTC + VN Luật Bảo vệ NTD + Nghị định 40/2018 + CCPA + Nghị định 13/2023 + state UDAP).
- ✅ Compliance audit Q1 owner assigned.

V1 forbidden in checklist:

- ❌ Family Passport public CTA on homepage above-fold.
- ❌ Partner Passport public CTA on homepage.
- ❌ Contributor public sign-up.
- ❌ Invest CTA, invest waitlist, invest above-fold mention.
- ❌ Kids surface accessible publicly (gated until V2).
- ❌ AI / Community / Finance / Green / Business surfaces.

### 8.2 V2 launch checklist (architecture)

- ✅ V1 trust metrics met: 1,000 free / 100 paying / 10 verified contributors.
- ✅ Kids: COPPA + Luật Trẻ em compliance documented; parent consent flow live.
- ✅ AI surface: AI Practical Toolkit live with no income/invest claims.
- ✅ Community: cohort programs scheduled.
- ✅ `learn.vetuonglai.com` graduates from `member.*/app/learn/` to dedicated subdomain.
- ✅ Family Passport public CTA enabled on homepage.
- ✅ Contributor public sign-up funnel live (Builder gate, Income Disclaimer adjacent, single-tier rule click-confirm).
- ✅ Pre-V2 legal opinions added (COPPA, Luật Trẻ em).

V2 forbidden:

- ❌ Invest opening (still V3 cuối).
- ❌ Studio opening (still V3).
- ❌ EU acquisition without EU counsel.

### 8.3 V3 launch checklist (architecture)

- ✅ V2 trust metrics met: 10,000 free / 1,000 paying / 100 contributors > $100/mo / 5-10 partners > $1,000/mo.
- ✅ Finance / Green / Business surfaces live.
- ✅ Studio opens with curation team and 85/15 split.
- ✅ Partner Passport public CTA enabled.
- ✅ Pre-Invest legal opinions on file (Reg D + Luật Chứng khoán + AML + securities counsel of record).
- ✅ Invest Stages 1-2 open (education + case study).

Invest Stages 3-4 open only with separate Founder authorization per §6.5.

### 8.4 EU expansion gate (orthogonal to V1/V2/V3)

Any EU-targeted public surface (paid acquisition, EU-language launch, EU contributor onboarding) requires:

- EU counsel retained.
- GDPR DPO appointed (or DPO-equivalent role).
- Platform Work Directive compliance assessment.
- Digital Services Act compliance for Read creator economy if accessible to EU users.

Until then, EU traffic is not actively pursued; passive EU traffic to `vetuonglai.com` is served with a GDPR-compliant cookie banner and minimal collection.

---

## 9. Entitlement and access-control matrix

This is the source of truth for who can access what, given which pass + tier.

### 9.1 Surface entitlement

| Surface | Anonymous | Free Member | Member Passport | Family Passport | Partner Passport |
|---|---|---|---|---|---|
| `vetuonglai.com` (homepage) | ✅ read | ✅ read + dashboard link | ✅ | ✅ | ✅ |
| `docs.*` | ✅ read | ✅ read | ✅ | ✅ | ✅ |
| `edu.*` (catalog) | ✅ read | ✅ read | ✅ + program access | ✅ + program access | ✅ + program access |
| `edu.*` (paid program enrollment) | ❌ | ❌ unless Mini purchase | ✅ where included | ✅ where included | ✅ where included |
| `vc.*` (credential view, public link) | ✅ if shared by member | ✅ own credentials | ✅ own credentials + issuance flow | ✅ | ✅ |
| `read.*` (free essays) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `read.*` (paid books / layered 70 portion) | ❌ | ❌ unless purchased | ✅ where included | ✅ where included | ✅ where included |
| `member.*` (dashboard) | ❌ | ✅ basic | ✅ full | ✅ full + family panel | ✅ full + partner seat panel |
| `member.*/app/learn/` | ❌ | ✅ basic | ✅ full | ✅ full | ✅ full |
| `work.*` (Work-light, Member capability) | ❌ | ✅ profile only | ✅ full + referral generator | ✅ full | ✅ full |
| `kids.*` (V2) | ✅ public landing only | ❌ child surface gated | ❌ requires Family | ✅ child entitlement | optional via partner |
| `ai.*`, `community.*` (V2) | ✅ public landing | ✅ basic | ✅ | ✅ | ✅ |
| `finance.*`, `green.*`, `business.*` (V3) | ✅ public landing | ✅ basic | ✅ | ✅ | ✅ |
| `studio.*` (V3, Contributor Studio) | ✅ browse | ✅ browse | ✅ buy + (post-Builder) sell | ✅ | ✅ |
| `invest.*` | ✅ education only | ✅ education only | ✅ + (if conditions) gate flow | ✅ + (if conditions) gate flow | partner-side terms |

### 9.2 Capability entitlement (orthogonal)

| Capability | Tier required | Pass required |
|---|---|---|
| Read paid book (per book) | Tier 1+ (anyone with Free Member) | Free Member or Mini purchase |
| Issue testimonial (post-login, with disclosure) | Tier 5 | any |
| Apply to contributor program | Tier 4 (Builder) | Member or Family or Partner |
| Generate single-tier referral link | Tier 4 (Builder) | any |
| Sell on Studio (V3) | Tier 4 (Builder) + curation review | any |
| Mentor in Community (V2+) | Tier 6 | any |
| Begin invest gate flow | Tier 7 (Steward) + 6 other conditions | Member or Family (not Partner-only seat) |

### 9.3 Hard rules (cannot be overridden)

- Tier cannot be purchased. (Positioning §1.4.)
- Multi-tier referral does not exist. (Positioning §2.2.)
- Children under 13 do not have direct accounts. (Positioning §2.3.)
- Partner Passport seat alone does not enable invest gate; member must hold a personal Member Passport to begin condition 7 flow.
- A refund within SLA returns the member to Free Member tier; tiers earned through completions are retained, but Pass-gated capabilities revert.

---

## 10. Reconciliations forced by this lock

The following prior docs require updates to match this architecture. Until updated, this doc is the authority.

### 10.1 `VETUONGLAI_PRODUCT_STRATEGY.md`

- §4.2 subdomain table: change `learn.vetuonglai.com` from "V1 Build now" to **"V2 (defer)"** and add `studio.vetuonglai.com` as V3 + remove `market.vetuonglai.com` from active table (mark "Reserved").
- §5 "9 NHÓM SẢN PHẨM" header: change to **"11 PRODUCT LINES across 3 phases"** and re-enumerate per §1.1 of this doc; collapse Work into Member, replace Marketplace with Contributor Studio.
- §5.3 Sản phẩm 12 (Marketplace): rewrite as Contributor Studio with `studio.*` and 85/15 split (override 80/20).
- §5.3 Sản phẩm 13 (Invest): align with §6 of this doc (7 public, 14 internal).

### 10.2 `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`

- §0 "9 nhóm" header: update to **"11 product lines"** with reference back to this doc.
- §6 hard rules count: align to public 5 red lines (Positioning §2) + retain longer internal hard rules with cross-reference.
- §3 Builder tier wording: clarify Builder = Tier 4 = earning floor; Steward = Tier 7 = invest floor.

### 10.3 `VETUONGLAI_INVEST_GATING_RULES.md`

- §0 (6 pre-conditions) and §2 (7 header / 14 body) and §9 (7 boolean fields): reconcile to **7 public / 14 internal sub-checks** per §6.2 of this doc.
- §2.1 "Đạt tầng Builder (tầng 4) trở lên": amend to clarify this is the earning floor; the invest-specific tier floor is **Tier 7 (Steward)**, not Tier 4.
- §15 reminders: align with the 5 red lines (Positioning §2).

### 10.4 `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md`

- §7.1: confirm `learn.*` as V2 (already correct); add `studio.vetuonglai.com` as V3-active subdomain; mark `market.*` as parked.
- §8: confirm `invest.primaryNav = false` (already correct); add reference to 7-public/14-internal model.
- §10 release checklist: add public lexicon verifier, add Family-public-CTA-not-V1 check, add Partner-public-CTA-not-V1 check.

### 10.5 `VETUONGLAI_REVENUE_FOR_MEMBERS.md`

- §3 splits: reconcile to **creator ≥85% / platform ≤15%** as the canonical split for Read + Mini + Studio; PS:408's 80/20 is overridden.
- §1 channels: keep 7 enumeration (3 V1 + 4 V2); PTF's "8 kênh" wording in §0 is dropped to 7.

### 10.6 `VETUONGLAI_DOCS_PUBLIC_CONTENT.md`

- §10 phase table: align Marketplace row → Contributor Studio (`studio.*`, V3); align learn row to V2.
- §10 invest table row: keep `Giáo dục đầu tư (V3, gated)` — already aligned.
- §3 cam kết: replaced by Positioning §2 (5 red lines).

---

## 11. Definition of Done — product architecture layer

This layer is "done for V1" when:

- ✅ 11 product lines documented with phase + subdomain (§1).
- ✅ 3 Master Passes documented with price + ladder + entitlement (§2).
- ✅ Mini-products path documented (§3).
- ✅ Pricing matrix complete; refund SLA complete (§4).
- ✅ Tier framework reconciled to 7 tiers with Builder-vs-Steward earning/invest floors (§5).
- ✅ Invest gate 7-public / 14-internal model documented (§6).
- ✅ Studio architecture position locked (§7).
- ✅ V1/V2/V3 phase boundaries spelled out (§8).
- ✅ Entitlement matrix complete (§9).
- ✅ Reconciliations to prior docs listed (§10).
- ✅ Engineering can produce a `verify-product-architecture.mjs` that asserts: each subdomain registry entry has the right phase tag; each pass has the right price tag; each tier has the right gate set; the invest gate has 7 boolean fields surfacing 14 internal sub-checks.

When all 10 boxes pass, this layer is V1-complete. V2 and V3 expansions are gated on the V2/V3 launch checklists (§8.2, §8.3) and on Founder go-decision per phase.

— end of product and membership architecture layer —
