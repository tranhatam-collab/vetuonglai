# 35_FOUNDER_AI_AUTOPILOT_SYSTEM.md

## 0. Mục tiêu

Xây một lớp AI Autopilot giúp hệ:

* tự theo dõi trạng thái vận hành
* phát hiện điểm nghẽn
* đề xuất hành động tối ưu
* tự thực thi các hành động an toàn đã cho phép

Không phải:

* AI tự ý thay đổi hệ
* AI ra quyết định thay founder
* AI tối ưu theo “tăng trưởng bằng mọi giá”

---

## 1. Định nghĩa

AI Autopilot là lớp điều hành bán tự động (semi-autonomous) nằm trên:

* Data (DB + logs + analytics)
* Orchestrator (`api.vetuonglai.com`)
* Command Panel (file 34)

Nó thực hiện vòng lặp:

Observe -> Diagnose -> Recommend -> (Optionally) Act -> Verify -> Learn

---

## 2. Nguyên tắc cốt lõi (Non-negotiable)

1. Human-in-the-loop mặc định
   Mọi hành động có rủi ro đều cần xác nhận của founder/PM.
2. Proof over guess
   Mọi nhận định phải kèm dữ liệu, không suy đoán.
3. Safety tiers
   Chỉ một số hành động được phép tự chạy (low-risk).
4. Reversible first
   Ưu tiên thay đổi có thể rollback nhanh.
5. No hype optimization
   Không tối ưu bằng cách phá Language Codex, ép CTA, hay FOMO.

---

## 3. Phạm vi (Scope V1)

### 3.1 Được làm

* Phân tích dữ liệu hệ (flow, lỗi, tắc nghẽn)
* Đề xuất cải tiến (UI nhỏ, copy, thứ tự bước)
* Tự chạy các hành động low-risk (config, thứ tự hiển thị, flag)

### 3.2 Không làm

* Thay đổi pricing
* Mở/đóng domain
* Thay đổi policy pháp lý
* Tự deploy code production
* Tạo hoặc sửa nội dung lớn

---

## 4. Kiến trúc tổng

[Data Sources]
  DB (users, progress, submissions, vc)
  Logs (errors, latency)
  Analytics (events)
        ↓
[Aggregator Service]
  tổng hợp & chuẩn hóa dữ liệu
        ↓
[Autopilot Engine]
  - Analyzer
  - Recommender
  - Action Executor (guarded)
        ↓
[Command Panel]
  hiển thị insight + cho phép approve/deny
        ↓
[Audit Log]
  ghi toàn bộ hành động & kết quả

---

## 5. Các module chính

### 5.1 Observer (Quan sát)

Thu thập:

* Activation rate
* Learn -> Submit rate
* Submit -> VC rate
* Error rate
* Time-to-first-action

### 5.2 Analyzer (Chẩn đoán)

Phát hiện:

* drop points
* bất thường (anomaly)
* regression so với baseline

### 5.3 Recommender (Đề xuất)

Sinh:

* 1-3 đề xuất rõ ràng
* kèm dữ liệu + mức độ tự tin (confidence)

### 5.4 Action Executor (Thực thi có kiểm soát)

Chỉ chạy các action thuộc LOW-RISK SET (mục 8)

### 5.5 Verifier (Xác minh)

Sau khi thay đổi:

* so sánh trước/sau
* xác nhận có cải thiện hay không

### 5.6 Learner (Ghi nhớ)

* lưu hiệu quả của từng action
* điều chỉnh trọng số đề xuất

---

## 6. Nguồn dữ liệu (Inputs)

* users (trạng thái, level)
* progress (bắt đầu/hoàn thành)
* submissions (số lượng, trạng thái)
* vc_badges (issued/failed)
* events (click, view, CTA)
* errors (API, FE)
* latency (hiệu năng)

---

## 7. Chỉ số chuẩn (Baseline Metrics)

* Activation ≥ 40%
* Learn -> Submit ≥ 30%
* Submit -> VC ≥ 50%
* Error rate < 1%
* Page load < 3s

Baseline được lưu trong config và dùng để so sánh.

---

## 8. Phân loại hành động (Action Tiers)

### 8.1 LOW-RISK (được tự động)

* Sắp xếp lại thứ tự card / danh sách
* Đổi text CTA trong tập cho phép (whitelisted)
* Bật/tắt feature flag nhỏ
* Điều chỉnh ngưỡng hiển thị (threshold)

### 8.2 MEDIUM-RISK (cần approve)

* Thay đổi flow (ví dụ: thêm bước submit hướng dẫn)
* Thay đổi cấu trúc section trên page
* Điều chỉnh điều kiện gợi ý (recommendation rules)

### 8.3 HIGH-RISK (cấm tự động)

* Pricing / subscription
* Policy / legal
* Domain routing lớn
* Deploy code
* Thay đổi Language Codex

---

## 9. Ví dụ vận hành

Case 1: Drop sau lesson

* Observer: Learn high, Submit low
* Analyzer: Drop tại bước submit
* Recommender:
  1. Đơn giản hóa form
  2. Thêm hướng dẫn 1 dòng
* Action (auto nếu đã whitelist):
  * bật “simple submit mode”
* Verifier:
  * so sánh submit rate sau 24h

Case 2: VC issuance chậm

* Analyzer: nhiều submission pending
* Recommender:
  * tăng batch review
  * hiển thị trạng thái rõ hơn
* Action: chỉ đề xuất (MEDIUM)

---

## 10. Giao diện trong Command Panel

Hiển thị:

* Insight
  * “Submit rate giảm 22% trong 48h”
* Nguyên nhân
  * “Form quá dài ở mobile”
* Đề xuất
  * “Bật simple submit mode”
* Hành động
  * [Apply] / [Ignore] / [Test 24h]

---

## 11. API gợi ý

GET  /api/autopilot/insights
GET  /api/autopilot/recommendations
POST /api/autopilot/apply
GET  /api/autopilot/audit

Response mẫu:

```json
{
  "insight": "Submission drop",
  "confidence": 0.82,
  "recommendations": [
    "Simplify form",
    "Add inline guidance"
  ]
}
```

---

## 12. Audit & Logging

Mỗi action phải lưu:

* action_id
* thời điểm
* người/AI kích hoạt
* trước/sau (metrics)
* kết quả (success/fail)

Không có audit -> không được chạy.

---

## 13. Bảo mật

* chỉ founder / PM cấp cao truy cập
* role-based permissions
* mọi action có chữ ký (signature)
* rate limit cho autopilot

---

## 14. Triển khai theo pha

Phase 1 — Observe

* thu thập data
* hiển thị dashboard

Phase 2 — Recommend

* đưa insight + đề xuất

Phase 3 — Assisted Action

* founder bấm chạy

Phase 4 — Limited Autopilot

* chạy LOW-RISK actions

Phase 5 — Adaptive

* học từ kết quả, tối ưu đề xuất

---

## 15. Definition of Done

Autopilot đạt khi:

* phát hiện đúng vấn đề thực
* đề xuất rõ, có dữ liệu
* hành động low-risk chạy an toàn
* có audit đầy đủ
* có cải thiện đo được

---

## 16. Rủi ro & cách kiểm soát

* Rủi ro sai đề xuất -> luôn có confidence + human review
* Rủi ro over-optimization -> khóa Language Codex, CTA whitelist
* Rủi ro drift dữ liệu -> refresh baseline định kỳ

---

## 17. Câu chốt

Autopilot không thay thế founder.
Autopilot giúp founder thấy rõ hơn và hành động nhanh hơn.

---

## 18. Kết luận

Đây là lớp cuối của hệ:

* không phải để làm nhanh hơn
* mà để giữ hệ đúng khi nó lớn lên

