# VTL 26 OFFICIAL DOCS UPGRADE PARALLEL PLAN

Version: 1.0  
Date: 2026-04-10  
Status: locked-for-execution  
Owner: Team 1 (platform runtime) with Team 2 + Team 3 parallel integration

## Mục tiêu

Đưa bộ `vetuonglai_official_docs` (12 file) thành source-of-truth máy đọc được để:

- 3 team không đọc rời rạc từng file
- release check có thể phát hiện drift giữa docs và runtime
- dev song song không chồng chéo khi founder tiếp tục cập nhật file mới

## Input khóa

- `vetuonglai_official_docs/01_SYSTEM_VALUE_MAP_FINAL.md`
- `vetuonglai_official_docs/02_LIVE_NOW_NEXT_LATER_MATRIX.md`
- `vetuonglai_official_docs/03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`
- `vetuonglai_official_docs/04_PUBLIC_TEASER_CONTRACT_ALL_SUBDOMAINS.md`
- `vetuonglai_official_docs/05_PAYPAL_MAGIC_LINK_IDENTITY_FLOW.md`
- `vetuonglai_official_docs/06_SPECIALIST_PACKS_9_TIER_CATALOG.md`
- `vetuonglai_official_docs/07_AFFILIATE_AND_PARTNER_POLICY.md`
- `vetuonglai_official_docs/08_MEMBER_DASHBOARD_AFTER_PAYMENT_SPEC.md`
- `vetuonglai_official_docs/09_CONTENT_DEPTH_MATRIX_PER_SUBDOMAIN.md`
- `vetuonglai_official_docs/10_DEV_EXECUTION_SEQUENCE_MASTER.md`
- `vetuonglai_official_docs/11_LEGAL_TRUST_LANGUAGE_RULES.md`
- `vetuonglai_official_docs/12_RUNTIME_TRUTH_MASTER.md`

## Output khóa

- Hub endpoint: `https://vetuonglai.com/api/official-docs-lock.json`
- Member mirror endpoint: `https://member.vetuonglai.com/api/official-docs-lock.json`
- Contract manifest mapping cho governance layer trong `/api/contracts.json`
- Release check bắt buộc ingest đủ 12 file + parse pack count + parse annual-pricing drift flag

## Quy tắc vận hành song song cho 3 team

### Team 1 (Platform / Runtime)

- maintain endpoint `official-docs-lock.json`
- giữ dual-gateway checkout/webhook contract ổn định
- không tự ý đổi pricing runtime khi chưa có founder lock cuối

### Team 2 (Content / Routing / CTA)

- chỉ dùng phrase/copy hợp lệ theo file `11_LEGAL_TRUST_LANGUAGE_RULES.md`
- deep-content CTA của subdomain luôn route về homepage purchase-hub
- wording live/next/later phải bám theo official docs lock endpoint

### Team 3 (Policy / Trust / Compliance)

- affiliate chỉ mở sau annual + pack + compliance pass
- enforce disclosure placement map đầy đủ
- policy event/reporting phải bám theo team3 matrix + official docs lock

## Handshake contract

- Team 1 xuất endpoint + contract manifest
- Team 2 consume endpoint để render copy/routing state
- Team 3 consume endpoint để lock policy/compliance checks

Không đội nào tự “ghi đè truth” bằng file cục bộ ngoài endpoint contract.

## Definition of done

- build/check pass với official docs ingestion
- hub/member đều publish endpoint official docs lock
- manifest map đầy đủ governance contracts
- 3 team đọc cùng một source-of-truth trước khi nhận batch task mới
