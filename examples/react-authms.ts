/**
 * AuthMS React 接入模板
 * @version 0.1.1
 *
 * 使用方法:
 *   1. npm install @authms/react @authms/api-identity
 *   2. 复制此文件到 src/authms.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 main.tsx 中包裹 <AuthmsProvider config={authmsConfig}>
 */

import { AuthmsProvider, useAuthms, RequireAuth } from '@authms/react';

export const authmsConfig = {
  appId: 'YOUR_APP_ID',                         // ← 在 AuthMS 控制台创建的应用 ID
  issuer: 'https://auth.iam.tianv.com',          // ← AuthMS 服务器地址（不是你的网站域名）
};

export { AuthmsProvider, useAuthms, RequireAuth };
