/**
 * AuthMS React 接入模板
 *
 * 使用方法:
 *   1. npm install @authms/react @authms/api-identity
 *   2. 复制此文件到 src/authms.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 main.tsx 中包裹 <AuthmsProvider config={authmsConfig}>
 */

import { AuthmsProvider, useAuthms, RequireAuth } from '@authms/react';

export const authmsConfig = {
  appId: 'YOUR_APP_ID',           // ← 改这里
  issuer: 'https://auth.example.com',  // ← 改这里
};

export { AuthmsProvider, useAuthms, RequireAuth };
