/**
 * AuthMS Next.js 接入模板
 *
 * 使用方法:
 *   1. npm install @authms/next @authms/api-identity
 *   2. 复制此文件到 src/authms.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 app/layout.tsx 中包裹 <AuthmsProvider config={authmsConfig}>
 *   5. 创建 middleware.ts 使用 authmsMiddleware
 */

import { AuthmsProvider, useAuthms } from '@authms/next';
import { authmsMiddleware } from '@authms/next';

export const authmsConfig = {
  appId: 'YOUR_APP_ID',                    // ← 在 AuthMS 控制台创建的应用 ID
  issuer: 'https://auth.example.com',      // ← AuthMS 服务器地址（你的认证域名）
};

export { AuthmsProvider, useAuthms, authmsMiddleware };
