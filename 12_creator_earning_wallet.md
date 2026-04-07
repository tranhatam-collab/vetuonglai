# 12_creator_earning_wallet

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · FINANCE · OPS

## A. Creator Dashboard — widget chính

- tổng thu nhập tháng này vs tháng trước
- breakdown theo nguồn
- top content theo doanh thu và engagement
- pending earnings
- VC badge status

## B. Earning flow

```text
Người mua thanh toán
  -> Tiền vào escrow hệ thống
    -> Nếu nội dung số: release sau 24h
    -> Nếu dịch vụ: release sau khi approve deliverable
      -> Trừ phí platform
        -> Trừ thuế nếu áp dụng
          -> Cộng vào available balance
            -> Creator request payout
              -> Transfer về tài khoản ngân hàng
```

## C. Wallet states

- Pending
- Available
- Withdrawn
- Tax held

## D. Minimum payout và phí

- rút tối thiểu: 200.000 VNĐ
- Level Pro: phí rút 2%
- Level Elite trở lên: miễn phí rút
- KYC bắt buộc trước lần rút đầu

## E. Earning protection

- dispute window: 24h cho digital, 5 ngày cho service
- creator protection nếu chargeback là lỗi hệ thống hoặc fraud rõ ràng

## F. Definition of done cho wallet

Wallet chỉ được coi là xong khi:
- earning flow rõ
- wallet state đúng
- payout request hoạt động đúng
- dispute window ảnh hưởng đúng release logic
