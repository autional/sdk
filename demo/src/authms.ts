/**
 * Demo 配置 — 打 example/react-authms.ts 模式
 *
 * 接入方式：
 *   1. npm install @authms/core @authms/react @authms/api-identity
 *   2. 复制 examples/react-authms.ts 到 src/authms.ts
 *   3. 改 appId 和 issuer
 *   4. 项目中永远 import from './authms'
 */
import { AuthmsProvider, useAuthms, RequireAuth } from '@authms/react';

export const authmsConfig = {
  appId: import.meta.env.VITE_AUTHMS_APP_ID || 'demo-app',
  // issuer = AuthMS 服务器地址（OIDC Discovery 端点，非当前域名）
  issuer: import.meta.env.VITE_AUTHMS_ISSUER || 'https://auth.iam.tianv.com',
  // apiUrl = API 调用基础路径（默认与 issuer 相同）
  apiUrl: import.meta.env.VITE_AUTHMS_API_URL || undefined,
  syncTabs: false,
};

export { AuthmsProvider, useAuthms, RequireAuth };
