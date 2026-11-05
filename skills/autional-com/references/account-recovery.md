<!-- generated: core@36d05db9d969 · region: com · lang: en — do not edit directly -->

# Identifier and account recovery

> Reference file for the Autional Onboarding skill.
> Use it to pick an identifier strategy and a recovery path.
> Both answers are required before signup is considered complete.

## Identifier matrix

| Identifier | Friction | Recovery | Anti-abuse |
|---|---|---|---|
| username + password | lowest | recovery code / admin | CAPTCHA + rate limit |
| username + optional email | low | email hint / code / admin | CAPTCHA + rate limit |
| email + verification | medium | email reset | CAPTCHA + rate limit |
| phone + SMS | medium | SMS reset | SMS cost + rate limit |

## Recovery options

| Option | Works without email/phone | User loses it → | Notes |
|---|---|---|---|
| recovery code | yes | account unrecoverable | generate at signup, show once |
| optional email | yes (unverified) | no recovery | only a hint, not proof |
| admin reset | yes | requires operator | document the process |
| none | yes | account unrecoverable | must be recorded in AUTIONAL_SETUP.md |

## SSO users

SSO users have no local password. Recovery happens at the identity provider.
If a user has both password and SSO, define the linking rule before enabling both.

## Decision record

Copy this into `AUTIONAL_SETUP.md`:

```
Identifier: <username | email | phone>
Recovery: <code | email hint | admin | none>
If none: account is unrecoverable (accepted by <user> on <date>)
```
