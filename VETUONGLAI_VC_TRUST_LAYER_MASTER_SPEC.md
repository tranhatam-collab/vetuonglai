# VETUONGLAI VC TRUST LAYER MASTER SPEC

Version: 1.0
Last updated: 2026-04-07

## `vc.vetuonglai.com` là gì

VC là lớp xác minh độc lập của toàn bộ hệ thống Về Tương Lai.

Nó không chỉ là trang chứng chỉ khóa học.

Nó là trust layer để xác minh năng lực, tiến trình, dự án, đóng góp và tác động.

## VC dùng để xác minh những gì

- năng lực
- tiến trình
- dự án
- đóng góp
- tác động xã hội
- course completion
- skill
- contribution

## Các loại credential

- learning credential
- skill credential
- project credential
- contribution credential
- impact credential
- asset-linked proof nếu cần

## Các trạng thái credential

- planned
- reviewing
- verified
- revoked
- superseded

## Public verify page

VC phải có:

- search / lookup
- route `/v/:code`
- minimal record display
- trust notes

## Minimal disclosure policy

VC chỉ hiển thị đủ bằng chứng cần thiết để xác minh, không công bố thừa dữ liệu riêng tư.

## Hash / proof strategy

Mỗi record quan trọng cần có:

- code
- hash
- issuer
- domain nguồn
- issued_at
- anchors

## Revocation / supersede strategy

Cần có cơ chế:

- revoke nếu proof không còn hợp lệ
- supersede nếu có phiên bản mới / proof mới

## Trust design principles

- tối thiểu dữ liệu
- tối đa niềm tin
- role verifier tách với role issuer
- verify được mà không phơi bày quá mức cần thiết

## Kết nối với các domain khác

- EDU -> completion, skill, project proof
- Community -> contribution proof
- Green -> impact proof
- Mission -> skill and contribution proof
- Stories / foundation -> impact-linked proof nếu cần
