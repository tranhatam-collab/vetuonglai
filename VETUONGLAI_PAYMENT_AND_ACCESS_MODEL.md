# VETUONGLAI PAYMENT AND ACCESS MODEL

Version: 1.0
Last updated: 2026-04-07

## Free vs paid vs cohort access

- free: mở cơ bản
- paid: mở sâu hơn
- cohort: có lớp đồng hành hoặc giới hạn riêng

## Stripe checkout

Là model thanh toán ưu tiên hiện tại.

## Webhook logic

- verify signature
- mark payment state
- unlock access

## Unlock rules

User chỉ được mở đúng thứ đã mua hoặc đã được cấp.

## Refund rules

Phải có nguyên tắc rõ, không xử lý tùy hứng.

## Certificate eligibility rules

Thanh toán không đồng nghĩa với có credential. Proof chỉ issue khi đạt điều kiện học / làm / review.
