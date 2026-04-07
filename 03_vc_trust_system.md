# 03_vc_trust_system

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · OPS · LEGAL · CONTENT

## A. VC là gì — định nghĩa chính thức

> Verified Contribution là bằng chứng số có thể kiểm chứng rằng một người đã thật sự học, làm, tạo ra giá trị, và đóng góp cho cộng đồng. Không phải bằng cấp, mà là proof thực tế.

## Vai trò của VC trong toàn hệ

- trust backbone
- anti-fake mechanism
- gating layer cho các engine kinh tế nhạy cảm
- bridge giữa learning, earning và contribution

## B. 6 loại VC badge

| Badge | Điều kiện cụ thể | Thẩm quyền cấp |
|---|---|---|
| Learner Verified | Hoàn thành >=3 khóa học, có project output | System auto + editor review |
| Creator Verified | >=5 sản phẩm, tổng >=1.000 lượt tiếp cận thật | Editor review |
| Builder Verified | >=1 project hoàn thành, có output kiểm chứng | Peer review Level 3+ |
| Service Verified | >=10 đơn dịch vụ, rating >=4.5 | System auto |
| Mentor Verified | >=20 người được mentor, feedback tích cực | Team VTL xét duyệt |
| Community Builder | Circle >=50 active members | System auto + team |

## C. Quy trình cấp badge

```text
User submit claim -> hệ thống auto-check dữ liệu
  -> Đủ điều kiện: cấp badge tự động
  -> Cần review: chuyển peer reviewer Level 3+
    -> Approved: badge + ghi vào registry vĩnh viễn
    -> Rejected: lý do + hướng dẫn đủ điều kiện
```

## Điều kiện review tối thiểu

- evidence packet rõ
- source domain rõ
- timestamps hợp lệ
- reviewer hoặc system có thể tái kiểm tra logic

## D. VC registry — tính chất

- mỗi badge có ID duy nhất
- có verify URL độc lập
- không xóa record sau khi cấp
- có thể revoke hoặc supersede theo rule rõ ràng
- public mặc định nếu policy cho phép
- user có quyền chọn private với một số loại proof nhạy cảm, trừ khi flow bắt buộc public

## Trường dữ liệu tối thiểu của một VC record

- vc_id
- user reference
- badge type
- issued_at
- status
- evidence summary
- source domain
- proof hash
- verify URL

## E. Tại sao VC là xương sống của toàn hệ

- Người mua dịch vụ tin proof hơn lời tự mô tả.
- Elite, Partner và nhiều engine kinh tế cần gating bằng VC.
- Story thật phải dựa trên proof thật.
- Không thể mua VC bằng tiền.

## F. Các trạng thái badge / record

- pending
- reviewing
- issued
- revoked
- superseded

## G. Revocation và supersede

### Revocation

Chỉ áp dụng khi:
- gian lận
- dữ liệu sai nghiêm trọng
- claim không còn hợp lệ vì bằng chứng giả

### Supersede

Áp dụng khi:
- có phiên bản bằng chứng mới hơn
- record cũ cần được thay bằng record chính xác hơn

Không được xóa lịch sử một cách âm thầm.

## H. Public verify page

Verify page phải hiển thị tối thiểu:
- badge type
- status
- issued date
- minimal disclosure
- verify note

Không được lộ dữ liệu nhạy cảm không cần thiết.

## I. VC như event bus trung tâm

VC không chỉ là badge layer. Nó là proof-event bus trung tâm của toàn hệ.

Ví dụ sự kiện:
- badge issued -> unlock features + notify user + update journey
- course completed -> auto-check VC eligibility
- job completed -> add service evidence
- first earning -> trigger earning milestone flow

## J. Definition of done cho VC system

VC system chỉ được coi là xong khi:
- user submit được claim
- system kiểm tra được điều kiện cơ bản
- reviewer xử lý được pending claims nếu cần
- verify URL dùng được độc lập
- status lifecycle rõ ràng
- event downstream cập nhật được member/journey/workflow
