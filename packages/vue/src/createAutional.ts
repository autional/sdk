import { type App, type InjectionKey, type Plugin } from 'vue';
import { Autional, browserPlatform, type AutionalConfig as CoreConfig } from '@autional/core';

export interface VueAutionalConfig {
  appId: string;
  issuer: string;
  apiUrl?: string;
  storagePrefix?: string;
  syncTabs?: boolean;
}

export const AUTIONAL_KEY: InjectionKey<Autional> = Symbol('autional');

let _autional: Autional | null = null;

export function getAutional(): Autional | null {
  return _autional;
}

export function createAutional(config: VueAutionalConfig): Plugin {
  const coreConfig: CoreConfig = {
    appId: config.appId,
    issuer: config.issuer,
    apiUrl: config.apiUrl,
    platform: browserPlatform,
    storagePrefix: config.storagePrefix,
    syncTabs: config.syncTabs,
  };

  const autional = new Autional(coreConfig);
  _autional = autional;

  return {
    install(app: App) {
      app.provide(AUTIONAL_KEY, autional);

      autional.initialize().catch((err: unknown) => {
        console.error('[Autional Vue] Initialization failed:', err);
      });
    },
  };
}
