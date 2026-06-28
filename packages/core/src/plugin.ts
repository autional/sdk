import type { AuthMS } from './authms';

export interface AuthmsPlugin {
  name: string;
  version: string;
  install(core: AuthMS): void | Promise<void>;
  uninstall?(): void | Promise<void>;
}
