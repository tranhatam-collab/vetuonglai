# VETUONGLAI_MASTER_SYSTEM_UPGRADE_2026_04

Version: 1.0
Last updated: 2026-04-08

## Mục đích

File này là bản khóa nâng cấp hệ thống sau khi đối chiếu:
- source of truth hiện có
- các spec EDU, admin, journey, language, design
- proposal mở rộng economy và member system

Mục tiêu là để cả team có một bản nâng cấp đồng bộ duy nhất để cùng hiểu:
- hệ đang là gì
- hệ sẽ mở rộng như thế nào
- cái gì là core
- cái gì chỉ là expansion hoặc capability
- tiến độ cần theo dõi ở đâu

## Những gì được giữ nguyên

Các core domain hiện tại vẫn là backbone:
- `vetuonglai.com`
- `edu.vetuonglai.com`
- `life.vetuonglai.com`
- `finance.vetuonglai.com`
- `invest.vetuonglai.com`
- `green.vetuonglai.com`
- `vc.vetuonglai.com`

Các nguyên tắc không đổi:
- human-centered
- AI-assisted, không AI-first theo kiểu vô hồn
- experience-first
- proof-driven
- không LMS cũ
- không startup UI generic
- không MMO rẻ tiền

## Những gì được bổ sung chính thức

### 1. Economy layer

Economy được nâng lên thành một lớp hệ thống chính thức, nhưng không thay thế triết lý gốc.

Vai trò:
- nối học với thu nhập thật
- nối đóng góp với trust thật
- nối content với value thật

### 2. Member system

Member system được coi là một lớp chiến lược bắt buộc để nối:
- identity
- access
- journey
- progress
- proof
- contribution

### 3. Admin and journey layer

Admin panel và journey engine được nâng thành phần bắt buộc trong operating system của toàn hệ.

### 4. EDU runtime expansion

EDU đã vượt qua mức catalog-only và bắt đầu có:
- course overview
- player runtime
- proof/reflection state
- eligibility shape

## Bản đồ hệ thống sau nâng cấp

### Core

- Hub / root
- EDU
- LIFE
- FINANCE
- INVEST
- GREEN
- VC

### Strategic expansion

- COMMUNITY
- MISSION
- STORIES
- FOUNDATION
- LABS

### Capability expansion

- MEMBER
- WORK
- TOOLS
- ADMIN
- API

### Deferred / conditional expansion

- MARKET
- AFFILIATE
- LIVE
- BLOG như domain riêng
- AI như domain riêng

## Quy tắc đánh giá proposal mới

Khi có proposal domain hoặc product mới, team phải trả lời:
- nó giải quyết vấn đề người dùng thật nào?
- nó thuộc domain hiện có hay cần domain mới?
- nó có làm lệch triết lý không?
- nó có runtime truth được không?
- nó có owner, legal, ops, QA và trust logic chưa?

Nếu chưa trả lời đủ thì không được nâng thành source of truth chính thức.

## Các file canonical sau nâng cấp

Team bắt buộc xem thêm các file sau:
- `VETUONGLAI_ECONOMY_AND_MEMBER_SYSTEM_MASTER.md`
- `VETUONGLAI_ADMIN_PANEL_REAL_MASTER_SPEC.md`
- `VETUONGLAI_USER_JOURNEY_ENGINE_MASTER_SPEC.md`
- `EDU_COURSE_PLAYER_REAL_AND_AI_FLOW_MASTER_SPEC.md`
- `VETUONGLAI_LANGUAGE_AND_EXPERIENCE_MASTER.md`
- `VETUONGLAI_NORTH_STAR_VISION_2026.md`
- `VETUONGLAI_HOMEPAGE_DIRECTION_SYSTEM.md`
- `VETUONGLAI_DOMAIN_HOMEPAGE_COPY_GUIDE.md`
- `VETUONGLAI_SUBDOMAIN_MISSION_AND_SEO_MASTER.md`

## Bộ V2 chính thức cho team

Từ bản nâng cấp này, bộ 14 file V2 được xem là extended implementation brief chính thức cho các lớp sau:

- ecosystem architecture V2
- member policy
- VC trust system
- proof-based economy
- EDU AI learning
- work system
- affiliate clean program
- content policy strict
- tech architecture / ERD
- roadmap phases
- legal VN
- creator wallet
- brand tone
- data flow / journey

## Bộ V2 hoàn chỉnh hiện tại

Bộ V2 hiện đã mở rộng thành full package 20 file, bao phủ thêm:

- financial model
- marketing launch plan
- investor deck brief
- wireframe/UI brief
- seed content plan
- testing plan cho VC và escrow

Như vậy team có thể làm việc đồng bộ theo cùng một bộ brief cho:
- product
- dev
- ops
- legal
- content
- design
- finance
- founder
- investor communication

Điểm cần nhớ:

- Đây là blueprint triển khai.
- Không phải toàn bộ đều live.
- Runtime truth vẫn là lớp xác nhận cuối cùng cho production state.

## Progress governance

Từ bản nâng cấp này, mọi tiến độ phải được report theo format cố định:

- What is being built
- Why it matters
- What files are affected
- What system layer it belongs to
- What is still missing
- Next immediate task

## Tiến độ ưu tiên tiếp theo

### Priority 1

- root hub onboarding và journey entry thật
- EDU player nối progress/journey thật
- admin shell và admin APIs contract

### Priority 2

- community MVP
- mission/work pilot
- member profile layer

### Priority 3

- payment + payout + access rules hoàn chỉnh
- verified member model
- controlled creator economy flow

## Definition of sync

Hệ chỉ được coi là đồng bộ khi:
- docs cùng một hướng
- routes cùng một promise
- CTA đúng vai trò domain
- runtime truth phản ánh đúng tình trạng live/preview/planned
- team có thể đọc 1 map và hiểu toàn hệ giống nhau

## Kết luận

Về Tương Lai không nâng cấp bằng cách thêm nhiều domain theo cảm hứng.

Về Tương Lai nâng cấp bằng cách làm rõ hơn:
- vai trò của từng lớp
- hành trình của người dùng
- đường đi từ học tới làm tới proof tới contribution

Đó là cách để cả team cùng build một hệ sống thật, làm thật và tương lai thật.
