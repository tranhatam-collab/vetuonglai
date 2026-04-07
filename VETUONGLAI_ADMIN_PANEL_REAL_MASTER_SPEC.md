# VETUONGLAI_ADMIN_PANEL_REAL_MASTER_SPEC

## 1. Mục tiêu của Admin Panel

Admin Panel không phải "trang quản trị nội dung" đơn thuần.

Nó là trung tâm vận hành để:
- tạo và quản lý khóa học
- tạo lesson và project
- gắn AI prompts
- quản lý tiến trình học
- quản lý bằng chứng / điều kiện cấp VC
- quản lý user journey
- theo dõi runtime truth của toàn hệ

Admin Panel phải phục vụ 4 nhóm:
- founder / system owner
- content team
- education ops
- proof / verification ops

## 2. Nguyên tắc thiết kế Admin Panel

Phải:
- rõ
- ít tầng
- ít nhầm
- dữ liệu nhìn ra logic ngay
- hành động quản trị ít bước

Không được:
- rối như CMS cũ
- menu quá nhiều
- admin phải đi nhiều nơi mới làm xong một việc
- dữ liệu nằm rời rạc giữa course, lesson, AI, VC

## 3. Cấu trúc Admin Panel chuẩn

### 3.1 Dashboard tổng

Trang đầu tiên của admin phải cho thấy:
- tổng số user
- tổng số course
- lesson đang live
- user đang học
- user đủ điều kiện VC
- chứng chỉ đã phát hành
- nội dung đang chờ review
- project submissions đang chờ xử lý
- các lỗi runtime nếu có

### 3.2 Course Management

Quản trị:
- tạo course
- sửa course
- đổi trạng thái
- publish / unpublish
- gắn level
- gắn outcome
- gắn VC eligibility

### 3.3 Module & Lesson Management

Quản trị:
- module tree
- lesson ordering
- lesson type
- media
- workbook
- action requirements
- AI prompt gợi ý theo lesson

### 3.4 AI Layer Management

Quản trị:
- system prompts
- lesson prompts
- quick prompts
- action prompts
- review prompts
- next-step prompts
- tone-of-voice templates

### 3.5 Project / Submission Management

Quản trị:
- xem submission
- đánh dấu review
- approve / reject / need revision
- AI review support
- proof extraction

### 3.6 Progress & Eligibility

Quản trị:
- xem tiến trình user
- lesson completed
- real completion vs fake completion
- eligibility for VC
- manual override nếu cần

### 3.7 VC / Trust Layer Management

Quản trị:
- danh sách credentials
- pending issue
- issued
- revoked
- superseded
- verify pages
- proof logs

### 3.8 User Journey Management

Quản trị:
- user segment
- current journey stage
- assigned path
- suggested next steps
- risk flags
- engagement state

### 3.9 Media / Asset Management

Quản trị:
- docs
- media
- cover images
- AI image prompts
- usage mapping

### 3.10 System Runtime / QA

Quản trị:
- feature live hay mock
- API health
- queue backlog
- webhook status
- recent failures

## 4. Sidebar menu chuẩn

Sidebar admin nên có đúng các cụm sau:
- Dashboard
- Courses
- Lessons
- AI Tutor
- Projects
- Progress
- Credentials
- Journeys
- Media
- Runtime
- Settings

Không nên tách quá sâu ngay phase đầu.

## 5. Dashboard blocks bắt buộc

### 5.1 Runtime truth block

Phải hiển thị:
- cái gì chạy thật
- cái gì chỉ mới UI
- cái gì đang lỗi
- cái gì cần action ngay

### 5.2 Learning flow block

Phải hiển thị:
- số user đã bắt đầu course
- số user đang active
- số user hoàn thành lesson
- số user submit project
- số user đủ điều kiện VC

### 5.3 Proof block

Phải hiển thị:
- credentials issued
- pending review
- revoked
- verify page hits

## 6. Course management chi tiết

Mỗi course phải quản lý được:
- course ID
- title
- subtitle
- summary
- level
- estimated duration
- language
- outcomes
- suitable for
- module tree
- course cover
- pricing
- payment state
- VC eligibility rules
- publish status

Trạng thái course:
- draft
- internal review
- live
- archived

## 7. Lesson management chi tiết

Mỗi lesson phải quản lý được:
- lesson ID
- course mapping
- type
- title
- objective
- why this matters
- main body
- media refs
- workbook refs
- action prompt
- AI prompts
- reflection prompt
- completion rule
- order

Lesson types:
- reading
- video
- audio
- AI guided
- action
- project
- reflection

## 8. AI Tutor management chi tiết

Admin phải sửa được:

### 8.1 Global AI personality
- tone
- style
- boundaries
- allowed advice scope
- language style

### 8.2 Course-specific tutor behavior
- course context
- expected outcomes
- default next steps
- common misunderstandings
- examples to use

### 8.3 Lesson-specific prompts
- explain this lesson
- simplify it
- give real-world example
- suggest action
- review user answer

### 8.4 AI action templates

Ví dụ:
- convert lesson to task
- generate micro project
- generate reflection questions
- generate next-step checklist

## 9. Submission management chi tiết

Submission panel phải cho phép:
- lọc theo course
- lọc theo status
- xem nội dung submit
- xem file đính kèm
- AI review summary
- human comment
- approve
- request revision
- mark verified

Submission statuses:
- submitted
- under review
- revision needed
- approved
- verified
- proof linked

## 10. Eligibility engine admin view

Admin phải thấy rất rõ:
- user nào học xong nhưng chưa đủ điều kiện
- thiếu điều kiện nào
- user nào đủ điều kiện
- user nào đã được cấp VC
- user nào cần review tay

Eligibility check gồm:
- paid access (nếu paid course)
- lesson completion
- required action proofs
- required project submission
- reflection complete
- review status

## 11. VC / Credentials admin view

Mỗi credential phải có:
- vc_id
- user reference
- course reference
- issue date
- status
- proof hash
- verify URL
- source submission
- revocation state

Actions:
- issue
- reissue
- revoke
- supersede
- copy verify URL

## 12. User Journey Engine mục tiêu

User Journey Engine không phải CRM.

Nó là hệ để:
- hiểu user đang ở đâu
- họ cần gì tiếp theo
- điều gì đang cản họ
- đưa họ sang bước đúng kế tiếp
