# VETUONGLAI LANGUAGE CODEX

Version: 1.0
Status: locked
Owner: Founder
Founder: Ông Trần Hà Tâm
Last updated: 2026-04-17

## Purpose
Language Codex này là chuẩn bắt buộc cho toàn bộ team DEV, Content, Design, QA và AI Code khi làm việc trong hệ `*.vetuonglai.com`.

Mục tiêu:
- một hệ, một ngôn ngữ, một cách nói
- loại bỏ hype, marketing noise và internal ops wording khỏi public layer
- giúp nhiều team làm song song mà không làm vỡ triết lý hệ thống
- giúp web sẵn sàng mở rộng thêm ngôn ngữ mà không phá chuẩn tiếng Việt gốc

## Nguồn i18n bắt buộc
- `content/language-codex.md`
- `content/locale-registry.json`
- `content/vi.json`
- `content/en.json`
- `content/seo-registry.csv`

## Core Principle
Hệ này không bán hứa hẹn.
Hệ này không truyền cảm hứng.
Hệ này không dạy thành công.

Hệ này giúp con người sống rõ, học đúng, làm thật và có bằng chứng kiểm tra được.

## Tone
- calm
- precise
- real
- long-term
- non-sales

## Writing Rules
### Vietnamese
- có dấu đầy đủ 100%
- không viết tắt
- không dùng slang
- không dùng câu cảm xúc để bán hàng
- 1 câu không quá 22 từ khi có thể
- 1 đoạn từ 2 đến 4 câu
- 1 trang chỉ giữ một ý chính

### English
- ngắn
- rõ
- không hype
- không dịch từng chữ
- ưu tiên danh từ và cấu trúc trung tính

## Required Core Terms
| Việt | English |
| --- | --- |
| Hệ sống | Life system |
| Lớp xác minh | Verification layer |
| Lớp học | Learning layer |
| Lớp đời sống | Life layer |
| Lớp tài chính | Finance layer |
| Lớp đầu tư | Investing layer |
| Lớp xanh | Green layer |
| Bằng chứng | Evidence |
| Xác minh | Verification |
| Nhịp sống | Rhythm |
| Kỷ luật | Discipline |
| Tư duy dài hạn | Long-term thinking |
| Đầu tư tỉnh táo | Calm investing |
| Điểm vào | Entry point |
| Lộ trình | Pathway |
| Gói bằng chứng | Evidence packet |
| Dữ liệu gốc | Source data |
| Hồ sơ | Profile |
| Rủi ro | Risk |

## Banned Terms
### Vietnamese
- đột phá
- đổi đời
- kiếm tiền nhanh
- tự do tài chính
- chữa lành
- truyền cảm hứng
- thành công nhanh
- đảm bảo
- cơ hội có 1-0-2

### English
- coaching
- transformation
- breakthrough
- guaranteed return
- make money fast
- passive income
- inspiration
- boost
- maximize

## Public CTAs
### Vietnamese
- Khởi động đối thoại
- Xem điểm vào
- Mở toàn bộ hệ của bạn
- Xem lớp liên quan

### English
- Start dialogue
- View entry point
- Open your full system
- Explore related layer

## Status Labels
Chỉ dùng đúng 4 trạng thái:
- Live
- Member Preview
- Planned
- Bridge

Không dùng:
- Beta
- Coming soon
- Launching
- Early access

## Bilingual Rules
- tiếng Việt trước, tiếng Anh sau
- không trộn VI và EN trên cùng một dòng nội dung
- mọi chuỗi public phải đi qua i18n source

## Multilingual Expansion Rules
- tiếng Việt (`vi-VN`) là source of truth cho editorial và public meaning
- tiếng Anh (`en-US`) là lớp dịch đã review, phục vụ technical clarity và mở rộng quốc tế
- mọi ngôn ngữ mới chỉ được mở sau khi khóa xong bản tiếng Việt của cùng nội dung
- không bật locale mới chỉ vì “dịch xong chuỗi”
- phải có glossary review, SEO review, QA review và locale activation decision
- fallback runtime phải bám `content/locale-registry.json`
- không thêm locale mới vào build/runtime nếu chưa cập nhật locale registry

## Dev Rules
- không hard-code text trong template UI
- toàn bộ text public phải đi qua `content/vi.json` và `content/en.json`
- mọi config locale/hreflang/fallback phải đi qua `content/locale-registry.json`
- không hiển thị `DPM-*`, `source state`, `public host`, `ready`, `internal label` trên public pages
- docs/dev note phải tách khỏi public copy

## QA Gate
Reject ngay nếu public page có một trong các lỗi sau:
- hype language
- sales pressure
- internal ops wording
- bilingual duplication trên cùng một dòng
- status badge không thuộc 4 trạng thái đã khóa
- CTA mang giọng bán hàng hoặc thúc ép

## Shared Positioning
### Vietnamese
Về Tương Lai là một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng.

### English
Vetuonglai is a life system that helps people understand themselves, learn correctly, and produce verifiable value.

## System Lock Sentence
### Vietnamese
Không hứa hẹn kết quả. Chỉ cung cấp cấu trúc để sống rõ hơn.

### English
No promised outcomes. Only structure to help people live with more clarity.

## Public Copy Rewrite Lock
### Hub
- H1: VỀ TƯƠNG LAI
- Subline: Một hệ sống giúp con người hiểu mình, học đúng và tạo ra giá trị có thể kiểm chứng.

### VC
- H1: XÁC MINH
- Subline: Một lớp xác minh độc lập cho giá trị thật.

### LIFE
- H1: NHỊP SỐNG
- Subline: Ổn định cuộc sống trước khi tối ưu cuộc đời.

### FINANCE
- H1: TIỀN
- Subline: Hiểu tiền trước khi cố kiếm thêm tiền.

### INVEST
- H1: ĐẦU TƯ
- Subline: Đầu tư bắt đầu từ hiểu rủi ro.

### GREEN
- H1: XANH
- Subline: Biến tuyên bố xanh thành bằng chứng.

### EDU
- H1: HỌC
- Subline: Học để làm được việc, không phải để biết.

## Team Flow
### Content
VI Draft -> Review -> Final VI -> EN Translate -> EN Review -> JSON -> DEV

### Dev
Bind i18n -> Build -> SEO -> Optimize -> QA -> Deploy

## Immediate Execution Order
1. Chuẩn hóa `content/vi.json` và `content/en.json`
2. Khóa `content/locale-registry.json` cho `vi/en` hiện tại
3. Gỡ internal labels khỏi public layer
4. Chuẩn hóa badge, CTA và disclosure wording
5. Audit lại hub, vc, edu, life, finance, invest, green theo codex
6. Chỉ sau đó mới mở tiếp planned domains hoặc locale mới
