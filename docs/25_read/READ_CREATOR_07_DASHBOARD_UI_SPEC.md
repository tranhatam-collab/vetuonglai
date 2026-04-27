# READ_CREATOR_07 — Dashboard UI Spec

## Scope

Dashboard nay la private/member-authenticated, khong phai public surface.

## V1 modules

- profile status
- role status
- submission status
- payout eligibility
- order summary
- settlement summary
- tax/KYC checklist

## UI guardrail

- khong hien payout promise khi transaction chua settle
- khong hien tax ket luan tuyet doi khi legal rule chua duoc xac nhan
- khong hien phi provider nhu mot gia tri co dinh neu provider policy co the thay doi

## Visibility levels

- public: khong co dashboard data
- member_preview: owner-only financial detail
- live: creator sees only own scoped data
