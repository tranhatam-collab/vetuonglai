# 02_member_policy_full

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · OPS · LEGAL · CONTENT

## Mục tiêu

File này khóa chính sách thành viên đầy đủ của Về Tương Lai.

Member system không chỉ là paywall.

Nó là lớp:
- identity
- access
- journey
- proof
- contribution
- earning readiness

## A. 4 level thành viên

| Level | Tên | Điều kiện | Phí | Quyền lợi |
|---|---|---|---|---|
| 0 | Free | Đăng ký | 0 | Đọc blog, tools cơ bản, 1 khóa học miễn phí |
| 1 | Pro | Thanh toán + hoạt động 7 ngày | 99k/tháng | Tools cơ bản, edu cơ bản, AI tier 1 |
| 2 | Elite | Pro + >=1 VC Proof | 299k/tháng | Ưu tiên work, AI full, affiliate tier 1 |
| 3 | Partner | Elite + real contribution | Xét duyệt | Co-creation, API, chia doanh thu, co-branding |

## Nguyên tắc cứng của level system

- Level không chỉ dựa vào tiền.
- Phải có đủ payment + activity + proof + contribution tùy level.
- VC badges là vĩnh viễn, không mất khi tụt level.
- Nội dung đã tạo và doanh thu đã có không mất khi tụt level.

## Điều kiện cụ thể từng level

### Level 0 — Free

- có tài khoản hợp lệ
- chưa cần payment
- chưa cần proof

### Level 1 — Pro

- có subscription hợp lệ
- có hoạt động tối thiểu 7 ngày sau khi vào hệ
- hoạt động được tính theo hành vi có ý nghĩa như:
  - mở course
  - hoàn thành lesson
  - comment có giá trị
  - dùng tool
  - cập nhật profile

### Level 2 — Elite

- đang là Pro
- có ít nhất 1 VC badge hợp lệ
- không có vi phạm trust hoặc abuse

### Level 3 — Partner

- đang là Elite
- có đóng góp thật cho hệ hoặc cộng đồng
- qua review và interview nội bộ
- có role rõ và scope hợp tác rõ

## B. Grace period khi tụt level

```text
Inactive 45 ngày -> Cảnh báo lần 1 (email + in-app notification)
Inactive 60 ngày -> Cảnh báo lần 2 + thông báo sẽ tụt level sau 14 ngày
Inactive 74 ngày -> Grace period 14 ngày bắt đầu
  -> Nếu có 1 hành động bất kỳ trong grace period: giữ nguyên level
  -> Nếu vẫn không active: tụt xuống 1 level
```

### Hành động được tính để giữ level

- hoàn thành một lesson
- mở lại hành trình và thực hiện next step
- cập nhật profile có ý nghĩa
- nộp proof / reflection / action
- tham gia circle hoặc event có xác thực
- đăng nội dung được duyệt

### Điều không bị mất khi tụt level

- VC badges
- nội dung đã tạo
- lịch sử doanh thu
- hồ sơ contribution

## C. Hồ sơ thành viên

### Identity

- tên
- avatar
- bio
- lĩnh vực quan tâm
- social links

### Journey

- stage hiện tại
- next best action
- milestone gần nhất
- domain ưu tiên

### Skills

- kỹ năng tự khai báo
- kỹ năng đã được VC verify

### Portfolio

- nội dung đã tạo
- dịch vụ đã làm
- project đã đóng góp

### Earnings

- tổng thu nhập
- breakdown theo nguồn
- trạng thái mặc định là private

### VC Badges

- danh sách badge
- ngày cấp
- verify URL

### Reputation

- điểm đóng góp
- rating
- số người đã hỗ trợ

## D. Journey Engine trong member dashboard

Journey Engine không phải subdomain riêng trong Phase 1-2.

Nó là widget nổi bật trong `member.vetuonglai.com`:
- tiêu đề: `Bước tiếp theo của bạn`
- input:
  - current stage
  - VC badges
  - activity history
  - goal
- output:
  - 1 next step chính
  - 2 next step phụ
  - 1 cảnh báo nếu user đang lệch

## E. VTL Points

### Vai trò của points

VTL Points là lớp contribution và retention support, không phải vanity gamification.

### Hành động được thưởng

| Hành động | Điểm |
|---|---:|
| Đăng bài được duyệt | 50 |
| Bài có 500 lượt xem thật | 100 |
| Hoàn thành khóa học | 200 |
| Nhận rating 5 sao cho dịch vụ | 150 |
| Giới thiệu thành viên mới hợp lệ | 300 |
| Tham gia project hoàn thành | 500 |
| Tổ chức workshop | 1000 |

### Quy tắc chống abuse

- view bot không được tính
- referral tự tạo không được tính
- spam comment không được tính
- action chỉ được thưởng khi có proof hoặc moderation logic tương ứng

### Quy đổi gợi ý

- 1.000 điểm = 50.000 VNĐ giảm trừ phí nền tảng
- 5.000 điểm = 1 tháng nâng cấp level miễn phí theo campaign phù hợp

## F. Quy tắc hiển thị level và badge

- level thể hiện access và role hiện tại
- badge thể hiện proof và trust đã đạt
- UI phải phân biệt rõ hai khái niệm này

Không được để người dùng hiểu nhầm rằng trả tiền là đồng nghĩa với verified.

## G. Quyền của thành viên

- xem và sửa hồ sơ của mình
- export data cơ bản của mình
- kiểm tra badges và status
- yêu cầu review nếu bị từ chối claim hoặc tụt level sai logic

## H. Quyền của hệ thống

Hệ thống có thể:
- cảnh báo
- giới hạn quyền tạm thời
- hạ level
- khóa account

Trong các trường hợp:
- gian lận proof
- spam
- abuse affiliate
- lừa đảo người dùng khác
- vi phạm zero-tolerance policy

## I. Definition of done cho member system

Member system chỉ được xem là xong khi:
- user có thể đăng ký và đăng nhập
- user thấy được level, badge, stage, next step
- rule nâng và tụt level chạy đúng
- grace period hoạt động đúng
- badges không mất khi tụt level
- quyền truy cập giữa các layer phản ánh đúng level và proof
