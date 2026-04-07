# VETUONGLAI INFORMATION ARCHITECTURE

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này thống nhất cấu trúc thông tin toàn hệ để FE, SEO, content, design và product làm cùng một logic.

## Sitemap toàn hệ

### Root hub

- `/`
- `/manifesto`
- `/vision`
- `/about`
- `/map`
- `/start`
- `/journey`
- `/library`
- `/stories`
- `/community`
- `/projects`
- `/contact`
- `/privacy`
- `/terms`
- `/transparency`

### EDU

- `/`
- `/courses`
- `/course/:slug`
- `/learn/:lesson`
- `/exam`
- `/result`
- `/certificate`

### VC

- `/`
- `/verify`
- `/v/:code`
- `/trust`

## Menu toàn hệ

Menu root nên có:

- Home
- Start
- Library
- Ecosystem
- Community
- VC

Menu domain chuyên môn nên có:

- Home
- Pathways / Tracks
- Resources / Tools
- Proof / VC link nếu có

## Footer toàn hệ

Footer cần có:

- ecosystem links
- manifesto / about
- privacy / terms / disclaimer
- trust / transparency
- contact

## Internal link logic

Internal link phải phục vụ 3 mục tiêu:

- điều hướng user sang next step
- xây trust và context
- tăng SEO có logic

Mỗi page quan trọng nên có:

- ít nhất 1 link lên cấp trên
- ít nhất 1 link ngang cùng chủ đề
- ít nhất 1 link xuống next action

## Breadcrumb logic

Nên dùng cho:

- course detail
- lesson
- library article
- story detail
- tool detail

Không cần nhất thiết cho trang landing cấp 1.

## Search logic

Search về sau cần tìm được ít nhất:

- courses
- articles
- stories
- tools
- glossary / faq
- VC records nếu mở cho public search

## Content hierarchy

Hierarchy ưu tiên:

- hub level meaning
- domain level pathways
- item level content / tool / record

## URL naming rules

- slug ngắn, rõ, ASCII lowercase
- không dùng slug mơ hồ
- ưu tiên danh từ + động từ rõ nghĩa nếu cần

Ví dụ:

- `/course/hands-on-startup-building`
- `/stories/life-reset-pilot`

## Canonical strategy

- mỗi page chỉ có 1 canonical source
- root không duplicate domain page role
- pages preview không được coi là canonical public source nếu đã có custom domain

## Language path / query strategy

Hệ thống hiện tại đang có `?lang=vi|en`.

Nguyên tắc tạm thời:

- duyệt theo `?lang=vi` và `?lang=en`
- có alternate links rõ ràng
- metadata song ngữ đầy đủ

Nếu sau này nâng cấp architecture, cần quyết định một model ổn định:

- query-based
- path-based

Không được vừa path-based vừa query-based nếu không có quy tắc rõ ràng.
