# VTL TEAM 2 — WAITING ON EXTERNALS (SLA BOARD)

Version: 1.0
Date: 2026-04-09
Status: active

## Purpose

This board tracks external dependencies from Team 1 and Team 3 required for Team 2 to continue integration safely.

## SLA Rules

- Priority `P0`: due in <= 24h
- Priority `P1`: due in <= 48h
- Priority `P2`: due in <= 72h
- If overdue, escalate to founder update and execution board

## Open Dependencies

| ID | Depends On | Priority | Request | Requested At | Due At | Status | Owner | Source File |
|---|---|---|---|---|---|---|---|---|
| T2-T1-001 | Team 1 | P0 | Route param schema lock (`entry/pack/intent/source/slug/gateway/lang/ref/return_to`) | 2026-04-09 | 2026-04-10 | accepted | TEAM_1_LOCK_OWNER | `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md` |
| T2-T1-002 | Team 1 | P1 | Entitlement names + member states lock | 2026-04-09 | 2026-04-11 | accepted | TEAM_1_LOCK_OWNER | `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md` |
| T2-T1-003 | Team 1 | P1 | Return-flow contract lock | 2026-04-09 | 2026-04-11 | accepted | TEAM_1_LOCK_OWNER | `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md` |
| T2-T3-001 | Team 3 | P1 | Trust language matrix lock | 2026-04-09 | 2026-04-11 | accepted | TEAM_3_TRUST_LOCK_OWNER | `docs/final-lock/VTL_21_TEAM_3_CONTRACT_HANDOFF_2026-04-09.md` |
| T2-T3-002 | Team 3 | P1 | Disclosure placement rules lock | 2026-04-09 | 2026-04-11 | accepted | TEAM_3_TRUST_LOCK_OWNER | `docs/final-lock/VTL_20_TEAM_2_DISCLOSURE_PLACEMENT_MAP_TEMPLATE_FOR_TEAM3.md` |
| T2-T3-003 | Team 3 | P1 | Pack-policy labels lock | 2026-04-09 | 2026-04-11 | accepted | TEAM_3_TRUST_LOCK_OWNER | `docs/final-lock/VTL_21_TEAM_3_CONTRACT_HANDOFF_2026-04-09.md` |
| T2-T3-004 | Team 3 | P2 | Annual-only affiliate-disabled copy lock | 2026-04-09 | 2026-04-12 | accepted | TEAM_3_TRUST_LOCK_OWNER | `docs/final-lock/VTL_21_TEAM_3_CONTRACT_HANDOFF_2026-04-09.md` |

## Status values

- `waiting`: request sent, no contract yet
- `in_review`: contract draft received, review running
- `accepted`: contract approved and integrated
- `blocked`: dependency cannot proceed
- `overdue`: due date passed without acceptable response

## Escalation format

When overdue:

```text
[OVERDUE] <ID>
Requested: <date>
Due: <date>
Owner: <name>
Blocking Team 2 scope: <short impact>
Required action: <what must be delivered>
```

## Integration checkpoint

Team 2 moves next integration slice only when:

- T2-T1-001 accepted
- T2-T1-002 accepted
- T2-T3-001 accepted
- T2-T3-002 accepted

Other dependencies can continue in parallel with controlled assumptions.
