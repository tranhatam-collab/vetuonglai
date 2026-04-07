# EDU_COURSE_PLAYER_REAL_AND_AI_FLOW_MASTER_SPEC

## 1. Mục tiêu

Course Player không phải màn hình xem video.

Nó là nơi người học:
- hiểu bài
- hỏi AI
- làm thật
- ghi nhận tiến bộ
- tạo sản phẩm / dự án
- được xác minh kết quả

Mỗi bài học phải trả lời được 4 câu:
- tôi đang học gì
- vì sao điều này quan trọng
- tôi phải làm gì tiếp theo
- kết quả đó được ghi nhận ra sao

## 2. Nguyên tắc cốt lõi

Course Player phải:
- đặt hành động lên trên tiêu thụ nội dung
- đặt AI bên cạnh người học, không ở ngoài lề
- đặt tiến trình thật lên trên completion giả
- đặt trải nghiệm đơn giản, ấm, rõ ràng lên trên giao diện phức tạp

Không được:
- biến thành màn hình video + quiz đơn điệu
- buộc người học đi đúng một đường cứng
- hiển thị quá nhiều thứ cùng lúc
- làm AI thành chatbot trang trí

## 3. Bố cục màn hình chuẩn

### Cấu trúc desktop

- Cột trái: chương trình học / bài học / tiến trình
- Trung tâm: nội dung bài học đang học
- Cột phải: AI Tutor + hành động gợi ý + bước tiếp theo

### Cấu trúc mobile

- Phần 1: nội dung bài học
- Phần 2: nút mở AI Tutor
- Phần 3: action cards
- Phần 4: tiến trình và bước tiếp theo

## 4. Các vùng chính của Course Player

### 4.1 Sidebar trái

Hiển thị:
- tên khóa học
- các module
- các lesson
- trạng thái từng lesson
- tiến trình tổng
- nút quay về dashboard

Trạng thái lesson:
- chưa bắt đầu
- đang học
- đã hoàn thành
- cần thực hành
- cần review

### 4.2 Vùng nội dung trung tâm

Có thể hiển thị:
- text lesson
- video
- audio
- PDF / workbook
- project brief
- checklist
- reflection prompts

Mỗi bài phải có tối thiểu:
- mục tiêu bài học
- nội dung chính
- ứng dụng thực tế
- action cuối bài

### 4.3 AI Tutor panel

AI phải luôn hiện diện như một người đồng hành.

Phải có:
- ô chat
- quick prompts
- tóm tắt bài học bằng ngôn ngữ dễ hiểu
- gợi ý bước tiếp theo
- nút "biến bài học thành hành động"

### 4.4 Action zone

Hiển thị dạng card:
- làm bài tập này
- tạo project nhỏ
- phản tư 3 phút
- hỏi AI phần chưa hiểu
- đánh dấu đã thực hành

### 4.5 Proof / progress zone

Hiển thị:
- lesson đã hoàn thành
- action đã làm
- project đã nộp
- điểm xác thực tiến trình
- điều kiện để được cấp VC

## 5. Các loại lesson được hỗ trợ

### 5.1 Reading lesson

Dùng cho:
- nền tảng tư duy
- giải thích khái niệm
- hướng dẫn

### 5.2 Video lesson

Dùng cho:
- mô phỏng
- case study
- hướng dẫn thao tác

### 5.3 AI-guided lesson

Dùng cho:
- học theo đối thoại
- giải thích cá nhân hóa
- kiểm tra mức hiểu

### 5.4 Action lesson

Dùng cho:
- việc phải làm ngoài đời
- task theo bước
- thực hành thực tế

### 5.5 Project lesson

Dùng cho:
- mini project
- milestone project
- deliverable thực

### 5.6 Reflection lesson

Dùng cho:
- tự nhìn lại
- chốt bài học
- xác định bước tiếp theo

## 6. Trạng thái tiến trình chuẩn

Không dùng logic "xem hết video = hoàn thành".

Một lesson chỉ được xem là hoàn thành khi đạt đủ điều kiện theo loại lesson.

Ví dụ:
- reading: đã đọc + xác nhận hiểu
- video: đã xem + trả lời ngắn / hỏi AI / action
- action: đã nộp action proof
- project: đã submit outcome
- reflection: đã ghi reflection

## 7. AI Flow chuẩn trong Course Player

### 7.1 AI xuất hiện ở đâu

AI phải có mặt ở 4 điểm:
- trước bài học: giải thích bài này dành cho ai
- trong bài học: giải thích phần khó
- cuối bài: chuyển bài học thành hành động
- sau bài: đề xuất bước tiếp theo

### 7.2 AI mở đầu bài học

Ví dụ:
- bài này giúp bạn điều gì
- nếu bạn là người mới, hãy bắt đầu từ đâu
- nếu bạn đã có kinh nghiệm, phần nào nên tập trung

### 7.3 AI trong bài

Các nút gợi ý:
- giải thích đơn giản hơn
- cho tôi ví dụ thật
- việc này áp dụng thế nào vào cuộc sống
- tôi đang bị kẹt ở đâu

### 7.4 AI cuối bài

Phải luôn đưa ra:
- 1 action nhỏ ngay hôm nay
- 1 câu hỏi phản tư
- 1 bước tiếp theo rõ ràng

## 8. Các màn hình con bắt buộc

### 8.1 Course overview

Gồm:
- mô tả khóa
- ai phù hợp
- bạn sẽ nhận được gì
- lộ trình
- yêu cầu
- cách học với AI

### 8.2 Lesson player

Là màn hình chính như mô tả ở trên.

### 8.3 Project submission

Gồm:
- tên project
- brief
- checklist nộp bài
- ô nộp text / file / link
- nút gửi AI review
- trạng thái

### 8.4 Reflection screen

Gồm:
- bạn học được gì
- bạn sẽ làm gì tiếp
- điều gì còn chưa rõ
- AI gợi ý cá nhân hóa

### 8.5 Completion screen

Gồm:
- bạn đã hoàn thành gì
- còn thiếu gì
- đã đủ điều kiện cấp VC chưa
- nút xác minh / nhận chứng chỉ khi đủ

## 9. Data model cần có

### Course
- id
- title
- summary
- level
- duration
- outcomes
- ai_mode
- modules

### Module
- id
- title
- order
- lessons

### Lesson
- id
- type
- title
- objective
- body
- media_refs
- action_requirements
- ai_prompts
- completion_rules

### Progress
- user_id
- course_id
- lesson_id
- started_at
- completed_at
- completion_type
- proof_ref

### Action proof
- user_id
- lesson_id
- type
- content
- file_refs
- submitted_at
- status

### AI session
- user_id
- course_id
- lesson_id
- conversation_id
- summary
- next_action

## 10. API surface cần có

### Public / authenticated learner APIs
- GET /api/courses/:id
- GET /api/courses/:id/modules
- GET /api/lessons/:id
- POST /api/progress/start
- POST /api/progress/complete
- POST /api/actions/submit
- POST /api/reflection/submit
- POST /api/ai/chat
- GET /api/progress/:courseId
- GET /api/eligibility/:courseId

### Admin APIs
- POST /api/admin/course
- POST /api/admin/module
- POST /api/admin/lesson
- POST /api/admin/project-brief
- POST /api/admin/publish
- GET /api/admin/submissions
- POST /api/admin/review

## 11. Completion rules engine

Mỗi lesson cần có rule riêng. Team dev phải build completion engine, không hard-code kiểu một rule cho tất cả.

Ví dụ:
- reading lesson: must_open + confirm_understanding
- video lesson: must_watch + must_answer_or_action
- action lesson: must_submit_proof
- project lesson: must_submit_project
- reflection lesson: must_submit_reflection

## 12. Điều kiện cấp VC

Không phải cứ xong 100% video là cấp.

VC chỉ được cấp khi:
- các lesson bắt buộc đã hoàn tất
- action proof tối thiểu đã có
- project bắt buộc đã nộp
- trạng thái course = eligible
- payment/access hợp lệ nếu course là paid

Hệ phải phân biệt:
- completed
- verified
- VC issued

## 13. UX writing trong Course Player

Headline bài học:
- ngắn, rõ, mềm

Nút:
- bắt đầu bài học
- hỏi AI
- làm bước tiếp theo
- nộp kết quả
- xem lại
- tiếp tục hành trình

Completion:
- không dùng: "Bạn đã hoàn thành 100%"
- dùng:
  - "Bạn đã đi xong bước này"
  - "Bạn đã sẵn sàng cho bước tiếp theo"
  - "Bạn đã có đủ bằng chứng để tiếp tục"

## 14. AI Tutor prompt layer cho Course Player

AI phải nhận được:
- user level
- course context
- lesson context
- progress state
- previous questions
- required next step

AI phải trả ra 3 lớp:
- giải thích
- hành động
- đề xuất bước tiếp

## 15. Trạng thái hệ thống cần phân biệt rất rõ

### Fake completion
- user chỉ mở bài
- không tạo outcome
- không có proof

### Real completion
- user học
- user hỏi
- user làm
- user nộp
- hệ ghi nhận

Chỉ real completion mới đi vào VC eligibility.

## 16. Course Player UI states bắt buộc

- loading
- empty
- no access
- in progress
- waiting for submission
- review pending
- eligible for VC
- VC issued

## 17. Mobile-first rules

Trên mobile:
- AI Tutor không chiếm toàn màn hình mặc định
- action cards phải lớn, dễ bấm
- lesson navigation đơn giản
- chỉ hiển thị 1 trọng tâm mỗi lúc
- project submit phải dễ dùng bằng điện thoại

## 18. Design rules riêng cho Course Player

- background sáng, dịu
- card mềm
- khoảng trắng rộng
- không dashboard lạnh
- AI panel cảm giác như người đồng hành
- action cards nổi bật nhưng không gắt

## 19. Roadmap build đúng thứ tự

### Phase 1
- course overview
- lesson player cơ bản
- progress tracking
- AI chat panel cơ bản

### Phase 2
- action submission
- reflection flow
- completion rules engine

### Phase 3
- eligibility engine
- VC issuance flow
- admin review flow

### Phase 4
- personalization
- adaptive next-step engine
- AI project generation

## 20. Definition of done cho Course Player

Course Player chỉ được xem là xong khi:
- user mở được khóa
- user học được một lesson
- user hỏi được AI
- user làm được một action
- user submit được proof
- progress được lưu
- hệ tính được eligibility
- đủ điều kiện thì đi tiếp tới VC

Nếu thiếu 1 mắt xích trên thì chưa được gọi là xong.
