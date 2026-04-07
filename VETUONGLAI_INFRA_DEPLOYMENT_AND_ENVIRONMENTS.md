# VETUONGLAI INFRA DEPLOYMENT AND ENVIRONMENTS

Version: 1.0
Last updated: 2026-04-07

## Mục đích

File này dành cho infra / devops để khóa model deploy, environment, secrets, build, cache, rollback và mapping domain.

## Repo structure

Target dài hạn có thể là monorepo `vetuonglai-platform`, nhưng trong giai đoạn hiện tại cần phân biệt rõ:

- repo hiện tại đang chứa multi-site static system
- target repo architecture có thể mở rộng dần về app + packages + services + infra

## Domain mapping

Cần có bảng mapping per domain:

- source path
- build output
- Pages project
- Worker script nếu có
- custom domain status
- public status

## Environment mapping

Cần tối thiểu:

- local
- preview
- production

Nếu thêm staging thì phải có mục đích rõ ràng.

## GitHub + Cloudflare deploy model

Target model:

- merge vào `main`
- GitHub Actions build và check
- sync Cloudflare config nếu cần
- deploy Pages
- deploy Workers nếu domain đang Worker-fronted
- smoke test production

## Branch strategy

- feature branches
- PR review
- merge vào `main`
- release tags nếu cần

## Secrets strategy

- không commit secrets
- dùng GitHub secrets và Cloudflare secrets / bindings đúng cách
- token production chỉ dùng trong environment phù hợp

## Worker naming rules

Tên Worker nên:

- rõ domain / vai trò
- ổn định
- không đổi tên tùy tiện sau khi đã route production

## Build rules

- build phải reproducible
- lockfile bắt buộc
- check artifact bắt buộc
- domain status không được fake trong build output

## Cache rules

- static assets cache dài hơn
- HTML và JSON cần cache theo mức độ cập nhật phù hợp
- verify routes cần ưu tiên tính đúng hơn là cache quá mạnh

## Rollback rules

Phải có khả năng quay về deployment trước nếu:

- route hỏng
- domain không load
- verify flow lỗi
- payment webhook lỗi nghiêm trọng

## Backup rules

Cần có backup / export strategy cho:

- content
- course metadata
- credentials / proof records
- uploaded media metadata
