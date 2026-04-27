# VTL TEAM 2 DISCLOSURE PLACEMENT MAP TEMPLATE FOR TEAM 3

Version: 1.2
Date: 2026-04-09
Status: team3_final_lock_t2_t3_002_ready
Owner: Team 2 — Hub, Domain Experience, Content Surfaces
Primary consumer: Team 3 — Trust, Affiliate, Legal, Analytics, Ops

## Purpose

This is a prefilled disclosure placement map so Team 3 can finalize rule text and placement constraints without redesigning Team 2 surfaces.

## Source Inputs

- `docs/final-lock/VTL_11_TEAM_2_OUTPUT_48H.md`
- `docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md`
- `src/data/team3-policy-matrix.json`
- `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`

## Dependency IDs

- `T2-T3-001`: trust language matrix lock
- `T2-T3-002`: disclosure placement rules lock
- `T2-T3-003`: pack-policy labels lock
- `T2-T3-004`: annual-only affiliate-disabled copy lock

## Team 3 Fill Instructions

For each row, Team 3 fills these columns:

- `Team 3 final VI copy`
- `Team 3 final EN copy`
- `Legal/compliance reference`
- `Approved by`
- `Approved at`
- `Final status`

Use placeholder if pending:

- `TBD_OWNER`
- `TBD_DATE`
- `TBD_DECISION`

Team 3 completion scope in this file:

- locked P0/P1 wording for hub, checkout, annual-only affiliate-disabled state, and VC reference blocks
- completed remaining pending rows `DPM-006` through `DPM-017` using the same policy guardrails

## Disclosure Block Registry (Prefilled by Team 2)

| Block key | Policy source key | Default surface intent |
| --- | --- | --- |
| `DISC-ANNUAL-PACK-SEPARATION` | `annual_pricing_ladder_and_pack_pricing_are_separate_layers` | homepage pricing and package chooser |
| `DISC-DEEP-ROUTE-TO-HUB` | `deep_content_and_purchase_intent_route_to_homepage_hub` | subdomain deep CTA blocks |
| `DISC-NO-GUARANTEE` | `no_guarantee_no_fast_income_no_public_layer_auto_commission` | pricing and conversion CTA areas |
| `DISC-AFFILIATE-ACTIVATION-RULE` | `activation_requires_annual_plus_qualifying_pack_plus_compliance_pass` | affiliate-related mention or onboarding surfaces |
| `DISC-VC-PROOF-DIRECTION` | `vc_confirms_proof_direction_not_guaranteed_income` | VC references and proof explanations |
| `DISC-REFUND-FRAUD-GATE` | `anti_abuse_and_fraud_flags_can_suspend_affiliate_state` | compliance-sensitive conversion and post-purchase states |

## Placement Matrix (Team 2 Prefilled, Team 3 Finalizes Rules)

| Placement ID | Surface key | Route / context | Trigger | Required block key(s) | Placement zone (Team 2 ready) | Visibility baseline (Team 2 ready) | Required event hook | Team 3 final VI copy | Team 3 final EN copy | Legal/compliance reference | Approved by | Approved at | Final status | Dependency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DPM-001` | `hub.purchase_hub.hero` | `https://vetuonglai.com/` | user enters purchase hub | `DISC-ANNUAL-PACK-SEPARATION`, `DISC-NO-GUARANTEE` | directly above primary purchase CTA cluster | visible without scroll trap on mobile/desktop | optional | `Annual access là lớp nền; specialist pack là lớp chuyên sâu tách biệt. Không có cam kết thu nhập.` | `Annual access is the base layer; specialist packs are a separate depth layer. No income guarantee.` | `T2-T3-001,T2-T3-002 + guardrails.no_guarantee + annual_pack_separation` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-002` | `hub.package_chooser.cards` | `https://vetuonglai.com/#package-chooser` | user compares annual vs pack | `DISC-ANNUAL-PACK-SEPARATION` | immediately below chooser heading, above cards | always visible before first card action | optional | `Vui lòng chọn đúng lớp: annual cho nền tảng, pack cho chiều sâu chuyên biệt.` | `Choose the correct layer: annual for foundation, pack for specialist depth.` | `T2-T3-002,T2-T3-003 + pricing_layer_separation_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-002`, `T2-T3-003` |
| `DPM-003` | `hub.start_here` | `https://vetuonglai.com/#start-here` | user picks annual or specialist path | `DISC-NO-GUARANTEE`, `DISC-AFFILIATE-ACTIVATION-RULE` | under CTA pair in start-here module | no collapsed accordion default | optional | `Không có cam kết thu nhập. Affiliate chỉ mở khi có annual + pack phù hợp + compliance pass.` | `No income guarantee. Affiliate activates only with annual + qualifying pack + compliance pass.` | `T2-T3-001,T2-T3-004 + affiliate_activation_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-001`, `T2-T3-004` |
| `DPM-004` | `hub.bat_dau` | `https://vetuonglai.com/bat-dau/` | onboarding entry from fallback routes | `DISC-ANNUAL-PACK-SEPARATION` | near first conversion CTA | above fold on primary viewport | optional | `Annual là lớp nền bắt đầu; quyền truy cập chuyên sâu yêu cầu pack riêng.` | `Annual is the foundation layer; specialist depth requires a separate pack.` | `T2-T3-002 + annual_pack_separation_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-002` |
| `DPM-005` | `edu.home.deep_cta` | `https://edu.vetuonglai.com/` | deep course CTA | `DISC-DEEP-ROUTE-TO-HUB` | adjacent to deep CTA button | visible in CTA viewport frame | optional | `Nội dung chuyên sâu được điều hướng về homepage purchase hub để chọn lộ trình phù hợp.` | `Deep content routes to the homepage purchase hub for the correct path selection.` | `T2-T3-001,T2-T3-002 + deep_route_to_hub_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-006` | `edu.courses.list` | `https://edu.vetuonglai.com/courses/` | course list item deep CTA | `DISC-DEEP-ROUTE-TO-HUB` | above list CTA row and repeated in list footer | not hidden behind tabs | optional | `Nội dung chuyên sâu trong danh sách khóa học được điều hướng về homepage purchase hub; không mở checkout cục bộ tại subdomain.` | `Deep content in course listings routes to the homepage purchase hub; no subdomain-local checkout is allowed.` | `T2-T3-002 + deep_route_to_hub_rule + no_subdomain_checkout_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-007` | `edu.course.detail` | `https://edu.vetuonglai.com/courses/<slug>/` | course detail unlock CTA | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | below course outcome summary, above unlock CTA | text block visible before CTA click | optional | `Nội dung chuyên sâu được điều hướng về homepage purchase hub. Không có cam kết thu nhập từ kết quả khóa học.` | `Deep content routes to the homepage purchase hub. No income is guaranteed from course outcomes.` | `T2-T3-001,T2-T3-002 + deep_route_to_hub_rule + no_guarantee_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-008` | `work.home.deep_cta` | `https://work.vetuonglai.com/` | deep apply CTA | `DISC-DEEP-ROUTE-TO-HUB` | near apply CTA cluster | same line-of-sight with CTA | optional | `CTA chuyên sâu tại WORK phải điều hướng về homepage purchase hub để giữ một điểm mua chung.` | `Deep CTA on WORK must route to the homepage purchase hub to keep a single purchase point.` | `T2-T3-002 + deep_route_to_hub_rule + homepage_purchase_hub_only` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-009` | `work.brief` | `https://work.vetuonglai.com/brief/` | brief unlock CTA | `DISC-DEEP-ROUTE-TO-HUB` | under brief summary card actions | visible before action buttons | optional | `Các hành động mở sâu ở WORK/brief phải quay về homepage purchase hub, không xử lý checkout tại trang brief.` | `Deep unlock actions on WORK/brief must return to the homepage purchase hub, with no checkout on the brief page.` | `T2-T3-002 + deep_route_to_hub_rule + no_subdomain_checkout_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-010` | `market.home.deep_cta` | `https://market.vetuonglai.com/` | market-buy CTA | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | adjacent to purchase-related CTA cluster | always rendered in primary CTA block | optional | `Luồng mua sâu tại MARKET phải về homepage purchase hub. Không có cam kết thu nhập từ hành động mua.` | `Deep purchase flow on MARKET must route to the homepage purchase hub. No income guarantee is allowed for purchase actions.` | `T2-T3-001,T2-T3-002 + deep_route_to_hub_rule + no_guarantee_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-011` | `market.rules` | `https://market.vetuonglai.com/rules/` | rules-based unlock CTA | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-REFUND-FRAUD-GATE` | below rules summary, above route CTA | visible before conversion action | optional | `Luồng mở sâu được điều hướng về homepage purchase hub. Trạng thái refund/fraud có thể giới hạn quyền affiliate và payout.` | `Deep unlock flow routes to the homepage purchase hub. Refund/fraud status can limit affiliate and payout rights.` | `T2-T3-002 + deep_route_to_hub_rule + refund_fraud_gate` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-012` | `green.home.deep_cta` | `https://green.vetuonglai.com/` | framework depth CTA | `DISC-DEEP-ROUTE-TO-HUB` | around deep framework CTA module | visible with CTA on mobile | optional | `Nội dung framework chuyên sâu tại GREEN được điều hướng về homepage purchase hub để tránh checkout phân tán.` | `Deep framework content on GREEN routes to the homepage purchase hub to avoid fragmented checkout.` | `T2-T3-002 + deep_route_to_hub_rule + homepage_purchase_hub_only` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-013` | `finance.home.deep_cta` | `https://finance.vetuonglai.com/` | framework depth CTA | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | adjacent to deep CTA module | no hidden state by default | optional | `Luồng chuyên sâu tại FINANCE phải về homepage purchase hub. Không có cam kết thu nhập hoặc lợi nhuận nhanh.` | `Deep flow on FINANCE must route to the homepage purchase hub. No income or fast-profit guarantees are allowed.` | `T2-T3-001,T2-T3-002 + deep_route_to_hub_rule + no_guarantee_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-014` | `life.home.deep_cta` | `https://life.vetuonglai.com/` | framework depth CTA | `DISC-DEEP-ROUTE-TO-HUB` | near deep CTA in preview surface | visible in first CTA viewport | optional | `CTA chuyên sâu tại LIFE phải điều hướng về homepage purchase hub để giữ hành vi định tuyến thống nhất.` | `Deep CTA on LIFE must route to the homepage purchase hub to keep routing behavior consistent.` | `T2-T3-002 + deep_route_to_hub_rule + routing_consistency_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002` |
| `DPM-015` | `invest.home.deep_cta` | `https://invest.vetuonglai.com/` | framework depth CTA | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | near deep CTA in preview surface | always visible with CTA block | optional | `Luồng chuyên sâu tại INVEST phải về homepage purchase hub. Không có ngôn ngữ cam kết thu nhập.` | `Deep flow on INVEST must route to the homepage purchase hub. Income-guarantee wording is not allowed.` | `T2-T3-001,T2-T3-002 + deep_route_to_hub_rule + no_guarantee_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-016` | `member.home.deep_cta` | `https://member.vetuonglai.com/` | member-depth CTA to hub | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-AFFILIATE-ACTIVATION-RULE` | below member depth CTA row | visible before route-out action | optional | `Luồng từ MEMBER về homepage purchase hub là bắt buộc. Affiliate chỉ mở khi có annual + pack phù hợp + compliance pass.` | `Routing from MEMBER to the homepage purchase hub is mandatory. Affiliate activates only with annual + qualifying pack + compliance pass.` | `T2-T3-002,T2-T3-004 + deep_route_to_hub_rule + affiliate_activation_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002`, `T2-T3-004` |
| `DPM-017` | `member.journey` | `https://member.vetuonglai.com/journey/` | journey CTA to hub pack chooser | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-AFFILIATE-ACTIVATION-RULE` | under journey next-step CTA | always visible at action point | optional | `Journey CTA phải quay về homepage package chooser. Affiliate không kích hoạt ở annual-only; cần annual + pack + compliance pass.` | `Journey CTA must return to the homepage package chooser. Affiliate is not active at annual-only; annual + pack + compliance pass are required.` | `T2-T3-002,T2-T3-004 + deep_route_to_hub_rule + annual_only_affiliate_disabled_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 23:06 ICT` | `approved` | `T2-T3-002`, `T2-T3-004` |
| `DPM-018` | `checkout.pre_confirm` | runtime checkout step before provider redirect | user confirms checkout intent | `DISC-ANNUAL-PACK-SEPARATION`, `DISC-NO-GUARANTEE`, `DISC-REFUND-FRAUD-GATE` | immediately before confirm-payment action | cannot be hidden in modal overflow | `disclosure_acknowledged` required | `Xác nhận: annual và pack là hai lớp tách biệt; không cam kết thu nhập; trạng thái refund/fraud có thể giới hạn quyền affiliate.` | `Confirm: annual and pack are separate layers; no income guarantee; refund/fraud status can restrict affiliate eligibility.` | `T2-T3-001,T2-T3-002 + disclosure_acknowledged + refund_fraud_gate` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-001`, `T2-T3-002` |
| `DPM-019` | `checkout.success` | `https://member.vetuonglai.com/unlock/success/` (contract target) | payment success return | `DISC-AFFILIATE-ACTIVATION-RULE`, `DISC-REFUND-FRAUD-GATE` | within success summary block | visible before next-step CTA | `disclosure_acknowledged` recommended | `Affiliate chưa tự động kích hoạt sau thanh toán; cần annual + pack phù hợp + compliance pass.` | `Affiliate is not auto-activated after payment; annual + qualifying pack + compliance pass are required.` | `T2-T3-004 + affiliate_activation_guardrail + compliance_gate` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-004` |
| `DPM-020` | `annual_only.affiliate_disabled_state` | annual-only member surfaces | user enters affiliate-related surface without eligibility | `DISC-AFFILIATE-ACTIVATION-RULE` | directly above disabled-state CTA options | must be visible in first disabled-state viewport | optional | `Affiliate chưa được kích hoạt ở trạng thái Annual-only. Bạn cần annual + qualifying pack + compliance pass để mở affiliate.` | `Affiliate is disabled in the annual-only state. Annual + qualifying pack + compliance pass are required for activation.` | `T2-T3-004 + annual_only_affiliate_disabled_rule` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-004` |
| `DPM-021` | `vc.reference_blocks` | hub/member surfaces that reference VC trust | user opens VC explanation near conversion | `DISC-VC-PROOF-DIRECTION`, `DISC-NO-GUARANTEE` | attached to VC reference module footer | visible in same module, no separate page jump required | optional | `VC xác nhận hướng chứng thực và tính minh bạch bằng chứng, không phải cam kết thu nhập.` | `VC confirms proof direction and transparency, not guaranteed income.` | `T2-T3-001 + vc_proof_direction_rule + no_guarantee_guardrail` | `TEAM_3_TRUST_LOCK_OWNER` | `2026-04-09 18:37 ICT` | `approved` | `T2-T3-001` |

## Final Closure Checklist (T2-T3-002)

- [x] Every placement row requiring `T2-T3-002` has non-placeholder VI/EN copy.
- [x] Every placement row requiring `T2-T3-002` has legal/compliance reference filled.
- [x] Every placement row requiring `T2-T3-002` has `Approved by` and `Approved at` populated.
- [x] All rows `DPM-001` through `DPM-021` now have `Final status: approved`.
- [x] Wording remains aligned with:
  - no guarantee guardrail
  - deep route to homepage purchase hub
  - annual vs pack separation
  - affiliate activation compliance rule

Closure decision:

- dependency ID: `T2-T3-002`
- final status: `accepted`
- accepted by: `TEAM_3_TRUST_LOCK_OWNER`
- accepted at: `2026-04-09 23:06 ICT`
- source of acceptance: this file (`VTL_20`)

## Team 3 Exit Checklist

- Fill all `TBD_*` fields in placement rows used by live or near-live surfaces.
- Mark each row `approved` / `blocked` / `not_applicable`.
- Ensure wording matches:
  - anti-guarantee guardrails
  - annual-vs-pack separation rule
  - affiliate-disabled-at-annual-only rule
- Update:
  - `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_READY_TO_FILL.md`
  - `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`
  - `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
