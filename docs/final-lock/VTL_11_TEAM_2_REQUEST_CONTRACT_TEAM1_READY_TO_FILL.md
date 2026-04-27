# VTL TEAM 2 REQUEST CONTRACT — TEAM 1 READY TO FILL

Version: 1.1
Date: 2026-04-10
Status: accepted_locked_by_team1
Requester: Team 2
Base template: `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_TEMPLATE.md`
Prefill source:
- `src/data/access-model.json`
- `docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md`

## Instructions for Team 1

Review each prefilled field and change only if needed.
When confirmed, flip `approved: true` in final sign-off.
Use `VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md` as the authoritative Team 2 payload map for parser/runtime compatibility.

## Section A — Route Param Schema Lock

### A1. Allowed parameters

```yaml
entry:
  required: true
  allowed_values: [hub, member, edu, work, market, life, finance, invest, green, vc]
  default: hub
pack:
  required: false
  allowed_values: [g1, g2, g3, g4, g5, g6, g7, g8, g9]
  default: g1
intent:
  required: true
  allowed_values: [annual-access, specialist-pack]
  preferred_emit_values_from_team2: [annual-access, specialist-pack]
  accepted_aliases: [annual, pack, course-depth, course-card, course-list, course-list-item, course-detail, job-apply, brief, market-buy, market-rules, member-depth, journey, green-depth, finance-depth, life-depth, invest-depth]
  default: specialist-pack
source:
  required: false
  allowed_pattern: "^[a-z0-9-]{1,80}$"
  max_length: 80
slug:
  required: false
  allowed_pattern: "^[a-z0-9-]{1,120}$"
  max_length: 120
gateway:
  required: false
  allowed_values: [paypal, stripe]
  default: paypal
lang:
  required: false
  allowed_values: [vi, en]
  default: vi
ref:
  required: false
  allowed_pattern: "^[a-z0-9-]{1,80}$"
  max_length: 80
return_to:
  required: false
  allowed_pattern: "^/[a-z0-9\\-_/]*$"
  max_length: 200
```

### A2. Validation and fallback

```yaml
invalid_entry_behavior: fallback_to_entry_hub
invalid_pack_behavior: fallback_to_pack_g1
invalid_intent_behavior: map_alias_then_fallback_to_specialist_pack
invalid_source_behavior: drop_source
invalid_slug_behavior: drop_slug
invalid_gateway_behavior: fallback_to_gateway_paypal
invalid_lang_behavior: fallback_to_lang_vi
invalid_ref_behavior: drop_ref
invalid_return_to_behavior: fallback_to_root
missing_required_behavior: set_default_and_continue_for_hub_links; reject_on_checkout_resolve_if_intent_or_gateway_missing
canonical_redirect_rule: normalize_aliases_and_query_in_runtime_contract_then_allow_canonical_hub_resolve
```

### A3. Ownership

```yaml
owner_team: team-1-platform-access-commerce-core
owner_person: TEAM_1_LOCK_OWNER
effective_date: 2026-04-09
```

## Section B — Entitlement Names and Member States

### B1. Member states

```yaml
states:
  - key: visitor
    description: public visitor without account
    user_visible_label: Visitor
  - key: pending_member
    description: started checkout but not fully provisioned
    user_visible_label: Pending Member
  - key: annual_active
    description: annual subscription active
    user_visible_label: Annual Access Member
  - key: pack_owner
    description: annual active + owns at least one specialist pack
    user_visible_label: Specialist Pack Owner
  - key: program_user
    description: annual active + admitted into approved program layer
    user_visible_label: Program User
  - key: partner
    description: verified proof + approved partner state
    user_visible_label: Partner
```

### B2. Entitlement matrix

```yaml
entitlements:
  - key: public_basics
    description: basic open content on every subdomain
    enabled_for_states: [visitor, pending_member, annual_active, pack_owner, program_user, partner]
    disabled_for_states: []
  - key: annual_access_core
    description: member identity, onboarding, dashboard, foundational cross-domain navigation
    enabled_for_states: [annual_active, pack_owner, program_user, partner]
    disabled_for_states: [visitor, pending_member]
  - key: purchase_hub
    description: homepage package chooser and annual-access management
    enabled_for_states: [annual_active, pack_owner, program_user, partner]
    disabled_for_states: [visitor, pending_member]
  - key: cross_domain_orientation
    description: orientation content across domains
    enabled_for_states: [annual_active, pack_owner, program_user, partner]
    disabled_for_states: [visitor, pending_member]
  - key: owned_pack_depth
    description: specialist depth for owned packs only
    enabled_for_states: [pack_owner, partner]
    disabled_for_states: [visitor, pending_member, annual_active, program_user]
  - key: program_layer
    description: guided cohort or mentor-approved layer
    enabled_for_states: [program_user, partner]
    disabled_for_states: [visitor, pending_member, annual_active, pack_owner]
  - key: partner_rights
    description: partner-specific rights
    enabled_for_states: [partner]
    disabled_for_states: [visitor, pending_member, annual_active, pack_owner, program_user]
```

### B3. Purchase lifecycle states

```yaml
purchase_states:
  - key: pending_activation
    meaning: annual subscription created but not active
    retry_policy: wait_for_webhook_then_manual_recheck
  - key: active
    meaning: annual access provisioned
    retry_policy: not_applicable
  - key: past_due
    meaning: payment issue detected
    retry_policy: grace_state_then_retry_payment
  - key: cancelled
    meaning: renewal disabled by user/system
    retry_policy: re-activate_via_checkout
  - key: expired
    meaning: annual access ended
    retry_policy: new_annual_checkout
```

## Section C — Return Flow Contract

### C1. Return precedence

```yaml
priority_order:
  - source_domain
  - member_dashboard
  - homepage
```

### C2. Session/token expectations

```yaml
session_required_before_return: true
refresh_behavior: refresh_if_access_expiring_else_continue
token_expired_behavior: redirect_member_magic_login
```

### C3. Failure fallback routes

```yaml
payment_success_but_no_session: https://member.vetuonglai.com/unlock/success/
payment_pending_timeout: https://member.vetuonglai.com/unlock/
magic_link_expired: https://member.vetuonglai.com/unlock/login/
generic_fallback: https://vetuonglai.com/bat-dau/
```

## Section D — API and Middleware Contract

### D1. Middleware parse contract

```yaml
middleware_owner: team-1-platform-access-commerce-core
parse_order: [entry, pack, intent, source, slug, gateway, lang, ref, return_to]
normalization_rules: lowercase_trim_then_allowlist
error_logging_rules: log_invalid_param_with_request_id
```

### D2. API contract

```yaml
api_endpoint_for_contract:
  - GET /api/access/checkout-contract.json
  - POST /api/access/checkout/resolve
  - GET /api/access/session/current
response_shape_checkout_resolve: "{ ok, provider, checkoutUrl, normalized: { entry, intent, gateway, pack, ref, returnTo } }"
response_shape_session_current: "{ authenticated, member_state, annual_access_status, owned_packs[], entitlements[] }"
error_codes: [entry_required, intent_required, gateway_required, pack_required_for_specialist_intent, checkout_url_not_configured]
```

### D3. Team 2 route-state consume addendum

```yaml
source_file: docs/final-lock/VTL_19_TEAM_2_ROUTE_AND_CTA_STATE_MAP_FOR_TEAM1.md
route_state_ids:
  - RS-001
  - RS-002
  - RS-003
  - RS-004
  - RS-005
  - RS-006
  - RS-007
  - RS-008
  - RS-009
  - RS-010
  - RS-011
  - RS-012
  - RS-013
  - RS-014
cta_state_ids:
  - CS-001
  - CS-002
  - CS-003
  - CS-004
  - CS-005
  - CS-006
team1_decision_on_alias_support: accepted_enable_legacy_alias_support_and_normalize_to_canonical_intent
team1_decision_on_source_and_slug_logging: accepted_accept_and_log_for_traceability_then_pass_through
team1_decision_on_unknown_pack_behavior: accepted_fallback_to_g1_with_warning_in_contract_response
```

## Section E — Final Sign-off

```yaml
approved: true
approver_name: TEAM_1_LOCK_OWNER
approver_role: team-1-platform-access-commerce-core
approved_at: 2026-04-10 09:35 ICT
notes: legacy alias support enabled in runtime; source and slug are accepted as trace metadata; invalid raw pack values fall back to g1 with warning; missing pack still rejects specialist checkout resolve
```

## Delivery target

Commit message:

`team1: lock route/entitlement/return contracts for team2`
