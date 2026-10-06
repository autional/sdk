import type { AutionalPlugin, Autional } from '@autional/core';

export function tenantPlugin(): AutionalPlugin {
  return {
    name: 'tenant-switcher',
    version: '0.1.0',
    install(_core: Autional) {},
  };
}
