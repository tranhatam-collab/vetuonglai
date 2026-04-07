# 20_testing_plan_vc_escrow

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · QA · OPS

## VC Claim Testing

- TC-VC-01: Happy path auto-approve
- TC-VC-02: Thiếu điều kiện -> reject tự động
- TC-VC-03: Borderline -> peer review -> approve
- TC-VC-04: Borderline -> peer review -> reject
- TC-VC-05: Fake evidence -> reject + flag
- TC-VC-06: Public URL verify đúng
- TC-VC-07: Badge hiển thị đúng trên profile
- TC-VC-08: Tụt level không mất badge
- TC-VC-09: Badge event unlock đúng
- TC-VC-10: Conflict of interest của peer reviewer

## Escrow Flow Testing

- TC-ES-01: Buyer thanh toán -> pending
- TC-ES-02: Digital product -> auto release sau 24h
- TC-ES-03: Service -> buyer approve -> release
- TC-ES-04: Buyer dispute trong 5 ngày
- TC-ES-05: Buyer thắng dispute -> hoàn tiền
- TC-ES-06: Buyer gian lận -> release + flag
- TC-ES-07: Creator protection khi có VC proof phù hợp
- TC-ES-08: Platform fee đúng
- TC-ES-09: Tax withholding đúng
- TC-ES-10: Payout thứ 6 chạy đúng
- TC-ES-11: Refund policy đúng theo loại
- TC-ES-12: Creator xóa nội dung khi còn pending transaction

## Definition of done

Flow VC và escrow chỉ được coi là xong khi toàn bộ test critical path pass và có audit logs kiểm tra lại được.
