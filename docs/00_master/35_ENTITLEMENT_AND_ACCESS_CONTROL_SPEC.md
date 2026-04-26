# 35_ENTITLEMENT_AND_ACCESS_CONTROL_SPEC

## Mục đích của file

File này khóa phần còn thiếu lớn nhất của V1.0:

- ai mở được cái gì
- quyền nào đến từ payment
- quyền nào đến từ proof
- quyền nào đến từ review/partner state
- khi hết hạn thì còn gì, mất gì, mở lại thế nào

File này là bản implementation-grade đi tiếp từ:

- `03_FUTURE_ACCESS_PASS_AND_ENTITLEMENTS.md`

---

## 1. Nguồn quyết định quyền truy cập

Entitlement phải do backend quyết định.

Không được quyết định quyền bằng:

- frontend state
- query param
- local storage
- magic link một mình

Nguồn sự thật phải dựa trên:

- payment state
- account state
- pack ownership
- proof state
- partner/compliance state

---

## 2. Tách rõ 3 lớp quyền

### 2.1 Payment rights

Quyền đến từ:

- Future Access Pass
- specialist pack

Ví dụ:

- `future_access_member`
- `specialist_pack_access:<pack_id>`

### 2.2 Proof rights

Quyền đến từ:

- completion
- review pass
- VC issue

Ví dụ:

- `verified_builder`
- `vc_claim_submit`
- `vc_claim_reviewed`

### 2.3 Governance rights

Quyền đến từ:

- partner approval
- compliance pass
- moderation pass

Ví dụ:

- `partner_access`
- `affiliate_eligible`

---

## 3. Quyền lõi hiện tại trong V1.0

### `public_access`

Ai cũng có.

### `future_access_member`

Có khi:

- subscription active
- không bị revoke

Mở:

- lớp member của các domain core đã sẵn sàng
- dashboard
- cross-domain identity

### `specialist_pack_access:<pack_id>`

Có khi:

- đã mua pack tương ứng

Mở:

- nội dung sâu của pack
- dashboard pack

### `verified_builder`

Có khi:

- đã có proof/credential/state đủ điều kiện

Mở:

- các pathway sâu hơn về trust/proof/value creation

### `partner_access`

Có khi:

- được xét duyệt

Mở:

- quyền partner tương ứng

---

## 4. Domain access matrix hiện tại

| Domain | Public | Future Access Pass | Pack | Proof gate | Partner gate |
| --- | --- | --- | --- | --- | --- |
| root | có | có member depth | có preview sâu theo pack khi được hỗ trợ | có proof summary | chưa mở full |
| member | teaser/planned-safe | có | không phải entry chính | không | không |
| edu | có | có | có thể mở module sâu theo pack | completion/proof mở thêm | không |
| vc | có verify public | có dashboard/proof summary sâu hơn | không phải pack-first | rất quan trọng | có thể có sau |
| life | có preview | có member depth | có thể mở sâu bằng pack sau | không bắt buộc | không |
| finance | có | có member depth | có thể mở sâu bằng pack sau | không bắt buộc | không |
| invest | có preview | có member depth | có thể mở sâu bằng pack sau | có thể yêu cầu review | không |
| green | có | có member depth | có thể mở sâu bằng pack sau | proof rất quan trọng | có thể có sau |
| work | chưa | chưa public | chưa | cần proof gate | có thể cần |
| market | chưa | chưa public | chưa | cần proof gate | có thể cần |

---

## 5. Expiry, grace period, reactivation

### Expired

Khi pass hết hạn:

- mất `future_access_member`
- giữ `public_access`
- vẫn login được để renew
- profile và history không mất

### Grace period

Khuyến nghị vận hành:

- `7 ngày`

Trong thời gian này:

- hiện cảnh báo
- cho renew nhanh
- chưa khóa gắt ngay lập tức

### Reactivation

Khi renew thành công:

- khôi phục `future_access_member`
- khôi phục member depth phù hợp
- không tự động nâng proof/gov rights nếu những quyền đó cần review riêng

---

## 6. Tách payment level và proof level

Không được dùng một level duy nhất để trộn:

- đã trả tiền
- đã hoạt động
- đã có proof
- đã có contribution

Phải tách:

1. payment state
2. activity state
3. proof state
4. governance state

Điều này giúp team không:

- gắn nhầm quyền
- mở economy trước trust
- hiểu sai “trả tiền = đủ điều kiện”

---

## 7. Team sync

### Team 1

- owner runtime entitlement resolution

### Team 2

- chỉ render đúng những quyền backend trả về

### Team 3

- review copy, disclosure và edge cases hết hạn / gia hạn / mở lại

---

## 8. Definition of done

File này chỉ được xem là đạt khi:

1. mọi route protected đều map được về entitlement rõ
2. expired / grace / renew có hành vi rõ
3. payment rights và proof rights không trộn lẫn
4. team không còn viết copy kiểu “trả tiền là mở mọi thứ”
