# VTL Contract Integration Quick Guide (Team 1/2/3)

## 1) Single-entry contract discovery

- Primary discovery endpoint: `https://vetuonglai.com/api/contracts.json`
- Mirror discovery endpoint: `https://member.vetuonglai.com/api/contracts.json`
- Both endpoints share the same `contractVersion` and contract map.

## 2) Contract endpoints by team

### Team 1 (Access/Commerce)

- `https://member.vetuonglai.com/api/access-model.json`
- `https://member.vetuonglai.com/api/entitlements.json`
- `https://member.vetuonglai.com/api/events.json`
- `https://member.vetuonglai.com/api/routing.json`
- `https://vetuonglai.com/api/purchase-hub.json`

### Team 2 (UX/CTA/Route)

- `https://vetuonglai.com/api/team2-kickoff-output.json`

### Team 3 (Trust/Affiliate/Legal)

- `https://vetuonglai.com/api/policy/team3-matrix.json`
- `https://member.vetuonglai.com/api/team3-policy-matrix.json`

## 3) Compatibility rules (hard requirements)

- `purchase-hub.version` is the compatibility base contract.
- `team2-kickoff-output.contractVersion` must equal `purchase-hub.version`.
- `team3-policy-matrix.contractVersion` must equal `purchase-hub.version`.
- Hub/member `api/index.json` must expose `/api/contracts.json`.
- Hub/member `api/contracts.json` must share the same `contractVersion`.

## 4) Minimum guardrail rules to preserve

- Affiliate must be disabled for public and annual-only states.
- Annual access is base layer only, not specialist depth.
- Team 3 policy must keep anti-MLM, anti-multi-tier, anti-earnings-guarantee rules.
- VC trust routing requires proof anchors (`contentHash`) and controlled statuses.

## 5) Local verification commands

```bash
npm run build
npm run check
npm run cloudflare:smoke:endpoints
```

Notes:

- `build + check` validates static contract generation and schema compatibility.
- `cloudflare:smoke:endpoints` validates required production endpoints and JSON contracts on live domains.
