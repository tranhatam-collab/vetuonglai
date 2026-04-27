# VTL TEAM 2 REQUEST CONTRACT — TEAM 3 TEMPLATE

Version: 1.0
Date: 2026-04-09
Status: pending Team 3 response
Requester: Team 2

## Instructions for Team 3

Fill this template directly. Do not answer in chat-only format.

If a field is unknown, set explicit placeholder:

- `TBD_OWNER`
- `TBD_DATE`
- `TBD_DECISION`

## Section A — Trust Language Matrix

### A1. Allowed phrases

```yaml
allowed:
  - phrase:
    context:
    notes:
```

### A2. Restricted phrases

```yaml
restricted:
  - phrase:
    reason:
    replacement:
```

### A3. Escalation rules

```yaml
requires_legal_review_if_contains:
requires_compliance_review_if_contains:
```

## Section B — Disclosure Placement Rules

### B1. Required placement by route type

```yaml
homepage_purchase_hub:
  required_blocks: []
  minimum_position:
subdomain_deep_cta_page:
  required_blocks: []
  minimum_position:
checkout_route:
  required_blocks: []
  minimum_position:
success_route:
  required_blocks: []
  minimum_position:
```

### B2. Visibility requirements

```yaml
mobile_visibility_rule:
desktop_visibility_rule:
contrast_and_readability_rule:
```

## Section C — Pack-policy Labels

### C1. Label table

```yaml
labels:
  - key:
    short_label:
    long_label:
    applies_to_pack_codes: []
    legal_note:
```

### C2. Tooltip/microcopy contract

```yaml
tooltip_rules:
microcopy_rules:
forbidden_wording:
```

## Section D — Annual-only Affiliate-disabled Copy

### D1. Required disabled-state copy

```yaml
headline:
body:
cta_primary:
cta_secondary:
```

### D2. Allowed next steps

```yaml
allowed_next_steps:
  - action:
    destination:
```

### D3. Forbidden wording

```yaml
forbidden:
  - phrase:
    reason:
```

## Section E — Launch Compliance Event Mapping

```yaml
required_events:
  - event_key:
    trigger:
    required_properties: []
```

## Section F — Final Sign-off

```yaml
approved: false
approver_name:
approver_role:
approved_at:
notes:
```

## Delivery target

Return this file completed and commit with message:

`team3: lock trust/disclosure/pack-policy contracts for team2`
