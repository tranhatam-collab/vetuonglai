# 36_SUBMISSION_AND_REVIEW_ENGINE

## Mục đích của file

File này khóa loop thực của EDU:

`học -> làm -> nộp -> review -> hoàn tất -> proof`

Nếu không có engine này, câu:

> học để làm được

sẽ chỉ còn là slogan.

---

## 1. Vai trò của engine

Submission Engine không phải chỉ là upload bài.

Nó là chỗ nối giữa:

- EDU
- review
- micro-credential
- VC eligibility
- dashboard progress

---

## 2. Thực thể tối thiểu

### Submission

- `submission_id`
- `member_id`
- `course_id`
- `module_id`
- `lesson_id`
- `artifact_type`
- `artifact_url`
- `submitted_at`
- `status`

### Review

- `review_id`
- `submission_id`
- `reviewer_type`
- `reviewer_id`
- `decision`
- `feedback`
- `reviewed_at`

### Completion

- `completion_id`
- `member_id`
- `lesson_id`
- `completion_type`
- `issued_micro_credential`
- `vc_candidate`

---

## 3. State machine

Submission phải đi qua các trạng thái:

1. `draft`
2. `submitted`
3. `auto_checking`
4. `needs_revision`
5. `review_pending`
6. `approved`
7. `rejected`
8. `vc_candidate`
9. `vc_submitted`

Không được nhảy từ:

- `submitted`

thẳng sang:

- `VC issued`

nếu chưa có review/completion logic.

---

## 4. Review flow chuẩn

### 4.1 Auto checks

Hệ thống phải kiểm tối thiểu:

- đúng loại artifact
- đủ file/đủ link
- không rỗng
- không sai format tối thiểu

### 4.2 Human / AI review

Tùy lesson type:

- AI review trước
- peer review
- editor review

### 4.3 Decision

Decision chỉ nên là:

- `approved`
- `needs_revision`
- `rejected`

Mọi decision phải có feedback.

---

## 5. Mapping sang completion và VC

### Lesson completion

Mỗi lesson type phải có rule rõ:

- lesson đọc: completion khi pass check tối thiểu
- lesson project: completion khi submission được approve
- lesson deep task: completion khi approve + artifact hợp lệ

### Micro-credential

Khi đủ rule:

- cấp micro-credential của module hoặc lesson

### VC candidate

Chỉ khi:

- completion đạt mức yêu cầu
- artifact đủ dùng làm proof
- rule của domain cho phép

thì mới chuyển sang:

- `vc_candidate`

---

## 6. API / service responsibilities

### EDU service

- tạo submission
- lưu artifact ref
- theo dõi progress

### Review service

- nhận queue review
- ghi feedback
- trả decision

### VC service

- chỉ nhận claim khi submission/completion đủ điều kiện

### Member/dashboard

- hiển thị progress, review state, next step

---

## 7. Team sync

### Team 1

- giữ contract và state machine

### Team 2

- build UI nộp bài, review state, revision flow

### Team 3

- review ngôn ngữ feedback, disclosure và fairness rule

---

## 8. Definition of done

Loop này chỉ được xem là đạt khi:

1. user học xong có thể nộp
2. submission được review thật
3. completion state thay đổi đúng
4. micro-credential và VC candidate map đúng
5. dashboard hiển thị next step rõ
