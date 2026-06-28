import type { AuthmsPlatform } from './platform/types';
import type { TokenManager } from './token-manager';
import type {
  AuthResult, LoginRequest, RegisterRequest, OAuthOptions,
  TenantAuthConfig, PasswordPolicyConfig,
} from './types';
import { AuthmsAuthError, AuthmsNetworkError } from './errors';
import { processPasswordForTransmission } from './crypto/password-transmission';
import { solveProofOfWork } from './crypto/pow-solver';
import type { KeyExchangeFn } from './crypto/password-transmission';

interface AuthClientConfig {
  tokenManager: TokenManager;
  http: AuthmsPlatform['http'];
  baseUrl: string;
  keyExchangeFn?: KeyExchangeFn;
}

const MAX_CAPTCHA_RETRIES = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

export class AuthClient {
  private tokenManager: TokenManager;
  private http: AuthmsPlatform['http'];
  private baseUrl: string;
  private keyExchangeFn?: KeyExchangeFn;
  private configCache: Map<string, { data: TenantAuthConfig; at: number }> = new Map();

  constructor(config: AuthClientConfig) {
    this.tokenManager = config.tokenManager;
    this.http = config.http;
    this.baseUrl = config.baseUrl;
    this.keyExchangeFn = config.keyExchangeFn;
  }

  async fetchAuthConfig(tenantId?: string): Promise<TenantAuthConfig> {
    const key = tenantId || '__default__';
    const cached = this.configCache.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return cached.data;
    }

    const path = tenantId
      ? `/identity/api/v1/public/auth-config/${tenantId}`
      : '/identity/api/v1/public/auth-config/default';

    const response = await this.http.request(`${this.baseUrl}${path}`);
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    const pp = (data.password_policy ?? {}) as Record<string, unknown>;

    const config: TenantAuthConfig = {
      tenantId: (data.tenant_id as string) || '',
      tenantName: (data.tenant_name as string) || '',
      displayName: (data.display_name as string) || '',
      membershipApproval: (data.membership_approval as string) || 'open',
      loginMethods: (data.login_methods as string[]) || [],
      oauthProviders: (data.oauth_providers as string[]) || [],
      passwordPolicy: {
        mode: (pp.password_transmission as string) || (data.password_transmission as string) || 'plain',
        minLength: (pp.min_length as number) || 8,
        maxLength: (pp.max_length as number) || 128,
        requireUpper: (pp.require_upper as boolean) || false,
        requireLower: (pp.require_lower as boolean) || false,
        requireDigit: (pp.require_digit as boolean) || false,
        requireSpecial: (pp.require_special as boolean) || false,
        tenantId: data.tenant_id as string || '',
        publicKey: data.transmission_public_key as string || '',
      },
      captchaEnabled: (data.captcha_enabled as boolean) || false,
      captchaProvider: (data.captcha_provider as string) || 'pow',
      silentChallengeEnabled: (data.silent_challenge_enabled as boolean) || false,
      transmissionPublicKey: (data.transmission_public_key as string) || '',
      oauthClientId: (data.oauth_client_id as string) || '',
      passkeyEnabled: (data.passkey_enabled as boolean) || false,
      magicLinkEnabled: (data.magic_link_enabled as boolean) || false,
      branding: (data.branding ?? null) as TenantAuthConfig['branding'],
    };

    this.configCache.set(key, { data: config, at: Date.now() });
    return config;
  }

  clearConfigCache(): void {
    this.configCache.clear();
  }

  async login(credentials: LoginRequest): Promise<AuthResult> {
    const authConfig = await this.fetchAuthConfig(credentials.tenantId);
    let captchaRetries = 0;

    while (true) {
      const body = await this.buildLoginBody(credentials, authConfig);

      if (!body['captcha_token'] && authConfig.silentChallengeEnabled && authConfig.captchaProvider === 'pow') {
        try {
          const token = await this.solveCaptchaChallenge();
          body['captcha_token'] = token;
          body['captcha_provider'] = 'pow';
        } catch {
          // PoW solver failed — proceed without
        }
      }

      const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
        const code = String(errJson.code ?? '');
        if (code.includes('captcha') && captchaRetries < MAX_CAPTCHA_RETRIES) {
          captchaRetries++;
          continue;
        }
        throw new AuthmsAuthError(code, (errJson.message as string) || `Login failed`, 401);
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
        throw new AuthmsAuthError(
          String(errJson.code ?? response.status),
          (errJson.message as string) || `Login failed`,
          response.status,
        );
      }

      const json = await response.json() as Record<string, unknown>;
      return this.handleAuthResponse(json);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResult> {
    const authConfig = await this.fetchAuthConfig(data.tenantId);

    const processed = await processPasswordForTransmission(
      data.password,
      {
        mode: authConfig.passwordPolicy.mode,
        tenantId: authConfig.tenantId || data.tenantId || '',
        requireUpper: false,
        minLength: 0,
        publicKey: authConfig.transmissionPublicKey || '',
      },
      this.keyExchangeFn,
    );

    const body: Record<string, unknown> = {
      ...data as unknown as Record<string, unknown>,
      password: processed.password,
      password_transmission: processed.passwordTransmission,
    };
    if (processed.keyExchangeId) body.key_exchange_id = processed.keyExchangeId;
    if (processed.clientPubKey) body.client_pub_key = processed.clientPubKey;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AuthmsAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || `Registration failed`,
        response.status,
      );
    }

    const json = await response.json() as Record<string, unknown>;
    const payload = (json.data ?? json) as Record<string, unknown>;

    if (payload.access_token) {
      const result = this.handleAuthResponse(json);
      return result;
    }

    return { user: payload as any, accessToken: '', refreshToken: '', expiresIn: 0, tokenType: '' };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const authConfig = await this.fetchAuthConfig();

    const processed = await processPasswordForTransmission(
      newPassword,
      {
        mode: authConfig.passwordPolicy.mode,
        tenantId: authConfig.tenantId,
        requireUpper: false,
        minLength: 0,
        publicKey: authConfig.transmissionPublicKey || '',
      },
      this.keyExchangeFn,
    );

    const body: Record<string, unknown> = {
      current_password: currentPassword,
      password: processed.password,
      password_transmission: processed.passwordTransmission,
    };
    if (processed.keyExchangeId) body.key_exchange_id = processed.keyExchangeId;
    if (processed.clientPubKey) body.client_pub_key = processed.clientPubKey;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AuthmsAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || `Password change failed`,
        response.status,
      );
    }
  }

  async loginWithOAuth(options: OAuthOptions): Promise<void> {
    const redirectUri = options.redirectUri || (typeof window !== 'undefined' ? window.location.origin + '/oauth/callback' : '');
    const params = new URLSearchParams({ provider: options.provider, redirect_uri: redirectUri });
    if (typeof window !== 'undefined') {
      window.location.href = `${this.baseUrl}/oauth/api/v1/oauth/${options.provider}/authorize?${params.toString()}`;
    } else {
      throw new AuthmsAuthError('NOT_BROWSER', 'OAuth login requires a browser environment', 400);
    }
  }

  async handleOAuthCallback(url: string): Promise<AuthResult> {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const state = urlObj.searchParams.get('state');
    if (!code) throw new AuthmsAuthError('OAUTH_FAILED', 'No authorization code in callback URL', 400);

    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code', code, state: state ?? '',
        redirect_uri: typeof window !== 'undefined' ? window.location.origin + '/oauth/callback' : '',
      }).toString(),
    });

    if (!response.ok) throw new AuthmsNetworkError(`OAuth token exchange failed (${response.status})`);
    const json = await response.json() as Record<string, unknown>;
    return this.handleAuthResponse(json);
  }

  async refreshToken(): Promise<void> {
    const refreshToken = this.tokenManager.getRefreshToken();
    if (!refreshToken) throw new AuthmsAuthError('NO_REFRESH_TOKEN', 'No refresh token available', 401);

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      const code = String(errJson.code ?? '');
      if (code.startsWith('400002')) {
        this.tokenManager.clear();
        this.tokenManager.persist();
        throw new AuthmsAuthError('TOKEN_REUSE', 'Refresh token reused — all sessions revoked', 401);
      }
      this.tokenManager.clear();
      this.tokenManager.persist();
      throw new AuthmsAuthError('REFRESH_FAILED', 'Token refresh failed', 401);
    }

    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    this.tokenManager.setTokens(
      data.access_token as string,
      (data.refresh_token as string) || refreshToken,
      (data.expires_in as number) || 900,
    );
    if (data.user) this.tokenManager.setUser(data.user as Record<string, unknown>);
    this.tokenManager.persist();
  }

  async logout(): Promise<void> {
    const accessToken = this.tokenManager.getAccessToken();
    const refreshToken = this.tokenManager.getRefreshToken();
    this.tokenManager.clear();
    this.tokenManager.persist();
    if (accessToken) {
      this.http.request(`${this.baseUrl}/identity/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    if (typeof window !== 'undefined') window.localStorage.removeItem('authms_auth_tokens');
  }

  async getProfile(): Promise<Record<string, unknown> | null> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.tokenManager.getAccessToken()}` },
    });
    if (response.status === 401) return null;
    if (!response.ok) return null;
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    this.tokenManager.setUser(data);
    return data;
  }

  private async buildLoginBody(credentials: LoginRequest, authConfig: TenantAuthConfig): Promise<Record<string, unknown>> {
    const processed = await processPasswordForTransmission(
      credentials.password,
      {
        mode: authConfig.passwordPolicy.mode,
        tenantId: authConfig.tenantId || credentials.tenantId || '',
        requireUpper: false,
        minLength: 0,
        publicKey: authConfig.transmissionPublicKey || '',
      },
      this.keyExchangeFn,
    );

    const body: Record<string, unknown> = {
      identity: credentials.email || credentials.phone || credentials.username || '',
      password: processed.password,
      password_transmission: processed.passwordTransmission,
    };
    if (credentials.tenantId) body['tenant_id'] = credentials.tenantId;
    if (processed.keyExchangeId) body['key_exchange_id'] = processed.keyExchangeId;
    if (processed.clientPubKey) body['client_pub_key'] = processed.clientPubKey;
    if (credentials.captchaToken) body['captcha_token'] = credentials.captchaToken;
    if (credentials.captchaProvider) body['captcha_provider'] = credentials.captchaProvider;
    if (credentials.captchaChallengeId) body['captcha_challenge_id'] = credentials.captchaChallengeId;
    return body;
  }

  private async solveCaptchaChallenge(): Promise<string> {
    const challengeResp = await this.http.request(
      `${this.baseUrl}/identity/api/v1/auth/captcha/challenge?provider=pow&difficulty=4`,
    );
    const cJson = await challengeResp.json() as Record<string, unknown>;
    const cData = (cJson.data ?? cJson) as Record<string, unknown>;
    const cd = (cData.data ?? cData) as Record<string, unknown> ?? cData;
    const powChallenge = String(cd.challenge ?? cd['challenge'] ?? '');
    const difficulty = Number(cd.difficulty ?? cd['difficulty'] ?? 4);
    return solveProofOfWork(powChallenge, difficulty);
  }

  private handleAuthResponse(json: Record<string, unknown>): AuthResult {
    const data = (json.data ?? json) as Record<string, unknown>;
    const result: AuthResult = {
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
      expiresIn: (data.expires_in as number) || 900,
      tokenType: (data.token_type as string) || 'Bearer',
      user: (data.user as AuthResult['user']) || { id: data.user_id as string || '' },
    };
    this.tokenManager.setTokens(result.accessToken, result.refreshToken, result.expiresIn);
    this.tokenManager.setUser(result.user as Record<string, unknown>);
    this.tokenManager.persist();
    return result;
  }
}
