import { type App, type InjectionKey, type Plugin } from 'vue';
import { AuthMS, browserPlatform, type AuthmsConfig as CoreConfig } from '@authms/core';

export interface VueAuthmsConfig {
  appId: string;
  issuer: string;
  apiUrl?: string;
  storagePrefix?: string;
  syncTabs?: boolean;
}

export const AUTHMS_KEY: InjectionKey<AuthMS> = Symbol('authms');

let _authms: AuthMS | null = null;

export function getAuthms(): AuthMS | null {
  return _authms;
}

export function createAuthms(config: VueAuthmsConfig): Plugin {
  const coreConfig: CoreConfig = {
    appId: config.appId,
    issuer: config.issuer,
    apiUrl: config.apiUrl,
    platform: browserPlatform,
    storagePrefix: config.storagePrefix,
    syncTabs: config.syncTabs,
  };

  const authms = new AuthMS(coreConfig);
  _authms = authms;

  return {
    install(app: App) {
      app.provide(AUTHMS_KEY, authms);

      authms.initialize().catch((err: unknown) => {
        console.error('[AuthMS Vue] Initialization failed:', err);
      });
    },
  };
}
