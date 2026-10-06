import type { AutionalPlugin, Autional } from '@autional/core';

export function passkeyPlugin(): AutionalPlugin {
  return {
    name: '@autional/plugin-passkey',
    version: '0.1.0',
    install(_core: Autional) {},
  };
}
