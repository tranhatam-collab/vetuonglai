# VTL_41_LANGUAGE_CODEX_IMPLEMENTATION_LOCK_2026-04-17

Version: 1.0
Date: 2026-04-17
Status: active
Owner: Team 1

## Purpose
Khóa implementation plan cho Language Codex phase để tất cả team tiếp tục dev mà không làm lệch ngôn ngữ công khai của hệ.

## Locked Deliverables
- `content/language-codex.md`
- `content/vi.json`
- `content/en.json`
- `content/site-map.md`
- `content/seo-registry.csv`
- public copy rewrite cho hub, vc, edu, life, finance, invest, green
- build lane `VTL_BUILD_SCOPE=public-core-only` để QA lớp public không bị chặn bởi lane member/work/market

## Team Split
### Team 1
- giữ lane runtime + cutover member
- đồng thời khóa shared i18n source, status labels và disclosure rendering sạch internal labels
- rerun build/check/smoke sau mỗi đợt rewrite

### Team 2
- audit toàn bộ public section copy theo codex
- sửa hero, CTA, section title, disclosure wording, meta copy
- không mở scope visual mới trước khi pass consistency

### Team 3
- kiểm tra trust wording, legal wording, badge/status, claims về proof và investing
- reject mọi câu overpromise, income language, medical language, crypto-hype language

## Gate Before More Dev
Không đội nào được mở tiếp `member`, `work`, `market` như public-ready surface trước khi:
1. hub + 6 domain public core pass codex
2. internal labels bị gỡ khỏi public pages
3. i18n source được xem là nguồn chính thức

## Progress Rule
Mỗi sprint phải báo:
- % i18n coverage
- % public pages pass codex
- số lỗi internal wording còn lại
- số lỗi CTA / badge / meta còn lại
