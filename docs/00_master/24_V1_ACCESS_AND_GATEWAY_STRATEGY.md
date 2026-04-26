# 24_V1_ACCESS_AND_GATEWAY_STRATEGY.md

## Mục đích của file

File này khóa chiến lược access/gateway cho `Về Tương Lai V1.0`.

File này thay thế cho tư duy cũ kiểu:

- `2 USD lifetime unlock`
- “mở tất cả vĩnh viễn chỉ bằng một lần thanh toán”

Trong V1.0 hiện tại, hệ phải bám đúng source of truth:

- public teaser vẫn tồn tại để giữ SEO và trust
- gateway mở lớp member phải bám `Future Access Pass`
- không claim “lifetime unlock” khi runtime, legal và payment reality chưa hỗ trợ mô hình đó

---

## 1. Current-state của V1.0

### Public layer

Mọi domain public phải cho người dùng:

- thấy vấn đề
- thấy hướng đi
- thấy demo
- thấy CTA vào hệ

### Member gateway

Trong V1.0 hiện tại, quyền đi sâu vào hệ được mở qua:

- `Future Access Pass`
- magic link
- entitlement server-side

Không dùng mô hình:

- mua một lần mở vĩnh viễn toàn hệ

---

## 2. Nguyên tắc gateway của V1.0

1. Không khóa sạch lớp public.
2. Không để subdomain tự làm checkout.
3. Hub là điểm gateway trung tâm cho flow commerce/member.
4. Entitlement phải được quyết định ở backend/runtime.
5. Mọi copy gateway phải nói là “mở hệ”, không nói là “mua vài bài”.

---

## 3. Những gì được mở trong V1.0

### Public mở

- teaser
- demo
- preview
- verify công khai
- bài viết và layer SEO

### Member mở sau gateway

- dashboard
- lớp member của các domain đã sẵn sàng
- recommendation / next step
- playbook, guide, demo sâu hơn
- AI layer cơ bản nếu lane đó đã sẵn sàng

### Không tự động mở

- specialist pack
- partner privileges
- earning lane sâu
- work / market / affiliate nếu proof-gating chưa sẵn sàng

---

## 4. Rule cứng cho toàn team

- không dùng từ `lifetime unlock` trong file public/release nếu chưa có legal và product lock mới
- không công bố một gateway khác với entitlement model hiện hành
- không để payment logic drift khỏi `03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`

---

## 5. Kết luận

V1.0 không phải “bán vé vào cửa vĩnh viễn”.

V1.0 là:

- giữ public layer mạnh
- mở member layer có điều kiện
- dùng gateway trung tâm
- đồng bộ identity + entitlement + magic link đúng thực tế runtime
