# VETUONGLAI_ECONOMY_AND_MEMBER_SYSTEM_MASTER

Version: 1.0
Last updated: 2026-04-08

## Mục đích

File này khóa lớp economy và member system của Về Tương Lai theo đúng triết lý đã có trong vision, brand, language, trust và user journey.

Đây không phải bản định hướng MMO tăng trưởng ngắn hạn.

Đây là kiến trúc kinh tế giá trị thật, nơi người dùng có thể:
- học thật
- làm thật
- tạo giá trị thật
- có thu nhập thật
- có bằng chứng thật

## Nguyên tắc nền tảng

- không kiếm tiền bằng ảo tưởng
- không xây growth stack làm lệch linh hồn hệ thống
- không tạo subdomain chỉ vì marketing
- mọi dòng doanh thu phải nối được với learning, action, proof hoặc contribution
- trust phải đứng trước conversion

## Vị trí của economy trong toàn hệ

Economy không phải là một domain riêng đứng ngoài hệ.

Nó là lớp vận hành xuyên suốt các domain:
- `edu`: học và tạo năng lực
- `life`: ổn định nền sống để làm được lâu dài
- `finance`: rõ tiền, quản lý tiền, chống lừa đảo
- `invest`: đầu tư tỉnh táo, không FOMO
- `community`: kết nối và đồng hành
- `vc`: xác minh đóng góp, kỹ năng, đầu ra
- `mission`: nơi nối năng lực với công việc và dự án có ý nghĩa

## Kiến trúc subdomain cho economy và member

### Core domains giữ nguyên trong source of truth

- `vetuonglai.com`
- `edu.vetuonglai.com`
- `life.vetuonglai.com`
- `finance.vetuonglai.com`
- `invest.vetuonglai.com`
- `green.vetuonglai.com`
- `vc.vetuonglai.com`

### Expansion domains đã phù hợp định hướng

- `community.vetuonglai.com`
- `mission.vetuonglai.com`
- `stories.vetuonglai.com`
- `foundation.vetuonglai.com`
- `labs.vetuonglai.com`

### Capability domains có thể mở sau, không được coi là core mặc định

- `member.vetuonglai.com`: dashboard thành viên và hồ sơ tổng hợp
- `work.vetuonglai.com`: việc làm thật, task, dịch vụ, project board
- `tools.vetuonglai.com`: công cụ mở phục vụ entry flow hoặc creator flow
- `admin.vetuonglai.com`: vận hành riêng tư
- `api.vetuonglai.com`: lớp API nội bộ / protected

### Những domain không được mặc định coi là source of truth ở giai đoạn này

Các ý tưởng sau chỉ được mở nếu đã có owner, legal, trust, runtime plan và role rõ ràng:
- `market`
- `affiliate`
- `live`
- `blog`
- `ai`

Trong giai đoạn hiện tại, các capability này nên được xem là product layer hoặc module trong domain phù hợp hơn là tách domain ngay.

Ví dụ:
- blog nên là content layer của hub + domain content
- AI nên là runtime capability trong `edu`, `member`, `admin`
- affiliate chỉ nên mở sau khi trust, legal và anti-spam rules đã đủ rõ
- market chỉ nên mở khi content licensing, payment, refund, moderation và proof đã đủ cứng

## 6 engine kinh tế đã chuẩn hóa lại

### 1. Learning engine

Điểm vào là `edu`.

Mục tiêu:
- biến học thành năng lực
- biến năng lực thành đầu ra
- biến đầu ra thành proof

Không chấp nhận:
- catalog-only learning
- học để xem cho hết

### 2. Service engine

Điểm vào phù hợp về sau là `mission` hoặc `work`.

Mục tiêu:
- biến kỹ năng đã học thành dịch vụ thật
- giúp user có khách hàng hoặc project đầu tiên
- gắn kết quả với review và VC proof

### 3. Creator engine

Điểm vào là content system + stories + EDU + community.

Mục tiêu:
- cho phép user tạo nội dung, workshop, cohort, tài liệu có giá trị
- doanh thu phải gắn với chất lượng và trust

### 4. Project engine

Điểm vào là `mission`, `community`, `labs`.

Mục tiêu:
- build dự án thật
- ghi nhận đóng góp thật
- nếu cần, nối về funding hoặc revenue share minh bạch

### 5. Community engine

Điểm vào là `community`.

Mục tiêu:
- tạo circle, cohort, support pathways
- tăng retention, belonging, collaboration
- không trở thành forum ồn ào không giá trị

### 6. Trust and proof engine

Điểm vào là `vc`.

Mục tiêu:
- xác minh năng lực, đóng góp, completion, outcomes
- tách claim với verify
- tăng trust cho economy layer

## Member system chuẩn

### Vai trò của member system

Member system không chỉ là paywall.

Nó là lớp định danh và hành trình của người dùng trong toàn hệ.

Nó phải quản lý:
- identity
- profile
- access
- progress
- proof
- contribution
- journey stage

### Member levels đề xuất

- guest: chưa đăng nhập, chỉ dùng phần mở
- learner: bắt đầu học và lưu hành trình
- creator: có thể tạo nội dung, lesson, asset phù hợp policy
- builder: có thể tham gia project, dịch vụ, cohort chuyên sâu
- verified: đã có proof/VC phù hợp
- mentor/partner: được xét duyệt riêng

### Nguyên tắc nâng cấp level

- không chỉ dựa vào trả tiền
- phải có kết hợp giữa access, behavior, completion và trust
- verified phải có proof, không chỉ có subscription

## Hồ sơ thành viên

Hồ sơ thành viên nên có các lớp:

- identity
- bio và lĩnh vực quan tâm
- current journey stage
- progress và milestones
- skills self-declared
- skills verified
- content created
- courses completed
- projects joined
- proof / credential records
- contribution score

## VTL points hoặc contribution points

Nếu dùng points, phải coi đó là contribution layer chứ không phải gamification rẻ tiền.

Points chỉ nên thưởng cho:
- hoàn thành hành trình học thật
- đóng góp nội dung có giá trị
- review có trách nhiệm
- tham gia project thật
- hỗ trợ cộng đồng thật

Không nên thưởng mạnh cho hành vi vanity như spam comment, mời người dùng bằng mọi giá, hoặc tạo engagement giả.

## Content economy policy

### Điều kiện monetize nội dung

Một nội dung chỉ nên bật monetize khi:
- có giá trị thực
- đúng role domain
- qua review workflow
- không vi phạm language standard
- không dùng claim thổi phồng

### Tầng nội dung

- public: trust-building, orientation, education nền
- member: nội dung sâu hơn, workbook, pathway, lesson
- premium/cohort: đồng hành sâu, mentor, workshop, review

### Không được cho phép

- khóa học rỗng
- bài viết chỉ để kéo traffic mà không có giá trị
- affiliate spam
- nội dung AI vô hồn không human review
- story không có thật hoặc gây hiểu lầm

## Work system chuẩn hóa

Work system không phải job board đại trà.

Nó phải ưu tiên:
- project thật
- service thật
- task có giá trị
- đóng góp có thể review
- outcome có thể xác minh

### Các lớp work phù hợp

- service listing
- project collaboration
- short paid task
- community hiring
- internal contributor roles

### Điều kiện trước khi mở rộng work

- profile đủ rõ
- review flow đủ cứng
- dispute / refund / contract flow có spec
- legal disclaimer rõ
- proof logic nối được về VC nếu cần

## Payment và revenue share

Nguyên tắc:
- rõ ràng
- không tùy hứng
- payout logic phải minh bạch
- refund rules phải công bố
- payment không đồng nghĩa với verified

### Revenue share chỉ được áp dụng khi

- có owner product cụ thể
- có legal review
- có policy về fraud, refund, abuse
- có dashboard theo dõi payout

## AI trong economy layer

AI chỉ là trợ lý.

AI có thể hỗ trợ:
- viết outline
- tạo course structure ban đầu
- gợi ý pricing frame
- gợi ý next step
- review nội dung sơ bộ

AI không được:
- publish thay người
- đưa claim tài chính nguy hiểm như lời khuyên đầu tư có tính quyết định
- thay thế review của con người trong các bước trust quan trọng

## VC proof trong economy layer

VC proof là lớp tăng trust, không phải huy hiệu trang trí.

Có thể xác minh:
- course completion đủ điều kiện
- project contribution
- service reliability
- creator quality milestone
- mentor contribution

## Rollout đề xuất

### Phase A

- root hub
- EDU course player
- VC proof flow
- member profile concept trong hub/dashboard

### Phase B

- community MVP
- mission/work pilot
- creator content review flow

### Phase C

- service/project marketplace có kiểm soát
- payment + payout rõ ràng
- verified member layer

### Phase D

- capability expansion như tools, live, advanced AI, partner model

## Runtime truth rules

Một capability economy chỉ được gọi là live khi:
- user vào được
- flow chính dùng được
- có review / payment / proof đúng logic nếu feature cần chúng
- policy và disclaimer tương ứng đã có

Nếu mới có UI hoặc doc mà chưa có flow end-to-end thì phải ghi là planned hoặc preview.

## Kết luận

Kinh tế của Về Tương Lai phải là kết quả tự nhiên của một hệ sống, học, làm và xác minh đúng.

Nếu economy tách khỏi triết lý, nó sẽ kéo toàn hệ lệch hướng.

Nếu economy gắn đúng với truth, contribution và proof, nó sẽ trở thành lớp tăng trưởng bền vững cho toàn hệ.
