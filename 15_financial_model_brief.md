# 15_financial_model_brief

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: Founder · Finance · Investor

## Mục tiêu

File này định hướng financial model 5 năm theo 3 scenario để founder, finance và investor cùng đọc chung một logic.

## Các sheet cần có

```text
Sheet 1: Assumptions
Sheet 2: User Growth Model
Sheet 3: Revenue Breakdown
Sheet 4: Cost Structure
Sheet 5: P&L (3 scenarios)
Sheet 6: Cash Flow
Sheet 7: Valuation Bridge
```

## Sheet 1 — Assumptions

| Tham số | Conservative | Base | Optimistic |
|---|---:|---:|---:|
| Monthly user growth | 8% | 15% | 25% |
| Free -> Pro conversion | 3% | 6% | 10% |
| Pro -> Elite conversion | 15% | 25% | 35% |
| ARPU Pro | 99k | 99k | 99k |
| ARPU Elite | 299k | 299k | 299k |
| Marketplace GMV / user / tháng | 50k | 150k | 400k |
| Platform take rate | 15% | 20% | 20% |
| Affiliate revenue / user / tháng | 20k | 60k | 150k |
| Churn monthly | 8% | 5% | 3% |

## Sheet 2 — User Growth Model

- Tháng 1-3: 500 -> 1.000 users
- Tháng 4-6: 1.000 -> 5.000 users
- Tháng 7-12: 5.000 -> 20.000 users
- Năm 2: 20.000 -> 80.000 users
- Năm 3: 80.000 -> 200.000 users
- Năm 4-5: 200.000 -> 500.000 users

## Sheet 3 — Revenue Breakdown

| Nguồn | Công thức tính |
|---|---|
| Subscription | Users × conversion rate × ARPU |
| Marketplace | GMV × take rate |
| Affiliate | Active affiliates × commission volume |
| Course sales | Courses sold × avg price × 20% platform |
| Job board fee | Jobs posted × listing fee |
| AI tools premium | Elite users × AI tier fee |
| Events/workshops | Events × avg ticket × 20% |

## Sheet 4 — Cost Structure

Ước tính Phase 1:

- Tech infra: 3-5tr
- AI API: 5-15tr
- Payment fees: 2-3% GMV
- Team 3-4 người: 30-60tr
- Legal + accounting: 3-5tr
- Marketing: 10-20tr

Tổng ước tính: 55-110tr/tháng

## Sheet 5 — P&L

Phải có 3 scenario:
- conservative
- base
- optimistic

Phải tách:
- revenue gross
- take rate revenue
- net revenue
- operating cost
- EBITDA proxy

## Sheet 6 — Cash Flow

Phải theo dõi:
- inflow
- payout obligations
- tax hold
- runway
- burn multiple

## Sheet 7 — Valuation Bridge

Gợi ý:
- năm 1-2: revenue multiple
- năm 3+: DCF + comparables

Luận điểm moat:
- VC trust layer độc lập
- proof-gated economy
- journey liền mạch

## KPI tài chính bắt buộc

- LTV
- CAC
- LTV:CAC
- MRR
- Net Revenue Retention
- time to break-even per user

## Ghi chú investor-facing

- không dùng dự báo như promise chắc chắn
- phải tách aspirational target và base-operating target
- phải gắn KPI tăng trưởng với trust và earning thực, không chỉ vanity signups
