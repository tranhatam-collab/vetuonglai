# 14_data_flow_journey

Trạng thái: V2 chốt nội bộ  
Ngày: 2026-04-08  
Dành cho: DEV · DATA · PRODUCT

## A. Journey engine — logic cá nhân hóa

```text
Input:  User stage + VC badges + activity history + goals
Process: Scoring engine -> next best action
Output:  Dashboard widget "Bước tiếp theo của bạn"
```

Ví dụ output:
- Bạn đã hoàn thành 2/3 module, hãy submit project để nhận Learner Badge
- Bạn đã có Learner Badge, hãy mở dịch vụ đầu tiên
- Có 3 job phù hợp trong 24h qua

## B. Cross-domain data flow

```text
edu. [học xong module] -> api. -> vc. [update tiến trình]
vc. [cấp badge] -> api. -> member. [update profile] + work. [unlock]
work. [job completed] -> api. -> vc. [thêm evidence] + wallet [release tiền]
market. [bán được] -> api. -> wallet [cộng tiền] + analytics
```

## C. Proof-event driven architecture

```text
VC badge issued    -> unlock features + notify user + update journey
Course completed   -> auto-claim VC check + update market eligibility
Job completed      -> escrow release + add evidence to VC + rating prompt
First earning      -> trigger celebration UI + suggest next income stream
```

VC không chỉ là badge. Nó là event bus trung tâm của toàn hệ thống.

## D. Analytics cần track

- activation
- engagement
- monetization
- retention
- NPS

## E. Privacy-first data principles

- không share data cá nhân giữa users
- analytics aggregate
- user có thể export data của mình
- retention rule: 5 năm sau khi tài khoản inactive nếu policy giữ nguyên

## F. Definition of done cho data flow

Chỉ được coi là xong khi:
- event chính có source rõ
- destination rõ
- unlock logic rõ
- journey card đọc được next step đúng lúc
