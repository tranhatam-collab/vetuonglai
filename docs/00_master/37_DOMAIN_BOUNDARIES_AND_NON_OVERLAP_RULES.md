# 37_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES

## Mục đích của file

File này khóa ranh giới domain để team không:

- chồng chéo vai trò
- build trùng lớp
- đẩy một domain sang làm việc của domain khác
- nói quá current state

---

## 1. Nguyên tắc chung

Mỗi domain phải trả lời 4 câu:

1. domain này giải quyết gì
2. domain này không giải quyết gì
3. khi user đi tiếp thì chuyển sang đâu
4. domain này đang ở trạng thái runtime nào

Nếu không trả lời được 4 câu, chưa được build sâu.

---

## 2. Boundary table

| Domain | Giải quyết gì | Không giải quyết gì | Chuyển tiếp chính | Runtime note |
| --- | --- | --- | --- | --- |
| `vetuonglai.com` | hub, ecosystem map, routing, Future Access Pass | không đi quá sâu vào chuyên môn từng layer | member, edu, vc, các domain core | live |
| `member.vetuonglai.com` | identity, dashboard, access, next step | không phải nơi chứa toàn bộ content | edu, vc, life, finance, invest, green | planned/staged |
| `vc.vetuonglai.com` | trust, verify, registry, disclosure | không bán hàng, không marketplace, không hứa kết quả | root, edu, green, work sau này | live |
| `edu.vetuonglai.com` | learning, output, submission, proof pathway | không chỉ là LMS video | vc, member dashboard | beta |
| `life.vetuonglai.com` | rhythm, baseline, discipline, review | không self-help, không chữa lành | member, root | member preview |
| `finance.vetuonglai.com` | money basics, anti-scam, discipline | không wealth-content, không kiếm tiền nhanh | root, invest khi phù hợp | live |
| `invest.vetuonglai.com` | calm investing, due diligence, risk-first | không tín hiệu kèo, không deal room | root, vc, member | member preview |
| `green.vetuonglai.com` | green proof, impact dossier, packet | không greenwashing, không chỉ slogan ESG | vc, member | live |
| `work.vetuonglai.com` | proof-based work, jobs, freelance | không social feed, không mở trước trust core | vc, member, edu | planned |
| `market.vetuonglai.com` | digital assets, template, toolkit | không mở trước khi creator proof rõ | vc, member, edu | planned |
| `ai.vetuonglai.com` | AI tutor, AI helpers, AI-assisted workflows | không chatbot hype | edu, member, work sau này | planned |
| `community.vetuonglai.com` | circle, cohort, peer practice | không social feed ồn ào | stories, live, member | planned |
| `stories.vetuonglai.com` | case thật, hành trình thật, social proof | không testimonial marketing rẻ | root, community, vc | planned |
| `blog.vetuonglai.com` | SEO/public content mở | không chứa member-only deep system | root, edu, finance, life, invest | planned |
| `tools.vetuonglai.com` | free utilities | không gánh learning/proof/dashboard | root, member | planned |
| `affiliate.vetuonglai.com` | referral layer có điều kiện | không phải engine spam traffic | member, partner, pack/compliance | planned |
| `admin.vetuonglai.com` | internal operations | không public | không có | internal |

---

## 3. Rule không chồng chéo

### 3.1 Root không nuốt domain con

Root chỉ:

- giải thích
- định tuyến
- mở gateway

Root không được thay EDU làm learning layer, hoặc thay VC làm trust layer.

### 3.2 Member không thành content warehouse

Member chỉ:

- identity
- access
- dashboard
- next step

Không gom toàn bộ content sâu của mọi domain vào member.

### 3.3 VC không thành sales layer

VC chỉ:

- verify
- disclosure
- registry

Không dùng VC như landing bán hàng.

### 3.4 Finance và Invest không lẫn nhau

- Finance = tiền cơ bản, anti-scam, discipline
- Invest = risk-first, due diligence, no-FOMO

Không để Finance thành kênh đầu tư.
Không để Invest thành wealth marketing.

---

## 4. Rule chuyển tiếp

Mỗi domain phải có next step rõ.

Ví dụ:

- học xong ở EDU -> sang submission/review -> VC
- user chưa ổn nhịp -> ở LIFE trước, không đẩy sang economy
- user chưa rõ tiền cơ bản -> ở FINANCE trước, không đẩy thẳng sang INVEST

---

## 5. Team sync

### Team 1

- giữ route contract phản ánh đúng boundary

### Team 2

- không build section trùng vai giữa các domain

### Team 3

- chặn copy làm domain drift vai trò

---

## 6. Definition of done

Domain boundaries chỉ được xem là đạt khi:

1. mỗi domain có role rõ
2. không có section public trùng vai lớn
3. next step routing rõ
4. planned domains chưa bị build như live
