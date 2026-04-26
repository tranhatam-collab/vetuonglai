# 30_FULL_SYSTEM_TEST_PLAN.md

## 0. Mục tiêu

File này khóa toàn bộ:

* cách test toàn hệ `*.vetuonglai.com`
* thứ tự test
* test theo flow thật (không test rời rạc)
* tiêu chuẩn pass/fail
* trách nhiệm từng team

---

## 1. Nguyên tắc kiểm thử

### 1.1 Test theo hệ, không test từng trang

❌ Sai:

* test riêng EDU
* test riêng VC

✅ Đúng:

* test flow xuyên hệ:

User -> Hub -> Login -> EDU -> Submit -> VC -> Dashboard

### 1.2 Test cái chạy thật

Không test:

* UI mock
* data giả
* flow chưa nối

### 1.3 Test phải có evidence

Mỗi test:

* log
* screenshot
* output

---

## 2. 5 nhóm test bắt buộc

### 2.1 AUTH + MEMBER TEST

Case

* login bằng magic link
* session giữ xuyên subdomain
* logout

Pass khi:

* login 1 lần -> dùng toàn hệ
* không phải login lại

### 2.2 EDU FLOW TEST

Case

* mở khóa học
* xem lesson
* làm bài
* submit

Pass khi:

* lesson load được
* submit lưu được
* status thay đổi

### 2.3 SUBMISSION + REVIEW TEST

Case

* submit bài
* review
* approve / reject

Pass khi:

* trạng thái đúng
* feedback lưu được

### 2.4 VC TEST

Case

* tạo VC
* verify VC

Pass khi:

* có ID
* mở `/v/:code` được
* data đúng

### 2.5 DASHBOARD TEST

Case

* user login
* xem progress
* xem next step

Pass khi:

* dữ liệu đúng
* không empty state sai

---

## 3. TEST FLOW CHÍNH (CRITICAL PATH)

### Flow 1 — Full journey

Vào hub
-> login
-> vào edu
-> học
-> submit
-> review
-> cấp VC
-> về dashboard

Pass khi:

* không lỗi
* không mất dữ liệu
* next step đúng

### Flow 2 — Cross domain

Hub -> LIFE -> EDU -> VC -> Dashboard

Pass khi:

* không cần login lại
* data giữ nguyên

### Flow 3 — Teaser -> Gateway

Public page -> CTA -> Gateway -> Login -> Dashboard

---

## 4. UI TEST

Kiểm tra:

* không trộn VI/EN
* không text hard-code
* không DPM / internal label
* responsive OK
* màu đúng domain

---

## 5. SEO TEST

Kiểm tra:

* Title
* Description
* 1 H1
* 3-6 H2
* alt text
* canonical
* hreflang

---

## 6. API TEST

Kiểm tra:

* response đúng format
* không lỗi 500
* error rõ ràng

---

## 7. DATA TEST

Kiểm tra:

* user lưu đúng
* submission lưu đúng
* VC tạo đúng
* không trùng dữ liệu

---

## 8. PERFORMANCE TEST

Kiểm tra:

* load < 3s
* API < 500ms
* không lag UI

---

## 9. SECURITY TEST

Kiểm tra:

* không lộ data user khác
* không bypass entitlement
* không lộ API key

---

## 10. QA CHECKLIST FINAL

Nội dung

* không hype
* không từ cấm
* đúng tone

Dev

* không bug
* không route lỗi
* không data sai

UX

* dễ hiểu
* có next step
* không rối

---

## 11. PASS / FAIL

PASS khi:

* 5 flow chính chạy được
* không bug nghiêm trọng
* data đúng

FAIL khi:

* flow bị đứt
* mất data
* VC sai
* dashboard sai

---

## 12. REPORT FORMAT

Test case:
Result:
Issue:
Severity:
Owner:
Evidence:

---

## 13. SEVERITY

* P0 -> chặn launch
* P1 -> phải fix trước launch
* P2 -> fix sau

---

## 14. TRÁCH NHIỆM

QA

* test toàn bộ

DEV

* fix lỗi

PM

* quyết định launch

---

## 15. FINAL RULE

Nếu hệ không chạy end-to-end -> không được launch

---

## KẾT LUẬN

Đây là bước quan trọng nhất trước launch.

