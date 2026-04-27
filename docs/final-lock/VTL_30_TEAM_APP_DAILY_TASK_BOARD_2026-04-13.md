# VTL TEAM APP DAILY TASK BOARD

Phiên bản: 1.0
Ngày: 2026-04-13
Trạng thái: active-execution-board
Owner: Team App Lead (Team 1 + Team 2 + Team 3 + Ops)

## Mục đích

Chuyển team app split plan thành daily execution board với:

1. owner rõ theo squad
2. deliverable hằng ngày
3. release gates và closure checks

Reference contract:

- `docs/final-lock/VTL_29_TEAM_APP_DEV_SPLIT_PLAN_2026-04-13.md`
- `docs/final-lock/VTL_32_MOBILE_AND_SUBDOMAIN_EXECUTION_PLAN_2026-04-14.md`

## Quy tắc vận hành hằng ngày

- Mỗi squad cập nhật board này lúc `09:00`, `13:30`, và `18:00` ICT.
- Chỉ dùng các trạng thái: `planned`, `in_progress`, `blocked`, `done`.
- Nếu task bị chặn bởi squad khác, phải ghi owner của blocker và ETA ngay.
- Pre-dev planning gate: không squad nào được bắt đầu code nếu plan file của cycle hiện tại còn thiếu hoặc chưa đủ.
- Công việc thanh toán vẫn nằm ngoài scope của board này.
- Từ `2026-04-19`, toàn bộ nội dung cập nhật trên board phải dùng tiếng Việt có dấu đầy đủ; tiếng Anh chỉ giữ cho thuật ngữ kỹ thuật cần thiết.

## Cycle chính hiện tại (2026-04-20)

Board daily này hiện phải chạy bên dưới:

- `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md`

Rule mới:

- không mở thêm subdomain mới
- không build `affiliate`, `wallet`, `marketplace runtime`, `community feed`
- ưu tiên tuyệt đối: `P0 -> P1`
- task nào lệch sequence phải chuyển `blocked_scope_violation`

## Làm mới local gần nhất (2026-04-14)

- Local gates are green after the latest member-app hardening pass:
  - `npm run build`
  - `npm run check`
  - `npm run smoke:access-runtime`
  - `npm run smoke:mobile-pwa`
- `member.vetuonglai.com/app/` now consumes:
  - `/api/mobile-config.json`
  - `/api/access/routing-contract.json`
  - `/api/mobile/session-states.json`
  - `/api/team3-policy-matrix.json`
- Team 2/3 mobile contract hardening is locally ready, but this does **not** close cutover:
  - Team 1 still needs post-Ops rerun for member promotion
  - Ops still owns secret injection + DNS/public reachability
- Nhắc nhở cross-team cho cycle hiện tại:
  - `docs/final-lock/VTL_37_TEAM_APP_SYNC_REMINDER_2026-04-14.md`

## Trạng thái kích hoạt hiện tại (2026-04-17)

- `npm run build`: pass
- `npm run check`: pass
- `npm run smoke:mobile-pwa`: pass
- `npm run cloudflare:smoke:endpoints`: pass for required endpoints
- `member.vetuonglai.com` still does not resolve publicly
- `vetuonglai-home` and `vetuonglai-member` still show only `SESSION_COOKIE_SECRET`
- execution moves forward under:
  - `docs/final-lock/VTL_42_NEXT_PHASE_EXECUTION_BOARD_2026-04-17.md`

Rule cho cycle này:
- do not reopen baseline cleanup
- continue mobile app + planned-domain execution in parallel with Team 1 cutover standby

## Day 1 Board (Gỡ chặn cutover + foundation)

Date target: 2026-04-14
Release gate: member cutover prerequisites complete

| Squad | Task | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| Squad D (Ops) | Inject 7 required secrets for member worker | Ops | planned | `wrangler secret list --name vetuonglai-member --format json` |
| Squad D (Ops) | Finalize DNS/custom-domain for `member.vetuonglai.com` | Ops | planned | `dig +short member.vetuonglai.com` |
| Team App Lead | Publish pre-dev planning gate and team assignment pack | Team App Lead | done | `VTL_33` |
| Squad A (Team 1) | Create/update complete plan file before coding | Team 1 | done | `VTL_34_TEAM1_EXECUTION_PLAN_2026-04-14.md` |
| Squad B (Team 2) | Create/update complete plan file before coding | Team 2 | done | `VTL_35_TEAM2_EXECUTION_PLAN_2026-04-14.md` |
| Squad C (Team 3) | Create/update complete plan file before coding | Team 3 | done | `VTL_36_TEAM3_EXECUTION_PLAN_2026-04-14.md` |
| Squad A (Team 1) | Run `npm run cloudflare:promote:member` after Ops ready | Team 1 | blocked | latest rerun (2026-04-14 11:50 ICT) reached strict deploy gate and failed-safe due 7 missing required secrets |
| Squad A (Team 1) | Re-verify access runtime contracts (`provider-status`, `policy-bindings`, `routing-contract`) | Team 1 | done | `npm run smoke:access-runtime` pass (2026-04-13 23:32 ICT) |
| Squad A (Team 1) | Restore build/check gate after docs upgrade | Team 1 | done | `npm run build && npm run check` pass (2026-04-14 11:50 ICT) |
| Squad B (Team 2) | Keep `/app/` shell stable and freeze non-payment UI scope | Team 2 | done | `npm run build`, `npm run check`, `npm run smoke:mobile-pwa` pass (2026-04-13 23:32 ICT) |
| Squad C (Team 3) | Prepare parity checklist for post-cutover trust/policy checks | Team 3 | done | checklist published in `VTL_31` Section A |

Tiêu chí hoàn tất Day 1:

- member host resolves publicly
- promotion command completes without runtime-truth drift
- no new UI scope added

## Day 2 Board (Auth + hardening dashboard)

Date target: 2026-04-15
Release gate: stable session + state mapping on mobile

| Squad | Task | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| Squad A (Team 1) | Monitor session persistence mode and fallback behavior | Team 1 | planned | `/api/access/provider-status.json` snapshot |
| Squad B (Team 2) | Validate state rendering (`visitor`, `pending_member`, `annual_active`, `pack_owner`) | Team 2 | planned | mobile screenshots/test log |
| Squad B (Team 2) | Close `DPM-001..DPM-021` regression set | Team 2 | planned | QA checklist |
| Squad C (Team 3) | Verify disclosure/trust language parity on dashboard/app shell | Team 3 | planned | parity matrix |
| Squad C (Team 3) | Lock event vocabulary and audit-field parity | Team 3 | planned | event diff report |

Tiêu chí hoàn tất Day 2:

- no session/state mismatch on mobile core routes
- disclosure/trust parity validated
- regression checklist closed

## Day 3 Board (EDU core + VC verify)

Date target: 2026-04-16
Release gate: core learning and verification flows stable

| Squad | Task | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| Squad B (Team 2) | Validate EDU list/detail/lesson player mobile flow | Team 2 | planned | user-flow test notes |
| Squad B (Team 2) | Validate VC quick verify entry flow | Team 2 | planned | test notes + route checks |
| Squad B (Team 2) | Ensure commerce CTA redirects to `vetuonglai.com` only | Team 2 | planned | deep-link verification log |
| Squad A (Team 1) | Keep mobile contract endpoints stable | Team 1 | planned | `npm run check` |
| Squad C (Team 3) | Audit telemetry event contract for EDU/VC flows | Team 3 | planned | telemetry contract pass note |

Tiêu chí hoàn tất Day 3:

- EDU + VC flows pass on required devices
- no in-app checkout route appears
- telemetry baseline is complete

## Day 4 Board (Hardening + Go/No-Go)

Date target: 2026-04-17
Release gate: full go-live checklist pass

| Squad | Task | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| Squad A (Team 1) | Run prod gate commands and publish results | Team 1 | planned | gate command logs |
| Squad B (Team 2) | Finish multi-device QA matrix and accessibility sweep | Team 2 | planned | QA matrix report |
| Squad C (Team 3) | Publish final go/no-go recommendation | Team 3 | planned | launch governance note |
| Squad D (Ops) | Confirm rollback owner and rollback command readiness | Ops | planned | rollback runbook confirmation |
| Team App Lead | Consolidate closure report | Team App Lead | planned | sync + readiness update links |

Tiêu chí hoàn tất Day 4:

- all mandatory commands pass
- no critical blocker remains open
- founder sign-off recorded

## Board cho cycle tiếp theo (superseded)

Release gate:
- keep execution moving without reopening baseline cleanup

| Squad | Task | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| Squad A (Team 1) | Rerun member DNS + secret gate checks at each Ops/Pay signal | Team 1 | blocked | `dig +short member.vetuonglai.com`, `wrangler secret list --name vetuonglai-member --format json` |
| Squad A (Team 1) | Hold `promote:member` until DNS + secret gates are actually green | Team 1 | blocked | latest runtime snapshot in `VTL_18` + `VTL_34` |
| Squad B (Team 2) | Push mobile app execution only: dashboard, EDU, VC, hub-return CTA | Team 2 | in_progress | `npm run smoke:mobile-pwa` pass + route screenshots |
| Squad B (Team 2) | Build planned-safe surfaces for `community/work/market/ai` | Team 2 | blocked | bị supersede bởi sequence mới, xem `39_EXECUTION_BOARD_VETUONGLAI_V1.md` |
| Squad C (Team 3) | Lock trust/disclosure parity on mobile core and planned-domain routes | Team 3 | in_progress | parity report + severity list |
| Squad C (Team 3) | Block any `Beta` or false-live wording on public surfaces | Team 3 | planned | copy review evidence |
| Team App Lead | Run phase under `39_EXECUTION_BOARD_VETUONGLAI_V1` and keep no-return execution rule | Team App Lead | done | `docs/00_master/39_EXECUTION_BOARD_VETUONGLAI_V1.md` |

## Checklist command gate bắt buộc

| Command | Squad owner | Status |
| --- | --- | --- |
| `npm run verify:team-app:day1` | Team App Lead | done |
| `npm run verify:team-app:day1:local` | Team App Lead | done |
| `npm run verify:team-app:day1:prod` | Squad A | done |
| `npm run verify:team-app:day1:full` | Team App Lead | done |
| `npm run build` | Squad B | done |
| `npm run check` | Squad B | done |
| `npm run smoke:access-runtime` | Squad A | done |
| `npm run smoke:mobile-pwa` | Squad B | done |
| `npm run cloudflare:smoke:endpoints` | Squad A | done |
| `npm run cloudflare:promote:member` | Squad A | planned |
| `npm run cloudflare:verify:runtime` | Squad A | done |

## Đường leo thang blocker

1. Squad owner marks task as `blocked` and writes blocker reason.
2. Mention dependency owner (Squad A/B/C/D) and ETA request.
3. If blocker remains after `13:30` update, escalate to Team App Lead.
4. If blocker remains after `18:00`, freeze non-critical tasks next day and prioritize unblock.

## Mẫu báo cáo hằng ngày

```text
### YYYY-MM-DD HH:MM ICT — Squad X
- status:
- done:
- in_progress:
- blocked:
- needed_from:
- next_24h:
- evidence:
```
