# READ_CREATOR_05 — Payment, Checkout, and Settlement Spec

## Payment promise

Khong duoc ghi provider fee nhu mot cam ket vinh vien.

Public wording dung:

- phi thanh toan duoc hien thi theo chinh sach nha cung cap tai thoi diem giao dich

## Phase map

Phase 1:

- owner-published ebook
- checkout
- order record
- basic ledger

Phase 2:

- author monetization
- reviewer payout

Phase 3:

- weekly settlement
- payout report

## Minimum runtime components

- checkout endpoint
- webhook handler
- order persistence
- refund handler
- settlement worker
- payout report generator

## Verify

- 1 real checkout
- 1 refund test
- 1 settlement cycle test
- fee line items match actual provider output
