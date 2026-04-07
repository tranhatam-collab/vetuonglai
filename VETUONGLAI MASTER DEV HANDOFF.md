# VETUONGLAI MASTER DEV HANDOFF

Version: 1.0

Mục đích: khóa toàn bộ định hướng thương hiệu, sản phẩm, hệ thống, luồng người dùng, target architecture và roadmap triển khai thành một bộ handoff để team dev, product, content, design và infra có thể bắt đầu làm ngay.

Lưu ý quan trọng:

- Tài liệu này mô tả `target system` cần đạt tới.
- Điều đó không có nghĩa là toàn bộ hệ thống đã tồn tại đầy đủ trong repo hiện tại.
- Trạng thái production đã được xác minh riêng trong `DEV-ROLL OUT PLAN.md`.
- Blueprint thương hiệu tổng thể đã được định nghĩa riêng trong `VETUONGLAI BRAND BLUEPRINT + SYSTEM ARCHITECTURE.md`.

## 0. Nguyên tắc tổng

Về Tương Lai không phải chỉ là website.

Đây là một `Human Life System Platform`.

Toàn hệ thống được xây trên 6 lớp cốt lõi:

1. Brand
2. UX
3. Content
4. Product
5. Trust Layer
6. Community

Ý nghĩa của 6 lớp:

- Brand: linh hồn, tầm nhìn, hệ giá trị, ngôn ngữ chung
- UX: hành trình con người đi từ mơ hồ đến rõ ràng và hành động
- Content: tri thức nền, framework, hướng dẫn, manifesto, story
- Product: khóa học, bài học, công cụ, challenge, dashboard, tiến trình
- Trust Layer: bằng chứng, credential, xác minh độc lập, VC
- Community: kết nối, đồng hành, lan tỏa, phụng sự

## 1. North Star

Mục tiêu cuối cùng của Về Tương Lai là giúp con người bắt đầu từ hiện tại để đi tới một tương lai sống được trong tình yêu, sự thật, đủ đầy, bình an, hạnh phúc, ấm no, phẩm giá và phát triển chung.

Hệ thống này phải trả lời được 5 câu hỏi:

1. Con người đang thiếu điều gì?
2. Vì sao cuộc sống hiện tại chưa trọn vẹn?
3. Nên bắt đầu thay đổi từ đâu?
4. Thay đổi bằng cách nào để có kết quả thật?
5. Kết quả đó được chứng minh và tin cậy ra sao?

## 2. Định nghĩa sản phẩm tổng thể

Về Tương Lai là một hệ sinh thái đa domain, đa lớp, hướng tới phát triển con người toàn diện.

Nó kết hợp đồng thời:

- hệ tư tưởng và tầm nhìn sống
- hệ tri thức và giáo dục
- hệ thực hành và chuyển hóa
- hệ tài chính và tự chủ
- hệ sống bền vững
- hệ xác minh và niềm tin
- hệ cộng đồng và phụng sự

## 3. Kiến trúc domain chuẩn

### 3.1 Root

- `vetuonglai.com`
  - hub trung tâm
  - tầm nhìn
  - journey entry
  - ecosystem map
  - trust center

### 3.2 Core subdomains

- `life.vetuonglai.com`
- `edu.vetuonglai.com`
- `finance.vetuonglai.com`
- `invest.vetuonglai.com`
- `green.vetuonglai.com`
- `vc.vetuonglai.com`

### 3.3 Expanded subdomains

- `community.vetuonglai.com`
- `mission.vetuonglai.com`
- `healing.vetuonglai.com`
- `stories.vetuonglai.com`

Nguyên tắc:

- root hub giải thích ý nghĩa và điều hướng
- mỗi subdomain giải quyết một nhu cầu cốt lõi của con người
- VC là trust backbone của toàn hệ

## 4. Vai trò từng domain

### `vetuonglai.com`

Vai trò:

- nơi bắt đầu cho người mới
- nơi trình bày tầm nhìn và manifesto
- nơi điều hướng sang các trụ cột sống
- nơi tổng hợp tri thức nền và ecosystem map

### `life.vetuonglai.com`

Vai trò:

- đời sống
- sức khỏe nền tảng
- nhịp sống
- kỷ luật cá nhân
- cân bằng nội tâm
- hồi phục và bình an

### `edu.vetuonglai.com`

Vai trò:

- hệ giáo dục công nghệ
- học để làm được, không học để lấy bằng cấp
- học thông qua trải nghiệm thực tế, dự án thật, năng lực thật
- học lý thuyết cùng AI, công nghệ và giáo viên AI Realtime trong app đang xây

Nguyên tắc cốt lõi của EDU:

- không phụ thuộc bằng cấp
- không lấy trường lớp truyền thống làm trung tâm
- tập trung vào năng lực, trải nghiệm, đầu ra và bằng chứng
- AI đóng vai trò gia sư, trợ lý học tập, người hướng dẫn realtime
- con người học qua việc thực hành, phản biện, tạo sản phẩm và chứng minh kết quả

### `finance.vetuonglai.com`

Vai trò:

- tài chính căn bản
- quản trị dòng tiền
- kỷ luật tiền bạc
- an toàn tài chính
- chống lừa đảo

### `invest.vetuonglai.com`

Vai trò:

- đầu tư tỉnh táo
- due diligence
- quản trị rủi ro
- kỷ luật phân bổ vốn
- không FOMO

### `green.vetuonglai.com`

Vai trò:

- sống bền vững
- hành động xanh có bằng chứng
- impact dossier
- góp phần vào một tương lai có trách nhiệm với hành tinh

### `vc.vetuonglai.com`

Vai trò:

- trust layer
- registry xác minh độc lập
- credential, contribution, skill, proof
- nơi giữ bằng chứng và niềm tin cho toàn hệ

### `community.vetuonglai.com`

Vai trò:

- cộng đồng đồng hành
- nhóm thực hành
- accountability
- lan tỏa và kết nối giá trị sống

### `mission.vetuonglai.com`

Vai trò:

- công việc có ý nghĩa
- sứ mệnh
- phụng sự xã hội
- dự án tác động

### `healing.vetuonglai.com`

Vai trò:

- hồi phục nội tâm
- chữa lành
- ổn định cảm xúc
- hành trình quay về cân bằng

### `stories.vetuonglai.com`

Vai trò:

- câu chuyện thật
- nhân chứng sống động
- bằng chứng chuyển hóa
- hành trình người thật việc thật

## 5. Current state vs target state

### 5.1 Current verified state

Trạng thái đã xác minh trong repo và production hiện tại:

- repo hiện tại là một multi-site static system đang build ra `dist/<domain>`
- Pages projects đã tồn tại cho `hub`, `vc`, `edu`, `green`, `finance`, `life`, `invest`
- custom domain hiện đang active không đồng đều
- `edu`, `life`, `invest` chưa đồng bộ public access đầy đủ
- CI/CD hiện chưa deploy Worker lane đầy đủ

Chi tiết production xem trong `DEV-ROLL OUT PLAN.md`.

### 5.2 Target state

Mục tiêu tiếp theo không chỉ là sửa live domain, mà là nâng cấp dần sang một product platform có user, course, progress, media, payment, VC, admin, onboarding và community.

## 6. Repo target architecture

Tên repo mục tiêu để team phát triển dài hạn:

- `vetuonglai-platform`

Monorepo đề xuất:

```text
/apps
  /web-root
  /edu
  /life
  /finance
  /invest
  /green
  /vc

/packages
  /ui
  /config
  /auth
  /api
  /db

/services
  /vc-service
  /payment-service
  /user-service

/infra
  /cloudflare
  wrangler.toml
```

Giải thích:

- `apps`: các front-end app theo domain
- `packages/ui`: design system dùng chung
- `packages/config`: config, env schema, constants
- `packages/auth`: login, session, permission
- `packages/api`: API client/server contracts, shared validators
- `packages/db`: schema, migrations, repositories
- `services`: các service nghiệp vụ tách riêng để mở rộng về sau
- `infra`: deploy, cloudflare, routing, environments

## 7. Root website specification

`vetuonglai.com` bắt buộc phải có các trang sau:

- `/`
  - Hero
  - Manifesto teaser
  - Journey entry
  - Ecosystem map
  - CTA
- `/manifesto`
  - tuyên ngôn đầy đủ
- `/journey`
  - onboarding + test
- `/map`
  - sơ đồ hệ sinh thái
- `/start`
  - lộ trình bắt đầu cho người mới
- `/library`
  - tri thức nền
- `/community`
  - tham gia cộng đồng

Trang chủ phải trả lời được:

- Về Tương Lai là gì?
- Tại sao hệ này tồn tại?
- Tôi đang gặp vấn đề gì?
- Tôi nên bắt đầu từ đâu?
- Tôi sẽ đi qua hành trình nào?

## 8. User flow chuẩn

Luồng tổng:

Landing -> hiểu vấn đề -> test cá nhân -> chọn hành trình -> vào subdomain -> học / thực hành -> chứng nhận / proof -> tham gia cộng đồng

Luồng này là cột sống của toàn hệ.

Nếu không có flow này, hệ thống chỉ là bộ website rời rạc.

## 9. Onboarding system

Trang:

- `/start`

Chức năng:

- bài test 10 câu hỏi
- phân loại người dùng theo tình trạng hiện tại

Nhóm phân loại ban đầu:

- `lost`
- `stable`
- `growth`
- `builder`

Kết quả cần trả về:

- user đang ở trạng thái nào
- domain nào nên bắt đầu
- lộ trình 7 ngày, 30 ngày, 90 ngày
- CTA tiếp theo

## 10. Data model target

### USER

```text
id
email
name
level
journey_stage
created_at
```

Có thể mở rộng:

```text
persona
recommended_track
language
last_active_at
```

### COURSE

```text
id
title
description
price
level
modules[]
```

Mở rộng cần có:

```text
slug
thumbnail_url
status
certificate_template
duration
domain
```

### LESSON

```text
id
course_id
type
media_url
content
```

Giá trị `type`:

- `video`
- `pdf`
- `text`
- `quiz`
- `live_ai_session`

### PROGRESS

```text
user_id
lesson_id
completed
score
```

Mở rộng cần có:

```text
last_position
submitted_at
review_status
```

### CERTIFICATE

```text
id
user_id
course_id
hash
issued_at
vc_url
```

Mở rộng cần có:

```text
record_type
status
issuer
anchors
```

## 11. Content model

Loại nội dung cần hỗ trợ:

- `article`
- `course`
- `video`
- `story`
- `guide`

Có thể mở rộng thêm:

- `tool`
- `challenge`
- `reflection`
- `faq`

## 12. API system target

Base routes:

- `/api/users`
- `/api/courses`
- `/api/lessons`
- `/api/progress`
- `/api/payment`
- `/api/vc`

Nguyên tắc:

- API phải phục vụ được root hub và các app domain
- có auth cho private routes
- có schema validation cho request và response
- có phân biệt public data và protected data

## 13. EDU system specification

`edu.vetuonglai.com` là priority product pillar, không chỉ là một catalog tĩnh.

### 13.1 Triết lý sản phẩm EDU

EDU là hệ giáo dục công nghệ cho tương lai con người.

Nó không xây trên bằng cấp.

Nó không lấy lý thuyết trường lớp làm trung tâm.

Nó xây trên 4 nguyên lý:

1. Học để làm được
2. Học qua trải nghiệm thực tế
3. Học lý thuyết cùng AI và công nghệ
4. Chứng minh năng lực bằng đầu ra và evidence

### 13.2 Learning stack của EDU

EDU phải kết hợp:

- content có cấu trúc
- bài học thực chiến
- challenge và project
- AI realtime teacher / tutor trong app
- quiz / assessment
- evidence packet
- VC issuance

### 13.3 EDU pages bắt buộc

- `/courses`
  - danh sách khóa học
- `/course/:id` hoặc `/course/:slug`
  - chi tiết khóa học
- `/learn/:lesson`
  - trang học bài
- `/exam`
  - bài thi hoặc bài đánh giá
- `/result`
  - kết quả
- `/certificate`
  - chứng chỉ + VC

### 13.4 EDU product requirements

- khóa học có module rõ ràng
- bài học hỗ trợ video, pdf, text, AI session
- học viên có progress tracking
- có exam hoặc milestone review
- có output / project / bài nộp
- có route sang VC khi đạt điều kiện

### 13.5 EDU strategic distinction

Đây là điểm khác biệt lớn nhất của EDU:

- học cùng AI Realtime
- học trong app công nghệ của hệ thống
- học để tạo sản phẩm, năng lực và kết quả đo được
- không bị ràng buộc bởi cơ chế bằng cấp truyền thống

## 14. Media system

Target media stack:

- R2 cho `pdf`, `images`, tài liệu, workbook
- Stream cho `video`

Yêu cầu:

- upload pipeline rõ ràng
- metadata media
- signed / protected access nếu cần
- lesson player đọc được media asset chuẩn

## 15. Trust layer

`vc.vetuonglai.com` là cực kỳ quan trọng.

Nó là trust backbone của toàn hệ.

VC cần hỗ trợ ít nhất 3 loại record:

- `course_completed`
- `skill`
- `contribution`

API cần có:

- `POST /api/vc/issue`
- `GET /api/vc/verify`

Về nghiệp vụ, VC phải làm được:

- issue record
- verify record
- route đến `/v/:code`
- hiển thị bằng chứng tối thiểu
- lưu anchors và hash
- tách biệt role issuer và role verifier

## 16. Payment system

Target payment stack:

- Stripe

Cần có:

- checkout
- payment success handling
- webhook verification
- unlock course
- issue VC tùy theo loại sản phẩm

Flow:

user pay -> webhook -> mark paid -> unlock course -> issue VC optional

## 17. Admin panel

Trang:

- `/admin`

Capabilities tối thiểu:

- create course
- upload lesson
- manage users
- view progress
- issue certificate

Mở rộng cần có:

- content moderation
- media library
- reviewer tools
- AI session config
- analytics dashboard

## 18. Design system direction

UI direction theo đề xuất hiện tại:

- dark
- glass
- minimal
- Apple-like

Cảnh báo quan trọng:

- không được biến toàn hệ thành một sản phẩm lạnh, vô cảm, corporate
- dark UI chỉ là một lớp mỹ thuật, không được làm mất tính người và tính bình an của thương hiệu

Màu nền đề xuất:

- `#05070a`

Accent đề xuất:

- green-blue gradient

Tiêu chuẩn UX vẫn phải giữ:

- ấm
- rõ
- dễ đọc
- mobile tốt
- không tạo cảm giác xa cách

## 19. SEO system

Bắt buộc có:

- meta
- OG
- sitemap
- structured data
- bilingual metadata nếu site có song ngữ

Ngoài ra cần có:

- canonical rõ ràng
- schema cho course/article/organization nếu phù hợp

## 20. Email system

Email flows cần có:

- welcome
- progress
- reminder

Mở rộng sau:

- payment receipt
- certificate issued
- re-engagement
- community invitation

## 21. Analytics

Cần theo dõi:

- user journey
- drop-off
- conversion
- course completion
- onboarding classification
- VC issuance

## 22. Security

Cần có:

- magic login hoặc auth phù hợp
- session management
- admin token hoặc role-based access control
- secret management đúng chuẩn

Không được:

- hardcode raw token
- commit secret vào repo
- để webhook không verify signature

## 23. Dev roadmap

### Phase 1: 1-2 tuần

Mục tiêu:

- root site đủ chuẩn hub
- EDU basic app
- courses + lessons
- onboarding skeleton
- fix CI/CD nền tảng

Deliverables:

- root pages có cấu trúc chuẩn
- course listing
- course detail
- lesson player ban đầu
- static or basic API contract
- production deploy ổn định hơn

### Phase 2

Mục tiêu:

- payment
- VC
- admin
- progress tracking

Deliverables:

- Stripe checkout flow
- webhook flow
- VC issue/verify
- admin manage course/user/progress

### Phase 3

Mục tiêu:

- onboarding AI
- community
- AI realtime learning layer

Deliverables:

- AI onboarding routing
- community MVP
- AI tutor integration ban đầu trong EDU app

## 24. Current technical issues already identified

Những lỗi vận hành cần xử lý dứt điểm:

- thiếu lockfile -> `npm` fail hoặc không ổn định giữa môi trường
- sai R2 binding
- sai API token handling
- dùng raw token thay vì secrets
- CI/CD chưa phủ Worker deployment lane
- domain live chưa đồng bộ với trạng thái source

## 25. Realistic current status assessment

Đánh giá tinh thần thận trọng:

- hạ tầng có nền tảng nhưng chưa đồng bộ hoàn toàn
- product mới ở giai đoạn đầu
- experience layer còn thiếu rất nhiều

Tóm tắt hợp lý hiện tại:

- infrastructure: có nền, chưa chốt vận hành
- product: đã có mock structure và một phần live content
- experience: chưa thành hành trình người dùng hoàn chỉnh

Không nên ghi `DNS OK` cho toàn hệ ở thời điểm này vì production verification đã cho thấy một số domain vẫn chưa public-ready.

## 26. Tomorrow-first execution plan

Thứ tự ưu tiên để bắt đầu ngay:

1. Fix CI/CD một lần dứt điểm
2. Chốt live serving model per domain
3. Recover `edu.vetuonglai.com`
4. Build course player cho EDU
5. Upload media thật
6. Test flow `học -> thi -> kết quả -> chứng chỉ -> VC`

## 27. Files dev cần có theo target platform

### Frontend app

```text
index.html
style.css
app.js
```

Hoặc nếu nâng cấp framework-based app thì cần có structure tương ứng, nhưng vẫn phải giữ rõ sự phân lớp app, route, component, feature.

### Worker/API

```text
src/index.js
src/api/*
wrangler.toml
```

### Config

```text
package.json
.env.example
```

Nếu dùng monorepo, file thực tế sẽ nhiều hơn, nhưng đây là minimum expectation.

## 28. Quy trình dev chuẩn

1. viết code local
2. test local
3. push GitHub
4. auto deploy
5. test production

Bổ sung bắt buộc:

6. smoke test domain public
7. xác minh route quan trọng
8. đối chiếu Pages và Workers nếu domain đang hybrid

## 29. Definition of done cho toàn hệ

Hệ thống được coi là đạt chuẩn khi:

- root hub nói được linh hồn của thương hiệu
- người dùng vào là biết bắt đầu từ đâu
- mỗi domain có vai trò rõ và không gây link hư hỏng
- EDU có thể cho phép học thật, làm thật và nhận bằng chứng thật
- VC xác minh được kết quả cốt lõi
- CI/CD deploy đúng serving layer
- team có admin, analytics, content workflow và secrets workflow đúng chuẩn

## 30. Final direction for the dev team

Team cần phải hiểu rõ ràng:

- Đây không phải dự án website thông thường
- Đây là một hệ thống định hình cuộc sống tương lai cho con người
- Mọi quyết định về code, content, UX, API, data và infra đều phải phục vụ cho hành trình biến đổi thật của người dùng

Công thức cốt lõi của Về Tương Lai:

Meaning + Journey + Learning + Practice + Trust + Community

Nếu thiếu một trong 6 thành phần này, hệ thống chưa hoàn chỉnh.
