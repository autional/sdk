import type { HttpAdapter } from './platform/types';
import type { TokenManager } from './token-manager';
import { AuthmsError, AuthmsApiError, AuthmsAuthError, AuthmsNetworkError } from './errors';

interface ApiClientConfig {
  baseUrl: string;
  tokenManager: TokenManager;
  http: HttpAdapter;
  refreshTokenFn: () => Promise<void>;
  onForceLogout?: () => void;
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

function transformKeys(obj: unknown, transform: (k: string) => string): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(v => transformKeys(v, transform));
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    result[transform(k)] = transformKeys(v, transform);
  }
  return result;
}

function unwrapResponse(data: Record<string, unknown>): unknown {
  if ('data' in data && data.data !== undefined) {
    return data.data;
  }
  if ('items' in data) {
    return { items: data.items, total: data.total, pagination: data.pagination };
  }
  return data;
}

export class ApiClient {
  private baseUrl: string;
  private tokenManager: TokenManager;
  private http: HttpAdapter;
  private refreshTokenFn: () => Promise<void>;
  private onForceLogout?: () => void;
  private refreshPromise: Promise<void> | null = null;
  private redirectingToLogin = false;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.tokenManager = config.tokenManager;
    this.http = config.http;
    this.refreshTokenFn = config.refreshTokenFn;
    this.onForceLogout = config.onForceLogout;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params);
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(transformKeys(data, camelToSnake)) : undefined,
    });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.request<T>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(transformKeys(data, camelToSnake)) : undefined,
    });
  }

  async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params);
    return this.request<T>(url, { method: 'DELETE' });
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    let url = `${this.baseUrl}${path}`;
    if (params && Object.keys(params).length > 0) {
      const query = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          query.append(camelToSnake(k), String(v));
        }
      }
      url += '?' + query.toString();
    }
    return url;
  }

  private async request<T>(url: string, init: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> || {}),
    };

    const token = this.tokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const tenantId = this.tokenManager.getTenantId();
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    const requestInit: RequestInit = {
      ...init,
      headers,
    };

    let response: Response;
    try {
      response = await this.http.request(url, requestInit);
    } catch (err) {
      throw new AuthmsNetworkError(err instanceof Error ? err.message : 'Network request failed');
    }

    if (response.status === 401 && !url.includes('/api/v1/auth/login') && !url.includes('/api/v1/auth/refresh')) {
      return this.handle401<T>(url, requestInit);
    }

    return this.handleResponse<T>(response);
  }

  private async handle401<T>(url: string, requestInit: RequestInit): Promise<T> {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          await this.refreshTokenFn();
        } catch {
          this.tokenManager.clear();
          if (!this.redirectingToLogin) {
            this.redirectingToLogin = true;
            this.onForceLogout?.();
            throw new AuthmsAuthError('SESSION_EXPIRED', 'Session expired, please login again', 401);
          }
          throw new AuthmsAuthError('REFRESH_FAILED', 'Token refresh failed', 401);
        } finally {
          this.refreshPromise = null;
        }
      })();
    }

    await this.refreshPromise;

    const newToken = this.tokenManager.getAccessToken();
    if (newToken) {
      const headers = { ...(requestInit.headers as Record<string, string>) };
      headers['Authorization'] = `Bearer ${newToken}`;
      const response = await this.http.request(url, { ...requestInit, headers });
      return this.handleResponse<T>(response);
    }

    throw new AuthmsAuthError('NOT_AUTHENTICATED', 'Not authenticated', 401);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as unknown as T;
    }

    const json: Record<string, unknown> = await response.json();

    if (json && typeof json === 'object' && 'code' in json) {
      const code = String(json.code);
      if (json.code !== 0) {
        throw new AuthmsApiError(
          code,
          (json.message as string) || 'API error',
          response.status,
        );
      }
      return transformKeys(unwrapResponse(json), snakeToCamel) as T;
    }

    return json as T;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    try {
      const json = await response.json() as Record<string, unknown>;
      const code = String(json.code ?? response.status);
      const message = (json.message as string) || `HTTP ${response.status}`;
      throw new AuthmsApiError(code, message, response.status);
    } catch (e) {
      if (e instanceof AuthmsError) throw e;
      throw new AuthmsNetworkError(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}
