/**
 * Demo 配置 — 打 example/react-autional.ts 模式
 *
 * 接入方式：
 *   1. npm install @autional/core @autional/react @autional/api-identity
 *   2. 复制 examples/react-autional.ts 到 src/autional.ts
 *   3. 改 appId 和 issuer
 *   4. 项目中永远 import from './autional'
 */
import { AutionalProvider, useAutional, useAutionalContext, RequireAuth } from '@autional/react';

export const autionalConfig = {
  appId: import.meta.env.VITE_AUTIONAL_APP_ID || 'demo-app',
  // issuer = Autional 服务器地址（OIDC Discovery 端点，非当前域名）
  issuer: import.meta.env.VITE_AUTIONAL_ISSUER || 'https://auth.iam.tianv.com',
  // apiUrl = API 调用基础路径（默认与 issuer 相同）
  apiUrl: import.meta.env.VITE_AUTIONAL_API_URL || undefined,
  syncTabs: false,
};

export { AutionalProvider, useAutional, useAutionalContext, RequireAuth };
