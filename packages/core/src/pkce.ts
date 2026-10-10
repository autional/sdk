/**
 * PKCE (RFC 7636) 与 SSO 授权跳转工具。
 *
 * Autional 作 IdP 的浏览器登录流程：
 *   loginWithOAuth → 生成 verifier/challenge + state → 存 sessionStorage
 *   → 整页跳转 auth 域 /oauth/api/v1/oauth/authorize
 *   → 应用回调页 handleOAuthCallback：校验 state → 用 verifier 换票
 *
 * verifier/state 只存 sessionStorage（标签页级），回调后立即清除。
 */

export interface PkceChallenge {
  verifier: string;
  challenge: string;
  method: 'S256';
}

export interface PkceSession {
  verifier: string;
  state: string;
  redirectUri: string;
  clientId: string;
}

const PKCE_STORAGE_KEY = 'autional_pkce';
const VERIFIER_BYTES = 32;
const STATE_BYTES = 16;

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/** 生成 PKCE code_verifier 与 S256 challenge */
export async function generatePkce(): Promise<PkceChallenge> {
  const verifier = base64UrlEncode(randomBytes(VERIFIER_BYTES));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: base64UrlEncode(new Uint8Array(digest)), method: 'S256' };
}

/** 生成 OAuth state（防 CSRF） */
export function generateState(): string {
  return base64UrlEncode(randomBytes(STATE_BYTES));
}

export function savePkceSession(session: PkceSession): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // 隐私模式等存储不可用 — 回调时会以 OAUTH_SESSION_LOST 明确报错
  }
}

export function loadPkceSession(): PkceSession | null {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(PKCE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PkceSession;
    if (!parsed.verifier || !parsed.state || !parsed.clientId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPkceSession(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(PKCE_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * 从 API 基址推导 SSO 授权入口：api.<root> ↔ auth.<root>。
 * 非 api. 开头的主机（如本地 localhost 隧道）返回同源地址。
 */
export function resolveSsoAuthorizeUrl(apiUrl: string): string {
  const url = new URL(apiUrl);
  let hostname = url.hostname;
  if (hostname.startsWith('api.')) {
    hostname = `auth.${hostname.slice(4)}`;
  }
  const port = url.port ? `:${url.port}` : '';
  return `${url.protocol}//${hostname}${port}/oauth/api/v1/oauth/authorize`;
}

export function buildAuthorizeUrl(authorizeUrl: string, params: Record<string, string>): string {
  const search = new URLSearchParams(params).toString();
  return search ? `${authorizeUrl}?${search}` : authorizeUrl;
}
