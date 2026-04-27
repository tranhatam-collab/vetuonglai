# VTL_49_TEAM4_PACKAGE_FORM_DATA_CONTRACT_2026-04-22

## Mục đích

Khóa data contract Team 4 cho:

- package / layer registry
- form schema cho member + subdomains
- comparison / demo / output bundles
- business lane riêng tại `business.vetuonglai.com`

File này chỉ mô tả contract dữ liệu. Không thay runtime truth, không thay build rule, không mở domain mới.

---

## File nguồn sự thật

### 1. Package / form registry

- [package-form-registry.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/src/data/package-form-registry.json)

Dùng cho:

- Team 2 render form, comparison card, package card
- Team 5 verify presence / required fields / required bundle IDs
- QA đối chiếu field bắt buộc và rule gợi ý

### 2. Comparison / demo / output registry

- [package-comparison-demo-output.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/src/data/package-comparison-demo-output.json)

Dùng cho:

- render bảng so sánh
- render demo block
- render output / evidence samples

### 3. Business lane contract

- [business-domain-contract.json](/Users/tranhatam/Documents/Devnewproject/vetuonglai-system/src/data/business-domain-contract.json)

Dùng cho:

- Team 2 dựng planned-safe shell cho `business.vetuonglai.com`
- Team 5 viết verify pack cho business lane
- Product / QA / Content kiểm tra không overclaim

---

## Top-level schema đã khóa

## A. `package-form-registry.json`

### Top-level keys

- `version`
- `owner`
- `sourceDocs`
- `guardrails`
- `entryLayers`
- `packageLayers`
- `fieldRegistry`
- `forms`
- `memberFormContract`
- `subdomainFormRegistry`
- `surfacePackageFamilies`
- `comparisonRegistry`
- `apiPublication`

### Quy tắc dùng

- UI phải lấy field schema từ `fieldRegistry`
- Flow từng form phải lấy từ `forms`
- Mapping surface -> form -> comparison bundle phải lấy từ `subdomainFormRegistry`
- Mapping package cụ thể theo domain phải lấy từ `surfacePackageFamilies`
- Không hard-code lại step titles, required fields, hay bundle ids trong UI

---

## B. `package-comparison-demo-output.json`

### Top-level keys

- `version`
- `owner`
- `sourceDocs`
- `comparisonColumns`
- `comparisonBundles`
- `demoBundles`
- `outputBundles`
- `renderingRules`

### 6 cột cố định của bảng so sánh

- `who_for`
- `problem_solved`
- `what_you_get`
- `expected_output`
- `ai_review_proof`
- `next_step`

Không được tự ý thêm kiểu hiển thị:

- số bài
- số giờ
- technical dump

---

## C. `business-domain-contract.json`

### Top-level keys

- `version`
- `owner`
- `sourceDocs`
- `domain`
- `runtimeTruthGuardrails`
- `intakeContract`
- `packageRecommendationRules`
- `businessPackages`
- `integrationPlaceholder`
- `plannedApiContract`

### Business lane guardrail

`business.vetuonglai.com` hiện chỉ là:

- spec
- form schema
- package recommendation contract
- demo-safe consulting preview

Không được render như:

- domain live
- enterprise onboarding usable
- AI agent integration usable

---

## Business form: step order đã khóa

1. `step_1_qualification`
2. `step_2_need_survey`
3. `step_3_verification`
4. `step_4_recommendation`

### Blockers cứng

- thiếu `business_registration_number` -> không cho qua bước 1
- `business_authorization_confirmed != true` -> không cho qua bước 1
- recommendation không được sinh nếu chưa xong bước 1 + bước 2

---

## Mapping package đã khóa

### Member access layers

- `free_member`
- `future_access_pass`

### EDU

- `edu_foundation`
- `edu_applied`
- `edu_professional`

### LIFE

- `life_baseline_7d`
- `life_rhythm_30d`
- `life_system_90d`

### FINANCE

- `finance_money_basics`
- `finance_money_discipline`
- `finance_personal_finance_system`

### INVEST

- `invest_risk_basics`
- `invest_due_diligence_applied`
- `invest_calm_investing_system`

### GREEN

- `green_basics`
- `green_impact_tracking`
- `green_proof_system`

### VC

- `vc_proof_basics`
- `vc_proof_packaging`
- `vc_verification_readiness`

### BUSINESS

- `business_entry`
- `business_foundation`
- `business_applied`
- `business_strategic`

---

## Cách consume cho từng team

### Team 2

- dùng `subdomainFormRegistry` để biết surface nào có form nào
- dùng `surfacePackageFamilies` để render package card đúng package key
- dùng `comparisonBundles` để render bảng so sánh
- dùng `demoBundles` + `outputBundles` để render demo/output block
- không lấy status từ Team 4 data; status phải lấy từ runtime truth riêng

### Team 5

Verify tối thiểu:

- mỗi `formKey` trong `subdomainFormRegistry` phải tồn tại trong `forms`
- mỗi `packageFamilyKey` phải tồn tại trong `surfacePackageFamilies`
- mỗi `comparisonBundleId` phải tồn tại trong `comparisonBundles`
- mỗi `demoBundleId` / `outputBundleId` phải tồn tại trong file comparison/demo/output
- business lane phải fail nếu UI claim live vượt `runtimeTruthGuardrails`

### QA

- so khớp field bắt buộc từng step
- kiểm tra `business` không đi chung flow cá nhân
- kiểm tra bảng so sánh luôn có đủ 6 cột chuẩn

---

## Giả định còn lại

1. Pricing live chưa được khóa trong lane Team 4, nên registry này cố ý không phát hành giá bán production.
2. Demo / output hiện là data contract và seed nội dung; asset thật, media thật, screenshot thật sẽ do Team 2 / Content gắn sau.
3. `business.vetuonglai.com` vẫn là `planned / internal planning only` cho tới khi board runtime truth nâng trạng thái.
4. `flow.iai.one` mới chỉ được giữ ở mức placeholder link và không được coi là integration usable.

---

## Kết luận

Team 4 đã khóa xong lớp dữ liệu để các team khác consume an toàn:

- form
- package
- comparison
- demo
- output
- business contract

Từ đây, Team 2 có thể dựng shell/UI và Team 5 có thể viết verify pack mà không phải tự phát minh schema nữa.
