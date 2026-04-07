# 01_ecosystem_architecture_v2

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · OPS · LEGAL · CONTENT

## Mục tiêu

File này khóa kiến trúc hệ sinh thái V2 và journey map cấp hệ thống.

Lưu ý rất quan trọng:
- Đây là kiến trúc mục tiêu V2.
- Không phải tất cả subdomain dưới đây đều đang `live` ở runtime hiện tại.
- Team phải luôn đối chiếu thêm với `cloudflare/domain-runtime-truth.json` và `VETUONGLAI_RUNTIME_TRUTH_AND_QA.md` trước khi gọi một thứ là production-ready.

## A. Sơ đồ 5 lớp hệ thống

### Layer 1 — Core Foundation

- `vetuonglai.com`
  - Vai trò: Hub, onboarding, ecosystem map, entry point chung.
  - Trạng thái hiện tại: live.
- `member.vetuonglai.com`
  - Vai trò: SSO toàn hệ, profile, dashboard, access layer.
  - Trạng thái hiện tại: planned.
- `vc.vetuonglai.com`
  - Vai trò: Trust Layer trung tâm, VC registry, verify flow.
  - Trạng thái hiện tại: live.
- `api.vetuonglai.com`
  - Vai trò: orchestration, data sync, event bridge, admin and partner contracts.
  - Trạng thái hiện tại: planned, chưa public runtime.
- Journey Engine
  - Vai trò: cá nhân hóa hành trình, next best action, stage progression.
  - Trạng thái hiện tại: tích hợp vào `member.vetuonglai.com`, không tách subdomain riêng ở Phase 1-2.

### Layer 2 — Proof-Based Economy

- `edu.vetuonglai.com`
  - Vai trò: AI learning, course player, project-based learning, micro-credential, VC proof bridge.
  - Trạng thái hiện tại: live.
- `work.vetuonglai.com`
  - Vai trò: job, freelance, project, service economy.
  - Trạng thái hiện tại: planned.
- `market.vetuonglai.com`
  - Vai trò: chợ tài sản số có proof, content access, template economy.
  - Trạng thái hiện tại: planned.
- `ai.vetuonglai.com`
  - Vai trò: AI tools kiếm tiền thật, creator tools, course authoring support.
  - Trạng thái hiện tại: planned.
- `affiliate.vetuonglai.com`
  - Vai trò: affiliate có gating bằng proof và level.
  - Trạng thái hiện tại: planned.

### Layer 3 — Life System

- `life.vetuonglai.com`
  - Vai trò: sức khỏe, nhịp sống, ổn định nền tảng.
  - Trạng thái hiện tại: preview / planned public.
- `finance.vetuonglai.com`
  - Vai trò: tài chính cơ bản, an toàn tiền bạc, clarity.
  - Trạng thái hiện tại: live.
- `invest.vetuonglai.com`
  - Vai trò: đầu tư tỉnh táo, due diligence, guardrails.
  - Trạng thái hiện tại: preview / planned public.
- `green.vetuonglai.com`
  - Vai trò: chứng chỉ bền vững, proof xanh, impact packet.
  - Trạng thái hiện tại: live.

### Layer 4 — Community & Social Proof

- `community.vetuonglai.com`
  - Vai trò: forum, circle, cohort, social support.
  - Trạng thái hiện tại: planned.
- Stories layer
  - Phase 1: tích hợp vào `blog.vetuonglai.com` dưới tag `#story` và category `Chuyện thật`, đồng thời có section `Stories` trong `community`.
  - Phase 2-3: đánh giá tách `stories.vetuonglai.com` khi volume đủ lớn.
- `live.vetuonglai.com`
  - Vai trò: workshop, webinar, community events.
  - Trạng thái hiện tại: planned.
- `blog.vetuonglai.com`
  - Vai trò: content mở, SEO, trust-building, story distribution.
  - Trạng thái hiện tại: planned như domain riêng; content layer có thể chạy trước trong hub.

### Layer 5 — Tools & Admin

- `tools.vetuonglai.com`
  - Vai trò: công cụ miễn phí, acquisition utility, creator helpers.
  - Trạng thái hiện tại: planned.
- `admin.vetuonglai.com`
  - Vai trò: quản trị nội bộ, runtime truth, course ops, proof ops, journey ops.
  - Trạng thái hiện tại: planned.

## B. Journey Map người dùng — 6 giai đoạn

```text
DISCOVER -> JOIN -> LEARN -> PROVE -> EARN -> SCALE

DISCOVER: Vào blog/life/stories -> thấy giá trị thật
JOIN:     Đăng ký free -> onboarding -> chọn lộ trình
LEARN:    edu. -> project-based learning -> hoàn thành output
PROVE:    vc. -> submit claim -> xác minh -> nhận badge
EARN:     work/market/affiliate -> thu nhập đầu tiên
SCALE:    community -> mentoring -> partner -> ecosystem
```

### Giải thích từng giai đoạn

#### 1. Discover

Người dùng gặp hệ thống qua:
- root hub
- content mở
- life / finance / green
- story thật có bằng chứng

Mục tiêu của giai đoạn này:
- tạo trust ban đầu
- giúp user thấy mình đang ở đâu
- tránh overload và tránh sales pressure

#### 2. Join

User đăng ký và vào member layer.

Tại đây cần có:
- hồ sơ cơ bản
- onboarding ngắn
- journey engine card: `Bước tiếp theo của bạn`

#### 3. Learn

User học trong `edu` hoặc domain phù hợp.

Nguyên tắc:
- học để làm được
- lesson phải tạo action
- completion phải gắn với output, không chỉ view content

#### 4. Prove

User đưa output sang trust layer.

VC đóng vai trò:
- xác minh thành quả
- tăng trust cho profile
- mở khóa engine kinh tế cao hơn

#### 5. Earn

User bắt đầu tạo thu nhập đầu tiên thông qua:
- service
- project
- nội dung số
- affiliate có kiểm soát

Điểm đo quan trọng:
- time-to-first-earning

#### 6. Scale

User đi tiếp lên các vai trò cao hơn:
- mentor
- builder
- partner
- community leader

## C. Nguyên tắc kiến trúc

- SSO một lần, dùng toàn bộ hệ.
- VC proof là điều kiện mở khóa các layer trust-sensitive.
- Mọi data người dùng quan trọng đồng bộ qua `api.vetuonglai.com` hoặc orchestration layer tương đương.
- Journey Engine là capability của member dashboard trong Phase 1-2, chưa tách subdomain riêng.
- Mobile-first từ Phase 1.
- Không domain nào được sống như một website độc lập không nối vào journey.

## D. Quy tắc phase

### Phase 1

- root hub
- member basic
- edu basic
- vc basic
- life / finance content direction
- tools cơ bản nếu có capacity

### Phase 2

- AI Tutor đầy đủ trong `edu`
- work pilot
- community MVP
- stories layer trong blog/community
- affiliate clean program

### Phase 3

- invest full
- live
- market proof-based
- member verified layer mạnh hơn
- cân nhắc tách `stories.` nếu đủ volume

## E. Runtime truth note bắt buộc

Khi team viết hoặc build từ file này, phải ghi rõ trong mỗi deliverable:
- live
- preview
- planned
- internal only

Không được dùng bản đồ mục tiêu V2 để ngộ nhận rằng toàn bộ hệ đã chạy thật.
