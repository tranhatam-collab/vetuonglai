# 32_RUNTIME_TRUTH_MATRIX_V1

## Mục đích của file

File này là bản **implementation-grade** của runtime truth cho V1.0.

Nó không thay thế:

- `02_LIVE_NOW_NEXT_LATER_MATRIX.md`
- `12_RUNTIME_TRUTH_MASTER.md`

Nó tồn tại để team DEV, QA, Content, Design và Ops có một bảng ngắn, rõ, dùng được ngay khi:

- build page
- gắn badge
- viết CTA
- review copy
- quyết định có được mở feature mới hay chưa

---

## 1. Kết luận runtime truth hiện tại

Tính đến `2026-04-22`, current V1.0 trong repo này phải được hiểu như sau:

- `vetuonglai.com` = `LIVE`
- `vc.vetuonglai.com` = `LIVE`
- `green.vetuonglai.com` = `LIVE`
- `finance.vetuonglai.com` = `LIVE`
- `edu.vetuonglai.com` = `LIVE`
- `life.vetuonglai.com` = `PLANNED`
- `invest.vetuonglai.com` = `PLANNED`
- `member.vetuonglai.com` = `LIVE`
- `work.vetuonglai.com` = `PLANNED`
- `market.vetuonglai.com` = `PLANNED`
- `community.vetuonglai.com` = `PLANNED`
- `ai.vetuonglai.com` = `PLANNED`
- `business.vetuonglai.com` = `PLANNED / internal planning only`
- `community`, `stories`, `blog`, `tools`, `live`, `affiliate`, `ai`, `api`, `admin` = `PLANNED` hoặc `INTERNAL` theo từng wave

Nếu có chỗ nào khác nói mạnh hơn bảng trên, bảng trên thắng trong phạm vi V1.0 hiện tại.

---

## 2. Bảng trạng thái dùng để build

| Surface | Trạng thái | Được công bố | Không được công bố | Build rule |
| --- | --- | --- | --- | --- |
| `vetuonglai.com` | LIVE | hub, ecosystem map, gateway, Future Access Pass, pack framing | member dashboard full, entitlement full, partner full | tiếp tục harden |
| `vc.vetuonglai.com` | LIVE | verify, registry, disclosure tối thiểu, proof framing | “không thể fake”, “bất biến tuyệt đối” | tiếp tục harden |
| `green.vetuonglai.com` | LIVE | green proof, packet, impact evidence framing | green network full, funded graph full | tiếp tục harden |
| `finance.vetuonglai.com` | LIVE | money basics, anti-scam, discipline | financial freedom, advisory, get-rich framing | tiếp tục harden |
| `edu.vetuonglai.com` | LIVE | catalog, packet flow, VC-linked learning | full production AI tutor, full eligibility engine | harden live core loop, chưa overclaim |
| `life.vetuonglai.com` | PLANNED | teaser-safe rhythm, baseline, discipline framing | full routines engine, full personalized dashboard | build planned-safe |
| `invest.vetuonglai.com` | PLANNED | teaser-safe risk-first, due diligence, no-FOMO | trading platform, advisory, guaranteed result | build planned-safe |
| `member.vetuonglai.com` | LIVE | identity, access, dashboard shell, mobile app shell, state-map disclosure | “mọi quyền sâu đã mở”, “SSO hoàn chỉnh cho toàn hệ”, “thanh toán ngay trong app” | giữ access-truth strict |
| `work.vetuonglai.com` | PLANNED | roadmap, proof-based work layer | public usable board, job marketplace live | chỉ viết spec/teaser-safe |
| `market.vetuonglai.com` | PLANNED | roadmap, digital asset layer | public usable commerce surface live | chỉ viết spec/teaser-safe |
| `community.vetuonglai.com` | PLANNED | cohort preview, participation principles, peer-support boundary, CTA về hub/member | live community feed, cohort registration usable, real-time interaction claim | build planned-safe shell + verify marker |
| `ai.vetuonglai.com` | PLANNED | use-case preview, helper demo-safe blocks, AI guardrails, CTA về hub/member | production AI tool claim, live assistant runtime, automation promise | build planned-safe shell + verify marker |
| `business.vetuonglai.com` | PLANNED / internal planning only | business spec, package contract, form schema, demo-safe consulting preview | business solution live, enterprise onboarding usable, AI agent integration live | chỉ viết spec/form/demo-safe |

---

## 3. Quy tắc claim công khai

### 3.1 Khi status là `LIVE`

Được nói:

- đang hoạt động
- đang mở công khai
- có giá trị sử dụng thật

Không được nói:

- hoàn chỉnh mọi flow
- đã có toàn bộ member / partner / automation

### 3.2 Khi status là `MEMBER_PREVIEW`

Được nói:

- preview có giá trị
- đã có giá trị thật
- đang mở sâu dần trong member layer
- pilot-ready

Không được nói:

- live đầy đủ
- full system
- complete experience
- production complete
- open all systems

### 3.3 Khi status là `PLANNED`

Được nói:

- planned
- đang chuẩn bị
- mở ở wave sau

Không được nói:

- open now
- enter now
- available today

### 3.4 Khi status là `BRIDGE`

Được nói:

- bridge
- mirror
- connected layer

Không được nói:

- trải nghiệm chính
- nguồn sự thật duy nhất
- thay thế VC hoặc runtime gốc

---

## 4. Những gì team phải kiểm trước khi build

Trước khi thêm CTA, nav item, page card hoặc badge, team phải kiểm:

1. domain này đang ở trạng thái gì trong file này
2. user public có dùng được end-to-end chưa
3. copy dự kiến có mạnh hơn current runtime không
4. CTA có đẩy user vào host chưa usable không

Nếu câu trả lời số 2 là `chưa`, không được viết copy như `LIVE`.

---

## 5. Team sync bắt buộc

### Team 1

- xác nhận host/runtime/proof trước khi xin nâng trạng thái

### Team 2

- chỉ render badge và CTA theo đúng status matrix này

### Team 3

- chặn mọi copy mạnh hơn runtime truth

### Ops

- chỉ xác nhận nâng trạng thái khi có host public + flow thực + smoke pass

---

## 6. Definition of done

File này chỉ được xem là đúng khi:

1. badge trên UI khớp runtime
2. copy public không mạnh hơn status thực
3. planned domains không bị render như destination usable
4. mọi team dùng cùng một bảng trạng thái
