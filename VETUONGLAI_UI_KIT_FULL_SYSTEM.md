# VETUONGLAI UI KIT FULL SYSTEM

Version: 1.0
Last updated: 2026-04-07

## 0. Nguyên tắc tối thượng

UI của Về Tương Lai phải tạo cảm giác:

- nhẹ
- sáng
- có hy vọng
- không bị áp lực
- không startup hustle
- không AI lạnh lẽo

Đây là `Future Human UI`, không phải `tech UI`.

## 1. Design token master (dùng cho dev)

### 1.1 Color tokens

```json
{
  "background": {
    "primary": "#F7FBFA",
    "secondary": "#ECF6F4",
    "glass": "rgba(255,255,255,0.6)"
  },
  "text": {
    "primary": "#0F172A",
    "secondary": "#475569"
  },
  "accent": {
    "green": "#4ADE80",
    "blue": "#22D3EE",
    "violet": "#818CF8",
    "gold": "#FACC15"
  }
}
```

### 1.2 Spacing

```json
{
  "xs": "4px",
  "sm": "8px",
  "md": "16px",
  "lg": "24px",
  "xl": "40px"
}
```

### 1.3 Radius

```json
{
  "button": "16px",
  "card": "20px",
  "modal": "24px"
}
```

## 2. Layout system

### 2.1 Grid

- max-width: `1200px`
- desktop padding: `24px`
- mobile padding: `16px`

### 2.2 Section structure

Mỗi section phải có:

1. title
2. description
3. action

## 3. Component system

### 3.1 Navbar

Structure:

`LOGO | MENU | CTA`

Style:

```css
height: 64px;
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.6);
```

### 3.2 Hero section

Structure:

- Headline
- Subtext
- CTA
- Visual

Style:

- headline lớn, mềm
- spacing rộng
- background gradient nhẹ

### 3.3 Button

Primary:

```css
background: linear-gradient(135deg, #4ADE80, #22D3EE);
color: white;
border-radius: 16px;
padding: 12px 20px;
```

Secondary:

```css
border: 1px solid #E2E8F0;
background: white;
```

### 3.4 Card

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
border-radius: 20px;
padding: 20px;
```

### 3.5 Input

```css
border-radius: 12px;
border: 1px solid #E2E8F0;
padding: 10px;
```

## 4. Page template - root

### 4.1 Landing structure

Hero -> Problem -> Vision -> Ecosystem -> Journey -> CTA

### 4.2 Hero copy

Headline:

`Một tương lai tốt hơn bắt đầu từ hôm nay`

Sub:

`Không phải học để thi - mà học để sống`

## 5. EDU UI (AI Tutor)

### 5.1 Chat layout

`[Message AI] [User input] [Suggested actions]`

### 5.2 AI message

```css
background: #ECF6F4;
border-radius: 16px;
padding: 12px;
```

### 5.3 User message

```css
background: #22D3EE;
color: white;
```

### 5.4 Quick actions

- `Tạo project`
- `Học tiếp`
- `Hỏi AI`

## 6. Course UI

### 6.1 Course card

Title -> Description -> Level -> CTA

### 6.2 Lesson view

- video / pdf
- AI panel bên phải (desktop), dưới nội dung (mobile)

## 7. Dashboard UI

### 7.1 User dashboard

- Progress
- Courses
- Projects
- Certificates
- Next step

## 8. VC verify UI

### 8.1 Structure

- Certificate ID
- Hash
- Status
- Verify button

### 8.2 Style

- minimal
- clean
- trust-first

## 9. Motion system

Rules:

- duration: `200-400ms`
- easing: `ease-out`
- subtle only

## 10. Icon set

Style:

- line icons
- rounded
- minimal

## 11. Image system

Phải có:

- con người thật
- ánh sáng tự nhiên
- không stock giả

Không dùng:

- cyberpunk
- neon
- dark dystopia

## 12. Dark mode

```css
background: #020617;
text: #E2E8F0;
```

## 13. Responsive

Mobile:

- 1 column
- button full width
- text lớn hơn một nấc so với web đọc nhanh

## 14. Final design rule

Mỗi màn hình phải trả lời được:

- user đang ở đâu?
- bước tiếp theo là gì?

## Kết luận

Đây là `UI KIT = nền tảng`, không phải trang web đơn lẻ, mà là cảm xúc vận hành của cả hệ.

## Runtime token files (cho FE dùng trực tiếp)

- JSON source of truth: `src/shared/design-tokens.json`
- CSS runtime variables: `src/shared/design-tokens.css`

Quy ước apply theo domain:

- gắn `data-domain` vào thẻ `html`, ví dụ:

```html
<html data-domain="edu">
```

Các giá trị domain-specific sẽ tự override qua:

- `--vt-domain-primary`
- `--vt-domain-gradient`
- `--vt-domain-surface-tint`
