---
"@autional/ai-auth": minor
---

Initial release: BFF handler for Autional AI sites with two login modes.

- OAuth 2.0 Authorization Code + PKCE (S256), RS256 ID Token verification.
- Embedded passwordless login (`/api/auth/embed/*`): QR scan and 6-digit email
  code on the customer's own domain, no redirect and no password; the identity
  token stays in the BFF and the browser only gets the encrypted HttpOnly
  `__Host-ai-session` cookie.
- Consent-revocation checks (≤5 minutes) and Cloudflare Workers / Vercel Edge /
  Node adapters.
