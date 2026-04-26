# GATEWAY SYSTEM — FILE 17
**Lifetime Unlock 2 USD · "Biết Về Tương Lai Của Bạn" · Đồng bộ V2.1**

## 17_demo_kit_all_subdomains.md
**Tên:** Spec & Nội dung Demo cho từng subdomain

### 17.1 Nguyên tắc demo

```
Demo tốt phải:
  ✅ Cho thấy giá trị THẬT trong < 60 giây
  ✅ Tạo cảm giác "tôi cần cái này"
  ✅ Không spoil toàn bộ — chỉ đủ để muốn thêm
  ✅ Không cần login để xem demo
  ✅ Hoạt động tốt trên mobile

Demo xấu:
  ❌ Screenshot mờ
  ❌ Mô tả tính năng thay vì show
  ❌ Yêu cầu login trước khi xem
  ❌ Quá dài (> 90s)
```

### 17.2 Demo spec từng subdomain

**`edu.` — Demo khóa học:**
```
Format: Video 60s (screen recording + voiceover)
Nội dung:
  • 10s: Bài học mở đầu — hook câu hỏi thực tế
  • 20s: AI Tutor trả lời 1 câu hỏi của học viên
  • 20s: Output submission — học viên nộp bài
  • 10s: VC badge được cấp sau hoàn thành

Interactive thêm:
  • Cho thử AI Tutor: 3 câu hỏi miễn phí
  • Hiển thị: "Học viên [tên thật] nhận badge sau 7 ngày"
```

**`vc.` — Demo badge verify:**
```
Format: Interactive widget (không cần video)
Nội dung:
  • Input field: "Nhập mã badge để verify"
  • Demo badge ID có sẵn: VTL-2026-CR-0042
  • Click verify → hiển thị:
      Tên: Nguyễn Văn A
      Badge: Creator Verified
      Ngày cấp: 15/03/2026
      Evidence: 5 bài blog, 2.300 lượt đọc
      NFT: [link nft.iai.one]
  → "Badge này là thật. Của bạn cũng có thể vậy."
```

**`work.` — Demo job board:**
```
Format: Interactive mockup (3 job cards thật)
Nội dung:
  Job 1: Content Writer Remote
    → Budget: 5–8tr/tháng
    → VC Required: Learner Verified
    → Apply button → blur + CTA unlock

  Job 2: UI Designer Freelance
    → Budget: 3–5tr/project
    → VC Required: Creator Verified
    → 12 người đã apply

  Job 3: AI Automation Specialist
    → Budget: $500–800/tháng
    → VC Required: Builder Verified
    → "Mở toàn bộ để apply ngay"
```

**`market.` — Demo sản phẩm:**
```
Format: Product card preview
Nội dung:
  • Hiển thị 3 sản phẩm bestseller
  • Mỗi sản phẩm: tên, preview ảnh, giá, rating
  • Click vào → xem trang sản phẩm đầy đủ
  • Nút "Mua ngay" → blur + CTA unlock

Demo đặc biệt:
  • Hiển thị tổng: "Tháng này creators kiếm được Xtr"
  • Rolling number animation (realtime nếu có)
```

**`ai.` — Demo AI Tools:**
```
Format: Live demo (thực sự gọi API)
Nội dung:
  AI Writer demo:
    Input: "Tôi là [input skill], muốn tạo content về [topic]"
    Output: Outline 3 bài viết cụ thể
    → "Mở full để tạo bài hoàn chỉnh"

  AI Niche Finder demo:
    Input: "Tôi giỏi [skill], có [X giờ/tuần]"
    Output: 3 niche phù hợp + estimated income
    → "Mở full để xem kế hoạch chi tiết"

Giới hạn demo: 3 queries/ngày per IP
```

**`community.` — Demo circle:**
```
Format: Read-only thread preview
Nội dung:
  • Hiển thị 1 thread nổi bật (không spoil toàn bộ)
  • 3 comment đầu hiện, còn lại blur
  • Profile người tham gia: ảnh + VC badge
  → "Tham gia thảo luận này — mở hệ"
```

**`blog.` — Demo / Free anchor:**
```
Format: Bài viết hoàn chỉnh (1–2 bài free)
Nội dung:
  • 1 bài guide dài 1.500+ từ hoàn toàn free
  • Cuối bài: "Đây chỉ là bề mặt.
                Toàn bộ hệ thống chờ bạn bên trong."
  • CTA nội tuyến trong bài tại điểm giá trị cao nhất
```

**`life.` + `finance.` + `green.` + `invest.` — Demo content:**
```
Format: 1 bài hoàn chỉnh free + quiz interactive
Nội dung quiz:
  "Sức khỏe tài chính của bạn đang ở đâu?"
  → 5 câu hỏi đơn giản
  → Kết quả: "Bạn đang ở giai đoạn X..."
  → "Xem lộ trình cụ thể — mở hệ"
```
