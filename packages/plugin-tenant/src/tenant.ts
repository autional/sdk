import type { AuthmsPlugin, AuthMS } from '@authms/core';

export function tenantPlugin(): AuthmsPlugin {
  return {
    name: 'tenant-switcher',
    version: '0.1.0',
    install(_core: AuthMS) {},
  };
}
