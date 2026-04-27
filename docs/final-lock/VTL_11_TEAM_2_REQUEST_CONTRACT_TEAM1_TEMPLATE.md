# VTL TEAM 2 REQUEST CONTRACT — TEAM 1 TEMPLATE

Version: 1.0
Date: 2026-04-09
Status: pending Team 1 response
Requester: Team 2

## Instructions for Team 1

Fill this template directly. Do not answer in chat-only format.

If a field is unknown, set explicit placeholder:

- `TBD_OWNER`
- `TBD_DATE`
- `TBD_DECISION`

## Section A — Route Param Schema Lock

### A1. Allowed parameters

```yaml
entry:
  required: true
  allowed_values: []
  default: 
pack:
  required: false
  allowed_values: []
  default: 
intent:
  required: false
  allowed_values: []
  default: 
source:
  required: false
  allowed_pattern: 
  max_length: 
slug:
  required: false
  allowed_pattern: 
  max_length: 
```

### A2. Validation and fallback

```yaml
invalid_entry_behavior:
invalid_pack_behavior:
invalid_intent_behavior:
invalid_source_behavior:
invalid_slug_behavior:
missing_required_behavior:
canonical_redirect_rule:
```

### A3. Ownership

```yaml
owner_team:
owner_person:
effective_date:
```

## Section B — Entitlement Names and Member States

### B1. Member states

```yaml
states:
  - key:
    description:
    user_visible_label:
```

### B2. Entitlement matrix

```yaml
entitlements:
  - key:
    description:
    enabled_for_states: []
    disabled_for_states: []
```

### B3. Purchase lifecycle states

```yaml
purchase_states:
  - key:
    meaning:
    retry_policy:
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
session_required_before_return:
refresh_behavior:
token_expired_behavior:
```

### C3. Failure fallback routes

```yaml
payment_success_but_no_session:
payment_pending_timeout:
magic_link_expired:
generic_fallback:
```

## Section D — API and Middleware Contract

### D1. Middleware parse contract

```yaml
middleware_owner:
parse_order:
normalization_rules:
error_logging_rules:
```

### D2. API contract

```yaml
api_endpoint_for_contract:
response_shape:
error_codes:
```

## Section E — Final Sign-off

```yaml
approved: false
approver_name:
approver_role:
approved_at:
notes:
```

## Delivery target

Return this file completed and commit with message:

`team1: lock route/entitlement/return contracts for team2`
