# API Opening Decision — trust.iai.one

Last updated: 2026-04-28

## Executive Decision

trust.iai.one should open API access in phases. The first public API surface should be **Proof + Public Verify**, not Credential or Asset.

Reason: Proof has the clearest value, the lowest legal risk, the smallest abuse surface, and it creates the base record needed by the Credential and Asset engines.

Formula:

```text
Open first: Proof Create + Proof Verify + Universal Verify Read
Keep gated: VC Issue/Revoke, Asset Create/Transfer, Billing Checkout
Open later: API keys, usage history, SDK, batch operations
```

## Phase 1 — Open Immediately After Auth + Rate Limit

### 1. POST /api/proof/create

Open to authenticated users with API key or dashboard session.

Requirements before opening:

- SHA-256 hashing is deterministic and tested.
- Original files are not stored by default.
- Metadata is size-limited and validated.
- User plan limits are enforced.
- Usage logs are written.
- Rate limit defaults to 10/min for Free.

Why open:

- It creates direct user value.
- It does not claim legal truth.
- It becomes the foundation for VC issuance later.
- It supports early paid conversion through proof limits.

### 2. POST /api/proof/verify

Open to authenticated users and eventually allow anonymous verification by hash where safe.

Requirements:

- Hash input validation.
- Constant response shape.
- No leakage of private metadata unless marked public.

### 3. GET /api/verify/{id}

Open publicly with no authentication.

Requirements:

- Auto-detect proof, credential, or asset by id namespace.
- Return only public fields.
- Show status clearly: valid, invalid, revoked, expired, pending.
- Include disclaimer: verification confirms integrity/status, not absolute truth.

Why open:

- Verification only works if third parties can view it.
- This endpoint is the main trust surface.
- It supports sharing from dashboard, email, QR code, and public profiles.

## Phase 1.5 — Open With Dashboard Controls

### API Keys

Endpoints:

- POST /api/keys
- GET /api/keys
- DELETE /api/keys/{id}

Open only when:

- API keys are hashed at rest.
- Plaintext key is shown once.
- Each key has permission scopes.
- Revocation is immediate.

Recommended default scopes:

```json
{
  "proof:create": true,
  "proof:read": true,
  "verify:read": true,
  "vc:issue": false,
  "asset:create": false
}
```

## Phase 2 — Keep Gated Until Issuer Model Is Ready

### 1. POST /api/vc/issue

Do not open broadly at launch.

Reason:

- Credential issuance can affect reputation, education, employment, and institutional trust.
- Issuer identity must be verified first.
- Revocation and expiry must be reliable.

Open to:

- Internal use.
- Approved organizations.
- Pro/Business users after issuer review.

Requirements before opening:

- Issuer profile and issuer DID or stable identifier.
- Credential type registry.
- Revocation reason model.
- Public verify page supports revoked/expired state.
- Audit log for every issue/revoke action.

### 2. POST /api/vc/{id}/revoke

Open only to credential issuer or admin.

Requirements:

- Permission check.
- Immutable audit event.
- Verify endpoint reflects revoked status immediately.

## Phase 3 — Keep Asset API Private Until Ownership Rules Are Stable

### 1. POST /api/asset/create

Do not open in Phase 1.

Reason:

- Asset ownership introduces stronger legal, financial, and fraud risk.
- Blockchain terminology can distort product positioning.
- The system should first prove value through Proof and Credential.

Open to:

- Business/Enterprise customers.
- Internal pilots.
- Approved integrations.

Requirements:

- Chain abstraction is stable.
- Contract address and token id validation exist.
- Transfer history is immutable.
- Ownership disclaimer is visible.

### 2. POST /api/asset/{id}/transfer

Open last.

Requirements:

- Owner authorization.
- Replay protection.
- Audit log.
- Verify endpoint shows transfer history.

## Billing API Opening

Open `GET /api/billing/plans` publicly early.

Keep checkout gated until:

- Stripe webhook signature verification is tested.
- PayPal webhook verification is tested.
- VN QR payment callback is idempotent.
- Subscription activation is reversible by admin.

Recommended public first:

- GET /api/billing/plans

Recommended gated:

- POST /api/billing/checkout
- POST /api/billing/webhook/{provider}

## Abuse Controls Required Before Any Public API

Minimum controls:

- API key hashing.
- Per-key and per-IP rate limit.
- Request body size limits.
- File size limits.
- Metadata JSON schema validation.
- Usage logs for all writes.
- Structured error responses.
- Billing limit enforcement.
- Public/private metadata split.

## Final Recommendation

Open APIs in this exact order:

1. `GET /api/verify/{id}` — public read, no auth.
2. `POST /api/proof/create` — authenticated write, rate-limited.
3. `POST /api/proof/verify` — authenticated first, public later if safe.
4. `GET /api/proof/{id}` — authenticated owner read, public only for public proof.
5. `GET /api/billing/plans` — public pricing.
6. API key management — dashboard-gated.
7. VC issue/revoke — approved issuers only.
8. Asset create/transfer — Business/Enterprise pilots only.

Do not launch with Asset-first messaging. The product should remain:

```text
A verification infrastructure for data, identity, credentials and digital assets.
```

Not:

```text
NFT platform / blockchain platform / Web3 product
```
