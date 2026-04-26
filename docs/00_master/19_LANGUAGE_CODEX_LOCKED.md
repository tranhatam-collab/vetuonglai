# 19_LANGUAGE_CODEX_LOCKED

## Mục đích
Khóa một ngôn ngữ duy nhất cho toàn bộ hệ `*.vetuonglai.com` để team DEV, Content, Design, QA và AI cùng dùng chung.

## Non-Negotiable
- không hype
- không sales pressure
- không trộn internal ops wording vào public layer
- không để từng domain nói bằng một giọng khác nhau
- không hard-code public copy ngoài i18n source

## Source of Truth
- `content/language-codex.md`
- `content/locale-registry.json`
- `content/vi.json`
- `content/en.json`
- `content/site-map.md`
- `content/seo-registry.csv`

## Public Lock Sentence
Không hứa hẹn kết quả. Chỉ cung cấp cấu trúc để sống rõ hơn.

## Public Status Lock
Chỉ dùng:
- Live
- Member Preview
- Planned
- Bridge

## Việc Team Dev Phải Làm
1. bind mọi text public qua `content/vi.json` và `content/en.json`
2. bind mọi config locale, hreflang và fallback qua `content/locale-registry.json`
3. gỡ toàn bộ `DPM-*`, `source state`, `public host`, `ready`, endpoint docs khỏi landing page public
4. chuẩn hóa badge, CTA và metadata theo registry chung
5. build + check + QA consistency sau mỗi đợt sửa copy

## Việc Team Content Phải Làm
1. viết theo một ý chính mỗi trang
2. giữ tiếng Việt có dấu đầy đủ
3. giữ tiếng Anh ngắn, rõ và không dịch từng chữ
4. không dùng từ cấm
5. không mở locale mới khi bản tiếng Việt gốc chưa khóa

## Việc Team QA Phải Chặn
- mixed bilingual line
- internal labels lộ ra public
- CTA mang giọng bán hàng
- status badge sai chuẩn
- meta title / description lệch codex

## Founder Lock
Nhà sáng lập hệ Về Tương Lai: Ông Trần Hà Tâm.
