import type { AutionalPlugin } from '@autional/core';
import type { Autional } from '@autional/core';

export function mfaPlugin(): AutionalPlugin {
  return {
    name: '@autional/plugin-mfa',
    version: '0.1.0',
    install(_core: Autional) {},
  };
}
