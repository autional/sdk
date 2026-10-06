/**
 * Autional Next.js 接入模板
 * @version 0.1.1
 *
 * 使用方法:
 *   1. npm install @autional/next @autional/api-identity
 *   2. 复制此文件到 src/autional.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 app/layout.tsx 中包裹 <AutionalProvider config={autionalConfig}>
 *   5. 创建 middleware.ts 使用 autionalMiddleware
 */

import { AutionalProvider, useAutional } from '@autional/next';
import { autionalMiddleware } from '@autional/next';

export const autionalConfig = {
  appId: 'YOUR_APP_ID',                    // ← 在 Autional 控制台创建的应用 ID
  issuer: 'https://auth.iam.tianv.com',      // ← Autional 服务器地址（你的认证域名）
};

export { AutionalProvider, useAutional, autionalMiddleware };
