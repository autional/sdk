/**
 * Autional React 接入模板
 * @version 0.1.1
 *
 * 使用方法:
 *   1. npm install @autional/react @autional/api-identity
 *   2. 复制此文件到 src/autional.ts
 *   3. 修改下方的 appId 和 issuer
 *   4. 在 main.tsx 中包裹 <AutionalProvider config={autionalConfig}>
 */

import { AutionalProvider, useAutional, RequireAuth } from '@autional/react';

export const autionalConfig = {
  appId: 'YOUR_APP_ID',                         // ← 在 Autional 控制台创建的应用 ID
  issuer: 'https://auth.example.com',          // ← Autional 服务器地址（不是你的网站域名）
};

export { AutionalProvider, useAutional, RequireAuth };

// 登出（RP-Initiated Logout）：const { logout } = useAutional(); await logout();
// SSO 会话由 SDK 整页跳转 end_session_endpoint 终结 OP 会话；identity 会话清本地。
// 只清本域的「登出」是半截登出——详见接入 skill §5.2c。
