import { Autional } from '@autional/core';
import type { AutionalConfig } from '@autional/core';
import { miniappPlatform } from './platform';
import type { MiniappConfig } from './types';

/**
 * 在微信小程序里创建 Autional 客户端。
 *
 * 说明（2026-10-30）：本包只负责**运行时装配**（存储/请求适配 + 全局挂载）。
 * 原先的 `loginWithWechat` / `getPhoneNumber` 调用 identity 的 `auth/wechat/*` 端点，
 * 而 identity 服务端从未实现这些端点（死链路，调用必 404/被网关兜底）——
 * 已随 0.4.0 移除。小程序端登录请走 Autional 标准方式（密码/验证码/社交 OAuth
 * 的 H5 跳转），服务端能力就绪后再以独立包提供微信专用流程。
 */
export function createAutional(config: MiniappConfig): Autional {
  const coreConfig: AutionalConfig = {
    appId: config.appId,
    issuer: config.authUrl,
    platform: miniappPlatform,
    storagePrefix: config.storagePrefix ?? 'autional_',
    syncTabs: false,
  };

  const autional = new Autional(coreConfig);

  const app = getApp({ allowDefault: true });
  if (!app.__autionalInitialized) {
    app.__autionalInitialized = true;
    autional.initialize().catch(() => {
      /* initialization is best-effort; autional is usable once token loads */
    });
  }

  app.globalData = app.globalData || {};
  app.globalData.autional = autional;

  return autional;
}
