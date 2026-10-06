import type { Autional } from './autional';

export interface AutionalPlugin {
  name: string;
  version: string;
  install(core: Autional): void | Promise<void>;
  uninstall?(): void | Promise<void>;
}
