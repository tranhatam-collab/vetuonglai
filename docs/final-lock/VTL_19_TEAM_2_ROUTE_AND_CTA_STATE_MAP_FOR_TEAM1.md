# VTL TEAM 2 ROUTE-STATE + CTA-STATE MAP FOR TEAM 1

Version: 1.0
Date: 2026-04-09
Status: handoff_ready_for_team1_consume
Owner: Team 2 — Hub, Domain Experience, Content Surfaces
Primary consumer: Team 1 — Platform, Access, Commerce Core

## Purpose

This file gives Team 1 a direct, table-based map of Team 2 routing and CTA states so middleware/runtime can consume Team 2 payloads without guessing.

## Source Inputs

- `scripts/build.mjs` (Team 2 CTA generation helpers)
- `dist/vetuonglai.com/api/team2-kickoff-output.json`
- `dist/vetuonglai.com/api/purchase-hub.json`
- `dist/member.vetuonglai.com/api/routing.json`
- `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md`

## Dependency IDs

- `T2-T1-001`: route parameter schema lock
- `T2-T1-002`: entitlement names + member states lock
- `T2-T1-003`: return-flow contract lock

## Canonical Routing Envelope (Team 2 -> Team 1)

- Destination hub: `https://vetuonglai.com/`
- Team 2 currently emits: `entry`, `pack`, `intent` (canonical), `source`, `slug`
- Team 1 checkout/runtime currently requires: `entry`, `intent`, `pack`, `gateway`, `lang`, `ref`, `return_to`
- Team 2 requested parse order for compatibility: `entry`, `pack`, `intent`, `source`, `slug`, `gateway`, `lang`, `ref`, `return_to`

## Intent Normalization Map Requested to Team 1

| Team 2 intent emitted | Team 1 canonical intent target | Notes for Team 1 parser |
| --- | --- | --- |
| `annual` | `annual-access` | homepage annual button |
| `pack` | `specialist-pack` | homepage specialist button |
| `course-depth` | `specialist-pack` | edu deep CTA |
| `course-card` | `specialist-pack` | edu card CTA, may include `slug` |
| `course-list` | `specialist-pack` | edu list CTA |
| `course-list-item` | `specialist-pack` | edu list-item CTA, includes `slug` |
| `course-detail` | `specialist-pack` | edu detail CTA, includes `slug` |
| `job-apply` | `specialist-pack` | work deep apply CTA |
| `brief` | `specialist-pack` | work brief CTA |
| `market-buy` | `specialist-pack` | market deep buy CTA |
| `market-rules` | `specialist-pack` | market rules CTA |
| `green-depth` | `specialist-pack` | green deep CTA |
| `finance-depth` | `specialist-pack` | finance deep CTA |
| `life-depth` | `specialist-pack` | life deep CTA |
| `invest-depth` | `specialist-pack` | invest deep CTA |
| `member-depth` | `specialist-pack` | member deep CTA |
| `journey` | `specialist-pack` | member journey CTA |

## Route-State Map

| Route State ID | Source surface | Team 2 CTA sample | Required params (Team 2) | Team 1 normalized payload target | User state expectation | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| `RS-001` | Hub `/#start-here` annual action | `https://vetuonglai.com/?entry=hub&pack=g1&intent=annual-access&source=hub-start` | `entry`, `pack`, `intent`, `source` | `entry=hub`, `intent=annual-access`, `pack=g1` | visitor/pending can start annual flow | `T2-T1-001` |
| `RS-002` | Hub `/#start-here` specialist action | `https://vetuonglai.com/?entry=hub&pack=g6&intent=specialist-pack&source=hub-start` | `entry`, `pack`, `intent`, `source` | `entry=hub`, `intent=specialist-pack`, `pack=g6` | annual member upgrades to specialist path | `T2-T1-001` |
| `RS-003` | EDU deep CTA | `https://vetuonglai.com/?entry=edu&pack=g6&intent=specialist-pack&source=edu-home` | `entry`, `pack`, `intent`, `source` | `entry=edu`, `intent=specialist-pack`, `pack=g6` | deep-content request routes to hub | `T2-T1-001` |
| `RS-004` | EDU course detail CTA | `https://vetuonglai.com/?entry=edu&pack=g6&intent=specialist-pack&source=edu-course-detail&slug=<course-slug>` | `entry`, `pack`, `intent`, `source`, `slug` | `entry=edu`, `intent=specialist-pack`, `pack=g6`, keep `slug` as metadata | preserve context for return/content continuity | `T2-T1-001` + `T2-T1-003` |
| `RS-005` | WORK deep CTA | `https://vetuonglai.com/?entry=work&pack=g4&intent=specialist-pack&source=work-home` | `entry`, `pack`, `intent`, `source` | `entry=work`, `intent=specialist-pack`, `pack=g4` | apply intent gated by annual + pack state | `T2-T1-001` + `T2-T1-002` |
| `RS-006` | WORK brief CTA | `https://vetuonglai.com/?entry=work&pack=g4&intent=specialist-pack&source=work-brief` | `entry`, `pack`, `intent`, `source` | `entry=work`, `intent=specialist-pack`, `pack=g4` | same entitlement checks as deep apply | `T2-T1-001` + `T2-T1-002` |
| `RS-007` | MARKET deep CTA | `https://vetuonglai.com/?entry=market&pack=g6&intent=specialist-pack&source=market-home` | `entry`, `pack`, `intent`, `source` | `entry=market`, `intent=specialist-pack`, `pack=g6` | market-buy requires normalized specialist path | `T2-T1-001` + `T2-T1-002` |
| `RS-008` | MARKET rules CTA | `https://vetuonglai.com/?entry=market&pack=g6&intent=specialist-pack&source=market-rules` | `entry`, `pack`, `intent`, `source` | `entry=market`, `intent=specialist-pack`, `pack=g6` | preserve source for compliance/rules trace | `T2-T1-001` |
| `RS-009` | GREEN deep CTA | `https://vetuonglai.com/?entry=green&pack=g7&intent=specialist-pack&source=green-home` | `entry`, `pack`, `intent`, `source` | `entry=green`, `intent=specialist-pack`, `pack=g7` | specialist depth routing | `T2-T1-001` |
| `RS-010` | FINANCE deep CTA | `https://vetuonglai.com/?entry=finance&pack=g2&intent=specialist-pack&source=finance-home` | `entry`, `pack`, `intent`, `source` | `entry=finance`, `intent=specialist-pack`, `pack=g2` | specialist depth routing | `T2-T1-001` |
| `RS-011` | LIFE deep CTA | `https://vetuonglai.com/?entry=life&pack=g3&intent=specialist-pack&source=life-home` | `entry`, `pack`, `intent`, `source` | `entry=life`, `intent=specialist-pack`, `pack=g3` | specialist depth routing | `T2-T1-001` |
| `RS-012` | INVEST deep CTA | `https://vetuonglai.com/?entry=invest&pack=g5&intent=specialist-pack&source=invest-home` | `entry`, `pack`, `intent`, `source` | `entry=invest`, `intent=specialist-pack`, `pack=g5` | specialist depth routing | `T2-T1-001` |
| `RS-013` | MEMBER deep CTA | `https://vetuonglai.com/?entry=member&pack=g1&intent=specialist-pack&source=member-home` | `entry`, `pack`, `intent`, `source` | `entry=member`, `intent=specialist-pack`, `pack=g1` | member context still routes through hub contract | `T2-T1-001` + `T2-T1-002` |
| `RS-014` | MEMBER journey CTA | `https://vetuonglai.com/?entry=member&pack=g1&intent=specialist-pack&source=member-journey` | `entry`, `pack`, `intent`, `source` | `entry=member`, `intent=specialist-pack`, `pack=g1` | preserve journey context for return route | `T2-T1-001` + `T2-T1-003` |

## CTA-State Map (Direct Team 1 Integration View)

| CTA State ID | Surface component | CTA goal | Payload sent from Team 2 | Team 1 route/API expected | Team 1 response contract expected | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| `CS-001` | `purchase_hub` | open annual checkout | `entry`, `intent=annual-access`, `pack=g1`, `source` + user gateway choice | `POST /api/access/checkout/resolve` | checkout URL + normalized payload + return target | `T2-T1-001` + `T2-T1-003` |
| `CS-002` | `package_chooser` | open specialist checkout | `entry`, `intent=specialist-pack`, `pack=gX`, `source`, optional `slug` | `POST /api/access/checkout/resolve` | pack-specific checkout URL + normalized payload | `T2-T1-001` |
| `CS-003` | subdomain deep CTA | redirect to homepage with preselect context | URL query from route state map (`RS-003`...`RS-014`) | Team 1 parser/middleware consume on hub | deterministic normalization + no hard failure on `source`/`slug` | `T2-T1-001` |
| `CS-004` | `start_here` | member orientation entry | homepage preselect link then member checks | `GET /api/access/session/current` | state-driven branch (`visitor`, `pending_member`, `annual_active`, `pack_owner`, etc.) | `T2-T1-002` |
| `CS-005` | return-from-payment success | continue to member route | normalized `return_to` or fallback | Team 1 return-flow policy | deterministic precedence: source -> dashboard -> homepage | `T2-T1-003` |
| `CS-006` | return-from-payment pending/failure | safe fallback routing | same context + retry signal | Team 1 fallback route table | stable fallback links (`/unlock/`, `/unlock/login/`, `/bat-dau/`) | `T2-T1-003` |

## Team 1 Immediate Consume Checklist

- Confirm alias normalization for Team 2 intent values in this file.
- Confirm whether `source` and `slug` are:
  - accepted as optional metadata, or
  - dropped deterministically without error.
- Confirm canonical behavior when `gateway` is not yet selected at deep CTA stage.
- Confirm final return precedence and fallback routes for `return_to`.
- Write final lock answers into:
  - `docs/final-lock/VTL_11_TEAM_2_REQUEST_CONTRACT_TEAM1_READY_TO_FILL.md`
  - `docs/final-lock/VTL_11_TEAM_2_WAITING_ON_EXTERNALS.md` (status transition)

## Open Contract Questions (Need Team 1 Lock)

1. Should Team 1 parser keep supporting legacy depth-intent aliases for backward compatibility, even though Team 2 now emits canonical intents?
2. Should `source` and `slug` be logged in resolver responses for traceability and return-flow continuity?
3. Should unknown `pack` values hard-fail or degrade to deterministic `g1` with warning?
