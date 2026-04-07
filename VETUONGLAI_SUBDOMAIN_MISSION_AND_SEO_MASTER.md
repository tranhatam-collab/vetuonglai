# VETUONGLAI_SUBDOMAIN_MISSION_AND_SEO_MASTER

Version: 1.0
Last updated: 2026-04-08

## Mục đích

File này khóa lớp vận hành cấp hệ cho:
- nhiệm vụ duy nhất của từng subdomain
- quy tắc không chồng chéo intent
- cấu trúc URL chuẩn
- canonical rules
- internal link rules
- keyword ownership
- sitemap toàn hệ

Mục tiêu là để DEV, SEO, CONTENT, DESIGN, OPS cùng làm theo một bản đồ chung mà không duplicate nội dung và không làm loãng nhiệm vụ của từng domain.

## PHẦN 1 — NGUYÊN TẮC NỀN TẢNG

### 1.1 Quy tắc không chồng chéo

```text
MỖI SUBDOMAIN = 1 NHIỆM VỤ DUY NHẤT
  -> Không có 2 subdomain cùng phục vụ 1 intent
  -> Nếu nội dung thuộc về A, nó không tồn tại đầy đủ ở B
  -> B chỉ preview, trích đoạn hoặc link đến A
```

Ví dụ:
- hướng dẫn freelance -> `blog.` hoặc `edu.` tùy intent
- đăng tìm việc freelance -> `work.`
- chứng nhận freelancer -> `vc.`

Ba trang khác nhau, ba intent khác nhau, link đến nhau nhưng không duplicate nhau.

### 1.2 Cấu trúc URL chuẩn toàn hệ

```text
Trang chủ subdomain:    https://[sub].vetuonglai.com/
Category:               https://[sub].vetuonglai.com/[category]/
Trang con / bài viết:   https://[sub].vetuonglai.com/[category]/[slug]/
Tag / keyword:          https://[sub].vetuonglai.com/tag/[keyword]/
User profile:           https://member.vetuonglai.com/u/[username]/
VC badge public:        https://vc.vetuonglai.com/badge/[badge-id]/
```

### 1.3 Canonical rule — chống duplicate

```text
Nội dung gốc tại blog.
Nếu preview ở hub, community, edu hoặc nơi khác
-> canonical luôn trỏ về blog. là nguồn gốc duy nhất
```

Quy tắc này áp dụng tương tự cho:
- course gốc ở `edu.`
- product gốc ở `market.`
- badge gốc ở `vc.`
- job gốc ở `work.`

## PHẦN 2 — BẢN ĐỒ NHIỆM VỤ TỪNG SUBDOMAIN

### `vetuonglai.com` — Hub trung tâm

Nhiệm vụ duy nhất:
- onboarding
- điều hướng toàn hệ
- tầm nhìn thương hiệu

Không làm:
- không chứa bài viết dài như domain content gốc
- không chứa khóa học gốc
- không chứa job listing gốc
- không chứa marketplace listing gốc

Trang cần có:
- `/`
- `/ve-chung-toi/`
- `/he-sinh-thai/`
- `/bat-dau/`
- `/thanh-vien/`
- `/tin-tuc/`
- `/lien-he/`
- `/sitemap/`

### `member.vetuonglai.com` — Identity & dashboard

Nhiệm vụ duy nhất:
- SSO toàn hệ
- profile cá nhân
- journey engine
- wallet / earnings summary

Không làm:
- không chứa course content gốc
- không chứa marketplace gốc
- không chứa job listing gốc

Trang cần có:
- `/`
- `/dang-ky/`
- `/dang-nhap/`
- `/quen-mat-khau/`
- `/u/[username]/`
- `/hanh-trinh/`
- `/thu-nhap/`
- `/vc-badges/`
- `/cai-dat/`
- `/nang-cap/`

### `vc.vetuonglai.com` — Trust layer & VC registry

Nhiệm vụ duy nhất:
- xác minh năng lực độc lập
- cấp badge
- public registry

Không làm:
- không chứa course content
- không chứa profile đầy đủ
- không chứa work listing

Trang cần có:
- `/`
- `/badge/[badge-id]/`
- `/badges/`
- `/badges/[badge-type]/`
- `/claim/`
- `/claim/[badge-type]/`
- `/leaderboard/`
- `/verify/`
- `/nft/`

### `edu.vetuonglai.com` — AI learning system

Nhiệm vụ duy nhất:
- học có output thật
- micro-credential
- VC proof integration

Không làm:
- không chứa job listings gốc
- không bán template/tool như marketplace
- không chứa blog tự do

Trang cần có:
- `/`
- `/khoa-hoc/`
- `/khoa-hoc/[slug]/`
- `/khoa-hoc/[slug]/bai-[n]/`
- `/lo-trinh/`
- `/lo-trinh/[slug]/`
- `/giang-vien/`
- `/giang-vien/[username]/`
- `/tai-lieu/`
- `/ket-qua/[username]/`
- `/dang-khoa-hoc/`

### `work.vetuonglai.com` — Việc làm & project thật

Nhiệm vụ duy nhất:
- job board
- freelance marketplace
- project board

Không làm:
- không chứa course gốc
- không chứa digital asset gốc
- không chứa community discussion gốc

Trang cần có:
- `/`
- `/viec-lam/`
- `/viec-lam/[slug]/`
- `/freelance/`
- `/freelance/[username]/`
- `/du-an/`
- `/du-an/[slug]/`
- `/noi-bo/`
- `/dang-tuyen/`
- `/ung-tuyen/[job-slug]/`
- `/ky-nang/`
- `/ky-nang/[skill-slug]/`
- `/muc-luong/`

### `market.vetuonglai.com` — Chợ tài sản số

Nhiệm vụ duy nhất:
- bán và mua sản phẩm số có proof

Không làm:
- không bán dịch vụ con người
- không thay thế khóa học dài
- không là blog / guide hub

Trang cần có:
- `/`
- `/san-pham/`
- `/san-pham/[slug]/`
- `/danh-muc/`
- `/danh-muc/[cat]/`
- `/ban/[username]/`
- `/dang-ban/`
- `/gio-hang/`
- `/tag/[keyword]/`
- `/moi-nhat/`
- `/ban-chay/`

### `ai.vetuonglai.com` — AI tools hỗ trợ

Nhiệm vụ duy nhất:
- công cụ AI thực chiến cho creator, freelancer, builder

Không làm:
- không là nơi chứa khóa học AI
- không là nơi chứa bài blog AI
- không là nơi publish content AI tự do

### `blog.vetuonglai.com` — Content mở & SEO hub

Nhiệm vụ duy nhất:
- bài viết giá trị thật
- SEO thu hút người mới
- cộng đồng viết có kiểm duyệt

Không làm:
- không chứa course content gốc
- không chứa job listings gốc
- không thay docs sản phẩm hoặc runtime docs

### `community.vetuonglai.com` — Forum & circle

Nhiệm vụ duy nhất:
- thảo luận
- kết nối
- nhóm học/làm/sống

Không làm:
- không chứa bài long-form gốc
- không chứa course gốc
- không chứa job listing gốc

### `live.vetuonglai.com` — Workshop & livestream

Nhiệm vụ duy nhất:
- sự kiện trực tiếp
- workshop
- webinar
- Q&A

### `affiliate.vetuonglai.com` — Affiliate dashboard

Nhiệm vụ duy nhất:
- tracking
- payout
- rule và tài nguyên affiliate

### `life.vetuonglai.com`

Nhiệm vụ duy nhất:
- nội dung sức khỏe, nhịp sống, kỷ luật, well-being

### `finance.vetuonglai.com`

Nhiệm vụ duy nhất:
- tài chính cá nhân cơ bản, budgeting, discipline

### `invest.vetuonglai.com`

Nhiệm vụ duy nhất:
- đầu tư tỉnh táo, không FOMO

### `green.vetuonglai.com`

Nhiệm vụ duy nhất:
- sống bền vững, green proof, green economy

### `tools.vetuonglai.com`

Nhiệm vụ duy nhất:
- free tools không cần login hoặc entry tools đơn giản

## PHẦN 3 — MA TRẬN INTERNAL LINK TOÀN HỆ

### 3.1 Link từ mỗi subdomain đến các sub khác

```text
vetuonglai.com  -> tất cả
member.         -> edu. vc. work. market. community. blog.
vc.             -> member. edu. work.
edu.            -> vc. work. market. community. blog.
work.           -> vc. edu. member. market. community.
market.         -> member. vc. edu. community.
ai.             -> edu. work. market. community.
blog.           -> edu. vc. work. market. ai. community. life.
community.      -> edu. work. market. blog. vc. live.
live.           -> member. vc. market. community. edu.
affiliate.      -> vc. edu. blog.
life.           -> finance. invest. green. community. blog.
finance.        -> invest. tools. edu. community.
invest.         -> finance. community. blog.
green.          -> life. community. blog.
tools.          -> vc. work. finance. edu.
```

### 3.2 Link ngược về hub

Mọi subdomain đều phải có:
- footer link về `vetuonglai.com`
- footer link về `member.`
- footer link về `vc.`
- footer link về sitemap toàn hệ

## PHẦN 4 — SEO KEYWORD MASTER MAP

### 4.1 Phân vùng keyword không chồng chéo

Nguyên tắc:
- awareness -> `blog.` / `life.` / hub
- consideration -> `edu.` / `vc.` / `work.`
- decision -> `market.` / `work.` / `member.` / `edu.`
- retention / advocacy -> `community.` / stories layer / `live.`

### 4.2 Keyword cluster theo chủ đề

Mỗi cluster phải có owner subdomain rõ.

Ví dụ:
- freelance cluster: `blog.` + `work.` + `vc.` + `edu.`
- creator cluster: `blog.` + `market.` + `edu.` + `vc.`
- remote work cluster: `blog.` + `work.` + `life.` + `edu.`
- AI tools cluster: `ai.` + `blog.` + `edu.` + `work.`

## PHẦN 5 — INTERNAL LINK PATTERN CHUẨN

### 5.1 Mỗi bài blog phải có 4 loại link

1. contextual link trong thân bài
2. author link
3. related content cùng sub
4. CTA link cross-sub

### 5.2 Anchor text chuẩn

Không dùng:
- click here
- xem thêm
- tại đây

Phải dùng anchor text mô tả đích đến thật.

### 5.3 Link structure cho course / product / page trọng tâm

Phải có:
- breadcrumb
- links sang profile / badge / discussion / next step / related asset đúng logic journey

## PHẦN 6 — CHECKLIST CHO DEV

### 6.1 Technical SEO bắt buộc từng subdomain

- robots.txt đúng
- sitemap.xml đúng
- canonical tag đúng
- hreflang nếu có song ngữ
- Open Graph tags đầy đủ
- schema markup phù hợp loại trang
- mobile-first
- custom 404 có điều hướng hữu ích
- redirect map khi đổi URL

### 6.2 Internal link implementation

- mọi subdomain có link về hub
- footer toàn hệ có links cốt lõi
- cross-sub link luôn dùng absolute URL
- cùng sub có thể dùng relative URL
- breadcrumb schema cho trang cấp 2+

### 6.3 URL slug chuẩn

- tiếng Việt không dấu
- lowercase
- gạch ngang
- không dùng ID xấu
- tối ưu 3-6 từ nếu có thể

## PHẦN 7 — MASTER SITEMAP TOÀN HỆ

Nguyên tắc:
- chỉ index public routes có giá trị
- private dashboard routes phải noindex
- sitemap hub phải đóng vai trò cổng vào toàn hệ

## Definition of done

Subdomain mission và SEO layer chỉ được xem là xong khi:
- mỗi subdomain có mission duy nhất rõ ràng
- không chồng chéo content owner
- URL structure và canonical rules nhất quán
- internal linking phản ánh đúng journey
- sitemap và technical SEO có thể triển khai ngay
