# VETUONGLAI DESIGN SYSTEM MASTER

Version: 1.0
Last updated: 2026-04-07

## 0. Triết lý thiết kế (đọc trước khi code)

Hệ Về Tương Lai không dùng:

- màu tối nặng nề
- cảm giác corporate lạnh
- UI phức tạp
- màu công nghệ cũ

Hệ dùng `Future Calm Design`:

- sáng
- nhẹ
- sâu
- có ánh sáng
- có hy vọng
- có sự sống

Cảm xúc cần truyền:

- bình an
- rõ ràng
- đáng tin
- có chiều sâu
- có tương lai

## 1. Color system - hệ màu gốc

### 1.1 Core palette

```css
--bg-main: #F7FBFA;
--bg-soft: #ECF6F4;
--bg-glass: rgba(255, 255, 255, 0.6);

--gradient-main: linear-gradient(
  135deg,
  #4ADE80,
  #22D3EE,
  #818CF8
);

--green-light: #4ADE80;
--blue-light: #22D3EE;
--violet-light: #818CF8;
--gold-light: #FACC15;

--text-main: #0F172A;
--text-soft: #475569;
--border-light: #E2E8F0;
```

## 2. Subdomain color identity

Mỗi subdomain có màu riêng nhưng vẫn cùng hệ:

- `life.vetuonglai.com`
  - primary: `#4ADE80`
  - gradient: green -> mint
  - feeling: healing, calm, breathing
- `edu.vetuonglai.com`
  - primary: `#22D3EE`
  - gradient: blue -> violet
  - feeling: clarity, intelligence, learning
- `finance.vetuonglai.com`
  - primary: `#FACC15`
  - gradient: gold -> soft orange
  - feeling: grounded, stable, practical
- `invest.vetuonglai.com`
  - primary: `#818CF8`
  - gradient: violet -> blue
  - feeling: strategic, long-term, intelligent
- `green.vetuonglai.com`
  - primary: `#34D399`
  - gradient: green -> earth
  - feeling: nature, sustainability
- `vc.vetuonglai.com`
  - primary: `#6366F1`
  - gradient: indigo -> blue
  - feeling: trust, verification, proof
- `community.vetuonglai.com`
  - primary: `#FB7185`
  - gradient: pink -> violet
  - feeling: connection, human warmth

## 3. Typography system

### 3.1 Font chuẩn

- primary: `Inter` / `SF Pro Display`
- fallback: `system-ui`
- mono: `JetBrains Mono` / `Menlo`

### 3.2 Style chuẩn

- heading:
  - weight: `600-700`
  - spacing: `-0.5px`
  - feeling: mềm, hiện đại
- body:
  - weight: `400-500`
  - line-height: `1.6-1.8`
  - dễ đọc

## 4. UI component system

### 4.1 Button

Primary:

```css
background: var(--gradient-main);
border-radius: 16px;
padding: 12px 20px;
color: white;
```

Secondary:

```css
background: rgba(255, 255, 255, 0.6);
border: 1px solid #E2E8F0;
```

### 4.2 Card

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
border-radius: 20px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
```

### 4.3 Glass effect

```css
background: rgba(255, 255, 255, 0.4);
backdrop-filter: blur(30px);
```

## 5. Icon system

Style:

- outline + soft fill
- bo tròn
- stroke nhẹ

Nguyên tắc:

- không dùng icon nặng
- không dùng icon quá chi tiết
- giữ tinh thần future calm

## 6. Logo system

Logo gốc:

- biểu tượng vòng tròn mở
- ánh sáng lan tỏa
- hoặc mầm đang phát triển

Logo subdomain:

- giữ logo gốc
- đổi màu theo domain

## 7. Image & AI visual guidelines

Prompt chuẩn cho AI image:

```text
Soft futuristic, calm, human-centered,
natural light, minimal, hopeful,
clean composition, subtle gradient lighting,
Vietnamese modern lifestyle, peaceful,
no cyberpunk, no dark dystopia
```

Không được:

- neon gắt
- cyberpunk
- quá công nghệ lạnh
- quá thương mại

Phải có:

- ánh sáng tự nhiên
- màu dịu
- có con người
- có cảm xúc

## 8. UX principles

- simple first
  - không quá nhiều menu
  - không overload
- always next step
  - luôn có bước tiếp theo rõ
- mobile first
  - ưu tiên trải nghiệm di động
- calm UX
  - không popup spam
  - không giật attention

## 9. Motion design

Style:

- nhẹ
- mượt
- chậm

Không dùng:

- animation mạnh
- hiệu ứng gây phân tâm

## 10. Brand consistency rule

Mọi subdomain:

- cùng font
- cùng spacing
- cùng component
- chỉ khác màu nhận diện

## 11. Dark mode (optional)

```css
background: #020617;
text: #E2E8F0;
```

## 12. Design token file (cho dev)

```json
{
  "colors": {
    "primary": "#22D3EE",
    "secondary": "#4ADE80",
    "accent": "#818CF8"
  },
  "radius": {
    "card": "20px",
    "button": "16px"
  }
}
```

## 13. Final rule (quan trọng nhất)

UI phải khiến người dùng cảm thấy:

- tôi có thể bắt đầu lại
- tôi thấy nhẹ hơn
- tôi tin được hệ này

## Kết luận

Nếu design đúng, hệ sẽ có linh hồn.
