# 28_PACKAGING_AND_FORMS_SYSTEM_FULL.md

## 0. Mục đích

Tài liệu này khóa toàn bộ:

* cấu trúc gói (packages)
* logic phân tầng
* form đăng ký (cá nhân & doanh nghiệp)
* cách hiển thị, so sánh, đề xuất
* flow từ xem -> hiểu -> chọn -> đăng ký -> sử dụng

Đây là source of truth cho:

* Product
* FE
* BE
* Content
* QA
* Legal

---

## 1. Nguyên tắc tổng

### 1.1 Không bán sản phẩm

Hệ này không bán khóa học rời rạc.

Hệ này:

* mở một hành trình
* đưa người dùng vào đúng điểm
* giúp họ đi tiếp

### 1.2 Gói phải gắn với vấn đề

Mỗi gói phải trả lời:

* dành cho ai
* đang gặp vấn đề gì
* sau gói này thay đổi được gì

### 1.3 Không quá nhiều lựa chọn cùng lúc

Nguyên tắc:

* mỗi màn hình tối đa 3-4 lựa chọn
* không hiển thị toàn bộ gói cùng lúc

---

## 2. Cấu trúc hệ gói tổng

### TẦNG 0 — FREE MEMBER

#### Mục tiêu

Cho người dùng vào hệ.

#### Có:

* đọc blog
* xem teaser
* dùng tools cơ bản
* xem demo
* tạo tài khoản

#### Không có:

* nội dung sâu
* dashboard đầy đủ
* AI đầy đủ

### TẦNG 1 — FUTURE ACCESS PASS

#### Giá

* 3 USD năm đầu
* 99 USD từ năm 2

#### Mục tiêu

Mở toàn hệ ở lớp core

#### Mở:

* dashboard cá nhân
* hành trình
* AI cơ bản
* content member
* xem tất cả subdomain

### TẦNG 2 — FOUNDATION PACKS

#### Mục tiêu

Hiểu nền tảng của từng lĩnh vực

#### Có:

* lộ trình cơ bản
* checklist
* bài học nền
* demo thực tế

### TẦNG 3 — APPLIED PACKS

#### Mục tiêu

Làm được thật

#### Có:

* project
* output
* feedback
* AI hỗ trợ sâu hơn

### TẦNG 4 — PROFESSIONAL / SPECIALIST

#### Mục tiêu

Ứng dụng vào công việc

#### Có:

* workflow
* template
* case thực tế
* điều kiện mở VC

### TẦNG 5 — BUSINESS (RIÊNG)

Subdomain:

`business.vetuonglai.com`

---

## 3. Hệ gói cho từng subdomain

### EDU

| Gói | Mục tiêu |
| --- | --- |
| Foundation | hiểu cách học |
| Applied | làm được |
| Professional | có output + proof |

### LIFE

| Gói | Mục tiêu |
| --- | --- |
| Baseline 7 ngày | ổn định |
| 30 ngày | tạo nhịp |
| 90 ngày | hệ sống |

### FINANCE

| Gói | Mục tiêu |
| --- | --- |
| Basics | hiểu tiền |
| Discipline | kiểm soát |
| System | vận hành |

### INVEST

| Gói | Mục tiêu |
| --- | --- |
| Basics | hiểu risk |
| Applied | kiểm tra |
| System | phân bổ |

### GREEN

| Gói | Mục tiêu |
| --- | --- |
| Basics | hiểu impact |
| Tracking | đo |
| Proof | xác minh |

---

## 4. BUSINESS DOMAIN

Subdomain:

`business.vetuonglai.com`

### 4.1 Điều kiện vào

BẮT BUỘC:

* tên công ty
* mã số doanh nghiệp
* người đại diện
* email công ty
* số điện thoại

### 4.2 Gói doanh nghiệp

#### B1 — Entry

* đánh giá sơ bộ
* scorecard
* gợi ý hướng đi

#### B2 — Foundation

* hệ vận hành cơ bản
* checklist nội bộ
* structure

#### B3 — Applied

* SOP
* quy trình
* triển khai thật

#### B4 — Strategic

* trust layer
* đánh giá đội ngũ
* mở partner

---

## 5. Form đăng ký

### 5.1 Cá nhân

#### Step 1

* tên
* email
* mục tiêu

#### Step 2

* bạn đang gặp vấn đề gì
* bạn muốn đạt điều gì

#### Step 3

* gợi ý gói

### 5.2 Doanh nghiệp

#### Step 1 — kiểm tra

* tên công ty
* mã số thuế
* email
* điện thoại
* người đại diện

#### Step 2 — khảo sát

* quy mô
* lĩnh vực
* vấn đề chính

#### Step 3 — đề xuất

* gói phù hợp
* demo
* đăng ký

---

## 6. Cấu trúc hiển thị gói

### 6.1 Card chuẩn

Mỗi gói phải có:

* dành cho ai
* giải quyết vấn đề gì
* bạn nhận được gì
* output là gì
* bước tiếp theo

### 6.2 Không hiển thị

* số bài
* số giờ
* thông số kỹ thuật khô

---

## 7. Demo bắt buộc

Mỗi gói phải có:

* demo UI
* demo output
* demo dashboard
* demo case

---

## 8. Logic đề xuất gói

Hệ phải:

* không cho user chọn bừa
* luôn đề xuất

Ví dụ:

`User -> form -> phân loại -> đề xuất 2-3 gói -> demo -> chọn`

---

## 9. Liên kết hệ thống

Từ gói phải dẫn tới:

* subdomain tương ứng
* next step
* journey

---

## 10. Quy tắc UX

* không overload
* không ép mua
* không hiển thị quá nhiều

---

## 11. Sai lầm phải tránh

* quá nhiều gói
* gói giống nhau
* không có demo
* không rõ output
* form quá dài

---

## 12. Definition of Done

Hệ gói hoàn chỉnh khi:

* user hiểu gói
* user thấy giá trị
* user thấy demo
* user chọn dễ
* user đi tiếp được

---

## 13. Kết luận

Hệ gói không phải để bán.

Hệ gói để:

* dẫn người dùng
* giúp họ chọn đúng
* giúp họ đi tiếp

---

## KẾT

Anh đã có:

* hệ gói hoàn chỉnh
* form chuẩn
* logic đề xuất
* business layer

---

Nếu anh muốn bước tiếp:

`29_REAL_CONVERSION_FLOW_AND_UI_SPEC.md`

-> để tối ưu tỷ lệ chuyển đổi, nhưng không phá brand.
