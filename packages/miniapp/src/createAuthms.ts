import { AuthMS } from '@authms/core';
import type { AuthmsConfig } from '@authms/core';
import type { AuthResult } from '@authms/core';
import { miniappPlatform } from './platform';
import type { MiniappConfig, WechatPhoneEvent } from './types';

export interface AuthmsWithWechat extends AuthMS {
  loginWithWechat(): Promise<AuthResult>;
  getPhoneNumber(e: WechatPhoneEvent): Promise<string>;
}

export function createAuthms(config: MiniappConfig): AuthmsWithWechat {
  const coreConfig: AuthmsConfig = {
    appId: config.appId,
    issuer: config.authUrl,
    platform: miniappPlatform,
    storagePrefix: config.storagePrefix ?? 'authms_',
    syncTabs: false,
  };

  const authms = new AuthMS(coreConfig) as AuthmsWithWechat;

  authms.loginWithWechat = async function (): Promise<AuthResult> {
    const loginRes: { code?: string; errMsg?: string } = await new Promise(
      (resolve, reject) => {
        wx.login({
          success(res: { code: string; errMsg: string }) {
            resolve(res);
          },
          fail(err: { errMsg: string }) {
            reject(new Error(err?.errMsg || 'wx.login failed'));
          },
        });
      },
    );

    if (!loginRes.code) {
      throw new Error(loginRes.errMsg || 'wx.login did not return a code');
    }

    const response = await coreConfig.platform.http.request(
      `${config.authUrl}/identity/api/v1/auth/wechat/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: loginRes.code, app_id: config.appId }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as any)?.message || `WeChat login failed (${response.status})`,
      );
    }

    const json = (await response.json()) as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;

    const result: AuthResult = {
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
      expiresIn: (data.expires_in as number) || 900,
      tokenType: (data.token_type as string) || 'Bearer',
      user: (data.user as AuthResult['user']) || {
        id: (data.user_id as string) || '',
      },
    };

    authms.tokenManager.setTokens(result.accessToken, result.refreshToken, result.expiresIn);
    authms.tokenManager.setUser(result.user as unknown as Record<string, unknown>);
    authms.tokenManager.persist();

    (authms as any)._userCache = result.user;
    authms.emit('USER_CHANGED');
    authms.emit('TOKEN_CHANGED');

    return result;
  };

  authms.getPhoneNumber = async function (e: WechatPhoneEvent): Promise<string> {
    if (!e?.detail?.errMsg || e.detail.errMsg !== 'getPhoneNumber:ok') {
      throw new Error('getPhoneNumber authorization denied');
    }

    if (e.detail.code) {
      const response = await coreConfig.platform.http.request(
        `${config.authUrl}/identity/api/v1/auth/wechat/phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authms.tokenManager.getAccessToken()}`,
          },
          body: JSON.stringify({ code: e.detail.code }),
        },
      );

      if (!response.ok) {
        throw new Error(`Phone number exchange failed (${response.status})`);
      }

      const json = (await response.json()) as Record<string, unknown>;
      const data = (json.data ?? json) as Record<string, unknown>;
      return (data.phone_number as string) || (data.phone as string) || '';
    }

    if (e.detail.encryptedData && e.detail.iv) {
      const response = await coreConfig.platform.http.request(
        `${config.authUrl}/identity/api/v1/auth/wechat/phone/decrypt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authms.tokenManager.getAccessToken()}`,
          },
          body: JSON.stringify({
            encrypted_data: e.detail.encryptedData,
            iv: e.detail.iv,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Phone decrypt failed (${response.status})`);
      }

      const json = (await response.json()) as Record<string, unknown>;
      const data = (json.data ?? json) as Record<string, unknown>;
      return (data.phone_number as string) || (data.phone as string) || '';
    }

    throw new Error('No phone number data received');
  };

  const app = getApp({ allowDefault: true });
  if (!app.__authmsInitialized) {
    app.__authmsInitialized = true;
    authms.initialize().catch(() => {
      /* initialization is best-effort; authms is usable once token loads */
    });
  }

  app.globalData = app.globalData || {};
  app.globalData.authms = authms;

  return authms;
}
