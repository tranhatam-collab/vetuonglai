# 18_PHASE_2_CHECKLIST_MOBILE_AND_PLANNED_SUBDOMAINS

## Mục đích của file

Checklist thực thi phase tiếp theo cho `5 team dev` sau khi đã chốt pass brand consistency.

Phạm vi file này:

- mobile app V1 (`PWA-first`, non-payment)
- planned subdomains (`planned-safe` theo runtime truth)
- founder command panel backend và AI contracts ở mức nội bộ
- cơ chế giao việc theo `5 team split` + cổng kiểm tra bắt buộc trước deploy

---

## 0) Pre-Dev Gate (bắt buộc)

Trước khi code bất kỳ task mới nào:

1. Team phải có file kế hoạch phiên hiện tại (`scope + owner + dependency + test gates + done criteria`).
2. Team lead ghi trạng thái `plan_ready`.
3. Team 1 phải ghi baseline `% hoàn thành / % còn lại` cho lane đó.
4. Nếu thiếu file kế hoạch: gắn `blocked_plan_missing`, không merge, không deploy.

---

## 1) Phase map

### Phase 2A — Mobile V1 closure (core)

- Domain trọng tâm: `member`, `edu`, `vc`, `vetuonglai.com/app/`
- Mục tiêu: user login được, vào dashboard, học EDU, mở VC verify, CTA commerce về hub đúng contract

### Phase 2B — Planned subdomain scaffolding (`planned-safe`)

- Domain trọng tâm: `community`, `work`, `market`, `ai`
- Mục tiêu: có public teaser + demo + gateway CTA đúng chuẩn, không claim live sai trạng thái

### Phase 2C — Founder Control Data Layer (internal-first)

- Scope: founder overview, metrics summary, incident stream, audit stream
- Mục tiêu: có read-only backend thật cho panel, chưa mở action execute production

### Phase 2D — Founder Insight Layer (internal-first)

- Scope: insight query, recommendation schema, low-risk action whitelist
- Mục tiêu: AI chỉ được quan sát + đề xuất trước, chưa được tự động vượt quyền

---

## 2) Checklist giao việc theo team

## Team 1 — Lead Platform / Runtime / Contracts / Release Control

### Mobile V1 checklist

1. Giữ xanh `provider-status`, `policy-bindings`, `routing-contract`.
2. Chốt `session/current`, `contracts/index`, `routing-contract` không drift với UI mobile.
3. Khóa persistence cho trạng thái truy cập (`pending_member`, `annual_active`, `pack_owner`).
4. Duy trì smoke required-public sau mỗi lần promote.

### Planned subdomain checklist

1. Dựng guarded runtime routes cho `community/work/market/ai` ở trạng thái `planned-safe`.
2. Không cho CTA đi vào host lỗi; route planned về hub roadmap / gateway hợp lệ.
3. Cập nhật runtime truth ngay sau khi đổi trạng thái domain.

### Founder control checklist

1. Khóa permission model cho founder / PM / QA / autopilot.
2. Chuẩn bị action apply / rollback guard cho `LOW_RISK`.
3. Giữ Team 4 và Team 5 không vượt boundary runtime.

### Artifact bắt buộc

- runtime contract diff report
- smoke evidence log
- blocker evidence cho Ops
- Team 1 lead rollup report có `% hoàn thành / % còn lại` cho cả `5` team

---

## Team 2 — Product / Frontend / Mobile UX / Panel UI

### Mobile V1 checklist

1. Chuẩn hóa hero / CTA / disclosure theo bộ khóa hiện hành.
2. Kiểm tra full state mapping: `visitor`, `pending_member`, `annual_active`, `pack_owner`.
3. EDU mobile: list / detail / player, resume flow, lesson progress.
4. VC mobile: quick verify mở ổn định, disclosure không thiếu.
5. CTA commerce trong app luôn route về homepage purchase hub.

### Planned subdomain checklist

1. Mỗi planned domain phải có:
   - hook `1–3` dòng
   - public value thật
   - ít nhất `1` demo block
   - gateway CTA chuẩn
2. Không render wording `open now / live now` cho domain chưa đạt runtime proof.
3. Đồng bộ badge / status theo runtime truth.

### Founder panel checklist

1. Dựng `Overview` UI, `Insight Drawer`, `Action Modal`.
2. Không dùng data giả để báo ready.
3. Mỗi block phải chỉ rõ field contract lấy từ API nào.

### Artifact bắt buộc

- mobile QA matrix
- CTA / deep-link verification report
- screenshot evidence theo route chính
- founder panel UI map theo API field

---

## Team 3 — Docs / Ops / Governance / QA Gate

### Mobile V1 checklist

1. Verify disclosure placement bắt buộc trên route mobile core.
2. Soát trust wording: không guarantee thu nhập, không overclaim verify.
3. Kiểm tra event vocabulary + audit fields không drift.

### Planned subdomain checklist

1. Duyệt copy theo status `Live / Member Preview / Planned / Bridge`.
2. Chặn publish nếu domain planned bị copy như live đầy đủ.
3. Rà legal / trust block cuối trang và cạnh CTA gateway.

### Founder control checklist

1. Tạo và giữ spec / board / report cho Team 4 và Team 5.
2. Audit cách tính `% hoàn thành / % còn lại` của Team 1.
3. Khóa incident severity, action tier wording, founder approval wording.

### Artifact bắt buộc

- trust / disclosure parity report
- violation list + severity
- go / no-go recommendation theo sprint
- progress audit note

---

## Team 4 — Data / Metrics / Founder Backend

### Checklist bắt đầu ngay

1. Chuẩn bị `system_health_snapshots`.
2. Chuẩn bị `journey_funnel` và `domain_summary` read model.
3. Dựng read-only APIs:
   - `/api/founder/overview`
   - `/api/founder/system-health`
   - `/api/founder/journey-funnel`
   - `/api/founder/domains`
   - `/api/founder/learning-summary`
   - `/api/founder/vc-summary`
   - `/api/founder/review-queue`
   - `/api/founder/incidents`
   - `/api/founder/audit-log`
   - `/api/founder/deployments`
4. Chưa được gắn nhãn `backend_ready` nếu chưa có data thật.

### Artifact bắt buộc

- API contract snapshot
- sample response có source field rõ
- schema / migration note
- dependency note gửi Team 1 và Team 5

---

## Team 5 — AI / Autopilot / Intelligence

### Checklist bắt đầu ngay

1. Khóa `observe / analyze / recommend / verify` contract.
2. Khóa output schema cho insight query.
3. Khóa `LOW / MEDIUM / HIGH` action boundaries theo Team 3 governance.
4. Dựng insight query `internal-first`, chưa được tự execute ngoài whitelist.
5. Chỉ được đụng `LOW_RISK` khi Team 1 đã expose action registry guard và Team 4 có before / after snapshots.

### Artifact bắt buộc

- prompt contract
- output schema sample
- action whitelist note
- confidence / evidence note

---

## 3) Command gate bắt buộc theo checkpoint

Nếu lane đang đụng runtime hiện có:

```bash
npm run build
npm run check
npm run smoke:mobile-pwa
npm run smoke:access-runtime
npm run cloudflare:smoke:endpoints
npm run cloudflare:verify:runtime
```

Nếu lane là founder control internal-first:

- phải có API contract snapshot
- phải có UI field map
- phải có prompt / action schema được Team 3 duyệt

---

## 4) Release gate (phase 2)

Chỉ được promote hoặc mở internal demo khi đủ tất cả:

1. team plan files đầy đủ và cập nhật ngày hiện tại
2. Team 1 lead report có `% hoàn thành / % còn lại` cho `5` team
3. command gates pass trong phạm vi lane đó
4. trust / legal pass
5. runtime truth đã cập nhật
6. không còn blocker `critical` mở

---

## 5) Báo cáo bắt buộc hằng ngày

1. `docs/final-lock/VTL_18_CROSS_TEAM_SYNC_REPORT.md`
2. `docs/00_master/28_EXECUTION_DAILY_CHECK_SYSTEM.md`
3. Team plan file tương ứng

---

## 6) Definition of done (phase 2)

Phase 2 được coi là hoàn tất khi:

1. mobile V1 ổn định end-to-end ở non-payment scope
2. planned subdomains có public layer `planned-safe` chuẩn teaser contract
3. founder control layer có read-only backend thật cho `Overview`
4. insight layer trả được summary + evidence + recommendation đúng schema
5. không có drift giữa runtime truth, UI status badge, report, và legal/trust wording
6. mọi team giữ đúng quy tắc: có kế hoạch hoàn chỉnh trước khi dev
