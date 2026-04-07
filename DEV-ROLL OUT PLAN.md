## Kế Hoạch Roll-Out Dev Vetuonglai

Last verified: 2026-04-06

### Phạm vi

Tài liệu này tóm tắt trạng thái live đã được xác minh của `*.vetuonglai.com`, kiến trúc source/deploy hiện tại trong repo, khoảng trống giữa source và production, và kế hoạch thực thi cho team dev.

### Hiện trạng đã xác minh

#### Git và repo local

- Branch hiện tại: `main`
- Worktree local: sạch
- Local clone này chưa có `git remote`
- Commit gần đây cho thấy hướng rollout hiện tại:
  - `24cfafb` `feat: ship bilingual vetuonglai system v1`
  - `2cf1f23` `Add worker-based live deploy pipeline for routed domains`
  - `2c13616` `Prevent VC verify redirect loops on Pages`
  - `c098823` `Fix VC verify route with Pages worker rewrite`
  - `8006a69` `Build unified Vetuonglai system with Cloudflare deploy pipeline`

#### Kiến trúc source trong repo này

- Một codebase tĩnh multi-site build ra toàn bộ các target sau:
  - `vetuonglai.com`
  - `vc.vetuonglai.com`
  - `edu.vetuonglai.com`
  - `green.vetuonglai.com`
  - `finance.vetuonglai.com`
  - `life.vetuonglai.com`
  - `invest.vetuonglai.com`
- Build output được sinh vào `dist/<domain>/`
- Mapping Pages project nằm trong `cloudflare/pages-projects.json`
- Mapping Worker route nằm trong `cloudflare/workers-projects.json`
- Workflow production nằm trong `.github/workflows/deploy-pages.yml`

#### Xác minh Cloudflare account

Đã xác minh bằng Wrangler với account `f3f9e76222dcb488d5e303e29e8ba192`.

##### Pages projects tồn tại

- `vetuonglai-landing`
- `vetuonglai-vc`
- `vetuonglai-edu`
- `vetuonglai-green`
- `vetuonglai-finance`
- `vetuonglai-life`
- `vetuonglai-invest`

Cả 7 Pages projects đều có production deployments, gồm cả deployment từ commit `2cf1f23`.

##### Trạng thái custom domain trên Pages

- `vetuonglai-landing`
  - `vetuonglai.com`: `active`
  - `www.vetuonglai.com`: `deactivated`
- `vetuonglai-vc`
  - `vc.vetuonglai.com`: `active`
- `vetuonglai-edu`
  - `edu.vetuonglai.com`: `deactivated`
- `vetuonglai-green`
  - `green.vetuonglai.com`: `deactivated`
- `vetuonglai-finance`
  - `finance.vetuonglai.com`: `active`
- `vetuonglai-life`
  - `life.vetuonglai.com`: `deactivated`
- `vetuonglai-invest`
  - `invest.vetuonglai.com`: `deactivated`

##### Worker routes thực tế đang có trên zone

- `vetuonglai.com/*` -> `vetuonglai-home`
- `www.vetuonglai.com/*` -> `vetuonglai-home`
- `edu.vetuonglai.com/*` -> `vetuonglai-edu-github`
- `www.edu.vetuonglai.com/*` -> `vetuonglai-edu-github`
- `green.vetuonglai.com/*` -> `vetuonglai-green`
- `www.green.vetuonglai.com/*` -> `vetuonglai-green`
- `finance.vetuonglai.com/*` -> `vetuonglai-finance`
- `www.finance.vetuonglai.com/*` -> `vetuonglai-finance`

Những domain không có trong Worker routes:

- `vc.vetuonglai.com`
- `life.vetuonglai.com`
- `invest.vetuonglai.com`

#### Hành vi public live đã được xác minh từ mạng

##### Resolve và trả nội dung

- `https://vetuonglai.com`
- `https://vc.vetuonglai.com`
- `https://green.vetuonglai.com`
- `https://finance.vetuonglai.com`

##### Không resolve công khai từ môi trường hiện tại

- `edu.vetuonglai.com`: không có public DNS answer
- `life.vetuonglai.com`: `NXDOMAIN`
- `invest.vetuonglai.com`: `NXDOMAIN`

##### Pages preview domains đang live

- `https://vetuonglai-edu.pages.dev`
- `https://vetuonglai-life.pages.dev`
- `https://vetuonglai-invest.pages.dev`
- `https://vetuonglai-green.pages.dev`
- `https://vetuonglai-finance.pages.dev`

Điều này xác nhận rằng bản thân site đã được build và deploy, và vấn đề chính của `edu`, `life`, `invest` là kích hoạt public domain và routing, không phải thiếu app content.

#### Xác minh live endpoint

Đang hoạt động trên public/custom domains:

- `https://vetuonglai.com/manifest.json`
- `https://vetuonglai.com/apps.json`
- `https://vc.vetuonglai.com/api/certificates.json`
- `https://nft.iai.one/api/asset-registrations`

Đang hoạt động trên Pages preview domain:

- `https://vetuonglai-edu.pages.dev`

#### Xác minh CI/CD

Workflow GitHub Actions hiện tại trong repo đang chạy:

- `npm run build`
- `npm run check`
- `npm run cloudflare:sync`
- `npm run cloudflare:deploy`

Workflow hiện chưa chạy:

- `npm run cloudflare:deploy:workers`

Đây là khoảng trống nghiêm trọng vì một số public domain vẫn đang được front bằng Worker routes, nên chỉ deploy Pages chưa chắc đã cập nhật được lớp đang thực sự phục vụ traffic.

### Kết luận chính

#### 1. Source đang đi trước public DNS

`edu`, `life` và `invest` đã được build và deploy production trên Pages preview URL, nhưng custom domain của chúng chưa active cho traffic công khai.

#### 2. Hub đang thể hiện mức sẵn sàng public cao hơn thực tế

`vetuonglai.com` đang link người dùng trực tiếp tới `edu`, `life`, `invest`, nhưng ít nhất từ môi trường hiện tại các domain đó chưa phải cái nào cũng public truy cập được.

#### 3. Kiến trúc routing đang là hybrid

Hệ thống hiện tại là sự kết hợp giữa:

- Cloudflare Pages deployments
- Cloudflare Worker-fronted traffic

Mô hình hybrid này chấp nhận được, nhưng bắt buộc phải có ownership vận hành rõ và CI coverage tương ứng.

#### 4. Pages và Workers chưa được căn chỉnh hoàn toàn

- `green` đang live công khai nhưng custom domain trên Pages lại là `deactivated`
- `edu` có Worker route nhưng public domain vẫn chưa resolve
- `life` và `invest` có Pages projects và production deployments nhưng không có active custom domain và không có Worker routes
- `vc` đang live công khai nhưng không xuất hiện trong Worker routes của zone, khả năng cao đang đi trực tiếp qua Pages/domain mapping thay vì Worker-fronted traffic

#### 5. Chưa thể xác minh governance phía GitHub từ máy này

`gh` chưa được cài, và repo local này chưa có `git remote`, nên chưa thể xác minh trực tiếp branch protection, PR flow và deployment history từ phía Git provider.

### Mục tiêu roll-out

#### Objective A

Làm cho thực tế public khớp với trạng thái hệ thống được công bố trên hub.

#### Objective B

Làm cho deploy automation cập nhật đúng lớp đang phục vụ traffic, không chỉ cập nhật Pages artifact.

#### Objective C

Làm cho ownership domain, routing, DNS và release status trở nên quan sát được với team.

### Kế hoạch ưu tiên

## P0: Sửa lỗi public access và trust gap

Target: 24-48 giờ

### P0.1 Khôi phục `edu.vetuonglai.com`

Việc cần làm:

- kiểm tra DNS record của `edu.vetuonglai.com` trên Cloudflare
- kiểm tra domain này đang được proxy đúng và attach đúng Pages project hoặc route tới Worker đúng
- xác nhận route target đúng với kiến trúc hiện tại
- xác nhận `https://edu.vetuonglai.com/api/health` trả `200`
- xác nhận `https://edu.vetuonglai.com/courses/` trả `200`

Definition of done:

- `edu.vetuonglai.com` resolve công khai
- home của `edu` load được trên custom domain
- `/api/health` hoạt động trên custom domain

### P0.2 Chốt chiến lược public cho `life` và `invest`

Mỗi domain cần chọn 1 trong 2 đường:

- Path 1: mở ngay
  - tạo hoặc sửa DNS records
  - activate Pages custom domains
  - verify HTTPS và status code
- Path 2: giữ lại có chủ đích
  - gỡ direct production links khỏi hub
  - thay bằng `coming soon` hoặc `preview only`

Definition of done:

- không còn broken production links từ hub
- business status khớp với public accessibility

### P0.3 Chốt live serving model cho từng domain

Mỗi domain phải quyết định 1 source of truth:

- Pages direct
- Worker-fronted Pages assets

Không được để team ở trong trạng thái mixed mà không có tài liệu hóa.

Definition of done:

- mỗi domain có đúng 1 live serving model được ghi nhận rõ

## P0: Sửa lệch CI/CD

Target: cùng sprint

### P0.4 Cập nhật workflow production

Workflow hiện tại chỉ deploy Pages. Cần thêm bước deploy Worker khi production đang dựa vào Workers.

Production sequence đề xuất:

1. `npm run build`
2. `npm run check`
3. `npm run cloudflare:sync`
4. `npm run cloudflare:deploy`
5. `npm run cloudflare:deploy:workers`
6. post-deploy smoke tests

Definition of done:

- push vào `main` cập nhật đúng lớp đang phục vụ traffic công khai
- Pages và Workers không còn drift sau deploy

## P1: Căn chỉnh vận hành

Target: sprint 1

### P1.1 Tạo domain operations matrix

Track cho từng domain:

- business status: `live`, `beta`, `planned`
- source path
- dist path
- Pages project
- Pages custom domain status
- Worker script
- Worker route status
- DNS status
- public HTTPS status
- owner

Definition of done:

- bất kỳ ai trong team cũng trả lời được một domain đang source-ready, deploy-ready hay public-ready

### P1.2 Chuẩn hóa hub registry behavior

`src/data/apps.json` cần phản ánh đúng trạng thái public thật.

Quy tắc:

- chỉ expose direct public links cho các domain thật sự public truy cập được
- nếu site mới preview-ready nhưng chưa public, phải đánh dấu rõ và tránh outbound link gãy
- stage labels phải phản ánh deployment truth, không chỉ phản ánh source completion

### P1.3 Làm rõ vai trò của các biến thể `www`

Bằng chứng hiện tại:

- `www.vetuonglai.com` đang `deactivated` trên Pages
- Worker routes vẫn bao gồm `www.vetuonglai.com/*`

Team cần quyết định `www` là:

- fully supported
- redirect về apex
- intentionally dropped

## P1: Release governance

Target: sprint 1

### P1.4 Khôi phục khả năng quan sát repo

Việc cần làm:

- cấu hình đúng `git remote` trong local/dev environments
- cài và dùng `gh` trên máy dev nơi cần inspect GitHub review/deploy
- ghi lại repo URL và deployment ownership trong `README.md` hoặc ops doc

### P1.5 Chuẩn hóa release flow

Baseline đề xuất:

- branch từ `main`
- mở PR
- yêu cầu review trước khi merge
- chỉ merge khi build và deploy checks pass
- tag release theo `v1.0.x`

Definition of done:

- team có thể map một live deployment ngược về reviewed commit/tag

## P2: Tăng độ chắc của test và monitoring

Target: sprint 2

### P2.1 Thêm post-deploy smoke tests

Smoke tests tối thiểu:

- `https://vetuonglai.com/`
- `https://vetuonglai.com/manifest.json`
- `https://vetuonglai.com/apps.json`
- `https://vc.vetuonglai.com/`
- `https://vc.vetuonglai.com/api/certificates.json`
- `https://vc.vetuonglai.com/v/VC-2026-0001`
- `https://edu.vetuonglai.com/`
- `https://edu.vetuonglai.com/api/health`
- `https://green.vetuonglai.com/`
- `https://finance.vetuonglai.com/`
- `https://life.vetuonglai.com/`
- `https://invest.vetuonglai.com/`

Failures phải block rollout hoặc ít nhất mở incident item.

### P2.2 Mở rộng static checks bằng deployment truth

`npm run check` hiện tại mới chỉ validate dist artifacts. Cần thêm một production verification script tùy chọn để kiểm tra:

- DNS resolution
- HTTPS response code
- content marker mong đợi theo domain
- critical JSON endpoints

### P2.3 Theo dõi drift giữa Pages và Workers

Thêm script hoặc dashboard report để trả lời:

- mỗi configured Pages project có tồn tại không
- mỗi custom domain có active không
- mỗi configured Worker route có tồn tại không
- có Worker script hoặc route nào mồ côi mà không còn trong repo config không

### Đề xuất ownership theo nhóm

#### DevOps / Infra

- Cloudflare DNS
- Pages custom domains
- Worker routes
- CI/CD production workflow
- smoke tests

#### Frontend / Site Platform

- trạng thái hub và CTA behavior
- tính nhất quán ngôn ngữ và metadata
- phòng tránh broken link trên production pages

#### Product / Content Platform

- `apps.json`
- `courses.json`
- `certificates.json`
- `system.json`
- tính nhất quán của status labeling

#### Tech Lead / PM

- quyết định go-live cho từng domain
- phê duyệt release checklist
- duy trì ownership matrix

### Trạng thái khuyến nghị theo từng domain

#### `vetuonglai.com`

- Public status: live
- Serving model: Worker-fronted
- Action: giữ live, đồng thời xác minh `www` có nên tiếp tục support hay không

#### `vc.vetuonglai.com`

- Public status: live
- Serving model: nhiều khả năng đi thẳng qua Pages, không Worker-routed ở cấp zone
- Action: phải tài liệu hóa rõ và verify hành vi `/v/*` trên public host sau mỗi lần deploy

#### `edu.vetuonglai.com`

- Public status: broken/inactive custom domain
- Source/deploy status: production build đã có, Pages deployment đã có
- Action: recovery ưu tiên cao nhất

#### `green.vetuonglai.com`

- Public status: live
- Serving model: Worker-fronted
- Pages custom domain status: deactivated
- Action: quyết định dứt điểm là giữ Worker-only hay kích hoạt lại alignment với Pages custom domain

#### `finance.vetuonglai.com`

- Public status: live
- Serving model: Worker-fronted
- Pages custom domain status: active
- Action: dùng làm reference pattern cho rollout đồng bộ

#### `life.vetuonglai.com`

- Public status: chưa public
- Source/deploy status: production build đã có, Pages preview đang live
- Action: hoặc activate public domain, hoặc gỡ direct production CTA cho đến ngày launch

#### `invest.vetuonglai.com`

- Public status: chưa public
- Source/deploy status: production build đã có, Pages preview đang live
- Action: hoặc activate public domain, hoặc gỡ direct production CTA cho đến ngày launch

### Immediate action checklist

Thực hiện theo đúng thứ tự:

1. Khôi phục `edu.vetuonglai.com`
2. Quyết định launch hay holdback cho `life` và `invest`
3. Cập nhật CI workflow để deploy Workers sau Pages khi cần
4. Thêm post-deploy smoke tests cho public hosts
5. Căn lại hub links theo đúng public availability thực tế
6. Tài liệu hóa 1 serving model cho mỗi domain
7. Khôi phục GitHub observability trên máy dev bằng cách cấu hình `git remote` và cài `gh`

### Cập nhật thực thi P0 (2026-04-07)

Đã thực hiện:

- Cập nhật workflow CI/CD để deploy cả Workers sau khi deploy Pages.
- Thêm bước verify runtime domains sau deploy qua script `cloudflare:verify:runtime`.
- Tạo source of truth cho serving model và trạng thái domain tại `cloudflare/domain-runtime-truth.json`.

Các thay đổi đã áp dụng:

- `.github/workflows/deploy-pages.yml`
- `package.json`
- `scripts/verify-runtime.mjs`
- `cloudflare/domain-runtime-truth.json`

Trạng thái `edu.vetuonglai.com` tại thời điểm cập nhật này:

- Pages project `vetuonglai-edu` có production deployments.
- Domain công khai `edu.vetuonglai.com` hiện vẫn không resolve từ mạng kiểm tra.
- Cần xử lý ở lớp DNS / domain activation trong Cloudflare dashboard hoặc API đầy đủ quyền zone chỉnh sửa.

### Success criteria

Rollout được coi là hoàn tất khi:

- mọi domain được hub công bố là public đều resolve công khai
- mọi production deployment cập nhật đúng lớp đang phục vụ traffic thật
- Pages, Workers, DNS và business status đồng thuận cho từng domain
- team có một operational matrix và một release checklist
- không còn production links nào dẫn tới domain unresolved hoặc deactivated
