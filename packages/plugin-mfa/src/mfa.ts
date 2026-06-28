import type { AuthmsPlugin } from '@authms/core';
import type { AuthMS } from '@authms/core';

export function mfaPlugin(): AuthmsPlugin {
  return {
    name: '@authms/plugin-mfa',
    version: '0.1.0',
    install(_core: AuthMS) {},
  };
}
