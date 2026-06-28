import type { AuthmsPlugin, AuthMS } from '@authms/core';

export function passkeyPlugin(): AuthmsPlugin {
  return {
    name: '@authms/plugin-passkey',
    version: '0.1.0',
    install(_core: AuthMS) {},
  };
}
