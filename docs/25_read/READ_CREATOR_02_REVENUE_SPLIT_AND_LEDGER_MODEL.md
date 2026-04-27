# READ_CREATOR_02 — Revenue Split and Ledger Model

## Muc tieu

Mo ta split model theo huong mem, khong khoa cung vao public khi chua co Terms versioned va legal review.

## Fee model

Platform operating fee:

- muc tieu khong qua 15%
- phai cong bo truoc moi giao dich
- co versioning theo policy date

Creator share:

- muc tieu 70-85%
- tuy role, loai san pham, va split config

Provider fee:

- luon lay theo phi thuc te tai thoi diem giao dich
- neu dang 0, hien thi 0 o transaction do

## Ledger model

Internal ledger fields:

- order_id
- product_id
- split_version
- gross_amount
- provider_fee_amount
- platform_fee_amount
- tax_withheld_amount
- creator_net_amount
- payout_batch_id
- settlement_status

Public ledger fields:

- ledger_entry_id
- quarter
- content_type
- role_group
- gross_bucket
- platform_fee_bucket
- creator_pool_bucket
- tax_bucket
- anonymized_hash

## Public restrictions

Khong hien:

- ten ca nhan
- bank info
- CCCD
- MST
- exact personal amount neu suy luan duoc danh tinh

## Consistency rule

Moi ledger public phai truy vet duoc vao internal ledger, nhung khong cho phep public reverse ra danh tinh that.
