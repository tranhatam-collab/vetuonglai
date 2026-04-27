# 20_DOMAIN_BOUNDARIES_AND_NON_OVERLAP_RULES.md

## Mục đích
File này khóa rõ:
- mỗi subdomain làm gì
- không làm gì
- khi nào chuyển user sang domain khác
- tránh chồng chéo
- tránh mỗi team tự hiểu hệ theo một kiểu

## Nguyên tắc tổng
1. Mỗi domain giải quyết một lớp vấn đề chính.
2. Không domain nào được ôm toàn bộ hệ.
3. Root hub định tuyến, không thay thế domain chuyên môn.
4. Member là identity/access layer, không thay content domains.
5. VC là trust layer, không thay learning/work/life domains.
6. Khi user cần sang layer khác, phải có handoff rõ.

## Root — `vetuonglai.com`
### Giải quyết
- giải thích hệ
- ecosystem map
- entry points
- routing
- Future Access Pass framing
- top-level journey framing

### Không giải quyết
- không dạy sâu như EDU
- không verify như VC
- không thay money layer
- không làm job board

## Member — `member.vetuonglai.com`
### Giải quyết
- identity
- login
- dashboard
- access
- next-step summary

### Không giải quyết
- không phải nơi chứa toàn bộ deep content
- không thay EDU, VC, community

## VC — `vc.vetuonglai.com`
### Giải quyết
- verify
- registry
- disclosure
- proof / badge state

### Không giải quyết
- không dạy
- không tuyển dụng
- không bán khóa học

## EDU — `edu.vetuonglai.com`
### Giải quyết
- learning
- AI tutor
- project-based outputs
- submission
- micro-credential pathways

### Không giải quyết
- không làm marketplace
- không làm job board
- không thay VC
- không thay community

## LIFE — `life.vetuonglai.com`
### Giải quyết
- rhythm
- recovery
- baseline
- discipline

### Không giải quyết
- không làm mental health treatment
- không thay education layer
- không làm investment advice

## FINANCE — `finance.vetuonglai.com`
### Giải quyết
- money basics
- anti-scam
- buffer mindset
- cash-flow discipline

### Không giải quyết
- không hứa tăng thu nhập
- không dạy trading
- không làm investing platform

## INVEST — `invest.vetuonglai.com`
### Giải quyết
- due diligence
- risk-first investing
- allocation logic
- no-FOMO rules

### Không giải quyết
- không phải trading room
- không phải signal service
- không phải broker

## GREEN — `green.vetuonglai.com`
### Giải quyết
- green evidence
- impact packet
- proof of contribution

### Không giải quyết
- không làm ESG marketing
- không thay VC

## WORK — `work.vetuonglai.com`
### Giải quyết
- jobs
- projects
- proof-based apply

### Không giải quyết
- không dạy kỹ năng nền
- không thay market
- không thay VC registry

## MARKET — `market.vetuonglai.com`
### Giải quyết
- digital assets
- creator storefronts

### Không giải quyết
- không thay EDU
- không thay WORK
- không thay MEMBER

## AI — `ai.vetuonglai.com`
### Giải quyết
- AI tools thực tế
- AI tutor extensions
- AI-assisted work

### Không giải quyết
- không là chatbot chung chung
- không thay education layer

## COMMUNITY — `community.vetuonglai.com`
### Giải quyết
- circles
- cohorts
- peer support

### Không giải quyết
- không thay stories
- không thay learning system
- không là social network đại trà

## STORIES — `stories.vetuonglai.com`
### Giải quyết
- case thật
- người thật
- social proof

### Không giải quyết
- không thay community
- không làm testimonial marketing
- không thay VC verify

## BLOG — `blog.vetuonglai.com`
### Giải quyết
- SEO
- public articles
- entry content

### Không giải quyết
- không chứa full member depth
- không thay root hub
- không thay EDU

## TOOLS — `tools.vetuonglai.com`
### Giải quyết
- lightweight utilities
- free helper tools

### Không giải quyết
- không là dashboard
- không là learning system
- không là marketplace

## AFFILIATE — `affiliate.vetuonglai.com`
### Giải quyết
- referral tracking
- partner-level commission visibility

### Không giải quyết
- không là growth spam machine
- không là MLM layer

## ADMIN — `admin.vetuonglai.com`
### Giải quyết
- operations
- moderation
- content / proof / member review
- runtime truth

### Không giải quyết
- không public
- không index

## Overlap rules bắt buộc
1. Nếu một domain chỉ đang link sang domain khác để giải bài toán chính, nó đang ôm sai role.
2. Nếu cùng một nội dung chuyên sâu xuất hiện ở nhiều domain, phải xác định một source domain duy nhất.
3. Nếu user có thể thực hiện cùng một action ở 2 domain khác nhau, phải giữ lại 1 nơi làm source action.
4. Nếu một domain đang nói quá nhiều về pricing / packs mà không thuộc root/member/gateway flow, phải giảm lại.

## Handoff rules
- Root chỉ dẫn, không giải thay.
- Domain → VC khi có proof claim / badge / verify need.
- Domain → Member khi cần dashboard / access state / next step.
- EDU → WORK / MARKET chỉ sau khi proof đủ.
- LIFE → EDU / FINANCE khi user đã ổn định hơn.
- FINANCE → INVEST chỉ sau khi user có nền money basics.
- GREEN → VC khi có evidence packet.

## Kết luận
Một hệ nhiều subdomain chỉ mạnh khi mỗi domain đúng vai, không ôm tham, và handoff mượt.
