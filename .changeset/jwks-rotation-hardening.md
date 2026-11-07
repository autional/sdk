---
"@autional/node": minor
---

JWKS verification hardening (G4/G5/G18):

- Unknown `kid` now forces one JWKS refresh (60s per-config cooldown), then fails closed.
- `aud` is fail-closed: `audience` → issuer/origin → `appId`; empty allowlist rejects.
- `verify: 'jwks'` requires `type=access` and `iss`; cache keys are partitioned by config.
