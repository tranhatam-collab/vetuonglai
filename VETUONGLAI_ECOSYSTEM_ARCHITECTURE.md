# VETUONGLAI ECOSYSTEM ARCHITECTURE

Version: 1.0
Last updated: 2026-04-07

## Sơ đồ domain tổng thể

### Root hub

- `vetuonglai.com`

### Core domains

- `life.vetuonglai.com`
- `edu.vetuonglai.com`
- `finance.vetuonglai.com`
- `invest.vetuonglai.com`
- `green.vetuonglai.com`
- `vc.vetuonglai.com`

### Expansion domains

- `community.vetuonglai.com`
- `mission.vetuonglai.com`
- `family.vetuonglai.com`
- `healing.vetuonglai.com`
- `stories.vetuonglai.com`
- `foundation.vetuonglai.com`
- `labs.vetuonglai.com`

## Vai trò root hub

`vetuonglai.com` là trung tâm ý nghĩa, điều hướng, trust và onboarding cho toàn hệ.

Nó không phải chỉ là trang link danh sách subdomain.

## Vai trò từng subdomain

- `life`: đời sống, sức khỏe, nhịp sống, bình an, kỷ luật sống
- `edu`: giáo dục công nghệ, học bằng trải nghiệm thật, học lý thuyết cùng AI
- `finance`: tài chính căn bản, an toàn tiền bạc, kỷ luật tài chính
- `invest`: đầu tư tỉnh táo, due diligence, ethics, không FOMO
- `green`: sống bền vững, hành động xanh, impact có bằng chứng
- `vc`: xác minh độc lập, credentials, proof, trust layer
- `community`: đồng hành, circles, cohort, support
- `mission`: nghề nghiệp có ý nghĩa, sứ mệnh, dự án giá trị
- `family`: hôn nhân, gia đình, nuôi dạy con, quan hệ lành mạnh
- `healing`: hồi phục cảm xúc, cân bằng, support pathways
- `stories`: câu chuyện thật, testimony, impact stories
- `foundation`: service, giving, impact funding, social projects
- `labs`: nghiên cứu, pilot, mô hình thử nghiệm cho tương lai

## Cách root hub liên kết tới các app

Root hub phải có 3 kiểu liên kết:

- liên kết theo nhu cầu con người
- liên kết theo trụ cột sống
- liên kết theo hành trình tiến bộ

Ví dụ:

- user mất ổn định -> `life`
- user mơ hồ tiền bạc -> `finance`
- user cần học năng lực -> `edu`
- user muốn verify -> `vc`
- user cần cộng đồng -> `community`

## Cơ chế liên kết chéo giữa các domain

Không domain nào được sống tách biệt.

Liên kết chéo bắt buộc:

- `life` -> `healing`, `community`, `edu`
- `finance` -> `invest`, `edu`
- `edu` -> `vc`, `community`, `mission`
- `green` -> `vc`, `community`, `foundation`, `stories`
- `mission` -> `edu`, `vc`, `community`

## Trust layer qua VC

`vc.vetuonglai.com` là trust backbone của toàn hệ.

Mỗi domain có thể phát sinh proof packet, nhưng VC là nơi xác minh độc lập.

## Mô hình mở rộng về sau

Hệ thống được mở rộng theo nguyên tắc thêm `một trụ cột sống -> một domain rõ vai trò`, không tạo domain vì lý do marketing ngắn hạn.

## Nguyên tắc không trùng lặp chức năng

- root hub không thay thế domain chuyên môn
- EDU không thay thế VC
- VC không thay thế content / course domain
- Finance không thay thế Invest
- Healing không thay thế y tế trị liệu chuyên môn
