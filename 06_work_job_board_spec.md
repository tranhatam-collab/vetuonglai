# 06_work_job_board_spec

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · OPS · LEGAL

## A. 3 board trong `work.`

### 1. Job Board

Các loại việc:
- task nhỏ
- freelance project
- part-time remote
- full-time remote

### 2. Project Board

Dùng cho:
- startup sản phẩm số
- dự án xã hội / phi lợi nhuận
- tool / SaaS / content channel

### 3. Internal Work

Dành cho các vai trò làm trong hệ VTL:
- content writer
- community moderator
- course reviewer
- support agent
- AI trainer
- tech contributor

## B. Flow đăng tuyển đến hoàn thành

```text
Đơn vị đăng JD + ngân sách (escrow vào hệ thống)
  -> Thành viên có VC phù hợp apply
    -> Review portfolio + VC badge
      -> Phỏng vấn / test qua platform
        -> Nhận việc -> Escrow giữ tiền
          -> Deliverable submit -> Review -> Approve
            -> Thanh toán release -> Rating hai chiều
```

## C. Điều kiện ứng tuyển theo loại job

| Job type | VC yêu cầu tối thiểu |
|---|---|
| Task nhỏ | Không cần |
| Freelance | Learner Verified |
| Part-time | Service Verified |
| Full-time remote | Service + Builder |
| Project co-found | Builder Verified |

## D. Project board rules

Mỗi project phải có:
- mô tả rõ
- role rõ
- timeline rõ
- reward / revenue split rõ
- milestone rõ

Không cho phép project mơ hồ hoặc dụ dỗ cộng tác viên bằng promise không kiểm chứng.

## E. Internal work

Internal work cần có:
- owner rõ
- output rõ
- thời gian rõ
- payout rule rõ
- review rule rõ

## F. Chính sách giải quyết tranh chấp

- thời gian review deliverable tối đa: 5 ngày làm việc
- nếu dispute: team VTL làm trọng tài trong 3 ngày
- quyết định cuối dựa trên contract + deliverable + log hệ thống

## G. Escrow logic tối thiểu

- tiền giữ trong pending state trước khi release
- digital / fast task có cửa sổ dispute ngắn
- service / project có cửa sổ dispute dài hơn

## H. Definition of done cho work system

Work system chỉ được xem là xong khi:
- job đăng được
- apply được
- review được
- deliverable submit được
- release payout được
- rating ghi nhận được
