# TRUST.IAI.ONE — Master Specification

> **Version:** 1.0.0  
> **Ngày tạo:** 2026-04-28  
> **Trạng thái:** Production-Ready Specification  
> **Tác giả:** Trần Hà Tâm / iai.one team

---

## I. System Identity

### Tên sản phẩm

**trust.iai.one**

### Định vị (Positioning)

> Hạ tầng xác minh cho dữ liệu, danh tính, chứng chỉ và tài sản số.  
> *A verification infrastructure for data, identity, credentials and digital assets.*

**KHÔNG** gọi là: NFT platform, blockchain platform, web3 app, crypto tool.  
**GỌI là:** verification infrastructure, trust layer, proof system.

### Tagline

- Chính: **"Xác minh mọi thứ. Tin tưởng mọi nơi."**
- Phụ (EN): *"Verify anything. Trust everywhere."*

### Brand Rules

| Quy tắc | Giá trị |
|---|---|
| Domain chính | `trust.iai.one` |
| Domain proof legacy | `proof.tranhatam.com` → redirect về `trust.iai.one/proof` |
| Domain VC legacy | `vc.vetuonglai.com` → redirect về `trust.iai.one/credential` |
| Domain asset legacy | `nft.iai.one` → redirect về `trust.iai.one/asset` |
| Ngôn ngữ giao diện | Tiếng Việt mặc định, English toggle |
| Tone | Chuyên nghiệp, rõ ràng, không hype |
| Không dùng từ | "blockchain", "NFT", "crypto", "web3" trên giao diện người dùng |
| Thay bằng | "bằng chứng số", "chứng chỉ xác minh", "tài sản số có chủ sở hữu" |

### Hệ thống hợp nhất

```
proof.tranhatam.com  ──┐
                       ├──▶  trust.iai.one
vc.vetuonglai.com    ──┤
                       │
nft.iai.one          ──┘
```

---

## II. Homepage Structure (App-first)

Homepage KHÔNG phải landing page marketing. Homepage là **app entry point**.

### Hero Section

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   trust.iai.one                                 │
│   Xác minh mọi thứ. Tin tưởng mọi nơi.        │
│                                                 │
│   [Tạo Bằng Chứng]  [Cấp Chứng Chỉ]  [Xác Minh] │
│                                                 │
│   Dán link hoặc mã xác minh để kiểm tra ngay:  │
│   ┌──────────────────────────────┐ [Xác minh]   │
│   └──────────────────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```

- **Tạo Bằng Chứng** → `/proof/create` (không cần login cho free tier)
- **Cấp Chứng Chỉ** → `/credential/issue` (cần login)
- **Xác Minh** → `/verify` (public, không cần login)
- Verify input: nhận URL `trust.iai.one/v/{id}` hoặc mã `TRU-XXXX-XXXX`

### 3 Core Blocks

```
┌──────────────────┬──────────────────┬──────────────────┐
│   📄 PROOF       │   🎓 CREDENTIAL  │   🔐 ASSET       │
│                  │                  │                  │
│ Chứng minh dữ   │ Cấp chứng chỉ   │ Gắn quyền sở    │
│ liệu tồn tại    │ xác minh được    │ hữu cho tài sản  │
│ tại thời điểm X  │ cho cá nhân/tổ  │ số               │
│                  │ chức             │                  │
│ • Hash SHA-256   │ • W3C VC format  │ • Ownership log  │
│ • Timestamp      │ • Issuer signed  │ • Transfer hist  │
│ • Immutable log  │ • Revocable      │ • Verify chain   │
│                  │                  │                  │
│ [Tạo ngay]       │ [Bắt đầu]       │ [Tìm hiểu]      │
│ [Xem mẫu]        │ [Xem mẫu]       │ [Xem mẫu]       │
└──────────────────┴──────────────────┴──────────────────┘
```

### CTAs

| CTA | Hành động | Yêu cầu login |
|---|---|---|
| Tạo ngay (Proof) | Mở form upload file/text | Không (free tier) |
| Bắt đầu (Credential) | Mở form issue VC | Có |
| Tìm hiểu (Asset) | Mở trang giới thiệu Asset | Không |
| Xem mẫu | Mở verify page của sample item | Không |
| Mở Dashboard | `/dashboard` | Có |
| Xác minh | Nhập mã/link, hiện kết quả | Không |

### Footer Section

```
Về trust.iai.one | Bảng giá | API Docs | Điều khoản | Bảo mật | Liên hệ
Sản phẩm của iai.one — Hạ tầng xác minh dữ liệu Việt Nam
```

---

## III. User Flows

### Flow 1: Cá nhân — Upload → Proof → VC → Asset (optional) → Verify Link

Đây là **core flow**, phục vụ 80% use cases.

**Bước 1: Upload dữ liệu**
- User truy cập `trust.iai.one` → click "Tạo Bằng Chứng"
- Form hiển thị: Upload file (drag & drop, max 50MB) HOẶC nhập text
- Hệ thống KHÔNG lưu file gốc. Chỉ tính hash SHA-256 phía client (browser)
- Hiển thị hash cho user xác nhận

**Bước 2: Tạo Proof**
- User click "Xác nhận tạo bằng chứng"
- Nếu chưa login → tạo proof dưới dạng anonymous (giới hạn 3 proof/tháng)
- Nếu đã login → gắn proof vào account
- Hệ thống tạo record:
  ```json
  {
    "proof_id": "prf_a1b2c3d4e5",
    "hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "algorithm": "SHA-256",
    "timestamp": "2026-04-28T10:30:00.000Z",
    "creator": "user_xyz123",
    "status": "active",
    "verify_url": "https://trust.iai.one/v/prf_a1b2c3d4e5",
    "verify_code": "TRU-A1B2-C3D4"
  }
  ```
- Hiển thị: verify URL + verify code + QR code
- User có thể download certificate PDF

**Bước 3: Nâng cấp thành Credential (optional, cần Pro plan)**
- Từ proof detail page, user click "Cấp chứng chỉ từ bằng chứng này"
- Form bổ sung:
  - Tên chứng chỉ (vd: "Chứng nhận hoàn thành khóa học React")
  - Người nhận (tên + email)
  - Ngày hết hạn (optional)
  - Metadata tùy chỉnh (key-value pairs)
- Hệ thống tạo Verifiable Credential (W3C format):
  ```json
  {
    "vc_id": "vc_x1y2z3",
    "type": "VerifiableCredential",
    "issuer": {
      "id": "did:trust:user_xyz123",
      "name": "Công ty ABC"
    },
    "subject": {
      "name": "Nguyễn Văn A",
      "email": "a@example.com"
    },
    "credential_name": "Chứng nhận hoàn thành khóa học React",
    "proof_ref": "prf_a1b2c3d4e5",
    "issued_at": "2026-04-28T11:00:00.000Z",
    "expires_at": "2027-04-28T11:00:00.000Z",
    "status": "active",
    "verify_url": "https://trust.iai.one/v/vc_x1y2z3"
  }
  ```
- Email tự động gửi cho người nhận kèm verify link

**Bước 4: Gắn Asset (optional, cần Business plan)**
- Từ credential detail, click "Tạo tài sản số"
- Hệ thống tạo asset record gắn ownership:
  ```json
  {
    "asset_id": "ast_m1n2o3",
    "name": "Chứng nhận React — Nguyễn Văn A",
    "owner": "user_recipient_456",
    "vc_ref": "vc_x1y2z3",
    "proof_ref": "prf_a1b2c3d4e5",
    "created_at": "2026-04-28T11:05:00.000Z",
    "ownership_history": [
      {
        "owner": "user_xyz123",
        "action": "created",
        "at": "2026-04-28T11:05:00.000Z"
      },
      {
        "owner": "user_recipient_456",
        "action": "transferred",
        "at": "2026-04-28T11:05:01.000Z"
      }
    ]
  }
  ```

**Bước 5: Verify Link**
- Mọi object (proof, vc, asset) đều có verify URL dạng `trust.iai.one/v/{id}`
- Bất kỳ ai có link đều xác minh được, không cần login
- Hiển thị: trạng thái, thời gian tạo, issuer, ownership chain

### Flow 2: Enterprise — Login → Project → Batch VC → Registry → Export/API

**Bước 1: Login + Tạo Organization**
- Enterprise user login → tạo Organization profile
- Thêm team members (Admin, Issuer, Viewer roles)
- Upload logo, verify domain (DNS TXT record)

**Bước 2: Tạo Project**
- Mỗi project = 1 nhóm chứng chỉ (vd: "Khóa đào tạo Q1/2026")
- Cấu hình project:
  - Template chứng chỉ (tên, format, fields)
  - Thời hạn mặc định
  - Auto-email settings
  - Webhook URL cho integration

**Bước 3: Batch Issue VC**
- Upload CSV file chứa danh sách người nhận:
  ```csv
  name,email,course,score,date
  Nguyễn Văn A,a@email.com,React Advanced,95,2026-04-01
  Trần Thị B,b@email.com,React Advanced,88,2026-04-01
  Lê Văn C,c@email.com,React Advanced,92,2026-04-01
  ```
- Preview trước khi issue
- Click "Cấp hàng loạt" → hệ thống tạo VC cho từng dòng
- Progress bar real-time (WebSocket)
- Kết quả: danh sách VC với verify links

**Bước 4: Registry (quản lý tập trung)**
- Dashboard hiển thị tất cả VC đã cấp
- Filter: theo project, trạng thái, ngày, người nhận
- Actions: Revoke, Extend, Re-send email
- Bulk actions: Revoke nhiều VC cùng lúc

**Bước 5: Export + API**
- Export: CSV, JSON, PDF batch
- API integration:
  ```bash
  # Cấp VC qua API
  curl -X POST https://trust.iai.one/api/vc/issue \
    -H "Authorization: Bearer trst_sk_live_abc123" \
    -H "Content-Type: application/json" \
    -d '{
      "project_id": "prj_001",
      "subject_name": "Nguyễn Văn A",
      "subject_email": "a@email.com",
      "credential_name": "AWS Certified",
      "metadata": {"score": 95}
    }'
  ```
- Webhook: POST tới URL doanh nghiệp khi VC được verify

### Flow 3: Public Verify — Open link → Check status → View detail

**Bước 1: Mở verify link**
- URL: `https://trust.iai.one/v/prf_a1b2c3d4e5`
- Hoặc vào `trust.iai.one` → paste code `TRU-A1B2-C3D4`
- Hoặc scan QR code

**Bước 2: Hệ thống kiểm tra**
- Lookup ID trong database
- Kiểm tra trạng thái (active / revoked / expired)
- Kiểm tra hash integrity
- Trả về kết quả trong < 500ms

**Bước 3: Hiển thị kết quả**

Trường hợp VALID:
```
┌─────────────────────────────────────────┐
│  ✅ XÁC MINH THÀNH CÔNG                │
│                                         │
│  Loại: Verifiable Credential            │
│  Tên: Chứng nhận React Advanced        │
│  Cấp bởi: Công ty ABC                  │
│  Người nhận: Nguyễn Văn A              │
│  Ngày cấp: 28/04/2026                  │
│  Hết hạn: 28/04/2027                   │
│  Trạng thái: Đang hiệu lực             │
│                                         │
│  Bằng chứng gốc:                       │
│  Hash: sha256:e3b0c442...              │
│  Timestamp: 2026-04-28T10:30:00Z       │
│                                         │
│  [Tải PDF] [Chia sẻ] [Xác minh lại]    │
└─────────────────────────────────────────┘
```

Trường hợp INVALID / REVOKED:
```
┌─────────────────────────────────────────┐
│  ❌ KHÔNG HỢP LỆ                       │
│                                         │
│  Chứng chỉ này đã bị thu hồi bởi      │
│  tổ chức phát hành vào 15/04/2026.     │
│                                         │
│  Lý do: Thông tin không chính xác      │
│                                         │
│  [Liên hệ tổ chức phát hành]           │
└─────────────────────────────────────────┘
```

Trường hợp NOT FOUND:
```
┌─────────────────────────────────────────┐
│  ⚠️ KHÔNG TÌM THẤY                     │
│                                         │
│  Mã xác minh không tồn tại trong       │
│  hệ thống trust.iai.one.               │
│                                         │
│  Kiểm tra lại mã hoặc liên hệ         │
│  người gửi chứng chỉ.                  │
└─────────────────────────────────────────┘
```

---

## IV. Product Architecture

### App Layout (Monorepo)

```
vetuonglai-system/
├── apps/
│   ├── web/                  # Next.js 14 — giao diện chính trust.iai.one
│   │   ├── app/
│   │   │   ├── (public)/     # Homepage, verify, pricing
│   │   │   ├── (auth)/       # Login, register, magic link
│   │   │   ├── dashboard/    # Dashboard chính
│   │   │   ├── proof/        # Tạo + quản lý proof
│   │   │   ├── credential/   # Cấp + quản lý VC
│   │   │   ├── asset/        # Tạo + quản lý asset
│   │   │   └── v/[id]/       # Public verify page
│   │   └── components/
│   ├── api/                  # Hono / Express — API server
│   │   ├── routes/
│   │   │   ├── proof.ts
│   │   │   ├── vc.ts
│   │   │   ├── asset.ts
│   │   │   ├── verify.ts
│   │   │   ├── auth.ts
│   │   │   └── billing.ts
│   │   ├── engines/
│   │   │   ├── proof-engine.ts
│   │   │   ├── vc-engine.ts
│   │   │   └── asset-engine.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       ├── rate-limit.ts
│   │       └── api-key.ts
│   └── admin/                # Admin panel (internal)
│       ├── users/
│       ├── analytics/
│       └── moderation/
├── packages/
│   ├── db/                   # Prisma schema + migrations
│   ├── shared/               # Types, utils, constants
│   └── email/                # Email templates (React Email)
└── infrastructure/
    ├── docker-compose.yml
    └── deploy/
```

### Core Modules

#### Auth Module

| Feature | Chi tiết |
|---|---|
| Magic Link | Gửi email chứa login link, hết hạn sau 15 phút |
| Google OAuth | Login bằng Google account |
| Session | JWT access token (15min) + refresh token (30 days) |
| Organization | Multi-tenant, 1 user thuộc nhiều org |
| Roles | Owner, Admin, Issuer, Viewer |
| API Key | `trst_sk_live_xxx` (live) / `trst_sk_test_xxx` (test) |

#### Billing Module

| Feature | Chi tiết |
|---|---|
| Plans | Free, Pro, Business, Enterprise |
| Payment | Stripe (international), QR bank transfer (VN) |
| Usage tracking | Đếm proof/vc/asset created per billing cycle |
| Overage | Tự động charge hoặc block tùy plan |
| Invoice | Auto-generate PDF invoice monthly |

#### API Key Module

| Feature | Chi tiết |
|---|---|
| Format | `trst_sk_live_` prefix (live), `trst_sk_test_` prefix (test) |
| Per user | Mỗi user tối đa 5 API keys |
| Scopes | `proof:create`, `vc:issue`, `vc:revoke`, `asset:create`, `verify:read` |
| Rate limit | Theo plan (Free: 100/day, Pro: 1,000/day, Business: 10,000/day) |
| Rotation | User tự rotate key, key cũ hết hạn sau 24h |

### Engines

#### Proof Engine

```typescript
// proof-engine.ts
interface ProofEngine {
  // Tạo proof từ hash
  create(input: {
    hash: string;           // SHA-256 hash (client-side computed)
    algorithm: "SHA-256";
    creator_id?: string;    // null nếu anonymous
    metadata?: Record<string, string>;
  }): Promise<Proof>;

  // Xác minh proof
  verify(proof_id: string): Promise<{
    valid: boolean;
    proof: Proof;
    integrity_check: "pass" | "fail";
    timestamp_verified: boolean;
  }>;

  // Xác minh bằng hash (user upload lại file, so sánh hash)
  verifyByHash(hash: string): Promise<{
    found: boolean;
    proofs: Proof[];  // Có thể nhiều proof cùng hash
  }>;
}
```

Quy trình hash:
1. File upload → browser tính SHA-256 bằng Web Crypto API
2. Hash gửi lên server (file KHÔNG gửi lên)
3. Server lưu hash + timestamp + creator
4. Server tạo internal signature: `HMAC-SHA256(hash + timestamp, server_secret)`
5. Signature dùng để verify integrity sau này

#### VC Engine

```typescript
// vc-engine.ts
interface VCEngine {
  // Cấp credential
  issue(input: {
    issuer_id: string;
    subject: { name: string; email: string; };
    credential_name: string;
    proof_ref?: string;       // Link tới proof (optional)
    metadata?: Record<string, any>;
    expires_at?: Date;
    project_id?: string;      // Enterprise batch
  }): Promise<VerifiableCredential>;

  // Thu hồi
  revoke(vc_id: string, reason: string): Promise<void>;

  // Gia hạn
  extend(vc_id: string, new_expiry: Date): Promise<void>;

  // Xác minh
  verify(vc_id: string): Promise<{
    valid: boolean;
    status: "active" | "revoked" | "expired";
    credential: VerifiableCredential;
    issuer_verified: boolean;
  }>;

  // Batch issue
  batchIssue(input: {
    issuer_id: string;
    project_id: string;
    subjects: Array<{ name: string; email: string; metadata?: Record<string, any> }>;
    credential_name: string;
    expires_at?: Date;
  }): Promise<{ total: number; success: number; failed: number; results: VerifiableCredential[] }>;
}
```

#### Asset Engine

```typescript
// asset-engine.ts
interface AssetEngine {
  // Tạo asset
  create(input: {
    name: string;
    owner_id: string;
    vc_ref?: string;
    proof_ref?: string;
    metadata?: Record<string, any>;
  }): Promise<Asset>;

  // Chuyển sở hữu
  transfer(asset_id: string, from_id: string, to_id: string): Promise<void>;

  // Xem lịch sử sở hữu
  getHistory(asset_id: string): Promise<OwnershipRecord[]>;

  // Xác minh
  verify(asset_id: string): Promise<{
    valid: boolean;
    asset: Asset;
    current_owner: User;
    history: OwnershipRecord[];
  }>;
}
```

---

## V. API Design

### Base URL

- Production: `https://api.trust.iai.one/v1`
- Sandbox: `https://api-sandbox.trust.iai.one/v1`

### Authentication

Mọi request cần header:
```
Authorization: Bearer trst_sk_live_abc123def456
```

### Response Format

Mọi response theo format:
```json
{
  "ok": true,
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-04-28T10:30:00.000Z"
  }
}
```

Error response:
```json
{
  "ok": false,
  "error": {
    "code": "PROOF_NOT_FOUND",
    "message": "Proof with ID prf_invalid does not exist",
    "status": 404
  },
  "meta": {
    "request_id": "req_abc124",
    "timestamp": "2026-04-28T10:30:01.000Z"
  }
}
```

### Endpoints

#### Proof

**POST /api/proof/create**

Tạo bằng chứng mới.

Request:
```json
{
  "hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "algorithm": "SHA-256",
  "label": "Contract_Q1_2026.pdf",
  "metadata": {
    "department": "Legal",
    "document_type": "contract"
  }
}
```

Response `201 Created`:
```json
{
  "ok": true,
  "data": {
    "proof_id": "prf_a1b2c3d4e5",
    "hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "algorithm": "SHA-256",
    "label": "Contract_Q1_2026.pdf",
    "creator_id": "user_xyz123",
    "status": "active",
    "created_at": "2026-04-28T10:30:00.000Z",
    "verify_url": "https://trust.iai.one/v/prf_a1b2c3d4e5",
    "verify_code": "TRU-A1B2-C3D4"
  }
}
```

**POST /api/proof/verify**

Xác minh bằng hash (user upload lại file, client tính hash, gửi lên so sánh).

Request:
```json
{
  "hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

Response `200 OK`:
```json
{
  "ok": true,
  "data": {
    "found": true,
    "matches": [
      {
        "proof_id": "prf_a1b2c3d4e5",
        "label": "Contract_Q1_2026.pdf",
        "created_at": "2026-04-28T10:30:00.000Z",
        "status": "active",
        "verify_url": "https://trust.iai.one/v/prf_a1b2c3d4e5"
      }
    ],
    "total_matches": 1
  }
}
```

#### Verifiable Credential

**POST /api/vc/issue**

Request:
```json
{
  "credential_name": "Chứng nhận React Advanced",
  "subject": {
    "name": "Nguyễn Văn A",
    "email": "a@example.com"
  },
  "proof_ref": "prf_a1b2c3d4e5",
  "project_id": "prj_001",
  "metadata": {
    "course": "React Advanced",
    "score": 95,
    "instructor": "Trần Thị B"
  },
  "expires_at": "2027-04-28T00:00:00.000Z",
  "send_email": true
}
```

Response `201 Created`:
```json
{
  "ok": true,
  "data": {
    "vc_id": "vc_x1y2z3",
    "credential_name": "Chứng nhận React Advanced",
    "issuer": {
      "id": "did:trust:user_xyz123",
      "name": "Công ty ABC",
      "verified_domain": "abc.com"
    },
    "subject": {
      "name": "Nguyễn Văn A",
      "email": "a@example.com"
    },
    "proof_ref": "prf_a1b2c3d4e5",
    "status": "active",
    "issued_at": "2026-04-28T11:00:00.000Z",
    "expires_at": "2027-04-28T00:00:00.000Z",
    "verify_url": "https://trust.iai.one/v/vc_x1y2z3",
    "verify_code": "TRU-X1Y2-Z3W4",
    "email_sent": true
  }
}
```

**GET /api/vc/{id}**

Response `200 OK`:
```json
{
  "ok": true,
  "data": {
    "vc_id": "vc_x1y2z3",
    "credential_name": "Chứng nhận React Advanced",
    "issuer": {
      "id": "did:trust:user_xyz123",
      "name": "Công ty ABC"
    },
    "subject": {
      "name": "Nguyễn Văn A",
      "email": "a@example.com"
    },
    "metadata": {
      "course": "React Advanced",
      "score": 95
    },
    "status": "active",
    "issued_at": "2026-04-28T11:00:00.000Z",
    "expires_at": "2027-04-28T00:00:00.000Z",
    "verify_url": "https://trust.iai.one/v/vc_x1y2z3"
  }
}
```

**POST /api/vc/revoke**

Request:
```json
{
  "vc_id": "vc_x1y2z3",
  "reason": "Thông tin không chính xác"
}
```

Response `200 OK`:
```json
{
  "ok": true,
  "data": {
    "vc_id": "vc_x1y2z3",
    "status": "revoked",
    "revoked_at": "2026-05-15T09:00:00.000Z",
    "revoke_reason": "Thông tin không chính xác"
  }
}
```

#### Asset

**POST /api/asset/create**

Request:
```json
{
  "name": "Chứng nhận React — Nguyễn Văn A",
  "owner_email": "a@example.com",
  "vc_ref": "vc_x1y2z3",
  "metadata": {
    "type": "certificate",
    "transferable": false
  }
}
```

Response `201 Created`:
```json
{
  "ok": true,
  "data": {
    "asset_id": "ast_m1n2o3",
    "name": "Chứng nhận React — Nguyễn Văn A",
    "owner": {
      "id": "user_recipient_456",
      "name": "Nguyễn Văn A"
    },
    "vc_ref": "vc_x1y2z3",
    "status": "active",
    "created_at": "2026-04-28T11:05:00.000Z",
    "verify_url": "https://trust.iai.one/v/ast_m1n2o3",
    "transferable": false
  }
}
```

**GET /api/asset/{id}**

Response `200 OK`:
```json
{
  "ok": true,
  "data": {
    "asset_id": "ast_m1n2o3",
    "name": "Chứng nhận React — Nguyễn Văn A",
    "owner": {
      "id": "user_recipient_456",
      "name": "Nguyễn Văn A"
    },
    "vc_ref": "vc_x1y2z3",
    "proof_ref": "prf_a1b2c3d4e5",
    "status": "active",
    "created_at": "2026-04-28T11:05:00.000Z",
    "ownership_history": [
      {
        "owner_id": "user_xyz123",
        "action": "created",
        "at": "2026-04-28T11:05:00.000Z"
      },
      {
        "owner_id": "user_recipient_456",
        "action": "transferred",
        "at": "2026-04-28T11:05:01.000Z"
      }
    ]
  }
}
```

#### Unified Verify

**GET /api/verify/{id}**

Tự động detect loại (proof/vc/asset) từ prefix (`prf_`, `vc_`, `ast_`).

Response `200 OK` (ví dụ cho VC):
```json
{
  "ok": true,
  "data": {
    "type": "credential",
    "valid": true,
    "status": "active",
    "detail": {
      "vc_id": "vc_x1y2z3",
      "credential_name": "Chứng nhận React Advanced",
      "issuer": "Công ty ABC",
      "subject": "Nguyễn Văn A",
      "issued_at": "2026-04-28T11:00:00.000Z",
      "expires_at": "2027-04-28T00:00:00.000Z"
    },
    "proof_chain": {
      "proof_id": "prf_a1b2c3d4e5",
      "hash": "sha256:e3b0c442...",
      "timestamp": "2026-04-28T10:30:00.000Z",
      "integrity": "pass"
    },
    "asset": null,
    "verified_at": "2026-04-28T12:00:00.000Z"
  }
}
```

### API System

| Thông số | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| API keys | 1 | 2 | 5 | Unlimited |
| Rate limit | 100 req/day | 1,000 req/day | 10,000 req/day | Custom |
| Scopes | `proof:create`, `verify:read` | + `vc:issue`, `vc:revoke` | + `asset:create` | All + custom |
| Webhook | Không | Có | Có | Có + priority |
| SLA | Không | 99.5% | 99.9% | 99.95% |

Rate limit headers trả về mỗi response:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1714348800
```

Usage tracking: mỗi API call được ghi log, tổng hợp theo ngày/tháng, hiển thị trên dashboard, tính phí theo overage nếu vượt plan.

---

## VI. Payment Flow

### 4 Tiers

| Plan | Giá USD/tháng | Giá VND/tháng | Proof | VC | Asset | API |
|---|---|---|---|---|---|---|
| **Free** | $0 | 0₫ | 10/tháng | Không | Không | 100 req/day |
| **Pro** | $19 | 475,000₫ | 100/tháng | 50/tháng | Không | 1,000 req/day |
| **Business** | $79 | 1,975,000₫ | 500/tháng | 200/tháng | 100/tháng | 10,000 req/day |
| **Enterprise** | Custom | Liên hệ | Unlimited | Unlimited | Unlimited | Custom |

Overage pricing (áp dụng khi vượt quota):

| Item | Giá overage |
|---|---|
| Proof | $0.05 / proof (1,250₫) |
| Credential | $0.20 / VC (5,000₫) |
| Asset | $0.50 / asset (12,500₫) |
| API call (vượt limit) | $0.001 / call (25₫) |

### Payment Channels

| Channel | Khu vực | Integration |
|---|---|---|
| **Stripe** | Quốc tế | Stripe Checkout + Customer Portal |
| **PayPal** | Quốc tế | PayPal Buttons SDK |
| **QR Bank VN** | Việt Nam | VietQR API (Vietcombank, Techcombank, MB Bank) |

### Payment Flow

```
User chọn plan
    │
    ├─ Stripe ──▶ Stripe Checkout Session ──▶ Payment ──▶ Webhook (checkout.session.completed)
    │                                                         │
    ├─ PayPal ──▶ PayPal Order ──▶ Approval ──▶ Capture ──▶ Webhook (PAYMENT.CAPTURE.COMPLETED)
    │                                                         │
    ├─ QR Bank ──▶ Tạo QR code (VietQR) ──▶ User scan ──▶ Bank callback / polling ──▶ Confirm
    │                                                         │
    ▼                                                         ▼
  Pending ◀──────────────────────────────────────────── Webhook received
    │
    ▼
  Activate plan
    │
    ▼
  Update user subscription record
    │
    ▼
  Send confirmation email + invoice PDF
```

Chi tiết QR Bank VN:
1. Hệ thống tạo unique transfer content: `TRUST-{user_id}-{plan}-{timestamp}`
2. Generate QR via VietQR API với nội dung chuyển khoản trên
3. Hiển thị QR + thông tin chuyển khoản (STK, ngân hàng, số tiền, nội dung)
4. Polling bank API mỗi 10s trong 15 phút
5. Match nội dung chuyển khoản → activate plan
6. Nếu 15 phút không nhận → hiển thị "Chờ xác nhận" + hướng dẫn liên hệ

### Billing Cycle

- Monthly billing, tự động gia hạn
- Cancel: có hiệu lực cuối cycle, không hoàn tiền giữa cycle
- Downgrade: có hiệu lực đầu cycle tiếp theo
- Upgrade: có hiệu lực ngay, tính prorated

---

## VII. Dashboard (Center of Product)

URL: `trust.iai.one/dashboard`

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  trust.iai.one    [Org: Công ty ABC ▾]    [User ▾] [?] [⚙]  │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ Overview │                                                   │
│ Proof    │           [Main Content Area]                     │
│ Cred.    │                                                   │
│ Assets   │                                                   │
│ Verify   │                                                   │
│ API      │                                                   │
│ Billing  │                                                   │
│          │                                                   │
│──────────│                                                   │
│ Settings │                                                   │
│ Help     │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

### Tab: Overview

| Widget | Nội dung |
|---|---|
| Quick stats | Tổng proof, VC, asset tháng này + so sánh tháng trước |
| Usage meter | Thanh progress bar theo plan limit (vd: 45/100 proofs) |
| Recent activity | 10 hoạt động gần nhất (tạo proof, issue VC, verify event) |
| Quick actions | Buttons: Tạo Proof, Cấp VC, Xác minh |
| Plan status | Plan hiện tại, ngày gia hạn, nút upgrade |

### Tab: Proof

| Feature | Chi tiết |
|---|---|
| Tạo proof mới | Form upload file / nhập text → tạo hash → submit |
| Danh sách proof | Table: ID, label, hash (truncated), date, status, actions |
| Filter | Theo ngày, trạng thái |
| Actions | Copy verify link, download certificate PDF, xem chi tiết |
| Detail view | Full hash, timestamp, verify URL, QR code, linked VC/asset |

### Tab: Credentials

| Feature | Chi tiết |
|---|---|
| Cấp VC đơn lẻ | Form: tên, người nhận, expiry, metadata |
| Cấp hàng loạt | Upload CSV, preview, confirm |
| Projects | Tạo/quản lý project, template VC |
| Danh sách VC | Table: ID, name, subject, status, issued date, expiry, actions |
| Actions | Revoke, extend, re-send email, copy verify link |
| Filter | Theo project, trạng thái, ngày, người nhận |

### Tab: Assets

| Feature | Chi tiết |
|---|---|
| Tạo asset | Form: tên, owner, link VC/proof |
| Danh sách | Table: ID, name, owner, status, date, actions |
| Ownership history | Timeline view cho mỗi asset |
| Transfer | Form chuyển sở hữu (chỉ owner hoặc admin) |

### Tab: Verify

| Feature | Chi tiết |
|---|---|
| Verify input | Paste ID/URL/code → hiển thị kết quả |
| Verify log | Lịch sử tất cả verify requests cho items của user |
| Stats | Số lần verify theo item, theo ngày |
| Embed code | Snippet HTML/JS để embed verify badge trên website |

### Tab: API

| Feature | Chi tiết |
|---|---|
| API keys | Tạo, xem, rotate, xóa API keys |
| Scopes | Chọn scopes cho mỗi key |
| Usage | Biểu đồ API calls theo ngày/tuần/tháng |
| Logs | Request log: endpoint, status, timestamp, response time |
| Docs link | Link tới API documentation |
| Webhook | Cấu hình webhook URL, xem delivery log |

### Tab: Billing

| Feature | Chi tiết |
|---|---|
| Current plan | Plan name, giá, ngày gia hạn |
| Usage | Bảng usage vs limit cho proof/vc/asset/api |
| Upgrade/downgrade | So sánh plans, chọn plan mới |
| Payment method | Quản lý thẻ/payment method |
| Invoices | Danh sách invoice, download PDF |
| Billing history | Lịch sử thanh toán |

---

## VIII. Database Schema (Reference)

> Chi tiết đầy đủ tại file riêng: `DATABASE_SCHEMA.md`

Tổng quan các bảng chính:

```
users
├── id, email, name, avatar_url
├── auth_provider (magic_link | google)
├── plan (free | pro | business | enterprise)
└── created_at, updated_at

organizations
├── id, name, logo_url, verified_domain
├── owner_id → users.id
└── created_at

org_members
├── org_id → organizations.id
├── user_id → users.id
└── role (owner | admin | issuer | viewer)

proofs
├── id (prf_xxx), hash, algorithm, label
├── creator_id → users.id
├── org_id → organizations.id (nullable)
├── status (active | deleted)
├── signature (HMAC for integrity)
├── verify_code (TRU-XXXX-XXXX)
└── created_at

credentials (verifiable_credentials)
├── id (vc_xxx), credential_name
├── issuer_id → users.id
├── org_id → organizations.id (nullable)
├── project_id → projects.id (nullable)
├── proof_ref → proofs.id (nullable)
├── subject_name, subject_email
├── metadata (jsonb)
├── status (active | revoked | expired)
├── revoke_reason (nullable)
├── issued_at, expires_at, revoked_at
└── verify_code (TRU-XXXX-XXXX)

assets
├── id (ast_xxx), name
├── owner_id → users.id
├── vc_ref → credentials.id (nullable)
├── proof_ref → proofs.id (nullable)
├── metadata (jsonb)
├── transferable (boolean)
├── status (active | transferred | burned)
└── created_at

ownership_history
├── id, asset_id → assets.id
├── from_user_id → users.id
├── to_user_id → users.id
├── action (created | transferred)
└── created_at

projects
├── id (prj_xxx), name, org_id
├── template (jsonb)
└── created_at

api_keys
├── id, user_id → users.id
├── key_hash (bcrypt of actual key)
├── prefix (first 8 chars for identification)
├── scopes (text[])
├── last_used_at
├── expires_at
└── created_at

subscriptions
├── id, user_id → users.id
├── plan, status (active | canceled | past_due)
├── stripe_subscription_id (nullable)
├── current_period_start, current_period_end
└── created_at

usage_records
├── id, user_id → users.id
├── type (proof | vc | asset | api_call)
├── count
├── period (YYYY-MM)
└── updated_at

verify_logs
├── id, item_type (proof | vc | asset)
├── item_id
├── verifier_ip (hashed)
├── result (valid | invalid | not_found)
└── created_at
```

---

## IX. Legal (4 Trang Bắt Buộc)

### 1. Terms of Use (Điều khoản sử dụng)

URL: `trust.iai.one/legal/terms`

Nội dung chính:
- **Phạm vi dịch vụ:** trust.iai.one cung cấp dịch vụ tạo bằng chứng số, cấp chứng chỉ xác minh, và quản lý tài sản số. Dịch vụ KHÔNG thay thế chứng nhận pháp lý.
- **Tài khoản:** User chịu trách nhiệm bảo mật tài khoản. 1 người = 1 tài khoản (trừ org members).
- **Nội dung:** User chịu trách nhiệm về tính chính xác của dữ liệu upload/nhập. Hệ thống chỉ xác minh tính toàn vẹn (integrity), KHÔNG xác minh tính đúng đắn (truthfulness) của nội dung.
- **Thanh toán:** Billing monthly, auto-renew. Cancel trước ngày gia hạn để tránh charge.
- **Chấm dứt:** trust.iai.one có quyền suspend tài khoản vi phạm. Data retention 30 ngày sau khi xóa tài khoản.
- **Giới hạn trách nhiệm:** trust.iai.one không chịu trách nhiệm cho thiệt hại phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, trong phạm vi pháp luật cho phép.

### 2. Privacy Policy (Chính sách bảo mật)

URL: `trust.iai.one/legal/privacy`

Nội dung chính:
- **Dữ liệu thu thập:** Email, tên, IP address (hashed), usage data, payment info (qua Stripe, không lưu thẻ trực tiếp).
- **Dữ liệu KHÔNG thu thập:** Nội dung file gốc (chỉ hash). Hệ thống không đọc, lưu, hoặc truy cập file người dùng.
- **Sử dụng dữ liệu:** Cung cấp dịch vụ, billing, cải thiện sản phẩm, email thông báo (opt-out được).
- **Chia sẻ:** Không bán dữ liệu cho bên thứ 3. Chia sẻ với: Stripe (payment), email provider (transactional email), khi luật yêu cầu.
- **Lưu trữ:** Dữ liệu lưu trên server tại Singapore/US. Encryption at rest (AES-256) và in transit (TLS 1.3).
- **Quyền user:** Xem, sửa, xóa dữ liệu cá nhân. Export data. Xóa tài khoản.
- **Cookies:** Session cookie (required), analytics cookie (optional, consent-based).

### 3. Verification Disclaimer (Tuyên bố về xác minh)

URL: `trust.iai.one/legal/disclaimer`

Nội dung chính:
- **trust.iai.one xác minh TÍNH TOÀN VẸN, không xác minh TÍNH ĐÚNG ĐẮN.**
- Khi hệ thống trả về "Xác minh thành công", nghĩa là: dữ liệu chưa bị thay đổi kể từ thời điểm tạo proof, chứng chỉ được cấp bởi issuer đã đăng ký và chưa bị thu hồi, tài sản số có lịch sử sở hữu rõ ràng.
- Hệ thống KHÔNG xác minh: nội dung bên trong có đúng sự thật không, issuer có đáng tin không (ngoài verified domain), người nhận có thực sự đạt được chứng chỉ không.
- **Trách nhiệm:** Tổ chức phát hành (issuer) chịu trách nhiệm về tính chính xác của nội dung chứng chỉ. trust.iai.one chỉ là hạ tầng.

### 4. Data Integrity Statement (Tuyên bố toàn vẹn dữ liệu)

URL: `trust.iai.one/legal/integrity`

Nội dung chính:
- **Phương pháp:** SHA-256 hashing, HMAC signature, timestamp logging.
- **Cam kết:** Mỗi proof được gắn timestamp tại thời điểm tạo. Hash và signature được lưu immutable (không thể sửa sau khi tạo). Mọi thay đổi trạng thái (revoke, transfer) được ghi log đầy đủ.
- **Giới hạn:** Hệ thống phụ thuộc vào độ chính xác của đồng hồ server (NTP-synced, sai số < 1 giây). Hệ thống không sử dụng blockchain; tính toàn vẹn dựa trên database integrity + server signature.
- **Audit:** Hệ thống có internal audit log. Enterprise plan có thể request audit report.

---

## X. Deployment Roadmap

### Phase 1: Foundation (Ngày 0–30)

**Mục tiêu:** User có thể tạo proof, đăng nhập, thanh toán.

| Tuần | Công việc | Output |
|---|---|---|
| 1 | Setup monorepo, deploy pipeline (Vercel + Railway), domain `trust.iai.one` | Blank app live |
| 1 | Auth module: magic link + Google OAuth, session management | Login hoạt động |
| 2 | Proof Engine: hash upload, create proof, generate verify URL/code | Tạo proof hoạt động |
| 2 | Verify page: `/v/{id}` hiển thị kết quả xác minh | Public verify hoạt động |
| 3 | Homepage: hero + 3 blocks + verify input | Homepage live |
| 3 | Billing: Stripe integration, 4 plans, checkout flow | Thanh toán hoạt động |
| 4 | Dashboard: Overview + Proof tab + Billing tab | Dashboard cơ bản |
| 4 | QR Bank VN payment, email notifications | Full payment |

**Deliverable Phase 1:**
- `trust.iai.one` live với proof creation + verify + login + payment
- User có thể: đăng ký → tạo proof → chia sẻ verify link → thanh toán nâng cấp

### Phase 2: Credentials (Ngày 30–60)

**Mục tiêu:** User Pro có thể cấp Verifiable Credentials.

| Tuần | Công việc | Output |
|---|---|---|
| 5 | VC Engine: issue single VC, verify, revoke, expire | VC core hoạt động |
| 5 | Credential tab trong dashboard | Quản lý VC |
| 6 | Batch issue: CSV upload, preview, progress bar | Enterprise VC |
| 6 | Project management: tạo project, template VC | Org features |
| 7 | Email system: gửi VC cho recipient, email template | Notification |
| 7 | Verify page upgrade: hiển thị VC detail, proof chain | Rich verify |
| 8 | Verify tab: embed code, verify log, stats | Analytics |
| 8 | API v1: proof + VC endpoints, API key management | API live |

**Deliverable Phase 2:**
- Cấp VC đơn lẻ và hàng loạt
- Verify page hiển thị full credential + proof chain
- API v1 public

### Phase 3: Assets + Scale (Ngày 60–90)

**Mục tiêu:** Full product, enterprise-ready, API public.

| Tuần | Công việc | Output |
|---|---|---|
| 9 | Asset Engine: create, transfer, ownership history | Asset core |
| 9 | Asset tab trong dashboard | Quản lý asset |
| 10 | API v1 complete: asset endpoints, webhook, rate limiting | Full API |
| 10 | SDK: JavaScript/TypeScript SDK package | `@trust-iai/sdk` |
| 11 | Admin panel: user management, analytics, moderation | Internal tools |
| 11 | Legal pages live, domain verification for orgs | Trust features |
| 12 | Performance optimization, security audit, load testing | Production-ready |
| 12 | Documentation site, onboarding flow, help center | User support |

**Deliverable Phase 3:**
- Full product: Proof + VC + Asset + Verify + API + Billing
- SDK published
- Enterprise features hoạt động

---

## XI. KPIs

### 30 ngày (End of Phase 1)

| Metric | Target |
|---|---|
| Registered users | 100 |
| Paid users (Pro+) | 10 |
| Proofs created | 500 |
| Verify page views | 1,000 |
| MRR | $190 (4,750,000₫) |

### 60 ngày (End of Phase 2)

| Metric | Target |
|---|---|
| Registered users | 1,000 |
| Paid users | 100 |
| VCs issued | 2,000 |
| API calls/day | 500 |
| MRR | $3,000 (75,000,000₫) |

### 90 ngày (End of Phase 3)

| Metric | Target |
|---|---|
| Registered users | 5,000 |
| Paid users | 300 |
| Enterprise accounts | 10 |
| API calls/day | 5,000 |
| Assets created | 500 |
| MRR | $15,000 (375,000,000₫) |

---

## XII. Risks & Mitigations

### Risk 1: User không hiểu giá trị "proof" so với screenshot

| | |
|---|---|
| **Mô tả** | User không thấy lý do phải dùng trust.iai.one thay vì chụp screenshot hoặc lưu file bình thường |
| **Xác suất** | Cao |
| **Impact** | Thấp conversion, CAC cao |
| **Giải pháp** | (1) Landing page có comparison table: screenshot vs proof. (2) Use case cụ thể: hợp đồng, bằng cấp, IP protection. (3) Demo video 60s cho mỗi use case. (4) Free tier cho phép trải nghiệm trước khi hiểu giá trị. |

### Risk 2: Trust vào hệ thống — "Ai xác minh người xác minh?"

| | |
|---|---|
| **Mô tả** | User/enterprise đặt câu hỏi về độ tin cậy của chính trust.iai.one |
| **Xác suất** | Trung bình |
| **Impact** | Cao — block enterprise adoption |
| **Giải pháp** | (1) Transparent về phương pháp: publish thuật toán, open-source verify logic. (2) Verification Disclaimer rõ ràng — không claim "absolute truth". (3) Domain verification cho issuer (DNS proof). (4) Phase sau: integrate với third-party timestamping authority (TSA) theo RFC 3161. |

### Risk 3: Quy mô thanh toán VN — QR bank không ổn định

| | |
|---|---|
| **Mô tả** | QR bank transfer qua VietQR có thể delay, fail match nội dung chuyển khoản, hoặc bank API downtime |
| **Xác suất** | Trung bình |
| **Impact** | Trung bình — mất paid conversion VN |
| **Giải pháp** | (1) Stripe là primary, QR bank là secondary. (2) Manual confirm flow: user upload ảnh chuyển khoản → admin verify trong 24h. (3) Fallback: MoMo / ZaloPay integration nếu VietQR không đủ reliable. (4) Retry logic: polling 15 phút, sau đó chuyển sang pending manual review. |

### Risk 4: Legal — bị dùng để "chứng nhận" nội dung sai sự thật

| | |
|---|---|
| **Mô tả** | User tạo proof/VC cho nội dung giả mạo, sau đó dùng verify link của trust.iai.one để tăng uy tín cho nội dung sai |
| **Xác suất** | Cao |
| **Impact** | Cao — rủi ro pháp lý và uy tín |
| **Giải pháp** | (1) Verification Disclaimer nổi bật trên mọi verify page: "Hệ thống xác minh tính toàn vẹn, không xác minh tính đúng đắn". (2) Report mechanism: nút "Báo cáo lạm dụng" trên mỗi verify page. (3) Terms of Use: quyền suspend account vi phạm. (4) Moderation queue trong admin panel cho reported items. (5) Watermark trên certificate PDF: "Xác minh tính toàn vẹn dữ liệu — không phải chứng nhận nội dung". |

---

## XIII. Conclusion

### Công thức: 1 Trust Operating System

```
Proof → Credential → Asset → Verify → API → Billing → Scale
  │         │           │        │        │       │        │
  │         │           │        │        │       │        └─ Enterprise adoption,
  │         │           │        │        │       │           10,000+ users
  │         │           │        │        │       │
  │         │           │        │        │       └─ Revenue engine,
  │         │           │        │        │          sustainable business
  │         │           │        │        │
  │         │           │        │        └─ Developer ecosystem,
  │         │           │        │           integration với hệ thống khác
  │         │           │        │
  │         │           │        └─ Public trust layer,
  │         │           │           bất kỳ ai xác minh được
  │         │           │
  │         │           └─ Ownership layer,
  │         │              tài sản số có chủ
  │         │
  │         └─ Identity + credential layer,
  │            chứng chỉ xác minh được
  │
  └─ Data integrity layer,
     nền tảng cho mọi thứ
```

### Tổng kết

**trust.iai.one** hợp nhất 3 hệ thống (proof.tranhatam.com, vc.vetuonglai.com, nft.iai.one) thành 1 sản phẩm duy nhất:

- **1 domain:** trust.iai.one
- **1 dashboard:** quản lý tất cả proof, credential, asset
- **1 verify page:** `/v/{id}` — xác minh mọi thứ bằng 1 link
- **1 API:** `/api/v1` — integrate với mọi hệ thống
- **1 billing:** thanh toán 1 lần cho tất cả tính năng
- **1 mục tiêu:** trở thành hạ tầng xác minh mặc định cho dữ liệu số tại Việt Nam và Đông Nam Á

> *Không bán "blockchain". Không bán "NFT". Bán sự tin tưởng có thể xác minh.*

---

**End of Master Specification v1.0.0**
