# 23_V2_MASTER_BRIEF_GAP_ANALYSIS_2026

## Mục đích của file

File này kiểm tra bộ `VETUONGLAI V2.0 — MASTER BRIEF CHO TOÀN BỘ 14 FILE` so với hiện trạng thực tế của repo `vetuonglai-system`.

Mục tiêu:

- chỉ ra cái gì đã có tương đương trong repo
- chỉ ra cái gì còn thiếu thật
- chỉ ra cái gì đang xung đột với runtime truth / protocol / language codex / payment reality
- đề xuất thứ tự nâng cấp tiếp theo để team không viết tài liệu đẹp nhưng lệch hệ thống đang chạy

---

## 1. Kết luận nhanh

Bộ brief 14 file này **rất tốt ở mức định hướng V2**, nhưng hiện tại cần tách thành 3 nhóm:

1. **Đã có nền tương đương trong repo**
2. **Thiếu thật và nên bổ sung**
3. **Đang xung đột với runtime truth hoặc stack hiện tại, cần viết lại trước khi khóa**

Nếu copy nguyên bộ brief này thành file “locked production” ngay lúc này thì sẽ tạo 4 loại drift:

- drift giữa status file và domain thực tế
- drift giữa tech architecture brief và codebase hiện tại
- drift giữa payment brief và payment lane đang chạy
- drift giữa member/policy/economy claims và proof/runtime hiện có

---

## 2. Những gì đã có tương đương

### 2.1 Nhóm đã có phần lớn nội dung nền

| Brief V2 | Tình trạng hiện tại | File tương đương đã có |
| --- | --- | --- |
| File 01 — Ecosystem Architecture | Có phần lớn | `01_SYSTEM_VALUE_MAP_FINAL.md`, `02_LIVE_NOW_NEXT_LATER_MATRIX.md`, `15_MULTI_SUBDOMAIN_OPERATING_SYSTEM_AND_ROOT_HUB_ORCHESTRATION_SPEC.md`, `22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md` |
| File 02 — Member Policy Full | Có nền nhưng chưa đúng format V2 | `03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`, `08_MEMBER_DASHBOARD_AFTER_PAYMENT_SPEC.md`, nhóm `docs/02_member/*` |
| File 03 — VC Trust System | Có nền mạnh | nhóm `docs/08_vc/*`, đặc biệt `VC_11`, `VC_12`, `VC_13` |
| File 04 — Proof-Based Economy | Có một phần | `06_SPECIALIST_PACKS_9_TIER_CATALOG.md`, `07_AFFILIATE_AND_PARTNER_POLICY.md`, `WORK_*`, `MARKET_*`, `AFFILIATE_*` |
| File 05 — EDU AI Learning Spec | Có nền mạnh | nhóm `docs/03_edu/*`, đặc biệt `EDU_11`, `EDU_12`, `EDU_13`, `EDU_14` |
| File 06 — Work Job Board Spec | Có nền khá rõ | nhóm `docs/10_work/*`, đặc biệt `WORK_11`, `WORK_12` |
| File 07 — Affiliate Clean Program | Có nền rõ | `07_AFFILIATE_AND_PARTNER_POLICY.md`, nhóm `docs/22_affiliate/*` |
| File 08 — Content Policy Strict | Có nền nhưng chưa gom thành một file strict policy riêng | `04_PUBLIC_TEASER_CONTRACT_ALL_SUBDOMAINS.md`, `09_CONTENT_DEPTH_MATRIX_ALL_SUBDOMAINS.md`, `11_LEGAL_TRUST_LANGUAGE_RULES.md` |
| File 10 — Launch Roadmap Phases | Có nền phân tán | `16_PRODUCT_REQUIREMENTS_DOSSIER_FOR_ALL_TEAMS.md`, `17_TEAM_EXECUTION_PLAN_MOBILE_AND_SUBDOMAINS.md`, `18_PHASE_2_CHECKLIST...`, `VTL_42_NEXT_PHASE_EXECUTION_BOARD_2026-04-17.md` |
| File 13 — Brand Tone of Voice | Có nền tốt | `13_BRAND_BLUEPRINT_MASTER.md`, `14_DESIGN_SYSTEM_MASTER.md`, `19_LANGUAGE_CODEX_LOCKED.md`, `content/language-codex.md` |
| File 14 — Data Flow Journey | Có nền một phần | `15_MULTI_SUBDOMAIN_OPERATING_SYSTEM_AND_ROOT_HUB_ORCHESTRATION_SPEC.md`, `03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`, Team 1 runtime docs |

---

## 3. Những gì còn thiếu thật

### 3.1 Thiếu file “gom” ở mức V2

Các ý sau hiện có rải ở nhiều file, nhưng **chưa có một bản production-ready 1.000–3.000 từ đúng format brief V2**:

1. một file hệ sinh thái V2 gom đủ 5 lớp + journey map 6 giai đoạn
2. một file member policy full theo kiểu level/points/profile/level-drop rule
3. một file proof-based economy gom đủ engine + revenue share + cấm vi phạm
4. một file content policy strict theo format “submit -> AI pre-screen -> editor review -> monetize model -> zero tolerance”
5. một file creator earning wallet đủ dashboard + wallet states + payout flow
6. một file legal policy VN dạng gom Terms / Privacy / Refund / Tax / Compliance

### 3.2 Thiếu domain docs ở mức hệ V2

Bộ brief V2 nhắc đến:

- `journey.vetuonglai.com`
- `blog.vetuonglai.com`
- `tools.vetuonglai.com`
- `stories.vetuonglai.com`
- `live.vetuonglai.com`
- `api.vetuonglai.com`
- `admin.vetuonglai.com`

Trong repo hiện tại:

- các domain này có nhắc trong roadmap/matrix
- nhưng chưa có hoặc chưa hoàn chỉnh bộ docs subdomain tương ứng trong `docs/<subdomain>/...`

Đây là thiếu thật nếu muốn đi đúng vision V2.

---

## 4. Những gì đang xung đột với hiện trạng

Đây là phần quan trọng nhất.

### 4.1 Xung đột về trạng thái domain

Brief V2 ghi:

- `life.vetuonglai.com` là `LIVE`
- `journey.vetuonglai.com` là một domain riêng
- `member.vetuonglai.com` như thể đã là SSO/dashboard trung tâm
- `work`, `market`, `affiliate`, `ai`, `community` đi theo economy layer rõ

Nhưng runtime truth hiện tại của repo đang khóa:

- `life.vetuonglai.com` = `Member Preview`
- `invest.vetuonglai.com` = `Member Preview`
- `member.vetuonglai.com` = đang ở lane staged/cutover, chưa được coi là live hoàn tất
- `work`, `market`, `community`, `ai`, `affiliate`, `stories`, `tools`, `api`, `admin`, `live` = planned hoặc internal

=> Vì vậy, không được khóa V2 file nào mà biến các domain này thành “đang live” nếu production chưa chứng minh được.

### 4.2 Xung đột về payment và membership

Brief V2 đưa ra:

- level `Pro / Elite / Partner`
- phí tháng `99k / 299k`
- earning flows, wallet, payout, escrow logic khá sâu

Nhưng hệ hiện tại đang có:

- Future Access Pass / entitlement model riêng
- payment lane đang đi qua `pay.iai.one` và payOS, chưa chốt hoàn tất
- phần membership hiện tại chưa ở mức production-ready cho full monthly tier ladder như brief V2

=> Có thể dùng brief V2 làm hướng thiết kế tiếp theo, nhưng **không được viết như runtime hiện tại đã hỗ trợ đủ 4 level và monthly billing model đó**.

### 4.3 Xung đột về tech stack

Brief V2 ghi:

- `Next.js 14 App Router`
- `Tailwind CSS + shadcn/ui`
- `Zustand`
- `React Query`
- `Clerk`
- `PostgreSQL + Redis + MeiliSearch`
- `Vercel + Railway -> AWS`
- `VNPay + MoMo + ZaloPay + Stripe`
- `React Native`

Nhưng codebase hiện tại của repo là:

- static multi-site generator
- build bằng `node scripts/build.mjs`
- deploy bằng Cloudflare Pages/Workers
- runtime access hiện do worker/access-runtime điều phối
- payment lane thực tế đang là `pay.iai.one` / payOS

=> File 09 nếu viết ngay theo brief V2 thì sẽ mâu thuẫn trực tiếp với codebase đang chạy.

**Cách đúng**:

- viết File 09 thành `Current Architecture + Target Architecture`
- tách rõ:
  - kiến trúc hiện tại đang chạy
  - kiến trúc mục tiêu cho Phase 2 / Phase 3

### 4.4 Xung đột về pháp lý

File 11 trong brief đụng tới:

- Terms
- Privacy
- Refund
- Tax
- e-commerce regulation

Đây là khu vực high-stakes.

=> không nên khóa như “đã chốt pháp lý” nếu chưa có legal review thật.

File này nên được ghi rõ là:

- `Bản khung legal/product requirements để legal review`
- chưa phải `final legal text`

---

## 5. Góp ý tiếp tục sau những việc đã làm

### 5.1 Điều nên làm ngay

1. **Không viết cả 14 file cùng lúc**
2. chia 14 file thành 3 đợt:
   - đợt A: file khóa hệ thống và không xung đột runtime
   - đợt B: file economy / wallet / work / affiliate
   - đợt C: file legal + tech architecture target-state

### 5.2 Thứ tự khuyến nghị

#### Đợt A — nên làm ngay

1. `01_ecosystem_architecture_v2.md`
2. `03_vc_trust_system.md`
3. `05_edu_ai_learning_spec.md`
4. `08_content_policy_strict.md`
5. `13_brand_tone_of_voice.md`
6. `14_data_flow_journey.md`

Lý do:

- phần lớn đã có nền trong repo
- ít rủi ro làm sai runtime truth hơn
- giúp team có xương sống để build tiếp

#### Đợt B — làm sau khi chốt thêm economy/member

1. `02_member_policy_full.md`
2. `04_proof_based_economy.md`
3. `06_work_job_board_spec.md`
4. `07_affiliate_clean_program.md`
5. `12_creator_earning_wallet.md`

Lý do:

- liên quan trực tiếp đến payment, proof gating, earning flow, level model
- rất dễ viết quá so với hiện trạng nếu chưa khóa lại taxonomy mới

#### Đợt C — chỉ làm khi có owner review rõ

1. `09_tech_architecture_erd.md`
2. `10_launch_roadmap_phases.md`
3. `11_legal_policies_vn.md`

Lý do:

- File 09 đang xung đột mạnh với stack hiện tại
- File 10 cần bám lại sequence hiện hành của repo và phase board mới
- File 11 cần legal review thật

---

## 6. Khuyến nghị viết lại brief trước khi expand

Trước khi expand thành 14 file production-ready, cần sửa 3 điểm trong brief:

### 6.1 Đổi mọi claim “đang có” thành 1 trong 3 loại

- `hiện đang chạy`
- `đang ở preview/pilot`
- `mục tiêu phase sau`

### 6.2 Tách “kiến trúc hiện tại” và “kiến trúc mục tiêu”

Đặc biệt cho:

- auth
- API
- payment
- infra
- mobile
- data layer

### 6.3 Tách “product policy” và “legal policy”

Ví dụ:

- refund logic product đề xuất
- legal wording final

không nên gộp làm một.

---

## 7. Nâng cấp còn thiếu nên bổ sung thêm ngoài 14 file

Ngoài 14 file trên, repo hiện còn nên có thêm 4 file để V2 chặt hơn:

1. `MULTILINGUAL_EXPANSION_PROTOCOL`
   - đã có: `21_MULTILINGUAL_EXPANSION_PROTOCOL_2026.md`
2. `SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT`
   - đã có: `22_SUBDOMAIN_TASK_MATRIX_AND_TEAM_ASSIGNMENT_2026.md`
3. `CURRENT_ARCHITECTURE_VS_TARGET_ARCHITECTURE`
   - chưa có, nên bổ sung
4. `LEGAL_REVIEW_REQUIRED_MATRIX`
   - chưa có, nên bổ sung

---

## 8. Chốt cuối

Bộ brief V2 này **không thừa**.
Ngược lại, nó là nền rất tốt để đi tiếp.

Nhưng nếu muốn dùng nó đúng chuẩn cho `vetuonglai.com`, cần áp nguyên tắc:

- không khóa file nào trái runtime truth
- không biến target-state thành current-state
- không biến legal draft thành legal final
- không biến target stack thành stack đang chạy

### Kết luận hành động

Tiếp tục đúng nhất là:

1. viết ngay nhóm file Đợt A
2. rà lại taxonomy/member/economy trước khi viết Đợt B
3. tách current-state và target-state trước khi viết Đợt C
