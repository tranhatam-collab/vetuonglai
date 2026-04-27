# VTL TEAM 2 REQUEST CONTRACT — TEAM 3 READY TO FILL

Version: 1.2
Date: 2026-04-09
Status: approved by Team 3
Requester: Team 2
Base template: `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM3_TEMPLATE.md`
Prefill source:
- `src/data/team3-policy-matrix.json`
- `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md`

## Instructions for Team 3

Review each prefilled field and change only if needed.
When confirmed, flip `approved: true` in final sign-off.
Use section `B3` below to approve or revise each `DPM-*` surface row mapped by Team 2.

## Section A — Trust Language Matrix

### A1. Allowed phrases

```yaml
allowed:
  - phrase: "no guarantee"
    context: earnings and outcomes
    notes: must be present near monetary claims
  - phrase: "proof direction"
    context: VC explanation
    notes: clarify VC confirms proof, not income
  - phrase: "annual and pack are separate layers"
    context: pricing and purchase hub
    notes: must remain explicit
```

### A2. Restricted phrases

```yaml
restricted:
  - phrase: "guaranteed income"
    reason: violates anti-guarantee guardrail
    replacement: "no guaranteed income"
  - phrase: "fast money"
    reason: violates trust and anti-FOMO guardrail
    replacement: "long-term value path"
  - phrase: "recruit to earn"
    reason: conflicts with anti-MLM guardrail
    replacement: "direct-only referral after compliance pass"
```

### A3. Escalation rules

```yaml
requires_legal_review_if_contains:
  - earnings projection
  - payout promise language
  - refund exception wording
requires_compliance_review_if_contains:
  - affiliate activation claims
  - VC status claims beyond verified/reviewing/planned
```

## Section B — Disclosure Placement Rules

### B1. Required placement by route type

```yaml
homepage_purchase_hub:
  required_blocks:
    - annual_vs_pack_layer_disclosure
    - no_guarantee_disclosure
  minimum_position: above_primary_purchase_cta
subdomain_deep_cta_page:
  required_blocks:
    - deep_content_routes_to_homepage_disclosure
  minimum_position: near_deep_cta
checkout_route:
  required_blocks:
    - pricing_layer_disclosure
    - refund_and_compliance_disclosure
  minimum_position: before_confirm_payment
success_route:
  required_blocks:
    - activation_state_disclosure
  minimum_position: within_success_summary
```

### B2. Visibility requirements

```yaml
mobile_visibility_rule: disclosure_visible_without_hidden_tabs_on_primary_flow
desktop_visibility_rule: disclosure_not_below_fold_only_on_primary_flow
contrast_and_readability_rule: minimum_accessible_contrast_and_plain_language
```

### B3. Surface placement row approval (from Team 2 DPM map)

| DPM ID | Surface key | Required block keys | Team 3 decision (`approve` or `revise`) | Team 3 revise note |
| --- | --- | --- | --- | --- |
| `DPM-001` | `hub.purchase_hub.hero` | `DISC-ANNUAL-PACK-SEPARATION`, `DISC-NO-GUARANTEE` | `approve` | - |
| `DPM-002` | `hub.package_chooser.cards` | `DISC-ANNUAL-PACK-SEPARATION` | `approve` | - |
| `DPM-003` | `hub.start_here` | `DISC-NO-GUARANTEE`, `DISC-AFFILIATE-ACTIVATION-RULE` | `approve` | - |
| `DPM-004` | `hub.bat_dau` | `DISC-ANNUAL-PACK-SEPARATION` | `approve` | - |
| `DPM-005` | `edu.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-006` | `edu.courses.list` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-007` | `edu.course.detail` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | `approve` | - |
| `DPM-008` | `work.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-009` | `work.brief` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-010` | `market.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | `approve` | - |
| `DPM-011` | `market.rules` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-REFUND-FRAUD-GATE` | `approve` | - |
| `DPM-012` | `green.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-013` | `finance.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | `approve` | - |
| `DPM-014` | `life.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB` | `approve` | - |
| `DPM-015` | `invest.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-NO-GUARANTEE` | `approve` | - |
| `DPM-016` | `member.home.deep_cta` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-AFFILIATE-ACTIVATION-RULE` | `approve` | - |
| `DPM-017` | `member.journey` | `DISC-DEEP-ROUTE-TO-HUB`, `DISC-AFFILIATE-ACTIVATION-RULE` | `approve` | - |
| `DPM-018` | `checkout.pre_confirm` | `DISC-ANNUAL-PACK-SEPARATION`, `DISC-NO-GUARANTEE`, `DISC-REFUND-FRAUD-GATE` | `approve` | require `disclosure_acknowledged` hook |
| `DPM-019` | `checkout.success` | `DISC-AFFILIATE-ACTIVATION-RULE`, `DISC-REFUND-FRAUD-GATE` | `approve` | - |
| `DPM-020` | `annual_only.affiliate_disabled_state` | `DISC-AFFILIATE-ACTIVATION-RULE` | `approve` | - |
| `DPM-021` | `vc.reference_blocks` | `DISC-VC-PROOF-DIRECTION`, `DISC-NO-GUARANTEE` | `approve` | - |

Reference map:

- `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md`

## Section C — Pack-policy Labels

### C1. Label table

```yaml
labels:
  - key: annual_base_layer
    short_label: "Annual Base"
    long_label: "Annual access is the base layer, not specialist depth"
    applies_to_pack_codes: []
    legal_note: mandatory on homepage purchase hub
  - key: specialist_pack_depth
    short_label: "Specialist Pack"
    long_label: "Specialist depth unlock requires qualifying pack ownership"
    applies_to_pack_codes: [g1, g2, g3, g4, g5, g6, g7, g8, g9]
    legal_note: align with entitlement and compliance state
  - key: affiliate_not_active
    short_label: "Affiliate Disabled"
    long_label: "Affiliate is disabled for public and annual-only states"
    applies_to_pack_codes: [g1, g2, g3, g4, g5, g6, g7, g8, g9]
    legal_note: must be shown on activation-related surfaces
```

### C2. Tooltip/microcopy contract

```yaml
tooltip_rules: concise_plain_language_no_promises
microcopy_rules: show layer separation and compliance requirements
forbidden_wording:
  - guaranteed return
  - instant commission
  - multi-level payout
```

## Section D — Annual-only Affiliate-disabled Copy

### D1. Required disabled-state copy

```yaml
headline: "Affiliate chưa được kích hoạt ở trạng thái Annual-only"
body: "Bạn cần annual + qualifying pack + compliance pass để mở affiliate."
cta_primary: "Xem điều kiện kích hoạt"
cta_secondary: "Quay về homepage package chooser"
```

### D2. Allowed next steps

```yaml
allowed_next_steps:
  - action: view_activation_requirements
    destination: homepage_purchase_hub
  - action: open_pack_chooser
    destination: homepage_package_chooser
```

### D3. Forbidden wording

```yaml
forbidden:
  - phrase: "Bật affiliate ngay"
    reason: annual-only state is denied
  - phrase: "Hoa hồng tự động"
    reason: violates compliance state machine
```

## Section E — Launch Compliance Event Mapping

```yaml
required_events:
  - event_key: affiliate_activation_approved
    trigger: compliance_passed_with_annual_plus_pack
    required_properties: [member_id, pack_key, compliance_state, timestamp]
  - event_key: affiliate_activation_rejected
    trigger: compliance_failed_or_missing_requirements
    required_properties: [member_id, reason_code, compliance_state, timestamp]
  - event_key: vc_record_status_changed
    trigger: vc_status_transition
    required_properties: [record_code, from_status, to_status, source_owner]
  - event_key: disclosure_acknowledged
    trigger: required_disclosure_confirmed
    required_properties: [surface_key, member_state, timestamp]
```

## Section F — Final Sign-off

```yaml
approved: true
approver_name: TEAM_3_TRUST_LOCK_OWNER
approver_role: team-3-trust-affiliate-legal-analytics-ops
approved_at: 2026-04-09 18:34 ICT
notes: locked with dependency IDs T2-T3-001..004; section B3 provides row-level approval against Team 2 DPM map
```

## Delivery target

Commit message:

`team3: lock trust/disclosure/pack-policy contracts for team2`
