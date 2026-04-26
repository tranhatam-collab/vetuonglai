# 27_V1_PAYMENT_MAGIC_LINK_AND_MEMBER_UNLOCK_FLOW.md

## Mục đích của file

Chốt current-state và next-state cho payment + magic link + member unlock trong V1.0.

---

## 1. Current-state

Payment lane hiện tại đi theo hướng:

- hub resolve payment
- `pay.iai.one`
- payOS
- magic link
- member entitlement

Không dùng mô hình:

- checkout phân tán ở subdomain
- unlock vĩnh viễn bằng client-side state

---

## 2. Flow đúng của V1.0

1. User thấy CTA từ public layer
2. User đi về hub/member flow
3. Payment được resolve ở gateway trung tâm
4. Backend provisioning xác nhận state
5. Magic link được gửi
6. Entitlement được cấp server-side
7. User vào member layer

---

## 3. Những gì bắt buộc đúng

- email phải là candidate identity đúng
- webhook/provisioning mới là nguồn sự thật
- magic link chỉ giải quyết identity, không tự quyết entitlement
- payment lane chỉ coi là pass khi trả được `checkoutUrl` usable và flow hoàn tất đúng

---

## 4. Những gì chưa được claim trong V1.0

- full monthly tier ladder
- lifetime unlock
- multi-gateway mature rollout như hệ đã production-complete

---

## 5. Kết luận

V1.0 phải nói đúng:

- payment đang là access/member lane
- không phải “mua một lần mở tất cả mãi mãi”
