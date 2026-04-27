# VC Protection + Enterprise Rollout Report (2026-04-15)

## Scope Completed

1. Public lookup remains open on VC registry.
2. Free ownership certification is now gated by paid membership status.
3. Full member profile verification is now mandatory before identity attestation and ownership challenge.
4. Enterprise paid package catalog is added to data contracts, runtime APIs, and VC homepage UI.
5. Build + local full smoke suite completed before handoff.

## New Runtime Rules

- Paid membership required for free VC ownership protection:
  - Allowed states: `annual_active`, `pack_owner`, `program_user`, `partner`.
- Full profile verification required:
  - New endpoint: `POST /api/vc/profile/verify`.
  - Identity attest now requires profile already verified.
  - Ownership challenge now requires profile + identity attestation.
- 2-layer strong protection maintained:
  - Layer 1: session + full profile verification + real-user identity attestation.
  - Layer 2: cryptographic ownership challenge signature.
- File type policy remains unrestricted:
  - `acceptedMimeTypes: */*`
  - `acceptedFileTypes: all`

## New/Updated APIs

- `GET /api/vc/security/status`
  - Added profile policy, enterprise plans snapshot, NFT bridge integration status.
- `GET /api/vc/protection/eligibility`
  - Added profile verification gate status and certification readiness.
- `POST /api/vc/profile/verify` (new)
  - Stores full-profile verification record for authenticated paid members.
- `POST /api/vc/identity/attest`
  - Now enforces paid membership + prior profile verification.
- `POST /api/vc/ownership/challenge/request`
  - Now enforces profile verification before challenge issue.
- `GET /api/vc/enterprise/plans` (new)
  - Returns enterprise paid plans and profile policy.

## Data Contract Additions

- Updated `src/data/access-model.json`:
  - `vcProtectionPolicy`
  - `enterprisePlans` (Core / Scale / Custom)
  - Version bumped to `2026-04-15-team1-vc-profile-enterprise`

## Static Build Output Additions

- VC homepage:
  - Added explicit member+profile certification flow section.
  - Added enterprise pricing section with CTA links.
- Member APIs:
  - New `member.vetuonglai.com/api/enterprise-plans.json`
  - `api/entitlements.json` now includes VC protection policy + enterprise plans.
  - `api/index.json` now exposes `/api/enterprise-plans.json`.

## Test Results

- `npm run verify:prelive:local`: PASS
  - Build: PASS
  - Dist check: PASS
  - Smoke access runtime: PASS
  - Smoke VC ownership runtime: PASS
  - Smoke mobile PWA: PASS

- `npm run verify:prelive:full`: BLOCKED in sandbox
  - Local checks: PASS
  - Live curl step failed inside subprocess due DNS resolution in this environment.

- `npm run cloudflare:smoke:endpoints`: PASS for required public endpoints.

## Live Integration Spot Checks

- `https://vc.vetuonglai.com/api/certificates.json`: returns VC records (OK).
- `https://nft.iai.one/api/asset-registrations`: returns NFT registrations (OK).
- VC live homepage already references NFT mirror integration.

## Production Deployment Notes (2026-04-15)

- Worker deployed:
  - Script: `vetuonglai-vc`
  - Version ID: `d6878ca7-c6d1-43b0-ba99-53e83e2e1744`
  - Active routes: `vc.vetuonglai.com/api/vc/*`, `www.vc.vetuonglai.com/api/vc/*`
- Pages deployed:
  - Project: `vetuonglai-vc`
  - Preview URL: `https://3d9a3c04.vetuonglai-vc.pages.dev`
- Live checks after deployment:
  - `https://vc.vetuonglai.com/v/VC-2026-0001` -> HTTP 200
  - `https://vc.vetuonglai.com/api/vc/security/status` -> JSON live, includes profile+enterprise policy
  - `npm run cloudflare:smoke:endpoints` -> PASS required endpoints

## Post-Deploy Action Required

- VC runtime secrets are still missing on worker:
  - `SESSION_COOKIE_SECRET`
  - `VC_IDENTITY_ATTESTATION_SECRET`
  - `VC_OWNERSHIP_CHALLENGE_SECRET`
- Current impact:
  - Public lookup and policy endpoints are live.
  - Session/profile/identity/challenge flows cannot be fully used in production until secrets are configured.
