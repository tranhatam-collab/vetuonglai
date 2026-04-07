# 05_edu_ai_learning_spec

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · OPS · CONTENT

## A. Triết lý học tại VTL

> Không học thuộc lòng. Học để làm được. Mỗi module phải tạo ra output thực tế, không chỉ quiz.

## B. Cấu trúc khóa học chuẩn VTL

```text
Module (3-10 bài/module)
  Bài học: Video + Transcript + AI Summary
  Bài tập: Project-based
  Output: Deliverable thật
  Review: Peer review hoặc AI review
  VC claim: Submit output -> xét VC badge
```

## C. Course player

Course player không phải video screen.

Nó phải có:
- lesson content
- action step
- proof submission
- reflection
- next step
- progress
- eligibility state

## D. AI trong `edu` theo phase

| Phase | AI trong `edu.` |
|---|---|
| Phase 1 | AI pre-screen bài nộp + gợi ý tài nguyên đơn giản |
| Phase 2 | Claude-based AI Tutor đầy đủ: hỏi đáp theo context, review output, gợi ý next step |
| Phase 3 | AI Tutor cá nhân hóa theo toàn bộ journey history |

## E. Vì sao chọn Claude cho AI Tutor

- context window lớn
- đọc được toàn bộ module + output học viên
- phản hồi sâu hơn, ít generic hơn
- phù hợp với review layer và next-step logic phức tạp

## F. Tính năng AI Tutor Phase 2

- trả lời theo context lesson
- giải thích đơn giản hơn
- cho ví dụ thật
- review output của học viên
- gợi ý bước tiếp theo
- phát hiện gap kỹ năng
- đề xuất tài nguyên phù hợp

## G. Micro-credential system

- mỗi module hoàn thành có thể tạo micro-credential
- tích đủ micro-credential thì mở điều kiện claim VC badge
- micro-credential có thể được hiển thị trong member dashboard

## H. Ai có thể tạo khóa học

- tối thiểu Level Pro
- phải submit curriculum draft
- team review trong 72h
- sau khi live phải chịu monitoring chất lượng liên tục

## I. Review logic cho output

### Phase 1

- AI pre-screen cơ bản
- human/editor review khi cần

### Phase 2

- AI Tutor review có context sâu
- peer review tùy course
- human escalation cho các case cần trust cao

### Phase 3

- AI review cá nhân hóa theo full journey
- cross-course recommendation

## J. Integration với VC

Luồng chuẩn:

```text
Lesson complete -> module output -> review -> micro-credential
  -> đủ điều kiện -> claim VC -> issue / reject / need review
```

## K. Definition of done cho EDU AI learning

EDU AI learning chỉ được xem là xong khi:
- user học được lesson
- user làm được output
- AI hỗ trợ được đúng context phase hiện tại
- output được review
- progress và micro-credential được lưu
- eligibility sang VC được tính đúng
