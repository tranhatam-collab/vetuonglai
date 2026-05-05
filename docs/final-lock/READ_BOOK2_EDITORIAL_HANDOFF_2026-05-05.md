# READ Book 2 — Editorial Handoff Plan
**File:** `docs/final-lock/READ_BOOK2_EDITORIAL_HANDOFF_2026-05-05.md`
**Status:** ACTIVE — runtime plumbing đã xong, chỉ chờ manuscript thật
**Owner (editorial):** Founder Trần Hà Tâm + team biên tập đang làm việc
**Owner (runtime):** Team 1 (đã rời khỏi Book 2, sang việc khác)
**Book:** `tan-cung-mot-cuoc-song` — "Tận Cùng Một Cuộc Sống"
**Lock model:** VTL_71 — 10/20/70 layered publish
**License lane:** `owner_only_dual_publish` (cùng tác giả với tranhatam.com)

---

## 1. Trạng thái hiện tại (snapshot 2026-05-05)

### Đã xong (Team 1 — runtime)
- `protected/read-books/manifest.json` — đăng ký book served + `valid_sections`
- `protected/read-books/tan-cung-mot-cuoc-song/content.json` — schema đầy đủ, body **placeholder**
- `workers/lib/access-runtime.mjs`:
  - capability `book_purchased`, KV `book_entitlements`
  - 4 endpoints: `/api/access/books/entitlements`, `/check`, `/grant` (admin), `/content`
  - Webhook auto-grant trên `pack.order.captured` / `annual.subscription.activated`; auto-revoke trên `pack.order.refunded`
- `scripts/smoke-access-runtime.mjs` — `testBookContentEndpoint` (12 assertions) PASS
- `scripts/verify-read-book-publish-gate.mjs` — VTL_71 enforcement (15 checks PASS)
- Public 10% page + Demo 20% page đã live tại:
  - https://read.vetuonglai.com/books/tan-cung-mot-cuoc-song/
  - https://read.vetuonglai.com/books/tan-cung-mot-cuoc-song/demo/
- Commit chain: `cffec44` → `05c6c65 (Step 3)` → editorial Chapter 4 fix

### Đang chờ team biên tập
- 9 chapter bodies (`body_vi` + `body_en`) — hiện đang prefix `[PROTECTED PLACEHOLDER]`
- 9 `closing_silence_vi/en` — cần review giọng văn (hiện đang hợp lệ nhưng minimal)
- `experience_plan.vi/en` — bản thật của 30-day re-reading plan
- `ai_study_guide.vi/en` — bản thật của 3-prompt rule
- `final_distillation.vi/en` — có thể giữ "không có chưng cất" nếu Founder confirm
- `final_white_page.vi/en` — hiện rỗng `""` (đúng chủ ý? confirm)
- `practice_map[].prompts_vi/en` — đã có 1 prompt mỗi chương; có thể mở rộng tới 3 nếu Founder muốn

---

## 2. Editorial North Star (LOCKED — không sửa)

**VI:** *"Cuốn sách đọc một lần. Mỗi chương đóng lại mà không dạy. Người đọc rời đi mà không bị sửa."*

**EN:** *"A book read once. Each chapter closes without teaching. The reader leaves without being corrected."*

Mọi câu trong manuscript phải vượt qua test:
1. **Không dạy** — không có "bạn nên", "hãy làm", "cách để…"
2. **Không sửa** — không phán xét quá khứ, không phân loại đúng/sai
3. **Đóng lại** — chương phải kết bằng silence/không kết luận
4. **Đọc một lần** — không recap, không call-back, không khuyến nghị tái đọc trong body

Chương 4 đã được sửa theo nguyên tắc này (commit `05c6c65`):
- ❌ "dạy cách nhìn lại" → ✅ "nhìn lại một đời đã qua mà không kết án nó"

---

## 3. Cấu trúc file `content.json` — KHÔNG SỬA SCHEMA

```jsonc
{
  "book_slug": "tan-cung-mot-cuoc-song",     // LOCKED
  "version": "2026-05-03_placeholder_v1",    // bump khi manuscript thật
  "license": "owner_only_dual_publish",      // LOCKED
  "license_note": "...",                     // LOCKED
  "editorial_north_star_vi": "...",          // LOCKED
  "editorial_north_star_en": "...",          // LOCKED
  "_placeholder_notice": "...",              // XOÁ khi launch revenue
  "chapters": [
    { "n": 1, "slug": "...", "title_vi": "...", "title_en": "...",
      "body_vi": "...", "body_en": "...",
      "closing_silence_vi": "...", "closing_silence_en": "..." },
    // ... 9 chương
  ],
  "practice_map":      [ { "chapter": N, "title_vi": "...", "prompts_vi": [...], ... } ],
  "experience_plan":   { "vi": "...", "en": "..." },
  "ai_study_guide":    { "vi": "...", "en": "..." },
  "final_distillation":{ "vi": "...", "en": "..." },
  "final_white_page":  { "vi": "", "en": "" }
}
```

**Quy tắc khi sửa:**
- Field nào cũng có cặp `_vi` / `_en` — không bao giờ chỉ có 1 ngôn ngữ
- `chapter.n` LOCKED 1..9 — không đổi thứ tự
- `chapter.slug` LOCKED (đã hardcoded vào URL public)
- `chapter.title_vi` / `title_en` LOCKED bởi Founder ngày 2026-05-01 — KHÔNG sửa
- Khi xoá tiền tố `[PROTECTED PLACEHOLDER]` trong body, phải bump `version`
- KHÔNG thêm field mới mà không báo Team 1

---

## 4. Workflow biên tập

### Branch & commit
- Làm trên branch `editorial/book-2-tan-cung-cuoc-song`
- Commit prefix: `editorial(book-2):`
- 1 commit = 1 chapter (dễ review/rollback)
- Khi xong toàn bộ 9 chương + 4 sections, mở PR vào `main`, tag `@team-1` review runtime + verifier

### Trước mỗi commit BẮT BUỘC chạy
```bash
node -e "JSON.parse(require('fs').readFileSync('protected/read-books/tan-cung-mot-cuoc-song/content.json','utf8'))"  # JSON valid
npm run verify:read:book-publish-gate
npm run audit:bilingual
```

Cả 3 phải PASS. `audit:bilingual` đặc biệt quan trọng — bắt thiếu cặp VI/EN.

### Trước khi merge PR
```bash
npm run build
npm run check
npm run smoke:access-runtime
npm run verify:read:phase0
npm run verify:read:book-publish-gate
npm run verify:total-system:release-gate
```

`publish_ready=true` + `blockers=[]` mới được merge.

---

## 5. Hard rules — vi phạm = block PR

### Bảo mật content
- ❌ KHÔNG copy nguyên văn từ tranhatam.com — author owns dual-publish nhưng VTL phiên bản phải khác (Book 2 trên VTL = 10/20/70, trên tranhatam = 5/10/85)
- ❌ KHÔNG để bất kỳ chuỗi >40 ký tự của manuscript xuất hiện trong `dist/read.vetuonglai.com/` (verifier check 17 sẽ chạy sau khi build — fail thì block)
- ❌ KHÔNG commit `protected/read-books/` vào `dist/` (verifier check 18)
- ❌ KHÔNG để PDF/EPUB/DOCX của manuscript trong repo

### Editorial integrity
- ❌ KHÔNG thêm "kết luận chương", "bài học rút ra", "hành động đề xuất"
- ❌ KHÔNG thêm câu hỏi suy ngẫm trong `body_*` — câu hỏi chỉ thuộc `practice_map.prompts_*`
- ❌ KHÔNG dùng từ "nên/phải/cần phải" trong body chính
- ❌ KHÔNG đề cập tên sản phẩm/khoá học khác của VTL trong body

### Surface
- ❌ KHÔNG sửa `src/static-pages/read.vetuonglai.com/books/tan-cung-mot-cuoc-song/` — đó là trang public 10%, do Team 2 quản
- ❌ KHÔNG sửa `src/data/read-books.json` — đó là registry, do Team 1 quản
- ✅ CHỈ sửa file: `protected/read-books/tan-cung-mot-cuoc-song/content.json`

---

## 6. Checklist khi nộp manuscript thật (revenue-ready handoff)

- [ ] 9 chương: `body_vi` + `body_en` không còn prefix `[PROTECTED PLACEHOLDER]`
- [ ] Mỗi chương qua test "không dạy / không sửa / đóng lại / đọc một lần"
- [ ] Mỗi `closing_silence_vi/en` ≤ 2 câu, không phải kết luận
- [ ] `experience_plan` viết xong, vẫn là plan trải nghiệm — KHÔNG phải action plan
- [ ] `ai_study_guide` giữ rule 3-prompt (lặp lại / im lặng / không tóm tắt) hoặc Founder confirm thay đổi
- [ ] `final_distillation` — Founder confirm giữ "không có chưng cất" hay viết bản thật
- [ ] `final_white_page.vi/en` — Founder confirm để rỗng `""`
- [ ] `version` bump thành `2026-MM-DD_revenue_v1`
- [ ] Xoá field `_placeholder_notice`
- [ ] Tất cả check ở mục 4 PASS
- [ ] PR có evidence: link 4 reports JSON mới nhất

---

## 7. Liên hệ runtime — khi cần Team 1

**Khi nào cần ping Team 1:**
- Muốn thêm/đổi field schema trong `content.json`
- Muốn thêm section mới ngoài 5 valid sections (`chapters`, `practice`, `experience`, `ai-guide`, `final`)
- Verifier hoặc smoke test fail mà không phải lỗi nội dung
- Muốn endpoint `/api/access/books/content` trả format khác

**Không cần ping Team 1:**
- Sửa text trong các field hiện có
- Thêm prompt vào `practice_map[].prompts_*`
- Bump version, xoá `_placeholder_notice`

**File ownership — CỨNG:**
| File | Owner | Editorial sửa được? |
|------|-------|---------------------|
| `protected/read-books/tan-cung-mot-cuoc-song/content.json` | Editorial | ✅ |
| `protected/read-books/manifest.json` | Team 1 | ❌ |
| `protected/read-books/README.md` | Team 1 | ❌ |
| `src/data/read-books.json` | Team 1 | ❌ |
| `src/static-pages/read.vetuonglai.com/books/...` | Team 2 | ❌ |
| `workers/lib/access-runtime.mjs` | Team 1 | ❌ |
| `scripts/verify-read-book-publish-gate.mjs` | Team 5 | ❌ |
| `scripts/smoke-access-runtime.mjs` | Team 5 | ❌ |

---

## 8. Step 4-5 — Team 1 sẽ làm song song (không block editorial)

Team 1 đã pivot sang:
- **Step 4:** xây trang reader xác thực `/books/tan-cung-mot-cuoc-song/read/` (gọi `/api/access/books/check` → render body từ `/api/access/books/content`)
- **Step 5:** wire `intent=book` + `book_slug` vào checkout-resolve để PayOS metadata mang `book_slug`

Hai step này KHÔNG cần manuscript thật — chỉ render whatever `body_vi/en` đang có. Khi editorial nộp manuscript, reader page sẽ tự động hiển thị bản mới mà không cần Team 1 đụng tay.

---

## 9. Auto-dev-loop note

Repo hiện có `auto-dev-loop` chạy launchd 9 phút/tick. Loop này có thể tự commit khi tick xanh; nó **không động vào** `protected/read-books/` (đã được loại trừ qua dev-sequence-lock). Editorial team an tâm làm việc.

---

## 10. Lịch sử & version

| Date | Event | Commit |
|------|-------|--------|
| 2026-05-03 | VTL_71 lock công bố | `5abe38c` |
| 2026-05-03 | book_purchased capability + 3 endpoints | `cffec44` |
| 2026-05-04 | Step 3 protected plumbing + placeholder content | `05c6c65` |
| 2026-05-04 | Editorial Chapter 4 fix ("không dạy") | `05c6c65` |
| 2026-05-05 | Doc handoff này (file hiện tại) | (this commit) |

---

**Câu hỏi gửi Founder trước khi editorial team viết manuscript thật:**

1. `final_distillation` — giữ "không có chưng cất" hay viết bản thật?
2. `final_white_page.vi/en` — để rỗng `""` (chủ ý) hay viết một câu kết?
3. `practice_map.prompts_*` — giữ 1 prompt/chapter hay mở rộng tới 3?
4. `closing_silence_*` — đã đúng giọng văn chưa, hay cần biên tập lại toàn bộ?

Cần Founder trả lời 4 câu trên thì manuscript thật mới có thể bắt đầu nộp.
