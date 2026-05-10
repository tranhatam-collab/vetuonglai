# VTL_75 — Founder Final Approval Memo (2026-05-06)

**Status:** `FOUNDER_LOCK_2026-05-06`
**Owner:** Tran Ha Tam (Founder)
**Author:** Team 1 (Platform/Access/Commerce) — assistant-of-record
**Supersedes / amends:** all 8 master strategy docs in `docs/00_master/VETUONGLAI_*.md` and any prior-locked product/positioning docs in `docs/final-lock/` where contradicted.
**Binding:** This memo is the source of truth for any subsequent strategy doc, public copy, dev contract, or release gate. Where a prior doc disagrees with this memo, this memo wins until the prior doc is rewritten to match.
**Scope:** Strategy/positioning lock only. Implementation contracts (DIM §7-§11) remain in force; this memo only narrows or renames where stated.

---

## 0. Why this memo exists

On 2026-05-06 the Founder reviewed the 8 master strategy docs in `docs/00_master/` and approved the strategy **with 8 mandatory edits**. The docs as written contain internal contradictions (product count: 9 in headers, 13 in body; invest gate: 3/6/7/14 conditions; tagline: 5 candidates pending; learn.* phase: V1 vs V2; Marketplace: defined but Founder asked to rename; "red lines": 8 different counts across 8 docs).

This memo:

1. Locks the 8 mandatory edits (§1).
2. Locks the answers to 22 Founder decisions raised in this session (§2).
3. Locks the canonical tagline (§3).
4. Locks the canonical 5 red lines (§4).
5. Locks the V1 public surface restriction (§5).
6. Lists the 4 strategy-definition docs that must be (re)written next, and what each must contain (§6).
7. Lists every prior doc that must be rewritten or annotated to match (§7).

No dev file may be created from the 8 masters until those masters are rewritten under this memo. Until then, **this memo is the binding strategy reference**.

---

## 1. The 8 mandatory edits (Founder lock)

### 1.1 Re-frame "earning" → "value creation" in all public copy

**Rule.** Public copy (homepage, docs, edu, read landing, pricing) must not lead with money. It must lead with what the member learns, builds, and proves. Money is consequence, not promise.

**Forbidden public words (any surface visible without login):** "kiếm tiền", "thu nhập thụ động", "passive income", "đổi đời", "làm giàu", "get rich", "earn $X/month", "đảm bảo thu nhập", "ROI", "expected return", "lợi nhuận".

**Required public framing words:** "tạo giá trị", "đóng góp được trả công xứng đáng", "cơ hội cộng tác", "value creation", "fair contribution payout", "collaboration opportunity".

**Allowed (but only post-login, with disclaimer):** historical income tier ranges (e.g. "$1,000-$5,000/month for top contributors") with FTC-style Income Disclaimer adjacent. Never on public homepage, never above the fold anywhere.

### 1.2 Drop the public label "affiliate" entirely

**Rule.** The string "affiliate" never appears on a public surface. Internal identifiers (`affiliate_single_tier` in code/data) are kept to avoid schema break — but **render layer must always translate** to one of:

- "giới thiệu minh bạch (1 cấp)" / "transparent referral (single-tier)"
- "contributor program"
- "đối tác giới thiệu hợp lệ" / "qualified referral partner"

**Single-tier only, forever.** No level 2, no downline, no commission tree. (Aligns with FTC §1 rule 2 + Vietnam Nghị định 40/2018 prohibition on multi-tier.)

### 1.3 V1 public surface = Free Member + Mini products $3-$9 + Annual $99 only

**Rule.** First 90 days of public launch (V1):

- Public homepage offers exactly 3 paths: (a) Free Member, (b) browse Mini products $3-$9, (c) Annual Member $99/year.
- All other product lines, all higher tiers, all multi-year ladders, all family/partner pricing exist in docs but **must not be primary CTA on homepage** in V1.
- No contributor sign-up CTA on public homepage in V1. Contributor program is opened post-login after Builder tier achieved.
- No invest CTA, no invest mention above fold, no "join investor waitlist".

This is the trust-building phase. V2 expands the homepage offer matrix.

### 1.4 Roll out the 3 Master Passes by phase

The 3 Master Passes are locked as:

| # | Pass (VI) | Pass (EN) | Phase | Annual price (USD) |
|---|---|---|---|---|
| 1 | **Hộ chiếu Thành viên** | **Member Passport** | V1 | $99/year (loyalty ladder 1/2/3/5/9 yr) |
| 2 | **Hộ chiếu Gia đình** | **Family Passport** | V2 | $159/year (≤2 adults + ≤4 children, household) |
| 3 | **Hộ chiếu Đối tác / Doanh nghiệp** | **Partner / Business Passport** | V3 | from $1,200/year (per-seat ladder, custom) |

Y1 launch discount: 30% on Pass 1 only, capped at first 1,000 paid members or 90 days, whichever first.

### 1.5 Lock product count to **11 product lines across 3 phases**

**Founder decision: 11, not 9, not 13.** The body of `VETUONGLAI_PRODUCT_STRATEGY.md` lists 13 because Work-light was double-counted (it is a capability of Member Passport, not a standalone product) and Marketplace was double-counted (V2 internal under work.*, V3 standalone under market.*). Both collapses below.

| # | Product line (VI) | Product line (EN) | Subdomain | Phase |
|---|---|---|---|---|
| 1 | Thành viên (Member Passport) | Member | `member.vetuonglai.com` | V1 |
| 2 | Học (Learning OS) | Edu | `edu.vetuonglai.com` (V1); learn dashboard at `member.*/app/learn/` in V1, `learn.vetuonglai.com` defer V2 | V1 |
| 3 | Năng lực được xác minh (Verified Credentials) | VC | `vc.vetuonglai.com` | V1 |
| 4 | Đọc (Books + Essays + Creator Economy) | Read | `read.vetuonglai.com` | V1 |
| 5 | Trẻ em (Family Learning) | Kids | `kids.vetuonglai.com` | V2 |
| 6 | Trợ lý AI Thực tiễn | AI Practical Toolkit | `ai.vetuonglai.com` | V2 |
| 7 | Cộng đồng & Cohort | Community | `community.vetuonglai.com` | V2 |
| 8 | Tài chính cá nhân Anti-scam | Finance | `finance.vetuonglai.com` | V3 |
| 9 | Tác động Xanh / Bền vững | Green Impact | `green.vetuonglai.com` | V3 |
| 10 | Vận hành & Tăng trưởng Doanh nghiệp | Business Growth | `business.vetuonglai.com` | V3 |
| 11 | Cổng Đầu tư (Investment Gate, gated) | Invest | `invest.vetuonglai.com` | V3 cuối, gated |

**Collapsed / removed:**

- ~~Work~~ — folded into Member Passport as a capability (career profile, services lite). The standalone work.* subdomain may exist for routing, but Work is **not a product line** in the count.
- ~~Marketplace~~ — replaced; see §1.6.

### 1.6 Rename "Marketplace" → **Contributor Studio**

**Rule.** The string "marketplace" is removed from public copy.

- New term: **Contributor Studio** (VI: **Xưởng Đóng góp**).
- New subdomain (when built, V3): `studio.vetuonglai.com`. The reserved `market.vetuonglai.com` is parked, never linked.
- Function: a curated workspace where verified contributors publish services, packs, and templates with single-tier referral rules. It is **not** a free-trade marketplace; every listing is reviewed; every payout is single-tier with material-connection disclosure.
- Revenue split: creator ≥85% / platform ≤15% (aligns with VTL_67 read.* creator economy split; PS:408's older 80/20 is overridden).

### 1.7 Investment gate: fully off public navigation, public count = 7 hard conditions

**Rule.** `invest.vetuonglai.com`:

- Not in primary nav. Not in footer primary block. Mentioned only inside `docs.vetuonglai.com/invest/` as education content, and inside post-login member dashboard for members who have crossed the gate.
- Public-facing count of hard conditions = **7**, in this exact order:

  1. Active membership ≥ 90 days continuous.
  2. Reached pathway tier ≥ Builder (Tier 4) on at least one pathway with verifiable proof.
  3. Completed ≥ 1 program on `edu.vetuonglai.com` with credential issued by VC.
  4. Click-confirmed Investment Risk Disclosure.
  5. Enhanced KYC passed (ID + address + source of funds).
  6. Jurisdictional eligibility verified — US: SEC Reg D Accredited Investor; VN: Luật Chứng khoán qualified investor; EU: deferred until separate legal opinion.
  7. PPM signed + 14-day cooling-off respected + AML cleared + wire transfer only (no card, no e-wallet).

- Internal **gate logic** carries 14 sub-checks (the breakdown of conditions 5-7 into atomic boolean fields). Public communication uses 7; engineering uses 14. `IGR §9` code stays at 7 boolean fields at the API contract level; the 14 sub-checks are private workflow.

### 1.8 Docs site = operating manual, not sales

**Rule.** `docs.vetuonglai.com` is the trust artifact. It explains how the system works, what is forbidden, what the member is entitled to, what the contributor must disclose. It does not sell. It does not have CTAs to "buy now" or "upgrade now". It links to the relevant product subdomain with neutral wording ("Đăng ký miễn phí" / "Tìm hiểu thêm"), never with urgency or scarcity.

This protects the system in any regulatory review (FTC, SEC, Vietnam consumer protection): the docs site is the canonical disclosure surface, not a marketing surface.

---

## 2. The 22 Founder decisions (locked answers)

Each decision below is binding. Where it conflicts with a prior doc, the prior doc must be rewritten to match (see §7).

### Group A — Positioning & language (Q1-Q4)

**A1. Public language posture.** Lead with value creation, not income. See §1.1.
**A2. The word "affiliate".** Forbidden in public surface. Internal-only. See §1.2.
**A3. The word "marketplace".** Replaced by "Contributor Studio". See §1.6.
**A4. The word "kiếm tiền".** Forbidden in public surface. Replaced by "tạo giá trị" / "được trả công xứng đáng cho đóng góp".

### Group B — Product & passes (Q5-Q9)

**B5. Product line count.** 11 (not 9, not 13). See §1.5.
**B6. Master Pass count.** 3 (Member, Family, Partner). See §1.4.
**B7. Pass rollout.** Member V1, Family V2, Partner V3. See §1.4.
**B8. Work as standalone product.** No — folded into Member Passport. See §1.5.
**B9. learn.vetuonglai.com phase.** V2 (defer). In V1 learning dashboard lives under `member.vetuonglai.com/app/learn/`. Aligns with DIM §7.1; overrides PS:145.

### Group C — Pricing (Q10-Q13)

**C10. Annual baseline.** $99/year for Member Passport.
**C11. Multi-year ladder.** Year 1 = $99; Year 2 prepay = $181.50 (~8% off); Year 3 prepay = $247.50 (~17% off); Year 5 prepay = $371.25 (~25% off); Year 9 prepay = loyalty cap (no further increase from year 9 onward — locked).
**C12. Y1 launch discount.** 30% off Year 1 of Member Passport only, capped at first 1,000 paid members or 90 days.
**C13. Mini products.** $3-$9 single-purchase items live on `edu.vetuonglai.com` and `read.vetuonglai.com`. Allowed in V1 public surface as the second purchase path beside Annual.

### Group D — Contributor / referral (Q14-Q17)

**D14. Tiers of referral.** 1-tier only, forever. No downline. (FTC §1 rule 2 + Nghị định 40/2018.)
**D15. Income tier disclosure.** Historical contributor income ranges ("$1,000-$5,000/month for top contributors") visible only after login, with FTC Income Disclaimer adjacent. Never above public fold.
**D16. Contributor sign-up surface.** Post-login only, after Builder tier (Tier 4) achieved on ≥ 1 pathway. No public "become a contributor" CTA in V1.
**D17. Revenue split (Contributor Studio + Read creator economy).** Creator ≥85% / platform ≤15%. Single canonical split across all creator-side products. Overrides PS:408 (80/20).

### Group E — Investment gate (Q18-Q19)

**E18. Public hard conditions count.** 7. See §1.7.
**E19. Public surface treatment.** Off primary nav. Education-only inside `docs.vetuonglai.com/invest/`. No CTA, no waitlist, no email capture. See §1.7 + §1.8.

### Group F — Tagline (Q20)

**F20. Locked tagline.**

- VI: **"Học đúng. Làm thật. Chứng minh giá trị."**
- EN: **"Learn well. Build real. Verify value."**

Overrides the 5 candidates A-E in `HC §3` and the default Option A placeholder in `DIM:214-222`.

### Group G — Vietnam Advantage (Q21)

**G21. Framing.** "Vietnam Advantage" is reframed publicly as **"Bản sắc vận hành Việt Nam"** (operational fluency in Vietnam): bilingual UX VI/EN, payment rails (PayOS, bank transfer, e-wallet) integrated locally, legal compliance with Luật Chứng khoán + Nghị định 40/2018 + Nghị định 117/2025, Vietnamese-language editorial standards on Read. It is **not** marketed as "cheaper labor" or "low-cost outsource"; that framing is forbidden.

### Group H — Compliance (Q22)

**H22. Legal counsel sequencing.** Before any public surface mentions earning, contributor sign-up, Kids onboarding, EU acquisition, or invest waitlist, the corresponding legal opinion must be on file:

- **Pre-V1 launch:** US (FTC + state UDAP) + VN (Luật Bảo vệ người tiêu dùng + Nghị định 40/2018) opinions on file.
- **Pre-Kids launch (V2):** US COPPA + VN Luật Trẻ em 2016 opinions added.
- **Pre-EU acquisition (any phase):** EU Platform Work Directive 2024/2831 + GDPR opinions added.
- **Pre-Invest open (V3 cuối):** SEC Reg D + Luật Chứng khoán opinions + securities-counsel-of-record retained.

---

## 3. Locked tagline

**VI:** Học đúng. Làm thật. Chứng minh giá trị.
**EN:** Learn well. Build real. Verify value.

Used as: homepage hero subtitle (under brand wordmark), docs site footer tagline, OG image strapline, member welcome email H1.

Not used as: pricing page header, invest page header (invest page has its own neutral education tagline), legal page header.

---

## 4. The 5 red lines (canonical, single source)

The 8 master docs each define a different count of "red lines" (3, 5, 5, 5, 6, 6, 6, 14). Founder locks the canonical 5 below, derived from FTC §1 + DPC §3, normalized to public-surface enforceable rules:

1. **Không hứa thu nhập.** No income promise. No "passive income", "đổi đời", "đảm bảo thu nhập", "earn $X/month".
2. **Không referral đa cấp.** Single-tier referral only. No downline, no commission tree, no recruitment incentive.
3. **Không thu phí trẻ em dưới 18 trực tiếp.** Children under 18 do not transact directly. Family Pass and Kids products are paid by the parent/guardian only, with COPPA-compliant consent.
4. **Không công bố ROI / lợi nhuận kỳ vọng cho invest.** No public statement of expected returns on invest. Education only on public surface; numbers only inside PPM after KYC.
5. **Không bán dữ liệu thành viên.** Member data is never sold, brokered, or rented to third parties. Data leaves the system only with explicit per-purpose member consent or by lawful order.

These 5 are the public-facing red lines. Any internal expansion (FTC §1, DPC §3, IGR §0, etc.) remains valid as engineering / process detail, but public copy uses these 5 as the canonical list.

---

## 5. V1 public surface restriction (binding for first 90 days)

Above-the-fold homepage in V1 may reference exactly these and nothing else:

1. Brand + tagline (§3).
2. Free Member sign-up CTA.
3. Annual Member Passport — $99/year — with 30% Y1 launch discount.
4. Mini products grid ($3-$9 from `edu.*` and `read.*`).
5. Trust block: link to `docs.vetuonglai.com` (operating manual), link to `docs.vetuonglai.com/legal/material-connection` (FTC disclosure), link to `docs.vetuonglai.com/invest` (education-only, no CTA).

**Forbidden above the fold in V1:**

- Family Pass / Partner Pass pricing.
- Contributor sign-up.
- Invest mention beyond the docs link.
- Any Kids / Finance / Green / Business / Invest product mention.
- Any income figure, any contributor earning figure, any "join investor waitlist".

V2 expansion of the public homepage is a separate Founder decision, gated on V1 trust metrics (1,000 free / 100 paying / 10 verified contributors per `PS:461`).

---

## 6. The 4 strategy-definition docs to write next

Each of these 4 docs is a rewrite-and-merge of relevant sections of the 8 masters under the locks in §1-§5. Each must be reviewed by Founder before any HTML/dev file is changed to match.

### 6.1 `docs/00_master/VETUONGLAI_PUBLIC_POSITIONING_AND_COMPLIANCE_LAYER.md`
- Tagline, Vietnam Advantage framing, forbidden vs preferred public lexicon, the 5 red lines, FTC + Nghị định 40/2018 + Luật Trẻ em + COPPA + Reg D obligations mapped to public-surface gates.
- Replaces: HC §3 (taglines), HC §17-§18 (invest reference + CTA list), DPC §3 (cam kết) where Founder language overrides, FTC §1 rules in their public-surface form.

### 6.2 `docs/00_master/VETUONGLAI_PRODUCT_AND_MEMBERSHIP_ARCHITECTURE_2026.md`
- The 11 product lines × 3 phases × 3 master passes. Subdomain map. Phase definitions V1/V2/V3 (with learn.* = V2 lock). Pricing matrix (Annual ladder, Family, Partner). Contributor Studio definition (replaces Marketplace). Invest gate at product-architecture level (links out to dedicated invest doc).
- Replaces: PS §5 product list (9-vs-13 contradiction), PTF §0-§2 if it references "9 nhóm", PS §4.2 subdomain table.

### 6.3 `docs/00_master/VETUONGLAI_CONTRIBUTOR_ECONOMY_AND_EARNING_POLICY_2026.md`
- Single-tier referral rule. 7 contributor skill groups (RFM A-G) reconciled with VTL_67 8 functional roles (state which is taxonomy, which is role assignment). Revenue channels (3 V1 + 4 V2 = 7 canonical; PTF's "8" is dropped). Creator ≥85% / platform ≤15% as the canonical split. $1,000-$5,000 income tier disclosure rules with placement (post-login + Income Disclaimer adjacent). Builder-tier (Tier 4) gate to access contributor sign-up. Public lexicon translation table.
- Replaces: RFM §1-§3, FTC §3 vocabulary table, PTF §3 tier roles where they touch earning, VTL_67 splits where they need restating in master scope.

### 6.4 `docs/00_master/VETUONGLAI_DOCS_AND_HOMEPAGE_PUBLIC_COPY_PLAN_2026.md`
- The exact homepage block sequence for V1 (per §5). The exact docs-site sitemap as operating manual (per §1.8). The 12 legal docs canonical list (DPC §10) plus 3 recommended supporting docs (TBD with Founder — see §8). Microcopy library: every Vi/En CTA wording approved for public surface, every disallowed wording with the approved replacement. OG image / hero image content rules. Email-capture rules (which page may capture, which may not).
- Replaces: HC §1-§16 (homepage sections), DPC §1-§14 (docs public content), DIM §10 release-checklist copy items.

---

## 7. Prior docs that must be rewritten or annotated

After this memo is committed, the following must each receive a header note **"Superseded in part by VTL_75 §X — see memo before relying on this section"** and be queued for rewrite under §6:

| Doc | Sections affected | Memo §s |
|---|---|---|
| `VETUONGLAI_PRODUCT_STRATEGY.md` | §4.2 (subdomain table), §5 (product list 13→11), §5.3 invest, §5.3 marketplace | §1.5, §1.6, §1.7 |
| `VETUONGLAI_DOCS_PUBLIC_CONTENT.md` | §3 cam kết, §10 invest table row, §13 contributor lexicon | §1.8, §4, §1.2 |
| `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` | §0 "9 nhóm", §6 hard rules count | §1.5, §4 |
| `VETUONGLAI_HOMEPAGE_CONTENT.md` | §3 tagline candidates, §17-§18 invest CTA + nav block | §3, §1.7, §5 |
| `VETUONGLAI_REVENUE_FOR_MEMBERS.md` | §1 contributor channels count, §3 creator splits | §6.3 |
| `VETUONGLAI_INVEST_GATING_RULES.md` | §0 (6 vs 7), §2 (14 vs 7), §9 (7 boolean fields) — reconcile public 7 vs internal 14 | §1.7 |
| `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` | §1 5-rule list re-numbered to align with §4 of memo | §4, §1.2 |
| `VETUONGLAI_DEV_IMPLEMENTATION_MAPPING_LOCK.md` | §7.1 keep learn.* = V2 (this matches memo); §7.2 add `studio.vetuonglai.com` reservation; §10 release checklist update | §1.5, §1.6 |

The DEV_IMPLEMENTATION_MAPPING_LOCK file is the only master that **already aligns** with this memo on `learn.*` and on `invest.primaryNav = false`. It needs the smallest patch.

---

## 8. Open items — Founder lock 2026-05-06 (resolved)

All 4 open items below were resolved by Founder on 2026-05-06 in the same session that approved this memo. They are now binding additions to the lock.

### 8.1 The 3 recommended supporting documents (LOCKED)

In addition to the 12 canonical legal documents (Public Copy Plan §12), the following 3 supporting documents are **required** for V1+V2 launch readiness:

| # | Title | Path | Owner |
|---|---|---|---|
| 1 | Editorial Standards (Read) | `docs.vetuonglai.com/legal/editorial/` (mirrored at `read.vetuonglai.com/standards/`) | Read editorial board + Team 3 |
| 2 | Contributor Code of Conduct | `docs.vetuonglai.com/legal/contributor-conduct/` | Team 3 |
| 3 | Data Subject Request (DSAR) workflow | `docs.vetuonglai.com/legal/dsar/` | Team 3 + counsel |

These 3 docs follow the same versioning, bilingual, and changelog rules as the 12 canonical docs (Public Copy Plan §12.1, §12.2). They appear in the `/legal/` index alongside the canonical 12.

The DSAR doc is the canonical surface for any GDPR access/erasure request, CCPA opt-out, and Nghị định 13/2023 data-subject rights. It must be live before the V1 public launch even though the EU regime does not actively apply until V3 (per §8.4 below) — because CA + VN regimes already apply on day one.

### 8.2 Family Passport pricing (LOCKED)

- **Family Passport: $159/year** for ≤ 2 adults + ≤ 4 children, single household.
- The legacy `$99/year` Family wording in `PS §3.3` is **superseded**; if any prior doc renders Family at $99/year, that wording is wrong and must be replaced with $159/year on the next pass through the doc.
- The legacy "Starter $89/year for 2" in PS:86 was an inconsistent draft and is **dropped from the canonical set**; Family is the only pricing for the 2-adult household tier.
- `$99/year` may only be reused as a Family-tier number under a future Founder memo; until then, $99 belongs exclusively to **Member Passport (single seat)**.
- Y1 launch discount (30% / first 1,000 / 90 days) applies to Member Passport only — not to Family. Family is full-price at first sale.

This lock is canonical for Product Architecture §2 and §4.

### 8.3 Contributor taxonomy — two independent axes (LOCKED)

RFM and VTL_67 represent **two orthogonal axes**, not a single list. They do not merge.

| Axis | Source | Count | Purpose |
|---|---|---|---|
| Skill / capability groups | `VETUONGLAI_REVENUE_FOR_MEMBERS.md` §1 (groups A-G) | 7 | What the contributor *can do* (writing, teaching, coaching, building, designing, reviewing, mentoring). Used by the matching engine to route work to contributors. |
| Operational roles | `docs/final-lock/VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md` | 8 | What the contributor *does in the workflow* (creator, reviewer, editor, curator, etc.). Used by the platform's editorial workflow to assign permissions. |

A single contributor may carry multiple skill groups (multi-tag) and may simultaneously hold one or more operational roles. The matching engine asks "which skill groups?"; the workflow engine asks "which role for this task?". Neither replaces the other.

Contributor Economy §3 + §10 read against this two-axis model. Any future doc that proposes merging the two axes is rejected unless a new Founder memo authorizes it.

### 8.4 EU launch trigger (LOCKED)

EU public launch is **deferred to V3**. V2 only prepares EU compliance notes; no EU-targeted public surface, no EU-targeted acquisition spend, no EU-targeted contributor onboarding occurs in V2.

| Phase | EU posture |
|---|---|
| V1 | Passive EU traffic served with GDPR-compliant cookie banner + minimal collection (per Public Copy Plan §15.1). No EU acquisition. No EU contributor. |
| V2 | Same as V1 plus active preparation: draft EU counsel engagement; map Platform Work Directive 2024/2831 requirements; design EU-region data residency posture; prepare DSA compliance for Read creator economy. **Still no EU public launch.** |
| V3 | EU public launch may open **only when** all of: (a) EU counsel of record retained, (b) GDPR DPO (or DPO-equivalent) appointed, (c) Platform Work Directive compliance assessment complete and signed, (d) Digital Services Act compliance assessment complete and signed for Read, (e) Founder explicit go-decision on file. Until all 5 are recorded, EU public launch is blocked. |

This supersedes any prior wording that allowed an opportunistic EU surface in V2.

---

## 9. Definition of Done for this memo

This memo is "approved" when:

- ✅ Founder reviews and confirms all 8 edits (§1).
- ✅ Founder confirms all 22 decisions (§2).
- ✅ Founder confirms tagline (§3).
- ✅ Founder confirms 5 red lines (§4).
- ✅ Founder confirms V1 public surface restriction (§5).
- ✅ Founder locks all 4 open items (§8) — resolved 2026-05-06.

Once §6 docs are written and committed, this memo's status changes from `FOUNDER_LOCK_2026-05-06` to `FOUNDER_LOCK_2026-05-06_IMPLEMENTED_BY_<commit-shas>`.

Until then: **this memo is the authority. The 8 masters are reference only.**

---

## 10. Audit trail

- 2026-05-06 — Memo drafted by Team 1 assistant after full read of 8 masters + 3 final-lock docs (`VTL_03`, `VTL_05`, `VTL_67`).
- Source extract delivered by general-purpose subagent task `ses_203cadc7cffeUN8ZRDIVexaY5e`; sections A-Q with file:line citations on record in session.
- 7 lock decisions confirmed by Founder via session question prompts on 2026-05-06.
- 4 open items (§8) resolved by Founder 2026-05-06 in same session: 3 supporting docs approved as proposed; Family Passport locked $159/year (overrides $99 legacy); contributor taxonomy locked as two orthogonal axes (RFM 7 skill groups × VTL_67 8 operational roles); EU launch deferred to V3.

— end of memo —
