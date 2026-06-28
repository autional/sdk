/**
 * AuthMS Vue 接入模板
 *
 * 使用方法:
 *   1. npm install @authms/vue @authms/api-identity
 *   2. 复制此文件到 src/authms.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 main.ts 中 app.use(authmsPlugin)
 */

import { createAuthms, useAuthms, authmsGuard } from '@authms/vue';

export const authmsConfig = {
  appId: 'YOUR_APP_ID',           // ← 改这里
  issuer: 'https://auth.example.com',  // ← 改这里
};

export const authmsPlugin = createAuthms(authmsConfig);

export { useAuthms, authmsGuard };
