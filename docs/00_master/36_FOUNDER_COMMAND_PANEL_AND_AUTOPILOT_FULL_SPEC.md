# 36_FOUNDER_COMMAND_PANEL_AND_AUTOPILOT_FULL_SPEC

Status: LOCKED (Non-negotiable)
Scope: Founder Command Panel + AI Autopilot cho toàn bộ `*.vetuonglai.com`
Áp dụng cho: Team 1 · Team 2 · Team 3 · Team 4 · Team 5 · PM · Ops · Founder
Nguồn hợp nhất từ:
- `docs/00_master/34_FOUNDER_COMMAND_PANEL_AI_SYSTEM.md`
- `docs/00_master/35_FOUNDER_AI_AUTOPILOT_SYSTEM.md`

---

## 0. Mục tiêu

Xây một hệ thống điều hành cấp founder cho toàn bộ `*.vetuonglai.com` với `2` lớp:

- `Founder Command Panel`
  Giao diện duy nhất để quan sát, hiểu, và ra quyết định.
- `AI Autopilot`
  Lớp phân tích, đề xuất, và thực thi có kiểm soát cho các action an toàn.

Hệ này không phải dashboard xem cho đẹp.
Nó phải giúp trả lời `5` câu hỏi thật:

- Hệ có đang chạy thật không?
- Người dùng đang dừng ở đâu?
- Domain nào đang yếu nhất?
- Cần sửa gì ngay hôm nay?
- Cái gì được phép cho AI tự làm, cái gì không?

---

## 1. Vai trò của hệ

### 1.1 Founder Command Panel là gì

Là giao diện duy nhất cho founder và cấp điều hành để:

- xem `system truth`
- xem `user truth`
- xem `trust truth`
- xem `economy readiness`
- kích hoạt action

### 1.2 AI Autopilot là gì

Là lớp AI ngồi phía sau để:

- đọc dữ liệu
- phát hiện bottleneck
- đưa ra insight
- đề xuất next action
- tự thực thi các action `LOW_RISK` đã whitelist

### 1.3 Quan hệ giữa 2 lớp

- `Command Panel` = nơi con người thấy và quyết định
- `Autopilot` = nơi AI quan sát, lý giải, đề xuất, hỗ trợ hành động

---

## 2. Kiến trúc tổng thể

```text
[Users / Content / EDU / VC / Member / Logs / Analytics]
                      ↓
              [api.vetuonglai.com]
                      ↓
          [Command Panel Backend Layer]
      - aggregation service
      - metrics service
      - journey truth service
      - incident service
      - action registry
                      ↓
           [Autopilot Intelligence Layer]
      - observer
      - analyzer
      - recommender
      - verifier
      - action executor
                      ↓
              [Founder Command Panel UI]
```

---

## 3. Người dùng hệ này

### 3.1 Founder

Toàn quyền xem và kích hoạt.

### 3.2 PM / Ops Lead

Được xem gần như toàn bộ, action có giới hạn.

### 3.3 QA Lead

Xem health, incidents, regressions.

### 3.4 Tech Lead

Xem system health, deploy, latency, errors, API integrity.

### 3.5 Content Lead

Xem content performance, CTA performance, teaser performance.

---

## 4. Phạm vi V1

V1 chỉ build những thứ này:

### 4.1 Quan sát

- system health
- user journey truth
- learning / proof flow
- incidents
- deployment state
- AI insights

### 4.2 Hành động thủ công

- pause feature
- toggle `LOW_RISK` flags
- request retest
- lock domain from public CTA
- switch routing priority
- force content review queue boost

### 4.3 Hành động AI bán tự động

- đề xuất
- auto-run low-risk whitelisted actions
- verify before/after

V1 chưa làm:

- tự deploy code
- tự sửa content hàng loạt
- tự đổi pricing
- tự đổi legal / policy
- tự mở domain mới

---

## 5. UI tổng thể

### 5.1 Cấu trúc một màn hình

- Top Bar
- Left Nav
- Main System Grid
- Right Insight / Action Drawer
- Bottom Activity / Audit Stream

### 5.2 Top Bar

Hiển thị:

- environment: `staging / production`
- current version
- critical alert count
- active incidents
- founder search / command input
- manual override state

### 5.3 Left Nav

- Overview
- System Health
- User Journey
- Learning & Proof
- Domain Performance
- AI Insights
- Incidents
- Actions
- Audit Log
- Deployments
- Settings

### 5.4 Main Grid

Các block dữ liệu chính.

### 5.5 Right Drawer

Chi tiết insight / recommendation / action panel.

### 5.6 Bottom Stream

Recent events:

- errors
- actions
- deploys
- VC spikes
- submit drops

---

## 6. UI blocks chi tiết

### 6.1 Block A — System Health

Mục tiêu: nhìn `10` giây là biết hệ có ổn không.

Hiển thị:

- Hub
- Member
- EDU
- Submission
- VC
- Dashboard
- Journey Engine
- Payment / Access
- Search
- AI layer

Mỗi item có:

- status: `OK / Warning / Critical`
- latency
- errors last `1h`
- last incident time

Trạng thái:

- xanh: ổn
- vàng: cần xem
- đỏ: có rủi ro trực tiếp
- xám: chưa bật / not in scope

### 6.2 Block B — User Journey Truth

Hiển thị:

- Total users
- Activated users
- Learners
- Users with submissions
- Users with VC
- Users stuck
- Users with next step missing

Funnel:

`Discover -> Join -> Learn -> Submit -> Prove -> Next`

Mỗi bước có:

- total count
- conversion to next
- delta vs previous `7 days`

### 6.3 Block C — Learning & Proof

Hiển thị:

- courses live
- lessons completed
- submissions today
- review backlog
- VC issued today
- submit -> VC conversion
- average review time

### 6.4 Block D — Domain Performance

Hiển thị từng domain:

- traffic
- CTA click-through
- teaser engagement
- next-step conversion
- drop rate
- active incidents

Domain list:

- hub
- edu
- life
- finance
- invest
- green
- vc
- member

Các domain chưa live thì có badge `Planned`.

### 6.5 Block E — AI Insight

Hiển thị `3` loại insight:

- critical
- operational
- optimization

Ví dụ:

- Submit rate down `28%` in mobile users
- VC issuance backlog growing in last `24h`
- Finance pages high trust, low onward conversion

Mỗi insight phải có:

- title
- explanation
- confidence
- affected area
- recommendation
- risk level

### 6.6 Block F — Actions

Hiển thị:

- recommended actions
- manual actions
- recently applied actions
- success / fail rate

Ví dụ action:

- Enable simple submit mode
- Demote broken CTA route
- Promote Finance teaser on hub
- Pause Invest CTA for public

### 6.7 Block G — Incident Stream

Hiển thị:

- new errors
- flow breaks
- login failures
- payment failures
- submission failures
- VC issue failures

Mỗi incident có:

- severity
- owner
- created_at
- status
- root hypothesis

### 6.8 Block H — Audit Log

Hiển thị:

- who did what
- when
- why
- what changed
- result
- rollback available or not

---

## 7. Founder Command Input

### 7.1 Mục tiêu

Founder có thể gõ ngắn gọn và hệ hiểu đúng.

Ví dụ:

- `show me the weakest domain`
- `why are users dropping after lesson 2`
- `what should we fix today`
- `pause any CTA to invest`
- `show vc issuance bottlenecks`
- `compare last 7 days and last 30 days`

### 7.2 Output format

AI phải trả về:

- summary
- evidence
- recommendation
- action options

---

## 8. API tổng thể

### 8.1 Overview APIs

#### `GET /api/founder/overview`

Trả về snapshot toàn hệ.

```json
{
  "environment": "production",
  "version": "v1.0.0",
  "system_health": {},
  "journey_summary": {},
  "domain_summary": {},
  "critical_alerts": []
}
```

#### `GET /api/founder/system-health`

Trả về health từng service / domain.

#### `GET /api/founder/journey-funnel`

Trả về funnel `Discover -> Join -> Learn -> Submit -> Prove -> Next`.

#### `GET /api/founder/domains`

Trả về metric từng domain.

### 8.2 Learning & Proof APIs

#### `GET /api/founder/learning-summary`

- courses live
- completions
- submissions
- review backlog

#### `GET /api/founder/vc-summary`

- issued count
- failure count
- backlog
- avg issuance time

#### `GET /api/founder/review-queue`

Danh sách submission chờ review.

### 8.3 Insight APIs

#### `GET /api/founder/insights`

Query params:

- `type=critical|operational|optimization`
- `limit=10`

```json
{
  "items": [
    {
      "id": "ins_001",
      "type": "critical",
      "title": "Submission drop after lesson 2",
      "confidence": 0.84,
      "evidence": [
        "mobile submit completion fell from 41% to 23%"
      ],
      "recommendation": [
        "Enable simple submit form",
        "Add inline guidance"
      ],
      "risk_level": "R2"
    }
  ]
}
```

#### `POST /api/founder/insights/query`

```json
{
  "query": "what should we fix today"
}
```

```json
{
  "summary": "...",
  "evidence": [],
  "recommendations": [],
  "actions": []
}
```

### 8.4 Action APIs

#### `GET /api/founder/actions/recommended`

Trả action AI đề xuất.

#### `POST /api/founder/actions/apply`

```json
{
  "action_id": "act_simple_submit_mode",
  "approved_by": "founder_user_id",
  "reason": "Submission drop in mobile"
}
```

```json
{
  "success": true,
  "execution_id": "exec_123",
  "rollback_available": true
}
```

#### `POST /api/founder/actions/rollback`

Rollback action trước đó.

#### `GET /api/founder/actions/history`

Lịch sử action.

### 8.5 Incident APIs

- `GET /api/founder/incidents`
- `POST /api/founder/incidents/:id/assign`
- `POST /api/founder/incidents/:id/resolve`

### 8.6 Audit APIs

- `GET /api/founder/audit-log`
- `GET /api/founder/deployments`

---

## 9. API contracts nội bộ cho AI Autopilot

### 9.1 Observer contract

Nguồn dữ liệu chuẩn:

- user activation
- journey steps
- submissions
- vc issuance
- content interactions
- latency / errors

#### `GET /api/autopilot/observe`

Snapshot đã chuẩn hóa cho AI dùng.

### 9.2 Analyzer contract

#### `POST /api/autopilot/analyze`

```json
{
  "window": "7d",
  "compare_to": "prev_7d"
}
```

```json
{
  "findings": [],
  "anomalies": [],
  "bottlenecks": []
}
```

### 9.3 Recommender contract

#### `POST /api/autopilot/recommend`

```json
{
  "finding_ids": ["find_01", "find_02"]
}
```

```json
{
  "recommendations": [
    {
      "id": "rec_01",
      "title": "Simplify mobile submission",
      "tier": "LOW_RISK",
      "confidence": 0.81,
      "expected_effect": "submit rate +8% to +15%"
    }
  ]
}
```

### 9.4 Executor contract

- `POST /api/autopilot/execute`
- `POST /api/autopilot/verify`

`execute` chỉ được phép cho action `LOW_RISK` nếu `autopilot_mode=limited`.

---

## 10. Action Registry

Mọi action phải được đăng ký trước, không cho AI tự phát minh action mới.

| action_id | name | tier | description | rollback |
| --- | --- | --- | --- | --- |
| `act_simple_submit_mode` | Simple Submit Mode | LOW | Rút gọn form submit mobile | yes |
| `act_disable_invest_cta_public` | Disable Invest Public CTA | LOW | Ẩn CTA công khai tới Invest | yes |
| `act_promote_finance_entry_block` | Promote Finance Entry Block | LOW | Đưa finance block lên cao hơn trên hub | yes |
| `act_change_pricing` | Change Pricing | HIGH | Thay đổi pricing | no |

---

## 11. Permission model

### Founder

- xem toàn bộ
- apply `MEDIUM / HIGH` sau confirm
- approve actions
- rollback

### PM / Ops Lead

- apply `LOW / MEDIUM` nếu được cấp quyền
- xem gần như toàn bộ

### QA Lead

- xem, không apply production actions

### AI Autopilot

- chỉ execute `LOW_RISK` whitelisted khi `autopilot_mode=limited`

---

## 12. Database schema bổ sung

### `founder_insights`

```sql
CREATE TABLE founder_insights (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  confidence NUMERIC(4,3),
  risk_level TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `action_registry`

```sql
CREATE TABLE action_registry (
  action_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  description TEXT NOT NULL,
  rollback_supported BOOLEAN NOT NULL DEFAULT FALSE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);
```

### `action_executions`

```sql
CREATE TABLE action_executions (
  id UUID PRIMARY KEY,
  action_id TEXT NOT NULL REFERENCES action_registry(action_id),
  triggered_by TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL,
  before_snapshot JSONB,
  after_snapshot JSONB,
  rollback_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### `system_incidents`

```sql
CREATE TABLE system_incidents (
  id UUID PRIMARY KEY,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT,
  status TEXT NOT NULL,
  owner_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP
);
```

### `system_health_snapshots`

```sql
CREATE TABLE system_health_snapshots (
  id UUID PRIMARY KEY,
  environment TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 13. UI wireframe logic

### 13.1 Overview page

```text
┌──────────────────────────────────────────────┐
│ Top bar: env | version | alerts | command    │
├───────────────┬──────────────────────────────┤
│ Left Nav      │ Main Grid                    │
│               │ [System Health]              │
│               │ [User Journey Truth]         │
│               │ [Learning & Proof]           │
│               │ [Domain Performance]         │
│               │ [AI Insights]                │
├───────────────┴──────────────────────────────┤
│ Audit / Incidents / Deploy Stream            │
└──────────────────────────────────────────────┘
```

### 13.2 Insight drawer

Khi click một insight:

- hiện explanation
- evidence
- recommendation
- action options
- rollback availability

### 13.3 Action modal

Khi apply action:

- confirm text
- tier
- expected impact
- rollback support
- require note from founder

---

## 14. UX rules

- Không overload màu
- Không biến panel thành terminal
- Không trộn analytics kiểu vanity
- Mỗi block phải giúp ra quyết định
- Dùng câu ngắn, rõ

Dùng:

- `Submission dropped 18% on mobile`
- `VC issuance backlog reached 43 items`
- `Finance entry block outperforms EDU on trust conversion`

Không dùng:

- `Amazing opportunity`
- `Performance is excellent`
- `Users love this`

---

## 15. AI prompt system cho panel

### System prompt

AI dùng trong Command Panel phải:

- nói ngắn, rõ
- không hype
- không đoán nếu thiếu dữ liệu
- luôn nêu evidence
- luôn cho phương án hành động rõ

### Output schema bắt buộc

```json
{
  "summary": "",
  "evidence": [],
  "risk_level": "R1|R2|R3|R4",
  "recommendations": [],
  "actions": []
}
```

### Guardrails

- không tự đề xuất thay legal / policy
- không tự đề xuất đổi pricing nếu không được hỏi
- không khẳng định nguyên nhân nếu chỉ có tương quan

---

## 16. Action tiers implementation

### LOW_RISK

Cho phép:

- reorder blocks
- switch simple mode
- adjust threshold
- disable broken CTA
- promote safer domain entry

### MEDIUM_RISK

Cho phép sau approve:

- change step order in flow
- change default next-step rules
- expose / hide a section on a page

### HIGH_RISK

Không cho autopilot:

- pricing changes
- legal copy changes
- domain opening / closing
- deploy code
- deleting data
- changing entitlement model

---

## 17. Verification loop

Mọi action sau khi chạy phải đi qua vòng:

`Before metrics -> Apply action -> Wait window -> Compare after metrics -> Mark improved / neutral / worse`

Nếu `worse`:

- mở rollback
- cảnh báo founder
- lưu `lesson learned`

---

## 18. Metrics cần hiển thị

### Core

- activation rate
- learn -> submit
- submit -> VC
- VC per active learner
- users stuck without next step

### Domain

- CTA CTR
- teaser engagement
- domain drop
- journey onward conversion

### Reliability

- error rate
- P0 incidents
- latency
- deploy failures

---

## 19. Definition of Done

Spec này chỉ được coi là hoàn thành khi team build được:

- `1` trang Overview hoạt động thật
- ít nhất `5` block dữ liệu thật
- AI insight query hoạt động
- action registry hoạt động
- apply `1` low-risk action thành công
- audit log ghi đúng
- rollback được `1` action

---

## 20. Thứ tự build khuyến nghị

### Sprint 1

- data aggregation
- overview page
- system health
- journey funnel
- audit log

### Sprint 2

- AI insights
- domain performance
- incident stream

### Sprint 3

- action registry
- manual apply actions
- rollback

### Sprint 4

- limited autopilot
- before / after verification
- learning memory

---

## 21. Phân công 5 team (khóa cứng)

### Team 1 — Lead Platform / Runtime / Release Control

Owner:

- auth / permissions cho founder panel
- guardrails `apply / rollback`
- integration cuối giữa panel, action registry, runtime flags, deploy state
- release gate cuối cùng và báo cáo liên team

### Team 2 — Panel UI / Frontend / Experience Surfaces

Owner:

- Founder Command Panel UI
- overview layout, block rendering, drawer, action modal
- responsive / readability / state presentation
- consume các API `/api/founder/*`

### Team 3 — Docs / Ops / Governance / QA Gate

Owner:

- spec / runbook / board / reporting model
- rule `% hoàn thành / % còn lại`
- trust wording cho panel insights / action labels
- gate review cho `LOW / MEDIUM / HIGH`
- incident, audit, release documentation parity

### Team 4 — Data / Metrics / Founder Backend Layer

Owner:

- aggregation service
- metrics service
- journey truth service
- incident service
- audit stream
- health snapshots
- founder backend read APIs

### Team 5 — AI / Autopilot / Intelligence Layer

Owner:

- observer
- analyzer
- recommender
- verifier
- limited executor
- insight query
- recommendation confidence + risk scoring

---

## 22. Dependency khóa cho Team 1

Team 1 là lead và chỉ được nhận integration khi các dependency sau đã rõ:

### Từ Team 2

- UI contract cho `Overview`, `Insight Drawer`, `Action Modal`
- mapping block -> API field rõ ràng
- state render cho `OK / Warning / Critical / Planned`

### Từ Team 3

- action tier policy final
- founder approval wording final
- mẫu báo cáo `% hoàn thành / % còn lại`
- incident severity vocabulary final
- trust-safe prompt / copy rules cho panel

### Từ Team 4

- `GET /api/founder/overview`
- `GET /api/founder/system-health`
- `GET /api/founder/journey-funnel`
- `GET /api/founder/domains`
- `GET /api/founder/learning-summary`
- `GET /api/founder/vc-summary`
- `GET /api/founder/review-queue`
- `GET /api/founder/incidents`
- `GET /api/founder/audit-log`
- `GET /api/founder/deployments`

### Từ Team 5

- `GET /api/founder/insights`
- `POST /api/founder/insights/query`
- `GET /api/founder/actions/recommended`
- `GET /api/autopilot/observe`
- `POST /api/autopilot/analyze`
- `POST /api/autopilot/recommend`
- `POST /api/autopilot/execute`
- `POST /api/autopilot/verify`

Nếu thiếu một contract ở trên, Team 1 không được gắn nhãn `integration_done`.

---

## 23. Rule báo cáo tiến độ cho spec này

Sau mỗi lượt dev, mọi team bắt buộc báo:

- `% hoàn thành lane`
- `% còn lại lane`
- deliverable nào đã chuyển `done`
- evidence nào xác nhận việc đó
- dependency nào còn treo sang Team 1

Công thức chuẩn:

- `% hoàn thành = (deliverable_done / deliverable_total) * 100`
- `% còn lại = 100 - % hoàn thành`

Không dùng phần trăm cảm tính.

---

## 24. Câu chốt

Đây không phải dashboard.
Đây là bộ điều hành hệ có AI hỗ trợ, nhưng vẫn đặt founder ở vị trí quyết định cuối cùng.
