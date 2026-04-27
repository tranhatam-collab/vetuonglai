# VTL_44_5_TEAM_EXECUTION_CONTROL_BOARD_2026-04-21

Status: active
Date: 2026-04-21
Owner chính: Team 1
Audit / docs owner: Team 3
Phạm vi: board điều phối `5 team` cho lane Founder Command Panel + AI Autopilot và phần tích hợp liên team liên quan

---

## 0. Mục tiêu

File này là board điều phối hiện hành để Team 1 và founder nhìn một nơi là biết:

- `5` team đang giữ lane nào
- phần nào đã có evidence thật
- phần nào mới là audit hoặc shell
- team nào còn bao nhiêu `%`
- gate kế tiếp là gì

File này không thay thế founder spec.
File này dùng để điều phối và báo cáo tiến độ thật.

---

## 1. Audit file 36

File được kiểm:

- `docs/00_master/36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC.md`

Kết luận audit hiện hành:

- phần cốt lõi founder lock `0 -> 20` vẫn giữ được ý nghĩa chính
- có additive diff thiên về điều phối vận hành ở các section bổ sung, nhưng không làm đổi nghĩa phần spec cốt lõi
- quyết định hiện tại:
  - không overwrite file `36`
  - giữ file `36` là founder core spec
  - mọi logic điều phối team, phần trăm, dependency, report phải nằm ở `VTL_44` và `VTL_18`

---

## 2. Phân chia 5 team hiện hành

| Team | Vai trò | Owner chính | Scope khóa | Không được làm |
| --- | --- | --- | --- | --- |
| Team 1 | Lead Platform / Runtime / Release Control | Team 1 | runtime, integration, verify, final merge, progress rollup | không báo số suy đoán thiếu evidence |
| Team 2 | UI Shell / Frontend Founder Panel | Team 2 | route `/founder/`, layout, drawer, shell blocks, bind UI | không dùng mock để báo live |
| Team 3 | Docs / Governance / Audit | Team 3 | audit spec, board, report, handoff docs | không overwrite runtime truth bằng audit-only snapshot |
| Team 4 | Data / Registry / Seeds | Team 4 | panel config, metric registry, action registry, autopilot seeds | không báo metric live nếu mới là seed |
| Team 5 | Smoke / Contract / Guardrail Validation | Team 5 | smoke scripts, strict contract, guardrail probes | không chốt pass nếu chưa có runtime evidence |

---

## 3. Trạng thái hiện tại theo evidence

### Team 1

Đã xong:

- dựng `workers/lib/founder-runtime.mjs` cho:
  - `GET /api/founder/*`
  - `POST /api/autopilot/*`
- ghép dữ liệu Team 4 vào runtime:
  - `src/data/founder-command-panel.json`
  - `src/data/founder-metrics-registry.json`
  - `src/data/founder-action-registry.json`
  - `src/data/founder-autopilot-seeds.json`
- giữ alias tương thích ngược cho action ID cũ để không gãy spec/UI cũ
- thêm local gate mới:
  - `scripts/verify-founder-panel-local.mjs`
  - `npm run verify:founder-panel:local`
- nối founder verify vào `verify:team-app:day1:local`
- evidence đã pass:
  - `node scripts/build.mjs`
  - `node scripts/check.mjs`
  - `node scripts/smoke-founder-panel-runtime.mjs --self-test`
  - `node scripts/check-founder-panel-contract.mjs --self-test`
  - `node scripts/verify-founder-panel-local.mjs`
  - `npm run verify:team-app:day1:local`
- chạy `npm run cloudflare:promote:member` thành công:
  - deploy `vetuonglai-member` version `0ce93cba-59be-41ca-8273-80d12889a0d1`
  - `member.vetuonglai.com` đã được promote thành `live`
  - `requiredPublic=true` đã được khóa vào runtime truth
- sửa drift smoke của Team 1 trong `scripts/smoke-access-runtime.mjs` để khớp runtime truth mới sau promote
- rerun `npm run verify:team3:parity`:
  - verdict cuối: `go`
  - suite: `6/6` pass

Còn lại:

- chốt release note founder lane theo evidence production mới
- theo dõi hậu deploy ngắn hạn sau khi founder lane đã pass

Tiến độ:

- hoàn thành: `100%`
- còn lại: `0%`

### Team 2

Đã xong:

- route UI shell tại `vetuonglai.com/founder/`
- overview shell, grid block, action drawer, incident/audit stream ở mức shell
- build pass trong phạm vi route founder
- Team 1 đã nhận phần bind còn treo và viết xong runtime hydration thật trong:
  - `scripts/build.mjs`
  - route `/founder/` hiện lấy dữ liệu từ `GET /api/founder/overview`, `GET /api/founder/insights`, `GET /api/founder/actions/recommended`, `GET /api/founder/incidents`, `GET /api/founder/audit-log`, `GET /api/founder/deployments`
- Team 2 đã rà lại founder shell theo payload/runtime thật và dọn xong cleanup UI còn treo:
  - labels của action/deploy/incident blocks đã bám panel contract seed
  - action history + query drawer không còn rơi về raw `action_id` khi đã có nhãn action trong registry
  - local founder verify + Team 3 parity rerun đều xanh sau cleanup

Còn lại:

- không còn cleanup/handoff debt mở trong scope UI founder shell của Team 2

Tiến độ:

- hoàn thành: `100%`
- còn lại: `0%`

Ghi chú:

- Team 2 không còn blocker và cũng không còn debt mở trong founder lane
- phần ký nhận còn lại là gate QA/PM của lane, không còn là phần việc thực thi của Team 2

### Team 3

Đã xong:

- audit file `36` ở mức docs
- thêm parity verifier dùng được ngay cho Team 3:
  - `scripts/verify-team3-parity.mjs`
  - `npm run verify:team3:parity`
- xuất evidence mới:
  - `reports/team3-parity.latest.json`
- cập nhật tài liệu parity/cutover liên quan:
  - `docs/00_master/32_RUNTIME_TRUTH_MATRIX_V1.md`
  - `docs/final-lock/VTL_25_MEMBER_SECRET_CHECKLIST_2026-04-10.md`
- chốt parity cuối sau promote member:
  - verdict `go`
  - không còn stop-line mở trong scope parity hiện tại

Còn lại:

- không còn việc mở trong scope handoff docs hiện tại

Tiến độ:

- hoàn thành: `100%`
- còn lại: `0%`

### Team 4

Đã xong:

- bàn giao đầy đủ source data:
  - `src/data/founder-command-panel.json`
  - `src/data/founder-metrics-registry.json`
  - `src/data/founder-action-registry.json`
  - `src/data/founder-autopilot-seeds.json`
- dữ liệu đã được Team 1 ghép vào runtime thật

Còn lại:

- không còn blocker trong lane hiện tại

Tiến độ:

- hoàn thành: `100%`
- còn lại: `0%`

### Team 5

Đã xong:

- `scripts/founder-api-contract.mjs`
- `scripts/smoke-founder-panel-runtime.mjs`
- `scripts/check-founder-panel-contract.mjs`
- `scripts/verify-founder-lane-release.mjs`
- self-test xanh
- contract shape đã được Team 1 vá và verify local xanh
- `npm run verify:founder-lane:release:self-test` đã pass
- có release wrapper để chạy đúng chuỗi:
  - smoke runtime
  - contract check
  - release verification
- đã chạy live verification trên `https://member.vetuonglai.com` với header vai trò:
  - `x-founder-role: founder`
- evidence live mới nhất:
  - sau redeploy, toàn bộ smoke founder/autopilot pass
  - strict founder/autopilot pass với auth hợp lệ
  - release wrapper trả `release_ready: true`

Còn lại:

- không còn blocker trong founder lane
- chỉ còn theo dõi hậu deploy ngắn hạn nếu PM/QA yêu cầu

Tiến độ:

- hoàn thành: `100%`
- còn lại: `0%`

---

## 4. Dependency map hiện hành

| Team 1 cần từ | Nội dung phải có | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| Team 2 | bind UI shell vào payload founder runtime thật | done by Team 1 takeover + Team 2 cleanup closed | không còn blocker lane, cleanup/handoff UI shell đã đóng |
| Team 3 | parity verifier + verdict cuối cho lane member/runtime truth | done | Team 3 parity đã `go`, không còn stop-line mở |
| Team 4 | source data founder | done | đã tích hợp xong vào runtime |
| Team 5 | smoke/release verification trên môi trường deploy thật | done | live smoke + strict + release verification đã pass sau redeploy home/member |

---

## 5. Tổng phần trăm của lane Founder Panel + Autopilot

Ước lượng hiện tại theo bằng chứng đã có:

- tổng hoàn thành: `100%`
- tổng còn lại: `0%`

Ghi chú:

- đây là phần trăm của lane `Founder Command Panel + AI Autopilot`
- không phải phần trăm toàn bộ hệ `*.vetuonglai.com`
- không còn debt thực thi mở giữa các team trong lane này; phần còn lại chỉ là thao tác ký nhận QA/PM theo evidence đã đủ
- cách tính hiện tại là rollup theo trọng số thực thi:
  - Team 1 = `40%`
  - Team 2 = `25%`
  - Team 3 = `10%`
  - Team 4 = `10%`
  - Team 5 = `15%`

---

## 6. Gate kế tiếp bắt buộc

1. QA/PM ký nhận founder lane theo evidence production thật + parity cuối của Team 3
2. Team 1 khóa release note ngắn cho founder/member promote
3. Team 1 chuyển sang lane kế tiếp sau khi QA/PM ký nhận xong

Tài liệu dùng cho gate này:

- `docs/final-lock/VTL_45_FOUNDER_MEMBER_RELEASE_NOTE_2026-04-21.md`
- `docs/final-lock/VTL_46_QA_PM_SIGNOFF_CHECKLIST_FOUNDER_LANE_2026-04-21.md`

---

## 7. Evidence tham chiếu nhanh

- runtime core:
  - `workers/lib/founder-runtime.mjs`
- local verify:
  - `scripts/verify-founder-panel-local.mjs`
- contract / smoke:
  - `scripts/founder-api-contract.mjs`
  - `scripts/smoke-founder-panel-runtime.mjs`
  - `scripts/check-founder-panel-contract.mjs`
  - `scripts/verify-team3-parity.mjs`
- UI shell:
  - `scripts/build.mjs`
  - `dist/vetuonglai.com/founder/index.html`
- seed / registry:
  - `src/data/founder-command-panel.json`
  - `src/data/founder-metrics-registry.json`
  - `src/data/founder-action-registry.json`
  - `src/data/founder-autopilot-seeds.json`
- runtime truth / parity:
  - `cloudflare/domain-runtime-truth.json`
  - `reports/team3-parity.latest.json`

---

## 8. Câu chốt

Board này phải phản ánh đúng trạng thái thật.
Audit không được đè lên runtime truth.
Spec không được trộn với progress report.
