# VETUONGLAI_USER_JOURNEY_ENGINE_MASTER_SPEC

## 1. Mục tiêu

Mỗi người dùng khi vào hệ phải có thể đi qua hành trình này:
- nhận ra mình đang ở đâu
- chọn hướng đi phù hợp
- vào đúng subdomain / đúng course
- được AI và hệ thống dẫn dắt
- có tiến bộ
- có bằng chứng
- có thể tiếp tục đóng góp

## 2. Journey stages chuẩn

Tối thiểu nên có 7 stage:
1. discovering
2. orienting
3. learning
4. practicing
5. building
6. verified
7. contributing

Mỗi user luôn phải nằm trong 1 stage chính.

## 3. Người dùng vào hệ từ đâu

Entry points:
- root hub
- direct subdomain
- article
- course page
- AI tutor
- community invite
- certificate verify page
- story page

Journey engine phải map nguồn vào.

## 4. User segments chuẩn

Tối thiểu nên có:
- seeker: người đang mất phương hướng
- stabilizer: người cần ổn định đời sống
- learner: người cần kỹ năng / tri thức
- builder: người muốn làm thật / khởi nghiệp
- contributor: người đã tiến xa và muốn cho đi

## 5. Journey engine phải làm gì

- đọc assessment
- đọc hành vi
- đọc progress
- đọc interests
- gợi ý bước tiếp theo
- gợi ý đúng domain
- gợi ý đúng course / challenge / project

## 6. Assessment mapping

Assessment không để "cho vui".

Nó phải map thẳng sang:
- current stage
- priority domain
- suggested path
- urgency
- next action

Ví dụ:
- nếu user mất ổn định -> life
- nếu user thiếu kỹ năng -> edu
- nếu user mù tài chính -> finance
- nếu user đã có kỹ năng và muốn xây -> mission / invest

## 7. Journey cards trong UI

Mỗi user nên thấy các card như:
- bạn đang ở đâu
- bước quan trọng nhất lúc này
- điều nên làm tiếp theo
- gợi ý domain phù hợp
- tiến trình của bạn
- điều đã được xác minh

## 8. Next-step engine

Đây là lõi của user journey.

Mỗi user phải luôn có:
- 1 next step chính
- 2 next step phụ
- 1 cảnh báo nếu đang lệch
- 1 lời nhắc nhẹ

Ví dụ:
- hoàn thành bài học này
- hỏi AI phần bạn chưa rõ
- nộp project nhỏ
- bắt đầu challenge 7 ngày
- vào community circle phù hợp

## 9. Journey data model

### User journey profile
- user_id
- segment
- current_stage
- primary_domain
- current_goal
- risk_flags
- next_step
- secondary_steps
- updated_at

### Journey events
- user_id
- type
- source
- target
- timestamp
- metadata

## 10. Journey trigger events

Journey engine phải cập nhật khi có các sự kiện:
- user hoàn thành assessment
- user vào course mới
- user hoàn thành lesson
- user submit action
- user pass review
- user được issue VC
- user tham gia community
- user dừng hoạt động lâu

## 11. Journey views cho admin

Admin phải xem được:
- current stage distribution
- users stuck at one stage
- journey drop-off points
- next-step completion rate
- cross-domain movement
- users eligible for deeper path

## 12. Journey UX cho user

### 12.1 Root hub

Hiển thị:
- bạn đang ở đâu
- bắt đầu từ đâu
- lộ trình phù hợp

### 12.2 Course dashboard

Hiển thị:
- bước tiếp theo trong course
- bước tiếp theo ngoài course
- khi nào đủ điều kiện proof

### 12.3 After completion

Hiển thị:
- bạn đã hoàn thành gì
- bạn có proof gì
- hành trình tiếp theo là gì
- bạn có thể đóng góp gì

## 13. Cross-domain routing rules

Journey engine phải có logic điều hướng chéo:
- life -> edu
- edu -> mission
- finance -> invest
- edu -> vc
- stories -> community
- community -> contribution
- verified -> foundation / stories

## 14. Definition of done cho Journey Engine

Journey engine chỉ được xem là xong khi:
- user vào hệ và được phân loại
- user được gợi ý bước đầu
- hệ cập nhật stage khi user tiến bộ
- hệ đề xuất bước tiếp theo theo thời gian thực
- user có thể đi từ học -> thực hành -> proof -> đóng góp
