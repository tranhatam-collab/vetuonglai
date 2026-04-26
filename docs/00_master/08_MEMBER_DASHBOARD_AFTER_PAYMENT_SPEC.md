# 08_MEMBER_DASHBOARD_AFTER_PAYMENT_SPEC.md

## Mục đích của file

Định nghĩa dashboard user thấy ngay sau khi thanh toán và login bằng magic link, để đảm bảo:
- user không bị rơi vào trạng thái “đã trả tiền nhưng không biết làm gì”
- hệ thể hiện rõ giá trị member layer
- hành trình tiếp theo luôn cụ thể

---

## 1. Product intent

Dashboard sau payment phải trả lời 4 câu ngay trên màn đầu:

1. Tôi đang ở trạng thái nào?
2. Tôi nên bắt đầu từ đâu?
3. Tôi đã mở được những gì?
4. Tôi có thể đi tiếp thế nào?

---

## 2. Information architecture (bắt buộc)

## 2.1 Header status block

- member status: `active/grace/expired`
- plan: `Future Access Pass`
- renewal date (nếu có)
- primary CTA theo trạng thái

## 2.2 Journey starter block

- current stage
- 1 next step chính
- 2 next step phụ
- recommended primary domain

## 2.3 Unlock map block

- danh sách domain đã mở member-depth
- trạng thái từng domain: `ready / preview / coming_next`

## 2.4 Proof/progress block

- proof summary
- credential summary
- completion summary

## 2.5 Expansion block

- specialist packs phù hợp
- partner/referral path (nếu đủ điều kiện)

---

## 3. Data contract

### 3.1 Inputs tối thiểu

- member profile
- subscription state
- entitlement list
- domain availability map
- recommendation payload
- progress/proof payload

### 3.2 API đề xuất

- `GET /api/member/session/current`
- `GET /api/member/dashboard`
- `GET /api/member/entitlements`
- `GET /api/member/recommendations`

---

## 4. State behavior

### 4.1 Active

- hiển thị đầy đủ dashboard
- CTA: “Bắt đầu hành trình của bạn”

### 4.2 Grace

- vẫn cho truy cập core (theo policy)
- hiển thị banner renewal
- CTA: “Gia hạn để tiếp tục hành trình”

### 4.3 Expired

- hạn chế member-depth
- giữ login + profile + renew CTA
- CTA: “Kích hoạt lại quyền truy cập”

### 4.4 Provision pending

- message rõ: payment ghi nhận, hệ đang kích hoạt
- polling/retry safe

---

## 5. UX copy contract

### 5.1 Dùng

- “Mở toàn bộ hệ của bạn”
- “Bạn đang ở đây, bước tiếp theo là…”
- “Đây là những gì bạn đã mở”

### 5.2 Không dùng

- “chúc mừng mua thành công” rồi dừng
- “bạn đã unlock mọi thứ mãi mãi”
- language ép mua pack ngay sau payment

---

## 6. Mobile-first rules

- ưu tiên card stack 1 cột
- quick actions phải nằm trên first viewport
- trạng thái pass phải đọc được ngay không cần scroll sâu
- CTA chính luôn sticky/đủ nổi bật

---

## 7. Telemetry events

Bắt buộc gửi:

- `dashboard_open`
- `dashboard_next_step_click`
- `dashboard_domain_open_click`
- `dashboard_pack_view_click`
- `dashboard_renew_click`

---

## 8. Error/empty states

### 8.1 No recommendation

- fallback: show 3 lộ trình mặc định theo stage

### 8.2 Missing entitlement

- show disclosure + action to resolve

### 8.3 API timeout

- giữ skeleton + retry CTA

---

## 9. QA checklist

1. user mới thanh toán -> thấy dashboard đầy đủ
2. user grace -> thấy renewal state đúng
3. user expired -> không vào member depth ngoài policy
4. deep-link từ dashboard mở đúng domain/context
5. mobile nhỏ vẫn dùng được không vỡ layout

---

## 10. Definition of done

Dashboard được xem là hoàn chỉnh khi:

- user hiểu ngay trạng thái và bước tiếp theo trong 10 giây đầu
- có ít nhất 1 hành động giá trị cao trên first screen
- state `active/grace/expired/pending` đều hiển thị đúng
- telemetry event đầy đủ
- không mâu thuẫn với entitlement runtime truth

