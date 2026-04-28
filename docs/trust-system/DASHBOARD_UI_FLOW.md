# trust.iai.one — Dashboard UI/UX Specification

> Production-ready specification for frontend developers.
> Version: 1.0 | Last updated: 2026-04-28

---

## Table of Contents

1. [Dashboard Layout](#1-dashboard-layout)
2. [Tabs](#2-tabs)
3. [UI Components Spec](#3-ui-components-spec)
4. [Key Interactions](#4-key-interactions)
5. [Mobile Responsive](#5-mobile-responsive)
6. [Accessibility](#6-accessibility)

---

## 1. Dashboard Layout

### Overall Structure

```
┌──────────────────────────────────────────────────────────┐
│ TOP BAR                                                  │
│  [☰]  trust.iai.one    [🔍 Search...]  [🔔] [🇻🇳/🇺🇸] │
├────────────┬─────────────────────────────────────────────┤
│  SIDEBAR   │  MAIN CONTENT AREA                         │
│            │                                             │
│  [Logo]    │  (context-dependent based on active tab)    │
│            │                                             │
│  Overview  │                                             │
│  Proofs    │                                             │
│  Creds     │                                             │
│  Assets    │                                             │
│  Verify    │                                             │
│  API       │                                             │
│  Billing   │                                             │
│            │                                             │
│  ────────  │                                             │
│  FREE plan │                                             │
│  [Avatar]  │                                             │
│  Tâm N.    │                                             │
└────────────┴─────────────────────────────────────────────┘
```

### Sidebar (Desktop: 240px fixed width)

| Element | Detail |
|---|---|
| Logo | `trust.iai.one` wordmark, 32px height, links to `/dashboard` |
| Nav tabs | 7 items, icon + label. Active tab: `bg-blue-50 text-blue-700 border-l-3 border-blue-700` |
| Plan badge | Bottom of nav. Pill badge showing current plan: `FREE` / `STARTER` / `BUSINESS` / `ENTERPRISE` |
| User avatar | Bottom. 36px circle, initials fallback. Click → dropdown: Settings, Logout |

Nav icon mapping:

| Tab | Icon (Lucide) | Label | Route |
|---|---|---|---|
| Overview | `LayoutDashboard` | Tổng quan / Overview | `/dashboard` |
| Proofs | `ShieldCheck` | Bằng chứng / Proofs | `/dashboard/proofs` |
| Credentials | `Award` | Chứng chỉ / Credentials | `/dashboard/credentials` |
| Assets | `Gem` | Tài sản / Assets | `/dashboard/assets` |
| Verify | `SearchCheck` | Xác minh / Verify | `/dashboard/verify` |
| API | `Code2` | API | `/dashboard/api` |
| Billing | `CreditCard` | Thanh toán / Billing | `/dashboard/billing` |

### Top Bar (h-14, sticky top-0, z-50)

```
┌──────────────────────────────────────────────────────────┐
│ [☰ mobile]  trust.iai.one   [🔍 Search...        ] [🔔 3] [🇻🇳▾] │
└──────────────────────────────────────────────────────────┘
```

- **Search** (`Cmd+K` / `Ctrl+K`): Global search — proofs by hash/filename, credentials by subject, assets by token ID. Opens command palette modal.
- **Notifications bell**: Badge count for unread. Dropdown list: verification events, credential expirations, system alerts. Max 20 items, "View all" link.
- **Language switch**: Toggle `vi` ↔ `en`. Persisted to `localStorage` key `trust_lang`. Uses `next-intl` or equivalent i18n library.

### Main Content Area

- Max width: `max-w-7xl` (1280px), centered with `mx-auto`
- Padding: `px-6 py-6` desktop, `px-4 py-4` mobile
- Content determined by active tab (see Section 2)

---

## 2. Tabs

---

### 2.1 Overview Tab (`/dashboard`)

> Mục tiêu: Người dùng thấy ngay trạng thái tổng quan và hành động nhanh.
> Goal: User immediately sees overall status and quick actions.

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Xin chào, Tâm 👋                                      │
│  Welcome back. Here's your trust dashboard.             │
├─────────────┬──────────────┬─────────────┬──────────────┤
│ Total Proofs│ Active Creds │ Assets      │ Verifications│
│    127      │     43       │    12       │   389 /mo    │
│  ▲ 12%      │  ▲ 5%        │  — 0%       │  ▲ 23%       │
├─────────────┴──────────────┴─────────────┴──────────────┤
│                                                         │
│  Quick Actions                                          │
│  [📄 Create Proof] [🏅 Issue Credential] [🔗 Copy Link]│
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Plan Usage (Free — 50 proofs/mo)                       │
│  Proofs:    ████████░░░░░░░░░░  32/50                   │
│  VCs:       ██████░░░░░░░░░░░░  18/50                   │
│  API Calls: ██░░░░░░░░░░░░░░░░  120/1000                │
│  [Upgrade to Starter →]                                 │
├─────────────────────────────────────────────────────────┤
│  Recent Activity                                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 🟢 Proof created — report_Q1.pdf      2 min ago  │  │
│  │ 🔵 Credential issued — Nguyễn Văn A   1 hr ago   │  │
│  │ 🟡 Verification — proof abc123...      3 hr ago   │  │
│  │ 🔴 Credential revoked — cert_0042      1 day ago  │  │
│  │ ...                                               │  │
│  │ [View all activity →]                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Stats Cards (grid: 4 columns desktop, 2 mobile)

Each card:

```tsx
interface StatCard {
  label: string;        // e.g. "Total Proofs"
  value: number;        // e.g. 127
  change: number;       // percent change vs previous month, e.g. 12
  changeDirection: 'up' | 'down' | 'flat';
  icon: LucideIcon;
}
```

- Card style: `rounded-xl bg-white shadow-sm border border-gray-100 p-5`
- Value: `text-3xl font-bold text-gray-900`
- Change badge: green for up, red for down, gray for flat

#### Quick Actions (3 buttons, horizontal row)

| Action | Navigates to | Variant |
|---|---|---|
| Create Proof | `/dashboard/proofs?action=create` | Primary (blue) |
| Issue Credential | `/dashboard/credentials?action=create` | Secondary (outline) |
| Copy Verify Link | Copies `https://trust.iai.one/verify` to clipboard | Ghost |

#### Plan Usage Bars

- Progress bar component: `h-2 rounded-full bg-gray-100` with fill `bg-blue-600`
- When usage > 80%: fill turns `bg-amber-500`
- When usage > 95%: fill turns `bg-red-500`
- Upgrade CTA button: `text-blue-600 hover:text-blue-700 font-medium text-sm`

#### Recent Activity Feed

- List of last 10 actions, each row:
  - Status dot (color by action type)
  - Description text
  - Relative timestamp (`2 min ago`, `1 hr ago`) — use `date-fns/formatDistanceToNow`
- Action types and colors:
  - `proof_created` → green `#16a34a`
  - `credential_issued` → blue `#2563eb`
  - `verification` → amber `#d97706`
  - `credential_revoked` → red `#dc2626`
  - `asset_minted` → purple `#7c3aed`
  - `asset_transferred` → teal `#0d9488`

Data source: `GET /api/v1/activity?limit=10`

---

### 2.2 Proof Tab (`/dashboard/proofs`)

> Bằng chứng số — cốt lõi của hệ thống trust.
> Digital proofs — the core of the trust system.

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Proofs                                    [+ Create]   │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search by name or hash...]  [📅 Date ▾] [Filter ▾]│
├─────────────────────────────────────────────────────────┤
│  Hash         │ File Name      │ Date       │ Actions   │
│  ─────────────┼────────────────┼────────────┼────────── │
│  abc123...def │ report_Q1.pdf  │ 2026-04-28 │ [👁][📋][🔗]│
│  fed456...abc │ contract.docx  │ 2026-04-27 │ [👁][📋][🔗]│
│  ...          │ ...            │ ...        │ ...       │
├─────────────────────────────────────────────────────────┤
│  Showing 1-10 of 127       [< 1 2 3 ... 13 >]          │
└─────────────────────────────────────────────────────────┘
```

#### Create Proof Form (modal or slide-over panel)

```
┌─────────────────────────────────────────┐
│  Create New Proof                   [✕] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │   Drag & drop file here         │    │
│  │   or [Browse files]             │    │
│  │                                 │    │
│  │   Max 50MB. Any file type.      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  File: report_Q1.pdf (2.3 MB) ✓        │
│                                         │
│  Metadata (optional, JSON):             │
│  ┌─────────────────────────────────┐    │
│  │ {                               │    │
│  │   "department": "finance",      │    │
│  │   "quarter": "Q1-2026"         │    │
│  │ }                               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Cancel]              [Create Proof →] │
└─────────────────────────────────────────┘
```

- **File upload**: `react-dropzone` or native `<input type="file">` with drag-drop zone
- **Drag zone**: `border-2 border-dashed border-gray-300 rounded-lg p-10`, on drag-over: `border-blue-500 bg-blue-50`
- **Metadata editor**: Code editor with JSON syntax highlighting. Use `@monaco-editor/react` (lightweight) or `textarea` with validation.
- **Validation**: File required. Metadata must be valid JSON if provided.
- **Submit**: `POST /api/v1/proofs` with `multipart/form-data`

#### Proof List Table

| Column | Width | Detail |
|---|---|---|
| Hash | 200px | Truncated: first 6 + `...` + last 3 chars. Font: `JetBrains Mono`. Full hash on hover tooltip. |
| File Name | flex | Original filename. Truncate with ellipsis at 30 chars. |
| Date | 120px | `YYYY-MM-DD` format |
| Actions | 120px | Icon buttons: View (eye), Copy hash (clipboard), Copy verify link (link) |

- Sortable by date (default: newest first)
- Pagination: 10 per page, server-side
- Data source: `GET /api/v1/proofs?page=1&limit=10&search=&sort=created_at:desc`

#### Proof Detail View (slide-over panel or dedicated page)

```
┌─────────────────────────────────────────┐
│  Proof Detail                       [✕] │
├─────────────────────────────────────────┤
│  File: report_Q1.pdf                    │
│  Size: 2.3 MB                           │
│  Type: application/pdf                  │
│                                         │
│  SHA-256 Hash:                          │
│  ┌─────────────────────────────────┐    │
│  │ abc123def456789...full_hash     │ [📋]│
│  └─────────────────────────────────┘    │
│                                         │
│  IPFS CID:                              │
│  ┌─────────────────────────────────┐    │
│  │ QmXy7z...                       │ [📋]│
│  └─────────────────────────────────┘    │
│                                         │
│  Verify URL:                            │
│  ┌─────────────────────────────────┐    │
│  │ https://trust.iai.one/v/abc123  │ [📋]│
│  └─────────────────────────────────┘    │
│                                         │
│  Timeline:                              │
│  ● Created — 2026-04-28 10:30 UTC       │
│  ● Pinned to IPFS — 2026-04-28 10:31   │
│  ● First verified — 2026-04-28 14:22   │
│  ● Verified 12 times total              │
│                                         │
│  Metadata:                              │
│  { "department": "finance", ... }       │
└─────────────────────────────────────────┘
```

#### Bulk Upload (Business+ plans only)

- Additional button: `[📦 Bulk Upload]` next to `[+ Create]`
- Opens modal with multi-file dropzone (up to 100 files)
- Progress bar per file
- Summary table on completion
- If user is on Free/Starter plan: button is visible but disabled, tooltip: "Upgrade to Business to unlock bulk upload" (Nâng cấp lên Business để mở khóa tải hàng loạt)

---

### 2.3 Credentials Tab (`/dashboard/credentials`)

> Chứng chỉ có thể xác minh (Verifiable Credentials).

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Credentials                               [+ Issue]    │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search...]     [Type ▾]  [Status ▾]  [Date ▾]     │
├─────────────────────────────────────────────────────────┤
│  Subject        │ Type        │ Status  │ Issued    │ ⋮ │
│  ───────────────┼─────────────┼─────────┼───────────┼── │
│  Nguyễn Văn A   │ Certificate │ 🟢 Active│ 2026-04-28│ ⋮│
│  Trần Thị B     │ License     │ 🟡 Expired│2026-03-15│ ⋮│
│  Lê Văn C       │ Badge       │ 🔴 Revoked│2026-02-01│ ⋮│
│  ...            │ ...         │ ...     │ ...       │   │
├─────────────────────────────────────────────────────────┤
│  Showing 1-10 of 43        [< 1 2 3 ... 5 >]           │
└─────────────────────────────────────────────────────────┘
```

#### Issue Credential Form

```
┌─────────────────────────────────────────┐
│  Issue Credential                   [✕] │
├─────────────────────────────────────────┤
│                                         │
│  Subject Name *                         │
│  [Nguyễn Văn A                       ]  │
│                                         │
│  Subject Identifier *                   │
│  [email@example.com                  ]  │
│  (Email, DID, or unique ID)             │
│                                         │
│  Credential Type *                      │
│  [Certificate             ▾]            │
│  Options: Certificate, License, Badge,  │
│           Membership, Diploma, Custom   │
│                                         │
│  Linked Proof (optional)                │
│  [Select a proof...        ▾]           │
│  (Chọn bằng chứng liên kết)            │
│                                         │
│  Expiry Date (optional)                 │
│  [📅 2027-04-28            ]            │
│                                         │
│  Metadata (optional, JSON):             │
│  ┌─────────────────────────────────┐    │
│  │ {                               │    │
│  │   "course": "Blockchain 101",   │    │
│  │   "grade": "A"                  │    │
│  │ }                               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Cancel]          [Issue Credential →] │
└─────────────────────────────────────────┘
```

- **Subject Name**: Text input, required, min 2 chars
- **Subject Identifier**: Text input, required. Validated as email or DID format or free-text ID.
- **Credential Type**: Dropdown select. Values: `certificate`, `license`, `badge`, `membership`, `diploma`, `custom`
- **Linked Proof**: Searchable dropdown of user's proofs. Optional.
- **Expiry Date**: Date picker, optional. Must be in the future.
- **Metadata**: JSON editor, optional. Validated on submit.
- **Submit**: `POST /api/v1/credentials`

#### Credential List Table

| Column | Detail |
|---|---|
| Subject | Name + identifier (tooltip) |
| Type | Capitalized type with icon |
| Status | Badge: `Active` (green), `Revoked` (red), `Expired` (amber) |
| Issued | `YYYY-MM-DD` |
| Actions (⋮ menu) | View detail, Copy verify URL, Revoke (if active) |

#### Credential Detail View

```
┌─────────────────────────────────────────┐
│  Credential Detail                  [✕] │
├─────────────────────────────────────────┤
│  Subject: Nguyễn Văn A                  │
│  Identifier: nguyenvana@email.com       │
│  Type: Certificate                      │
│  Status: 🟢 Active                      │
│  Issued: 2026-04-28                     │
│  Expires: 2027-04-28                    │
│  Issuer: trust.iai.one/org/your-org     │
│                                         │
│  Linked Proof: abc123...def [→]         │
│                                         │
│  Verify URL:                            │
│  https://trust.iai.one/v/vc_xyz   [📋]  │
│                                         │
│  ┌───────────┐                          │
│  │  QR CODE  │  Scan to verify          │
│  │  ███████  │  (Quét để xác minh)      │
│  │  ███████  │                          │
│  └───────────┘                          │
│                                         │
│  Metadata:                              │
│  { "course": "Blockchain 101", ... }    │
│                                         │
│  Revocation History:                    │
│  (none)                                 │
│                                         │
│  [Revoke Credential]                    │
└─────────────────────────────────────────┘
```

- **QR Code**: Generated client-side using `qrcode.react`. Encodes the verify URL.
- **Revoke button**: Red outline button. Requires confirmation dialog: "Are you sure? This action cannot be undone." (Bạn có chắc chắn? Hành động này không thể hoàn tác.)
- **Revoke API**: `POST /api/v1/credentials/{id}/revoke`

#### Batch Issue (Enterprise plans only)

- Button: `[📦 Batch Issue]` — opens CSV upload modal
- CSV format: `subject_name, identifier, type, expiry_date, metadata_json`
- Preview table before confirmation
- Progress indicator during batch processing
- Gated same as bulk upload on Proofs tab

---

### 2.4 Assets Tab (`/dashboard/assets`)

> Tài sản số on-chain (NFT/SBT).

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Assets                                    [+ Mint]     │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search...]                [Chain ▾]  [Status ▾]   │
├─────────────────────────────────────────────────────────┤
│  Token ID │ Name         │ Chain    │ Status  │ Actions │
│  ─────────┼──────────────┼──────────┼─────────┼──────── │
│  #0001    │ Cert-NFT-A   │ Polygon  │ 🟢 Minted│ [👁][↗]│
│  #0002    │ Badge-SBT-B  │ Base     │ 🔵 Pending│[👁]   │
│  ...      │ ...          │ ...      │ ...     │ ...     │
├─────────────────────────────────────────────────────────┤
│  Showing 1-10 of 12        [< 1 2 >]                   │
└─────────────────────────────────────────────────────────┘
```

#### Mint Asset Form

```
┌─────────────────────────────────────────┐
│  Mint Asset                         [✕] │
├─────────────────────────────────────────┤
│                                         │
│  Linked Credential (optional)           │
│  [Select credential...      ▾]          │
│                                         │
│  Chain *                                │
│  [Polygon ▾]                            │
│  Options: Polygon, Base, Arbitrum       │
│                                         │
│  Asset Name *                           │
│  [Certificate NFT #0001             ]   │
│                                         │
│  Metadata (JSON) *                      │
│  ┌─────────────────────────────────┐    │
│  │ {                               │    │
│  │   "name": "Certificate NFT",   │    │
│  │   "description": "...",         │    │
│  │   "image": "ipfs://..."         │    │
│  │ }                               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Recipient Address *                    │
│  [0x1234...                          ]  │
│  (Địa chỉ ví người nhận)               │
│                                         │
│  [Cancel]                [Mint Asset →] │
└─────────────────────────────────────────┘
```

- **Chain selector**: Dropdown. Each option shows chain icon + name.
- **Metadata**: Must be valid JSON. Pre-populated template for ERC-721 metadata standard.
- **Recipient address**: Validated as Ethereum address format (`0x` + 40 hex chars).
- **Submit**: `POST /api/v1/assets/mint` — returns pending status, polls for confirmation.

#### Asset Detail View

```
┌─────────────────────────────────────────┐
│  Asset #0001                        [✕] │
├─────────────────────────────────────────┤
│  Name: Certificate NFT #0001           │
│  Chain: Polygon                         │
│  Token ID: 0001                         │
│  Contract: 0xABCD...1234          [📋]  │
│  Owner: 0x5678...EFGH             [📋]  │
│  Status: 🟢 Minted                      │
│                                         │
│  Linked Credential: vc_xyz [→]          │
│                                         │
│  Metadata:                              │
│  { "name": "...", "image": "..." }      │
│                                         │
│  Transfer History:                      │
│  ● Minted to 0x5678... — 2026-04-28    │
│  ● (no transfers)                       │
│                                         │
│  Ownership Proof:                       │
│  On-chain tx: 0xTXHASH...        [↗]   │
│                                         │
│  [Transfer Asset]                       │
└─────────────────────────────────────────┘
```

#### Transfer Form (modal)

```
┌─────────────────────────────────────────┐
│  Transfer Asset #0001               [✕] │
├─────────────────────────────────────────┤
│  From: 0x5678...EFGH (you)              │
│                                         │
│  To Address *                           │
│  [0x9999...                          ]  │
│                                         │
│  [Cancel]             [Transfer Asset →]│
└─────────────────────────────────────────┘
```

- Confirmation dialog before executing
- `POST /api/v1/assets/{id}/transfer`

---

### 2.5 Verify Tab (`/dashboard/verify`)

> Xác minh bất kỳ bằng chứng, chứng chỉ, hoặc tài sản nào.
> Verify any proof, credential, or asset.

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Verify                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Paste any ID, URL, or hash to verify:                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │ https://trust.iai.one/v/abc123                  │    │
│  └─────────────────────────────────────────────────┘    │
│  [Verify →]                                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ✅ VERIFIED                                    │    │
│  │                                                 │    │
│  │  Type: Proof                                    │    │
│  │  Status: Valid                                  │    │
│  │  File: report_Q1.pdf                            │    │
│  │  Hash: abc123def456...                          │    │
│  │  Created: 2026-04-28 10:30 UTC                  │    │
│  │  Issuer: trust.iai.one/org/acme                 │    │
│  │  IPFS: QmXy7z...                               │    │
│  │                                                 │    │
│  │  [Open Public Verify Page ↗]                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Verification Statistics                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │        Verifications Over Time                  │    │
│  │  400│      ╭─╮                                  │    │
│  │  300│    ╭─╯ │  ╭╮                              │    │
│  │  200│  ╭─╯   ╰──╯╰─╮                           │    │
│  │  100│╭─╯            ╰──                         │    │
│  │    0│────────────────────                       │    │
│  │     Jan Feb Mar Apr                             │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### Universal Verify Input

- Single text input, auto-detects input type:
  - URL matching `trust.iai.one/v/*` → extract ID
  - Hex string (64 chars) → treat as proof hash
  - `vc_*` prefix → credential ID
  - `asset_*` or numeric → asset token ID
- **Submit**: `POST /api/v1/verify` with `{ "input": "..." }`
- Loading state: pulsing skeleton card

#### Result Card

- **Verified**: Green border-l-4, `✅ VERIFIED` header, bg-green-50
- **Invalid/Not Found**: Red border-l-4, `❌ NOT VERIFIED` header, bg-red-50
- **Revoked**: Amber border-l-4, `⚠️ REVOKED` header, bg-amber-50

Fields vary by type:

| Type | Fields shown |
|---|---|
| Proof | file name, hash, IPFS CID, created date, issuer |
| Credential | subject, type, status, issued/expiry, issuer, linked proof |
| Asset | token ID, chain, owner, contract, minted date |

#### Public Verify Page Preview

- Link opens `/v/{id}` in new tab
- Standalone page (no dashboard chrome), white background, centered card
- Shareable, no auth required

#### Verification Statistics Chart

- Line chart (use `recharts` or `chart.js`)
- Time range selector: 7d / 30d / 90d / 1y
- Y-axis: verification count
- X-axis: date
- Data source: `GET /api/v1/stats/verifications?range=30d`

---

### 2.6 API Tab (`/dashboard/api`)

> Quản lý API keys và theo dõi sử dụng.

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  API                                                    │
├─────────────────────────┬───────────────────────────────┤
│  API Keys               │  Usage                        │
│  ┌────────────────────┐ │  ┌───────────────────────┐    │
│  │ sk_live_abc...  🟢 │ │  │  API Calls (30 days)  │    │
│  │ Created 2026-04-01 │ │  │  ┌─────────────────┐  │    │
│  │ [Copy] [Revoke]    │ │  │  │  chart here     │  │    │
│  ├────────────────────┤ │  │  └─────────────────┘  │    │
│  │ sk_test_xyz... 🟢 │ │  │                       │    │
│  │ Created 2026-03-15 │ │  │  Total: 2,847         │    │
│  │ [Copy] [Revoke]    │ │  │  Avg: 95/day          │    │
│  └────────────────────┘ │  └───────────────────────┘    │
│  [+ Create New Key]     │                               │
├─────────────────────────┴───────────────────────────────┤
│                                                         │
│  Rate Limits (Current Plan: Starter)                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  1,000 calls/day  │  10 req/sec burst           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Code Examples                          [cURL ▾]        │
│  ┌─────────────────────────────────────────────────┐    │
│  │ curl -X POST https://trust.iai.one/api/v1/...   │    │
│  │   -H "Authorization: Bearer sk_live_abc..."     │    │
│  │   -H "Content-Type: application/json"           │    │
│  │   -d '{"file_hash": "..."}'                     │    │
│  └─────────────────────────────────────────────────┘    │
│  [📋 Copy]                                              │
│                                                         │
│  Webhooks (Business+ only)                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Endpoint: https://your-app.com/webhook   🟢    │    │
│  │  Events: proof.created, credential.issued       │    │
│  │  [Edit] [Delete]                                │    │
│  │                                                 │    │
│  │  [+ Add Webhook Endpoint]                       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### API Key Management

- **Create key**: `POST /api/v1/api-keys` → returns full key ONCE. Modal shows key with copy button and warning: "Copy this key now. It won't be shown again." (Sao chép khóa này ngay. Nó sẽ không hiển thị lại.)
- **List**: Shows masked keys (`sk_live_abc...`), created date, last used date, status
- **Revoke**: Confirmation dialog → `DELETE /api/v1/api-keys/{id}`
- Key format: `sk_live_` prefix (production), `sk_test_` prefix (sandbox)

#### Usage Chart

- Bar chart: calls per day for last 30 days
- Toggle: day / week / month aggregation
- Data source: `GET /api/v1/stats/api-usage?range=30d`

#### Code Examples Panel

- Tab selector: `cURL` | `JavaScript` | `Python`
- Syntax highlighted code block (JetBrains Mono font)
- Auto-inserts user's first API key (masked in display, full on copy)
- Copy button per example

Example content:

**cURL:**
```bash
curl -X POST https://trust.iai.one/api/v1/proofs \
  -H "Authorization: Bearer sk_live_abc..." \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F 'metadata={"department":"finance"}'
```

**JavaScript:**
```javascript
const res = await fetch('https://trust.iai.one/api/v1/proofs', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer sk_live_abc...' },
  body: formData
});
const proof = await res.json();
console.log(proof.data.verify_url);
```

**Python:**
```python
import requests

resp = requests.post(
    'https://trust.iai.one/api/v1/proofs',
    headers={'Authorization': 'Bearer sk_live_abc...'},
    files={'file': open('document.pdf', 'rb')},
    data={'metadata': '{"department":"finance"}'}
)
print(resp.json()['data']['verify_url'])
```

#### Webhook Configuration (Business+ plans)

- **Add endpoint**: URL input + event multi-select (checkboxes)
- Events: `proof.created`, `proof.verified`, `credential.issued`, `credential.revoked`, `asset.minted`, `asset.transferred`
- **Secret**: Auto-generated HMAC signing secret, shown once
- **Status**: Green dot = healthy (last delivery succeeded), Red = failing
- **Test**: Send test event button
- Gated: Free/Starter users see the section disabled with upgrade prompt

#### Rate Limit Display

- Shows limits for current plan tier:
  - Free: 100 calls/day, 2 req/sec
  - Starter: 1,000 calls/day, 10 req/sec
  - Business: 10,000 calls/day, 50 req/sec
  - Enterprise: Custom

---

### 2.7 Billing Tab (`/dashboard/billing`)

> Quản lý gói dịch vụ và thanh toán.

#### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Billing                                                │
├─────────────────────────────────────────────────────────┤
│  Current Plan                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🟢 STARTER — $19/month                         │    │
│  │  Next billing: May 28, 2026                     │    │
│  │  [Change Plan]              [Cancel Subscription]│    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Plan Comparison                                        │
│  ┌─────────┬─────────┬─────────┬─────────┬───────────┐  │
│  │         │  Free   │ Starter │Business │ Enterprise│  │
│  │ Price   │  $0     │  $19/mo │ $79/mo  │ Custom    │  │
│  │ Proofs  │  50/mo  │  500/mo │ 5,000/mo│ Unlimited │  │
│  │ VCs     │  50/mo  │  500/mo │ 5,000/mo│ Unlimited │  │
│  │ API     │  100/d  │ 1,000/d │10,000/d │ Custom    │  │
│  │ Assets  │  5      │  50     │  500    │ Unlimited │  │
│  │ Bulk    │  ✕      │  ✕      │  ✓      │ ✓         │  │
│  │ Webhook │  ✕      │  ✕      │  ✓      │ ✓         │  │
│  │ Support │  Community│ Email │Priority │ Dedicated │  │
│  │         │ [Current]│[Upgrade]│[Upgrade]│[Contact]  │  │
│  └─────────┴─────────┴─────────┴─────────┴───────────┘  │
│                                                         │
│  Payment History                                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Date       │ Amount  │ Status │ Invoice         │    │
│  │  2026-04-28 │ $19.00  │ ✅ Paid │ [Download PDF] │    │
│  │  2026-03-28 │ $19.00  │ ✅ Paid │ [Download PDF] │    │
│  │  2026-02-28 │ $19.00  │ ✅ Paid │ [Download PDF] │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Payment Method                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  💳 Visa ending in 4242    Exp: 12/2028         │    │
│  │  [Update]  [Remove]                             │    │
│  └─────────────────────────────────────────────────┘    │
│  [+ Add Payment Method]                                 │
└─────────────────────────────────────────────────────────┘
```

#### Current Plan Card

- Plan name + monthly price
- Next billing date
- `[Change Plan]` → opens plan comparison with upgrade/downgrade flow
- `[Cancel Subscription]` → confirmation dialog with retention offer

#### Plan Comparison Table

- 4 tiers as columns, features as rows
- Current plan column highlighted with `ring-2 ring-blue-500`
- CTA per column: "Current" (disabled), "Upgrade" (primary button), "Contact Sales" (for Enterprise)
- Upgrade flow: Stripe Checkout redirect or embedded payment form
- Downgrade: confirmation with feature loss warning

#### Payment History Table

| Column | Detail |
|---|---|
| Date | `YYYY-MM-DD` |
| Amount | Formatted currency |
| Status | `Paid` (green), `Failed` (red), `Pending` (amber) |
| Invoice | Download link → PDF. `GET /api/v1/billing/invoices/{id}/pdf` |

#### Payment Method Management

- Show current card (brand icon, last 4, expiry)
- `[Update]` → Stripe card element modal
- `[Remove]` → confirmation, blocked if active subscription
- `[+ Add Payment Method]` → Stripe card element
- Integration: Stripe Customer Portal or embedded `@stripe/react-stripe-js`

---

## 3. UI Components Spec

### Color System

| Token | Hex | Usage |
|---|---|---|
| `primary-700` | `#1e40af` | Primary buttons, active nav, links |
| `primary-600` | `#2563eb` | Button hover, focus rings |
| `primary-50` | `#eff6ff` | Active nav background, light highlights |
| `success-600` | `#16a34a` | Success states, active badges, verified |
| `success-50` | `#f0fdf4` | Success card backgrounds |
| `warning-500` | `#f59e0b` | Warning states, expired badges |
| `warning-50` | `#fffbeb` | Warning card backgrounds |
| `danger-600` | `#dc2626` | Error states, revoked badges, destructive actions |
| `danger-50` | `#fef2f2` | Error card backgrounds |
| `gray-900` | `#111827` | Primary text |
| `gray-600` | `#4b5563` | Secondary text |
| `gray-400` | `#9ca3af` | Placeholder text |
| `gray-100` | `#f3f4f6` | Borders, dividers |
| `gray-50` | `#f9fafb` | Page background |
| `white` | `#ffffff` | Card backgrounds |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page title (h1) | Inter | 24px / `text-2xl` | 700 bold |
| Section title (h2) | Inter | 18px / `text-lg` | 600 semibold |
| Body text | Inter | 14px / `text-sm` | 400 normal |
| Small/caption | Inter | 12px / `text-xs` | 400 normal |
| Code / hashes | JetBrains Mono | 13px | 400 normal |
| Stat values | Inter | 30px / `text-3xl` | 700 bold |

Font loading:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Card Component

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';  // p-3, p-5, p-6
}
```

Base classes: `rounded-xl shadow-sm border border-gray-100 bg-white`

Variants:
- Default: as above
- Highlighted: add `ring-2 ring-blue-500`
- Success: add `border-l-4 border-l-green-500 bg-green-50`
- Danger: add `border-l-4 border-l-red-500 bg-red-50`
- Warning: add `border-l-4 border-l-amber-500 bg-amber-50`

### Badge Component

```tsx
interface BadgeProps {
  status: 'active' | 'revoked' | 'expired' | 'pending' | 'minted';
  label?: string;
}
```

| Status | Classes | Default Label |
|---|---|---|
| `active` | `bg-green-100 text-green-700` | Active |
| `revoked` | `bg-red-100 text-red-700` | Revoked |
| `expired` | `bg-amber-100 text-amber-700` | Expired |
| `pending` | `bg-blue-100 text-blue-700` | Pending |
| `minted` | `bg-green-100 text-green-700` | Minted |

Base classes: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`

### Table Component

```tsx
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  pagination?: {
    page: number;
    pageSize: number;     // default 10
    total: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
```

- Header: `bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-medium`
- Row: `border-b border-gray-100 hover:bg-gray-50 transition-colors`
- Sortable header: click toggles `asc` → `desc` → `none`, shows `ChevronUp`/`ChevronDown` icon
- Loading: skeleton rows (pulse animation, 5 rows)
- Empty state: centered illustration + "No data yet" message
- Pagination: `[< Previous] Page 1 of 13 [Next >]`

### Form Components

**Text Input:**
```
Base: h-10 rounded-lg border border-gray-300 px-3 text-sm
Focus: ring-2 ring-blue-500 border-blue-500
Error: ring-2 ring-red-500 border-red-500
Disabled: bg-gray-100 cursor-not-allowed opacity-60
```

**Label:** `text-sm font-medium text-gray-700 mb-1.5 block`

**Error text:** `text-xs text-red-600 mt-1`

**Select/Dropdown:** Same styling as text input + `ChevronDown` icon right-aligned

**Textarea:** Same base styling, `min-h-[100px] resize-y`

**Date picker:** Native `<input type="date">` with custom styling, or `react-day-picker`

**File upload zone:**
```
Default: border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
Drag over: border-blue-500 bg-blue-50
Has file: border-green-500 bg-green-50
```

**Button variants:**

| Variant | Classes |
|---|---|
| Primary | `bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900` |
| Secondary | `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50` |
| Danger | `bg-red-600 text-white hover:bg-red-700` |
| Ghost | `text-blue-700 hover:bg-blue-50` |
| Disabled | `opacity-50 cursor-not-allowed pointer-events-none` |

All buttons: `h-10 px-4 rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center`

### Toast Notifications

```tsx
interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // default 3000ms
}
```

- Position: top-right, stacked
- Animation: slide in from right, fade out
- Max visible: 3, queue additional
- Colors follow card variants (success=green, error=red, info=blue, warning=amber)
- Icon per type: `CheckCircle`, `XCircle`, `Info`, `AlertTriangle`
- Dismiss: auto after duration, or click X

---

## 4. Key Interactions

### Create Proof Flow

```
Step 1: User clicks [+ Create] on Proof tab
        → Slide-over panel opens from right (or modal)

Step 2: User drags file onto drop zone
        → Zone highlight: border-blue-500 bg-blue-50
        → On drop: file name + size displayed, checkmark icon
        → Zone text changes to file info

Step 3: (Optional) User enters metadata JSON
        → Real-time JSON validation
        → Red underline on invalid JSON, error message below

Step 4: User clicks [Create Proof →]
        → Button enters loading state: spinner + "Creating..." text
        → All inputs disabled

Step 5: Success
        → Toast: "Proof created successfully" (green)
        → Panel content replaced with success view:
          - Green checkmark animation (Lottie or CSS)
          - Hash displayed in monospace with copy button
          - Verify URL with copy button
          - [Create Another] and [View Proof] buttons
        → Proof list refreshes in background

Error: → Toast: error message (red)
       → Button re-enabled
       → Inputs preserved
```

### Issue Credential Flow

```
Step 1: User clicks [+ Issue] on Credentials tab
        → Form panel opens

Step 2: User fills required fields
        → Inline validation on blur:
          - Name: min 2 chars
          - Identifier: format validation
          - Type: must select one
          - Expiry: must be future date if set

Step 3: User clicks [Issue Credential →]
        → Preview step: shows JSON representation of the credential
          ┌─────────────────────────────┐
          │  Preview Credential         │
          │                             │
          │  {                          │
          │    "subject": "Nguyễn...",  │
          │    "type": "certificate",   │
          │    ...                      │
          │  }                          │
          │                             │
          │  [← Back]    [Confirm →]    │
          └─────────────────────────────┘

Step 4: User clicks [Confirm →]
        → Loading state on button
        → On success: toast + success view with QR code + verify URL
        → List refreshes

Error: → Return to form with errors highlighted
```

### Verify Flow

```
Step 1: User pastes/types into verify input
        → Input accepts: URL, hash, credential ID, asset ID

Step 2: User clicks [Verify →] or presses Enter
        → Input and button enter loading state
        → Skeleton result card appears below with pulse animation

Step 3: Result arrives (typically < 1s)
        → Skeleton replaced with result card
        → Card slides in with subtle scale animation (0.95 → 1.0, 200ms ease-out)
        → Status icon animates:
          - Verified: green checkmark with brief scale bounce
          - Invalid: red X with brief shake
          - Revoked: amber warning with fade-in

Step 4: User can click [Open Public Verify Page ↗]
        → Opens /v/{id} in new tab
```

### Copy to Clipboard

```
Step 1: User clicks any [📋] copy button
Step 2: navigator.clipboard.writeText(value)
Step 3: Button icon briefly changes to checkmark (300ms)
Step 4: Toast appears: "Copied to clipboard" (info, 2s duration)
Step 5: Button icon resets to clipboard

Fallback: If clipboard API unavailable, select text in hidden input + document.execCommand('copy')
```

### Destructive Actions (Revoke Credential, Delete API Key)

```
Step 1: User clicks destructive action button
Step 2: Confirmation dialog appears (modal with overlay):
        ┌────────────────────────────────────┐
        │  ⚠️ Revoke Credential?             │
        │                                    │
        │  This action cannot be undone.     │
        │  The credential for "Nguyễn Văn A" │
        │  will be permanently revoked.      │
        │                                    │
        │  Hành động này không thể hoàn tác. │
        │                                    │
        │  [Cancel]        [Revoke]          │
        │                  (red button)      │
        └────────────────────────────────────┘
Step 3: User confirms → loading → success toast → list refreshes
```

---

## 5. Mobile Responsive

### Breakpoints

| Name | Width | Tailwind |
|---|---|---|
| Mobile | < 640px | `sm:` |
| Tablet | 640–1023px | `md:` |
| Desktop | >= 1024px | `lg:` |

### Sidebar → Bottom Tab Bar

On screens < 1024px (`lg`), sidebar is replaced with a fixed bottom tab bar:

```
┌─────────────────────────────────────────┐
│                                         │
│  MAIN CONTENT (full width)              │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [🏠] [🛡] [🏅] [🔍] [⋯]              │
│  Home Proof Cred Verify More            │
└─────────────────────────────────────────┘
```

- 5 tabs shown: Overview, Proofs, Credentials, Verify, More
- "More" (⋯) opens a bottom sheet with: Assets, API, Billing, Settings, Logout
- Active tab: `text-blue-700`, inactive: `text-gray-400`
- Bar height: 64px, safe-area padding for iOS (`pb-safe`)

### Tables → Card List View

On mobile, tables transform to stacked cards:

```
Desktop table row:
│ abc123...def │ report.pdf │ 2026-04-28 │ [👁][📋] │

Mobile card:
┌─────────────────────────────────┐
│  report.pdf                     │
│  abc123...def                   │
│  2026-04-28         [👁] [📋]  │
└─────────────────────────────────┘
```

Implementation: Use CSS grid or conditional rendering. The table component accepts a `mobileRender` prop or uses `@media` queries to switch layout.

### Forms → Full-Width Stacked

- All form inputs: `w-full`
- Slide-over panels become full-screen modals on mobile
- Buttons: `w-full` on mobile, stack vertically
- File drop zone: tap to open file picker (drag-drop not reliable on mobile)

### Dashboard Grid → Single Column

- Stats cards: `grid-cols-2` on mobile (2x2), `grid-cols-4` on desktop
- Overview sections: single column stack
- Two-column layouts (e.g., API tab): stack vertically

---

## 6. Accessibility

### Focus Management

- All interactive elements have visible focus indicator: `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`
- Modal/slide-over panels trap focus when open
- On modal close, focus returns to the trigger element
- Skip-to-content link as first focusable element: `sr-only focus:not-sr-only`

### Screen Reader Support

- Icon-only buttons must have `aria-label`:
  ```html
  <button aria-label="Copy hash to clipboard">
    <ClipboardIcon aria-hidden="true" />
  </button>
  ```
- Status badges include `aria-label` with full text: `aria-label="Status: Active"`
- Tables use `<thead>`, `<th scope="col">`, `<td>` semantically
- Loading states announced: `aria-live="polite"` on result containers
- Toast notifications: `role="status"` with `aria-live="polite"`
- Form errors: `aria-describedby` linking input to error message, `aria-invalid="true"`

### Keyboard Navigation

| Context | Key | Action |
|---|---|---|
| Global | `Cmd+K` / `Ctrl+K` | Open search palette |
| Global | `Escape` | Close modal/panel |
| Tab bar | `Tab` / `Shift+Tab` | Navigate between tabs |
| Table | `Arrow Up/Down` | Navigate rows |
| Table | `Enter` | Open row detail |
| Modal | `Tab` | Cycle through focusable elements (trapped) |
| Dropdown | `Arrow Up/Down` | Navigate options |
| Dropdown | `Enter` / `Space` | Select option |
| Dropdown | `Escape` | Close |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- All animations (card slide-in, toast, skeleton pulse) respect this preference
- Success checkmark animation falls back to static icon
- Page transitions are instant

### Color Contrast

All text/background combinations meet WCAG 2.1 AA (minimum 4.5:1):

| Combination | Ratio | Pass |
|---|---|---|
| `gray-900` on `white` | 15.4:1 | AA |
| `gray-600` on `white` | 7.0:1 | AA |
| `blue-700` on `white` | 8.6:1 | AA |
| `green-700` on `green-100` | 5.1:1 | AA |
| `red-700` on `red-100` | 5.2:1 | AA |
| `amber-700` on `amber-100` | 4.6:1 | AA |
| `white` on `blue-700` | 8.6:1 | AA |
| `white` on `red-600` | 4.5:1 | AA |

- Never use color alone to convey information — always pair with icon or text
- Badge status has both color AND text label
- Chart data uses patterns in addition to color for colorblind users

### Additional A11y Requirements

- `lang` attribute set on `<html>` matching selected language (`vi` or `en`)
- All images/illustrations have descriptive `alt` text
- Form labels are always visible (no placeholder-only inputs)
- Touch targets: minimum 44x44px on mobile
- Page title updates on tab change: `Proofs — trust.iai.one`

---

## Appendix: Tech Stack Recommendations

| Layer | Recommendation |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS 3.4+ |
| Components | Radix UI primitives + custom styled |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form + Zod validation |
| Tables | TanStack Table v8 |
| i18n | next-intl |
| QR Code | qrcode.react |
| File upload | react-dropzone |
| Code editor | @monaco-editor/react (API tab) or highlight.js |
| Toasts | Sonner |
| Animations | Framer Motion (respects reduced motion) |
| Payments | @stripe/react-stripe-js |
| State | React Query (TanStack Query) for server state |
| Auth | NextAuth.js or custom JWT |

---

*End of specification. This document should be sufficient for a frontend developer to build the complete dashboard without additional design input.*
