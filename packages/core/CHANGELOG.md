# @autional/core

## 0.3.1

### Patch Changes

- e20ad03: fix(core): align changePassword with server contract

  - Send `old_password` / `new_password` (was `current_password` / `password`; the server DTO rejects the old names with
    400).
  - Preprocess both passwords for transmission per the tenant's auth config, so hash-mode tenants can actually change
    passwords.
  - Fetch the auth config for the client's configured tenant instead of always the `default` config (wrong hash input
    for tenant-scoped hash mode).
  - `symmetric` / `asymmetric` transmission: the server change-password chain has no decrypt path, so those requests now
    fail with an explicit error (`61001670`) instead of silently storing an unrecoverable password.
