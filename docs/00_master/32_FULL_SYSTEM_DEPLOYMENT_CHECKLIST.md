# 32_FULL_SYSTEM_DEPLOYMENT_CHECKLIST.md

## 0. Mục tiêu

Khóa toàn bộ quy trình:

* Dev -> Staging -> Production -> Live
* Không skip bước
* Không deploy “niềm tin”
* Mọi thứ phải có evidence

---

## 1. Nguyên tắc bắt buộc

* Không deploy nếu chưa QA pass
* Không deploy nếu core flow chưa chạy
* Không deploy nếu language chưa chuẩn
* Không deploy nếu còn route lỗi
* Không deploy nếu không có rollback

Deploy là một phần của delivery.

---

## 2. Môi trường

| Môi trường | Mục đích |
| --- | --- |
| Local | Dev cá nhân |
| Dev | Test nội bộ |
| Staging | Test gần production |
| Production | Live |

---

## 3. DEV -> STAGING

### 3.1 Code checklist

* Build pass
* Không lỗi lint
* Không hard-coded text
* i18n OK
* ENV đúng

### 3.2 Feature checklist

* Auth hoạt động
* EDU load
* Submit chạy
* VC issue OK
* Dashboard load

### 3.3 API checklist

* Không 500
* Response đúng format
* Error có message

### 3.4 Evidence

* Screenshot
* Log
* API response

---

## 4. STAGING CHECK

### 4.1 Flow test (bắt buộc)

Login -> Learn -> Submit -> Review -> VC -> Dashboard

* Flow chạy end-to-end
* Không mất data
* Không redirect lỗi

### 4.2 UI test

* Không trộn VI/EN
* Không DPM
* Layout chuẩn
* Mobile OK

### 4.3 SEO test

* Title
* Description
* H1/H2
* Schema

### 4.4 Performance

* Load < 3s
* API < 500ms

---

## 5. PRE-PRODUCTION GATE

PASS khi:

* 100% flow chạy
* 0 lỗi P0
* Language sạch
* Data đúng
* Logs OK

FAIL khi:

* VC lỗi
* Submission lỗi
* Dashboard sai
* Auth lỗi

---

## 6. PRODUCTION DEPLOY

### 6.1 Pre-deploy

* Backup DB
* Snapshot config
* Kiểm tra ENV
* Kiểm tra secrets

### 6.2 Deploy

* Build production
* Deploy FE
* Deploy BE
* Migrate DB

### 6.3 Smoke test

* Login OK
* EDU OK
* Submit OK
* VC OK
* Dashboard OK

---

## 7. ROLLBACK PLAN

Khi rollback:

* Lỗi P0
* Flow gãy
* Data sai

Rollback steps

* revert code
* restore DB
* redeploy version cũ

---

## 8. MONITORING

Tools

* Sentry (error)
* Logs
* Analytics

Check

* error rate
* API latency
* user drop

---

## 9. POST-LIVE CHECK

1 giờ đầu

* login OK
* no crash

24 giờ

* user flow OK
* no data loss

7 ngày

* retention
* bug count

---

## 10. INCIDENT RESPONSE

Khi lỗi

1. Identify
2. Fix
3. Deploy
4. Report

Template

Issue:
Impact:
Root cause:
Fix:
Prevention:

---

## 11. TEAM RESPONSIBILITY

FE

* UI
* i18n

BE

* API
* DB
* auth

QA

* test

PM

* approve

---

## 12. DEPLOYMENT CHECKLIST FINAL

* Code sạch
* Flow chạy
* Language chuẩn
* SEO OK
* No bug
* Monitoring bật
* Rollback sẵn

---

## 13. Definition of Done

Deploy chỉ DONE khi:

* user vào được
* user dùng được
* user tạo output
* hệ ghi nhận

---

## 14. Câu chốt

Không deploy khi chưa chắc.
Deploy khi mọi thứ đã chạy thật.

---

## KẾT

Anh đã có:

* System lock
* Dev plan
* Test plan
* Launch plan
* Deploy plan

