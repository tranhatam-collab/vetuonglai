# READ_09 — Editorial and Quality Gate

## Vì sao cần
Mở public marketplace mà không có gate = mất uy tín brand `vetuonglai` trong vài tuần. Đây là rule khóa cứng để bảo vệ chất lượng.

## Auto-check (chạy ngay khi submit)

| Check | Pass nếu | Reject lý do |
|---|---|---|
| Min length | 800 từ (essay) / 15.000 từ (book) | "Quá ngắn cho format này" |
| Max length | 5000 từ (essay) / 80.000 từ (book) | "Quá dài, chia nhiều phần" |
| Vietnamese diacritic | >95% từ tiếng Việt có dấu đầy đủ | "Mất dấu, chạy lại với bộ gõ" |
| Banned words | Không chứa từ trong `content/language-codex.md` banned list | "Wording vi phạm codex" |
| Plagiarism | <15% similarity với corpus public | "Trùng nội dung công khai" |
| AI detector | <40% AI-likelihood (GPTZero / Originality.ai) | "Có dấu hiệu AI-generated" |
| Bilingual pair | Nếu có `data-en`, phải có `data-vi` đầy đủ | "Thiếu cặp song ngữ" |
| Image alt text | Mọi `<img>` có alt | "Thiếu alt text" |

## Peer review (Tier 1 + Tier 2)

### Quy trình
```
Submit → Auto-check pass
       → Random assign 1 reviewer từ pool (theo pillar)
       → Reviewer có 72h để review
       → Pass / Request changes / Reject
       → Editor signoff (Curator hoặc Trusted Author)
       → Publish + payable
```

### Reviewer được trả
- 30k VNĐ — essay <2000 từ
- 50k VNĐ — essay 2000–4000 từ
- 100k VNĐ — book chapter
- Trả từ bonus pool, không trừ author
- Max 5 review/tuần để tránh rush

### Reviewer rubric

```
[ ] Có lập trường rõ, không mơ hồ
[ ] Argument có dữ liệu hoặc precedent, không cảm tính suông
[ ] Không hype, không FOMO, không clickbait
[ ] Vietnamese rõ, không sao chép kiểu dịch máy
[ ] Có giá trị reread (không phải news cycle)
[ ] Không trùng đáng kể với essay đã có trên hệ
```

5/6 trở lên → pass.

## Editor signoff (Tier 3 trở lên)

Trusted Author và Curator có quyền signoff cuối:
- Trusted Author tự signoff cho essay của mình (nhưng vẫn cần peer review)
- Trusted Author signoff cho essay người khác cùng pillar (paid 50k)
- Curator signoff cho cả pillar mình quản lý
- Lead Editor (founder hoặc người được uỷ quyền) override khi cần

## Anti-AI-content rules (HARD)

| Tình huống | Xử lý |
|---|---|
| AI detector flag >40% | Block publish, request rewrite |
| AI detector flag >80% | Auto-reject, warn contributor |
| Cùng contributor flag 2 lần | Demote 1 tier |
| Cùng contributor flag 3 lần | Ban + refund all + công khai |

**Ngoại lệ:** Contributor có thể dùng AI cho:
- Brainstorm structure (không phải viết)
- Grammar check
- Translation draft (nhưng phải human-edit và VC tag `ai_assisted`)

## Plagiarism rules

| Tình huống | Xử lý |
|---|---|
| <15% similarity (citation OK) | Pass |
| 15–40% (cần proper citation) | Request changes |
| >40% similarity với public source | Reject |
| Cố tình copy without citation | Ban, refund all, công khai |

## Refund quality control

| Refund rate trên contributor | Action |
|---|---|
| <10% lifetime | Bình thường |
| 10–20% | Email warning |
| 20–30% | Demote 1 tier, peer review lại các essay |
| >30% | Freeze monetization, manual review |

## Publication queue dashboard

**File:** `read.vetuonglai.com/admin/queue/` (admin-only, member.vetuonglai.com auth)

```
┌────────────────────────────────────────────────────────────┐
│  Pending peer review                                       │
│  ────────────────────                                      │
│  [3] essay > 24h chờ review (alert!)                       │
│  [12] essay đang review                                    │
│                                                            │
│  Pending editor signoff                                    │
│  ──────────────────────                                    │
│  [5] essay đã pass peer review, chờ editor                 │
│                                                            │
│  Violations this week                                      │
│  ────────────────────                                      │
│  AI content: 1 (banned)                                    │
│  Plagiarism: 0                                             │
│  Refund rate spike: 1 (under review)                       │
└────────────────────────────────────────────────────────────┘
```
