# VETUONGLAI MASTER HANDOFF INDEX

Version: 1.0
Last updated: 2026-04-08

## Mục đích

Đây là file đầu tiên mọi thành viên trong team phải mở trước khi đọc bất kỳ file handoff nào khác.

Bộ tài liệu này được tạo để biến định hướng Về Tương Lai thành một hệ thống có thể giao việc, phân tách owner và triển khai thành product thật.

Bộ file này không dùng để brainstorm. Đây là bộ source of truth cho team.

## Nguyên tắc đọc

- Không đọc từng file rồi suy diễn theo ý riêng.
- Phải đọc theo đúng thứ tự.
- Nếu có xung đột giữa ý kiến riêng và file source of truth, team phải mang về review thay vì tự sửa hướng đi.

## Reading order bắt buộc

1. `VETUONGLAI_MASTER_HANDOFF_INDEX.md`
2. `VETUONGLAI_MASTER_VISION_AND_POSITIONING.md`
3. `VETUONGLAI_BRAND_BLUEPRINT.md`
4. `VETUONGLAI_ECOSYSTEM_ARCHITECTURE.md`
5. `VETUONGLAI_DOMAIN_ROLE_MATRIX.md`
6. `VETUONGLAI_USER_JOURNEY_SYSTEM.md`
7. `VETUONGLAI_INFORMATION_ARCHITECTURE.md`
8. `VETUONGLAI_DATA_MODEL_MASTER.md`
9. `VETUONGLAI_API_SURFACE_MASTER.md`
10. `VETUONGLAI_FRONTEND_ARCHITECTURE.md`
11. `VETUONGLAI_BACKEND_AND_WORKER_ARCHITECTURE.md`
12. `VETUONGLAI_INFRA_DEPLOYMENT_AND_ENVIRONMENTS.md`
13. `VETUONGLAI_DEV_EXECUTION_ROADMAP_12_WEEKS.md`
14. `VETUONGLAI_RUNTIME_TRUTH_AND_QA.md`

Sau đó mới đi vào file riêng từng domain.

## Bộ file ưu tiên phải làm ngay

10 file ưu tiên hiện được tạo và dùng để team bắt đầu ngay:

1. `VETUONGLAI_MASTER_HANDOFF_INDEX.md`
2. `VETUONGLAI_MASTER_VISION_AND_POSITIONING.md`
3. `VETUONGLAI_BRAND_BLUEPRINT.md`
4. `VETUONGLAI_ECOSYSTEM_ARCHITECTURE.md`
5. `VETUONGLAI_DOMAIN_ROLE_MATRIX.md`
6. `VETUONGLAI_ROOT_HUB_SPEC.md`
7. `VETUONGLAI_EDU_PRODUCT_SPEC.md`
8. `VETUONGLAI_VC_TRUST_LAYER_MASTER_SPEC.md`
9. `VETUONGLAI_DATA_MODEL_MASTER.md`
10. `VETUONGLAI_DEV_EXECUTION_ROADMAP_12_WEEKS.md`

File bổ sung bắt buộc cho team EDU:

- `VETUONGLAI_EDU_PHILOSOPHY_AND_SYSTEM_LOCK.md`
- `EDU_AI_TUTOR_SYSTEM_DEEP_SPEC.md`

## File source of truth theo nhóm

### Strategy

- `VETUONGLAI_MASTER_VISION_AND_POSITIONING.md`
- `VETUONGLAI_ECOSYSTEM_ARCHITECTURE.md`

### Brand / Content / Design

- `VETUONGLAI_BRAND_BLUEPRINT.md`
- `VETUONGLAI_ROOT_HUB_SPEC.md`
- `VETUONGLAI_LANGUAGE_AND_EXPERIENCE_MASTER.md`
- `VETUONGLAI_FULL_WEBSITE_COPY.md`
- `AI_TUTOR_HUMAN_SCRIPT.md`
- `STORY_PACK_50.md`

### Product / Domain direction

- `VETUONGLAI_DOMAIN_ROLE_MATRIX.md`
- `VETUONGLAI_EDU_PRODUCT_SPEC.md`
- `VETUONGLAI_VC_TRUST_LAYER_MASTER_SPEC.md`

### Platform / Data

- `VETUONGLAI_DATA_MODEL_MASTER.md`

### Execution

- `VETUONGLAI_DEV_EXECUTION_ROADMAP_12_WEEKS.md`

## Owner đề xuất

- Founder / Vision owner: vision, positioning, master direction
- Product lead: user journey, product requirements, roadmap
- Brand lead: naming, tone, CTA, copy, emotional standards
- Content lead: content system, editorial quality, publishing rules
- FE lead: IA, component behavior, flows, rendering model
- BE / Infra lead: API, worker architecture, deployment, data integrity
- Trust / VC owner: verification standards, proof rules, disclosure rules

## File nào bắt buộc phải đọc trước khi code

Mọi engineer trước khi code bắt buộc đọc tối thiểu:

1. `VETUONGLAI_MASTER_HANDOFF_INDEX.md`
2. `VETUONGLAI_MASTER_VISION_AND_POSITIONING.md`
3. `VETUONGLAI_ECOSYSTEM_ARCHITECTURE.md`
4. `VETUONGLAI_DOMAIN_ROLE_MATRIX.md`
5. `VETUONGLAI_DATA_MODEL_MASTER.md`
6. `VETUONGLAI_DEV_EXECUTION_ROADMAP_12_WEEKS.md`

Nếu làm EDU thì đọc thêm:

- `VETUONGLAI_EDU_PHILOSOPHY_AND_SYSTEM_LOCK.md`
- `EDU_AI_TUTOR_SYSTEM_DEEP_SPEC.md`
- `VETUONGLAI_EDU_PRODUCT_SPEC.md`

Nếu làm VC thì đọc thêm:

- `VETUONGLAI_VC_TRUST_LAYER_MASTER_SPEC.md`

Nếu làm root hub thì đọc thêm:

- `VETUONGLAI_ROOT_HUB_SPEC.md`

## File tham chiếu đã có sẵn trong repo

Để giảm lặp lại nội dung, bộ handoff này được bổ sung bởi các file đã tồn tại:

- `VETUONGLAI BRAND BLUEPRINT + SYSTEM ARCHITECTURE.md`
- `VETUONGLAI MASTER DEV HANDOFF.md`
- `DEV-ROLL OUT PLAN.md`

Vai trò của 3 file cũ:

- `VETUONGLAI BRAND BLUEPRINT + SYSTEM ARCHITECTURE.md`: bản tổng thể tầm nhìn thương hiệu và hệ thống
- `VETUONGLAI MASTER DEV HANDOFF.md`: target architecture tổng quan cho dev
- `DEV-ROLL OUT PLAN.md`: hiện trạng đã xác minh và kế hoạch roll-out production

## Batch 4 đã hoàn tất

Các file bổ sung để bộ handoff đủ cho content, admin, onboarding, dashboard, media, payment, security, SEO, email, analytics, design, ops, QA và legal:

- `VETUONGLAI_CONTENT_SYSTEM_MASTER.md`
- `VETUONGLAI_CONTENT_MODEL_SCHEMA.md`
- `VETUONGLAI_PRODUCT_LAYERS.md`
- `VETUONGLAI_ASSESSMENT_AND_ONBOARDING_SPEC.md`
- `VETUONGLAI_PERSONAL_JOURNEY_DASHBOARD_SPEC.md`
- `VETUONGLAI_ADMIN_AND_CMS_SPEC.md`
- `VETUONGLAI_STORAGE_AND_MEDIA_STRATEGY.md`
- `VETUONGLAI_PAYMENT_AND_ACCESS_MODEL.md`
- `VETUONGLAI_SECURITY_PRIVACY_AND_TRUST.md`
- `VETUONGLAI_SEO_AND_DISCOVERABILITY_MASTER.md`
- `VETUONGLAI_EMAIL_AND_NOTIFICATION_SYSTEM.md`
- `VETUONGLAI_ANALYTICS_AND_MEASUREMENT.md`
- `VETUONGLAI_DESIGN_SYSTEM_AND_UI_KIT.md`
- `VETUONGLAI_DESIGN_SYSTEM_MASTER.md`
- `VETUONGLAI_UI_KIT_FULL_SYSTEM.md`
- `VETUONGLAI_COMPONENT_LIBRARY_SPEC.md`
- `VETUONGLAI_LANDING_PAGE_DESIGN_SPEC.md`
- `EDU_AI_TUTOR_UI_REAL_SCREEN_SPEC.md`
- `VETUONGLAI_AUTONOMOUS_EXECUTION_SYSTEM.md`
- `VETUONGLAI_TEAM_OPERATING_MODEL.md`
- `VETUONGLAI_RUNTIME_TRUTH_AND_QA.md`
- `VETUONGLAI_LEGAL_ETHICS_AND_DISCLAIMER_PACK.md`

## Trạng thái handoff hiện tại

Bộ handoff hiện tại đã đủ để giao cho team dev, product, content, design, infra, ops và legal bắt đầu làm việc theo cùng một chuẩn.

Từ thời điểm này, mọi công việc triển khai nên bám vào bộ file này như source of truth, thay vì quay lại brainstorm từ đầu.

## Quy tắc cập nhật

- Mỗi file phải có owner rõ ràng trước khi sửa.
- Mỗi thay đổi lớn phải cập nhật `Last updated`.
- Không sửa file source of truth mà không đối chiếu với các file liên quan.
- Nếu một thay đổi ảnh hưởng nhiều file, phải cập nhật index này để ghi nhận.

## Mục tiêu của bộ handoff

Khi team làm đúng bộ file này, kết quả cần đạt được là:

- cả team hiểu cùng một tầm nhìn
- không nhầm vai trò giữa các domain
- không xây website rời rạc
- mọi quyết định code đều phục vụ hành trình người dùng thật
- có thể biến Về Tương Lai thành một hệ sinh thái sống được, học được, thực hành được và xác minh được
