# VETUONGLAI — CONTRIBUTOR ECONOMY AND EARNING POLICY 2026

**Status:** `FOUNDER_LOCK_2026-05-06`
**Authority:** Implements `docs/final-lock/VTL_75_FOUNDER_FINAL_APPROVAL_MEMO_2026-05-06.md` §1.1, §1.2, §1.6, §6.3, plus Group D (Q14-Q17) decisions.
**Reads from:** Public Positioning layer (forbidden lexicon, 5 red lines, public/post-login boundary), Product Architecture (Builder = Tier 4 earning floor, Studio = `studio.*` V3, 85/15 split).
**Supersedes (in part):** `VETUONGLAI_REVENUE_FOR_MEMBERS.md` §1-§3; `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md` §3 vocabulary scope; `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md` §3 earning-related tier roles; `docs/final-lock/VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md` splits — restated in master scope here.
**Audience:** every team owning contributor onboarding, payout, single-tier referral logic, creator economy on Read, Studio (V3), pricing/payment of contributor revenue, FTC/Reg D compliance.

---

## 0. Purpose

This file is the **how-money-moves layer** for everyone who is not a passive member. It tells the system:

- who can earn,
- when they can earn (which gate, which tier, which evidence),
- what they earn from (which channels, which split, which referral mechanic),
- how the earning is disclosed (FTC material connection + Income Disclaimer),
- what is forbidden (multi-tier, income promise, recruitment incentive),
- how the contributor relationship is classified for tax and labor law (US AB5, EU Platform Work Directive, VN tax withholding under Nghị định 117/2025).

This file does not write the public CTAs (Public Copy Plan owns that) and does not redefine the product topology (Product Architecture owns that). It locks the policy.

---

## 1. The single binding earning principle

**Vetuonglai pays for output, never for recruitment.** Every dollar that flows from the platform to a member is consideration for a verifiable contribution: a service delivered, a product sold, a course taught, a book read, a referral that converted (single-tier only). No dollar flows for recruiting another member, for occupying a tier, for purchasing a tier, or for being above someone in a tree (no tree exists).

This sentence is the canonical earning principle. Every section below is its expansion. If a future change appears to contradict it, this principle wins until a new Founder lock memo is issued.

---

## 2. Earning eligibility — who can earn

### 2.1 Hard gate: Builder (Tier 4) on at least one pathway

A member may begin earning **only after** reaching Tier 4 (Builder) on at least one pathway, with verifiable evidence accepted by the VC issuer. Below Tier 4, the member may purchase, learn, read, complete programs — but may not generate single-tier referral payouts, sell on Contributor Studio (V3), or receive Read creator-economy revenue share.

This rule has no exception. It is enforced at the API layer: any payout-generating action by a member with `pathway_max_tier < 4` returns `gate_blocked_pre_builder`.

### 2.2 Soft gate: program completion + active membership ≥ 30 days

In addition to Builder tier, the member must:

- Have an active membership (Free Member or paid Pass) for ≥ 30 days continuous at the moment of first payout activation. (90-day stickiness applies separately to invest, not to earning.)
- Have completed ≥ 1 program on `edu.*` with VC-issued credential, OR have published ≥ 1 reviewer-attested output on `read.*`, OR have delivered ≥ 1 reviewed service on Work-light (Member capability).

The 30-day floor is a fraud / refund-abuse guard, not a stickiness gate. It exists to prevent same-day-signup-and-payout cycles.

### 2.3 Identity and tax preconditions

Before a member's first payout is released:

- W-9 (US) / W-8BEN (non-US to US-paying entity) / VN tax declaration form on file as the entity-of-record requires.
- Bank or PayPal/Wise rail validated for the recipient's jurisdiction.
- Bilingual contractor agreement signed (per `/legal/contractor/`).
- Click-confirm acknowledgement of: (a) single-tier rule, (b) material connection disclosure obligation, (c) Income Disclaimer.

If any precondition is not on file, the payout is held in escrow at the platform side and notified to the member; no funds are forfeited, but no funds release until the gate clears.

### 2.4 Forbidden eligibility patterns

- A member cannot earn by recruiting another member into membership (no recruitment commission). The single-tier referral pays out only when the referred member completes a **paid action** (paid Mini, paid Pass, paid Read book, etc.) — not when they sign up for free.
- A member cannot pay to become a contributor or to "unlock" Builder tier; tier is earned (Public Positioning §1.4 / FTC §1.5).
- A member cannot receive payouts for testimonials they post about Vetuonglai (testimonials are voluntary and unpaid; if they are paid, they become contributor content with full material connection disclosure under §6).
- A member cannot receive payouts in cash, crypto, or instruments outside the published rails.

---

## 3. The 7 revenue channels (canonical)

Vetuonglai recognizes exactly **7 contributor revenue channels**. The earlier "8 kênh" wording in `PTF §0` is dropped; the canonical list is 7, split across V1 + V2 phases.

### 3.1 Phase V1 channels (3)

| # | Channel (VI) | Channel (EN) | What it pays |
|---|---|---|---|
| 1 | Sản phẩm số tự sản xuất | Self-produced digital products | Mini products $3-$9 sold on Edu / Read; member-creator gets ≥85% of gross. |
| 2 | Giới thiệu minh bạch (1 cấp) | Single-tier transparent referral | A referrer earns up to 20% of platform's 15% (i.e., 3% of gross) on a referred member's paid action; never of creator's 85%. Single-tier only; no level 2. |
| 3 | Chương trình tính phí | Paid programs on Edu / Read | Programs priced above mini-tier ($10+); creator share ≥85%; platform ≤15%. |

### 3.2 Phase V2 channels (4)

| # | Channel (VI) | Channel (EN) | What it pays |
|---|---|---|---|
| 4 | Coaching 1-1 | 1-on-1 coaching | Coach sets price within published band; coach gets ≥85%; platform ≤15%. Material connection mandatory if coach refers further services. |
| 5 | Mentorship trong cohort | Cohort mentorship | Per-cohort fee paid by platform from cohort revenue; mentor share ≥80% (slightly lower because cohort ops require platform staff time). |
| 6 | Đồng sáng tạo (co-creation) | Co-creation | Two or more contributors co-publish; revenue split is set in the co-creation contract; platform retains ≤15%. |
| 7 | Talent pool doanh nghiệp | Enterprise talent pool | Partner Passport buyer hires Vetuonglai contributor for project; contractor receives ≥85% of project fee; platform retains ≤15%. |

### 3.3 V3+ channels — Studio overlay

Contributor Studio (`studio.*`, V3) is **not a separate channel**; it is a curated surface that hosts channels 1, 4, 6, 7 with stricter review and a published category-band price grid. The economics are identical (creator ≥85% / platform ≤15%); the difference is curation + surface.

### 3.4 Channels that do not exist

The following are explicitly excluded from the contributor economy:

- Multi-tier referral / downline / commission tree.
- Recruitment bonus.
- "Sign-up bonus" paid to the recruiter.
- Network sales contests with cash prizes.
- Income-share agreements (ISAs) where member income post-Vetuonglai is shared back to the platform.
- Equity in Vetuonglai issued to contributors as compensation (equity is via a separate Reg D / VN Luật Chứng khoán process under §6 of Product Architecture, never a contributor payout).

---

## 4. The canonical revenue split

**Creator ≥ 85% / Platform ≤ 15%.** This is the single split across:

- Mini products (Edu / Read).
- Paid programs (Edu / Read).
- Read creator economy (essays, paid book layers, layered 70 portion).
- Contributor Studio listings (V3).
- Coaching, mentorship, co-creation (Phase V2 channels).
- Enterprise talent pool projects.

Earlier numbers (PS:408 80/20 for Marketplace, RFM variations) are overridden. The 85/15 number is the floor for creator share and the ceiling for platform share. Specific channels may give more to the creator (up to 90% in some V3 contracts negotiated case-by-case), never less than 85%.

### 4.1 Single-tier referral inside the platform's 15%

When a referral exists, the referrer is paid out of the platform's 15%, not out of the creator's 85%. The creator's share is unaffected by referrals.

| Component | Share of gross |
|---|---|
| Creator | ≥ 85% |
| Referrer (single-tier, optional) | up to 3% (= up to 20% of platform's 15%) |
| Platform net | ≥ 12% (= 15% minus referrer share) |

If no referrer is attached to the transaction, the platform retains the full 15%.

### 4.2 Payment processing fees

Payment processing (PayOS / card processor / wire fees) is deducted from the **platform's** share, not the creator's. The creator's "≥85% of gross" is gross-of-processor, net-of-tax. The member always receives the headline percentage on the price the buyer paid.

### 4.3 Tax withholding

Tax withholding is governed by the entity-of-record + recipient jurisdiction:

- US recipient: 1099 reporting at year-end thresholds; backup withholding if W-9 missing.
- VN recipient: PIT withholding per Nghị định 117/2025 e-commerce + tax rules; receipt issued by platform.
- Other jurisdictions: per local tax law; recipient is responsible for reporting unless local law obligates platform withholding.

The withholding is deducted from the creator's gross share, not added to the platform's share. Net to creator after tax = creator share − local withholding.

### 4.4 Refund mechanics

When a buyer refunds:

- Within refund SLA (14 days for Mini, 14 days for Programs, etc.): creator share is reversed in full; referrer share (if any) is reversed in full; platform retains nothing on the original transaction.
- After SLA: refund decisions are case-by-case; platform may absorb the platform share but creator share generally stands as paid for delivered work.

### 4.5 Forbidden split patterns

- Creator share below 85% on any standard channel.
- Platform share above 15% on any standard channel (V3 Studio negotiated rates may be lower platform but never higher).
- Referrer share above 3% of gross.
- Splits that depend on a downline (forbidden — no downline exists).
- Hidden deductions not disclosed in the contributor agreement.

---

## 5. Single-tier referral — exact mechanic

This section is the binding spec for referrals. Every referral system on the platform must conform.

### 5.1 The mechanic

- A member at Tier 4+ may generate a referral link from their Member dashboard.
- The link encodes the referrer's member ID and an opaque campaign ID.
- A new visitor following the link is attributed to the referrer for **30 days** from first click.
- During the attribution window, the first **paid action** (not free signup) by the new visitor pays the referrer up to 3% of gross (per §4.1).
- After the first paid action, attribution is consumed; subsequent paid actions by the same buyer do not pay the referrer (single-action attribution per referral, single-tier per attribution).
- A new attribution can be initiated by a separate referrer link click; the most recent click within the 30-day window wins.

### 5.2 What is single-tier-illegal

- Paying any commission to a "level 2" member who recruited the referrer (no — only the direct referrer earns; their upstream earns nothing from this transaction).
- Paying any commission for the referred member's signup alone (no — only the referred member's first paid action triggers payout).
- Paying recurring commissions on subscription renewals (the first paid renewal counts as the first paid action; subsequent renewals do not pay the referrer).
- Paying for "team performance" or aggregated downline metrics (forbidden — no team / downline construct exists in the data model).

### 5.3 Attribution data model

The data model carries exactly:

```
referral_link {
  id, referrer_member_id, campaign_id, generated_at, expires_at?
}

referral_click {
  id, referral_link_id, visitor_anon_id, first_seen_at
}

referral_attribution {
  id, referral_link_id, referred_member_id, attributed_at,
  expires_at = attributed_at + 30 days
}

referral_payout {
  id, referral_attribution_id, transaction_id, gross_amount,
  referrer_share, paid_at, status
}
```

There is no `parent_referrer_id`, no `tree_depth`, no `downline_count`, no `team_volume`. These columns must never be added; their absence is a structural enforcement of single-tier.

### 5.4 Public surface rules for referrals

- A referral link is a personal URL the member shares; the link itself is not a public CTA on Vetuonglai surfaces.
- The Member dashboard generates the link; the dashboard explains the mechanic plainly, in line with `/legal/material-connection/`.
- When the referrer shares the link externally (TikTok, Facebook, blog), they must include the FTC-style material connection disclosure (Public Positioning §3 + §12).
- The referred member sees, on first paid checkout, a one-line transparent acknowledgement: *"Bạn đến từ giới thiệu của [referrer display name]. Người giới thiệu nhận một phần nhỏ doanh thu nền tảng (1 cấp, không ảnh hưởng giá bạn trả)."*

### 5.5 Forbidden referral patterns

- Auto-applied referral on any account a referrer creates for someone else (no — the referred member must visit the link themselves).
- Forced disclosure of referrer identity to the buyer beyond the one-line acknowledgement at checkout.
- Mass-spam referral campaigns (the platform may revoke referral capability for any member found violating CAN-SPAM, GDPR ePrivacy, or VN Nghị định 91/2020).

---

## 6. Material connection disclosure — the operational rule

### 6.1 When disclosure is mandatory

Per FTC 16 CFR §255 and platform-specific paid-partnership rules, **every** post, video, podcast, livestream, email, or written piece by a contributor that mentions Vetuonglai with any of the following connections must disclose:

- Receiving payment (commission, payout, bonus, gift card).
- Receiving a free product, free Pass, free credential, free service.
- Being employed by, contracted to, or in a partnership with Vetuonglai.
- Being an invited creator / influencer with non-monetary benefit.
- Holding a referral link to the content being discussed.

Disclosure must be **clear and conspicuous**: same caption, near the start, in the user's normal language, in the same medium (overlay on video, in-frame text on TikTok), not buried in hashtags or a footer.

### 6.2 Required disclosure wordings

- **VI (default):** "Bài/video này có quan hệ lợi ích với Vetuonglai (hợp tác có doanh thu / link giới thiệu 1 cấp)."
- **EN (default):** "This post/video has a paid relationship with Vetuonglai (revenue share / single-tier referral link)."
- **TikTok / IG paid partnership:** also enable the platform's native paid-partnership tag in addition to the in-caption text.
- **Hashtags (VI):** `#hợptáccódoanhnghiệp`, `#vetuonglai` (in addition to in-caption text, not as a substitute).
- **Hashtags (EN):** `#paidpartnership`, `#vetuonglai`.

### 6.3 Where disclosure must appear on Vetuonglai's own surfaces

- On any Read essay or chapter authored by a paid contributor: a disclosure block at the top of the piece with the contributor's role.
- On any Edu program led by a paid instructor: a disclosure block on the program landing page.
- On any Studio listing (V3): the listing's compensation model is shown ("Creator: $X net of platform fee", with a link to /legal/material-connection).
- On any Member dashboard testimonial display: the source of the testimonial is named and the relationship is disclosed.

### 6.4 Penalty for disclosure failure

A contributor who fails to disclose:

- First incident: warning + remediation requirement (correct the post within 7 days).
- Second incident: 30-day suspension from earning channels.
- Third incident: termination of contributor agreement; outstanding payouts honored, but future channels closed.
- Severe / pattern violation: termination + reporting to FTC if necessary.

The disclosure rule is the single most enforced rule in the contributor economy because it is the rule regulators check first.

---

## 7. Income Disclaimer — the always-attached statement

### 7.1 When it must appear

The Income Disclaimer must appear:

- Adjacent to any historical contributor income figure displayed inside Vetuonglai (post-login surfaces only — public surface forbids income figures entirely per Public Positioning §3.1).
- On `/legal/income/` as the canonical full text.
- In every contributor agreement (signed before first payout).
- In every email that mentions earning (footer link minimum; full text if email subject mentions a specific income).

### 7.2 Canonical text

**VI:**
> Mức thu nhập tham khảo bên trên được lấy từ thành viên đã xác minh. Đây không phải cam kết, dự đoán, hay đảm bảo. Thu nhập thực tế của một thành viên phụ thuộc vào kỹ năng, thời gian, chất lượng đóng góp, thị trường, và nhiều yếu tố khác. Đa số thành viên đóng góp không đạt mức cao nhất hiển thị. Vetuonglai không hứa thu nhập.

**EN:**
> Reference income figures shown above are from verified members. They are not a promise, projection, or guarantee. Actual member income depends on skill, time invested, contribution quality, market conditions, and many other factors. Most contributing members do not reach the higher figures shown. Vetuonglai does not promise income.

### 7.3 Display rules

- The disclaimer's font size must be no smaller than the income figure it accompanies.
- The disclaimer must be in the same language as the income figure.
- The disclaimer must be visible without expanding a "more" toggle or scrolling away from the figure.
- The disclaimer cannot be placed only in a separate `/legal/income/` page if the figure is shown elsewhere; it must be adjacent.

---

## 8. Income tier ranges — what may be shown, where

### 8.1 The reference ranges (post-login only)

Vetuonglai may publish, on post-login surfaces only, historical contributor income tier ranges drawn from verified payout records. Working bands (subject to actual data):

| Tier of contributor activity | Reference monthly income (USD, illustrative) |
|---|---|
| Casual referrer (< 5 referrals/yr) | $0-$50 |
| Active mini-product seller | $50-$500 |
| Coach / cohort mentor | $300-$2,000 |
| Top-decile creator on Read / Edu | $1,000-$5,000 |
| Enterprise project lead | varies, contract-by-contract |

### 8.2 Display rules

- Ranges shown only post-login. Public surface (logged-out) forbids income figures.
- Ranges always displayed with Income Disclaimer adjacent (§7.3).
- Ranges always sourced — link to a transparency note explaining the data window and sample size.
- Ranges updated quarterly from actual payout data; never projected forward.
- Ranges never used in marketing copy ("you can earn $X-$Y"); they are informational reference only.
- Ranges never personalized as a forecast for a specific viewer ("members like you earn $X").

### 8.3 Forbidden display patterns

- Showing only the top of the band ("$5,000/month possible!") — the full band must be shown.
- Showing the band on a public homepage or pricing page.
- Showing the band in advertising creatives (ads must adhere to public-surface rules even if the click-through lands on a post-login page).
- Showing the band in contributor recruitment emails to non-members.

---

## 9. Contributor classification — labor and tax

### 9.1 Default classification: independent contractor

By default, contributors on Vetuonglai are independent contractors (US: 1099 / VN: hợp đồng dịch vụ độc lập / EU: freelance), not employees. The contributor agreement makes this explicit. Contributors:

- Set their own working hours.
- Provide their own equipment.
- Are not entitled to employee benefits.
- Bear their own tax obligations (subject to platform withholding where law requires).
- May contract with other platforms.

### 9.2 California AB5 + state law

For California-resident contributors, the platform applies the AB5 ABC test:

- (A) Free from direction and control: contributor sets their own work product and method.
- (B) Outside the usual course of business: contributor's specific output (a single course, a single book, a single referral) is not the platform's core deliverable.
- (C) Independently established: contributor offers similar services to others.

Where the ABC test would fail for a specific arrangement, the platform reclassifies the relationship as employment with full benefits, or terminates the engagement. The platform never operates a "1099 in name, W-2 in practice" arrangement.

### 9.3 EU Platform Work Directive 2024/2831

For any contributor with primary residence in an EU member state (when V2/V3+ EU expansion occurs):

- Platform applies the directive's classification test.
- If the directive's presumption of employment applies, platform treats the contributor as employee per local law, OR terminates the engagement.
- Algorithmic management constraints under the directive are honored (transparency on automated decisions, human review, data subject rights).

### 9.4 Vietnam classification

- Default: hợp đồng dịch vụ (service contract) as independent contractor.
- Tax: PIT withholding per Nghị định 117/2025 e-commerce rules where the platform is the payer-of-record.
- No employee benefits unless contracted as an employee under separate agreement.
- Multi-level marketing classification is explicitly **not applicable** because the platform is single-tier (Nghị định 40/2018 carve-out — the platform's structure is not MLM and disclosure documents reflect this).

### 9.5 Worker Classification disclosure

A "Worker Classification" disclosure (per `/legal/contractor/`) is shown to every contributor before signing the contributor agreement, in the contributor's primary language. It explains:

- Independent contractor classification.
- No employee benefits.
- Tax responsibility.
- Right to raise classification concern via a defined channel.
- Right to terminate the relationship at will.

---

## 10. Builder gate operations

### 10.1 Builder = Tier 4 — what gets you there

A member reaches Tier 4 (Builder) on at least one pathway by accumulating verified evidence of capability per the pathway rubric in `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`. Working categories of evidence:

- Edu program completion(s) with VC-issued credential.
- Read essay / chapter publication(s) with reviewer attestation.
- Work-light service delivery with client + reviewer attestation.
- VC-issued attestation from a Mentor (Tier 6+) on a specific skill.

### 10.2 What Builder unlocks

- Generation of single-tier referral links with payout enabled.
- Application to Contributor Studio (V3) as a seller.
- Eligibility to receive Read creator-economy revenue share on paid layers.
- Eligibility to lead a paid Mini product on Edu.
- Eligibility to apply as Coach / Mentor (tier-gated to Mentor = Tier 6 for full mentorship; coach permission unlocks at Builder).
- Visibility of post-login income tier ranges (§8).
- Access to the contributor dashboard.

### 10.3 What Builder does not unlock

- Invest gate clearance (that requires Tier 7 Steward + 6 other conditions, see Product Architecture §6).
- Access to other members' personal data.
- Authority to onboard contributors (curation team owns onboarding).
- Multi-tier earning (does not exist).

### 10.4 Builder downgrade

If credentials underlying Builder tier are revoked (e.g., for cause), the member's tier drops below 4 and earning channels close. Earned funds in escrow are still released after a review window; future earning is suspended until the member regains Builder via new evidence.

---

## 11. Contributor onboarding flow

### 11.1 Public surface

- V1: no public contributor sign-up. (Public Positioning §6.1, Memo §1.3.)
- V2+: a public landing page on `docs.vetuonglai.com/contributor/` explains the program neutrally, lists the 5 red lines, links to `/legal/material-connection/`, and lands on a post-login application form gated to Builder-tier members.

### 11.2 Application flow (post-Builder)

1. Member opens contributor dashboard.
2. System verifies Builder tier; if not, returns to learning surface with explanation.
3. Member views the contributor program rules, including:
   - 7 revenue channels (§3).
   - Single-tier rule (§5).
   - 85/15 split (§4).
   - Material connection obligation (§6).
   - Income Disclaimer (§7).
   - Worker classification disclosure (§9.5).
   - 5 red lines (Public Positioning §2).
4. Member click-confirms each rule independently.
5. Member uploads tax forms (W-9 / W-8BEN / VN tax form) and bank/Wise/PayPal rail.
6. Member signs the bilingual contractor agreement.
7. Curation team review (V3 for Studio sellers; auto-approve for non-Studio channels in V2 if all click-confirms + tax forms valid).
8. Member receives access to referral link generator + earning channels enabled.

### 11.3 Approval rejection and appeal

- Rejection reasons are returned in writing to the member.
- Member may appeal once via a defined channel; appeal review by Team 3 (Governance).
- If appeal is denied, member may reapply after demonstrating new evidence (e.g., new credential, new published work).

---

## 12. Payout operations

### 12.1 Payout cadence

- Monthly payout cycle: payouts run on the 15th of each month for the prior calendar month's earnings.
- Minimum payout threshold: USD $25 (or VND equivalent). Below threshold, balance rolls forward.
- Maximum manual hold: 30 days for first payout (anti-fraud); standard 7 days thereafter.

### 12.2 Payout rails

- US: ACH or wire (USD).
- VN: domestic bank transfer (VND).
- Other regions: Wise / PayPal where compliant.
- No cash, no crypto, no gift cards, no money-order.

### 12.3 Payout receipt

Every payout includes a receipt with:

- Gross transaction(s) attributed.
- Creator share, platform share, referrer share (if any).
- Tax withholding (if any).
- Net to recipient.
- Currency and exchange-rate basis.
- Tax-form references (e.g., 1099 line item).

### 12.4 Disputes and chargebacks

- A dispute window of 30 days from payout.
- Chargeback events are reversed against creator share if within refund SLA; outside SLA, platform may absorb chargeback per case review.
- Repeated chargeback abuse from a buyer triggers buyer-side review independently of contributor.

---

## 13. Public language for the contributor economy

This section restates the language rules from Public Positioning §3 in the contributor economy's specific surface context.

### 13.1 Allowed contributor-economy phrasing (public)

- "chương trình đóng góp" / "contributor program"
- "giới thiệu minh bạch (1 cấp)" / "transparent referral (single-tier)"
- "đóng góp được trả công xứng đáng" / "fair payout for contribution"
- "tạo giá trị" / "value creation"
- "chia sẻ doanh thu (1 cấp)" / "revenue share (single-tier)"
- "tiết lộ quan hệ lợi ích" / "material connection disclosure"

### 13.2 Forbidden contributor-economy phrasing (public)

- "affiliate", "affiliate program", "affiliate marketing".
- "earn $X / month", any specific public-surface income figure.
- "passive income", "thu nhập thụ động".
- "join my team", "build your team", "đội của tôi".
- "downline", "upline".
- "MLM", "network marketing", "matrix".
- "Get rich", "đổi đời", "làm giàu".

### 13.3 Internal vs public

Internal identifiers (e.g., `affiliate_single_tier`, `contributor_payout_event`) may keep legacy strings for schema stability, but the render layer translates them per Public Positioning §3.2.

---

## 14. Reconciliations forced by this lock

Until updated, this doc is the authority. The following must be updated:

### 14.1 `VETUONGLAI_REVENUE_FOR_MEMBERS.md`
- §1 channels: lock 7 (3 V1 + 4 V2). Remove any "8 kênh" wording.
- §3 splits: lock creator ≥85% / platform ≤15%. Remove any 80/20 wording.
- §1.3 lằn ranh đỏ (3 items): align with the 5 red lines (Public Positioning §2); the 3 RFM items are a subset, retained as internal reminders.

### 14.2 `VETUONGLAI_FTC_DISCLOSURE_AND_AFFILIATE_COMPLIANCE.md`
- §1 5-rule list: re-number to align with Public Positioning §2 (the public 5 red lines); the FTC §1 list is the engineering / disclosure-operations expansion, not the public list.
- §3 vocabulary table: align with Public Positioning §3.2.

### 14.3 `VETUONGLAI_PATHWAY_AND_TIER_FRAMEWORK.md`
- §3 tier roles touching earning: cross-link Builder = Tier 4 = earning floor explicitly.
- §6 hard rules: cross-reference the 5 red lines.

### 14.4 `docs/final-lock/VTL_67_READ_CREATOR_ECONOMY_LOCK_2026-04-28.md`
- Confirm 85/15 (already aligned). Add cross-reference to this doc as the master-scope source.

### 14.5 `VETUONGLAI_PRODUCT_STRATEGY.md`
- §5.3 Marketplace economics (PS:408 80/20): override to 85/15 under Contributor Studio.

---

## 15. Definition of Done — contributor economy layer

This layer is "done for V1" when:

- ✅ Earning principle (§1) rendered in contributor agreement + dashboard.
- ✅ Eligibility gate (§2) enforced at API: Builder + 30 days + tax forms before any payout.
- ✅ 7 channels (§3) documented; only V1 channels active in V1.
- ✅ 85/15 split (§4) enforced in payout calculation; refund mechanics tested.
- ✅ Single-tier referral data model (§5.3) implemented; no `parent_referrer_id` or `tree_depth` columns exist anywhere.
- ✅ Material connection disclosure (§6) auto-injected on contributor surfaces; disclosure verifier returns zero defects.
- ✅ Income Disclaimer (§7) rendered adjacent to every income figure on post-login surfaces; not present on any public surface.
- ✅ Income tier ranges (§8) shown post-login only; data sourced; updated quarterly cycle scheduled.
- ✅ Worker classification (§9) handled per jurisdiction; AB5 / Platform Work Directive / Nghị định 117/2025 mapped.
- ✅ Builder gate (§10) enforced; downgrade path tested.
- ✅ Onboarding flow (§11) gated to Builder; click-confirms recorded; tax forms validated.
- ✅ Payout operations (§12) running monthly; receipts complete; dispute window enforced.
- ✅ Public lexicon for contributor economy (§13) verified clean in `dist/`.

When all 13 boxes pass, this layer is V1-complete. V2 expansion (channels 4-7) requires the V2 launch checklist (Product Architecture §8.2). V3 Studio onboarding requires the V3 launch checklist (Product Architecture §8.3) and curation team standup.

— end of contributor economy and earning policy layer —
