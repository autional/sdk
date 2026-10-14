import type { HttpAdapter } from './platform/types';
import type { TokenManager } from './token-manager';
import { AutionalError, AutionalApiError, AutionalAuthError, AutionalNetworkError } from './errors';

interface ApiClientConfig {
  baseUrl: string;
  tokenManager: TokenManager;
  http: HttpAdapter;
  refreshTokenFn: () => Promise<void>;
  onForceLogout?: () => void;
  /** 请求前预刷新提前量（ms；0 = 禁用）。剩余寿命 ≤ 该值时先刷新再发请求。 */
  refreshSkewMs?: number;
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
  private maxRetries = 3;
  private baseDelay = 1000;
  private refreshSkewMs: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.tokenManager = config.tokenManager;
    this.http = config.http;
    this.refreshTokenFn = config.refreshTokenFn;
    this.onForceLogout = config.onForceLogout;
    this.refreshSkewMs = config.refreshSkewMs ?? 0;
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
    // 预刷新：剩余寿命 ≤ skew 时先刷新再发请求（并发请求共享同一 refreshPromise）。
    // 失败不在此处理（不清会话、不注销）—— 请求照发，由 401 路径按既有语义兜底。
    if (this.refreshSkewMs > 0 && this.tokenManager.needsRefresh(this.refreshSkewMs)) {
      await this.startRefresh().catch(() => { /* 留给 401 路径 */ });
    }

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
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        response = await this.http.request(url, requestInit);
      } catch (err) {
        lastError = err as Error;
        if (attempt < this.maxRetries) {
          await new Promise(r => setTimeout(r, this.baseDelay * Math.pow(2, attempt)));
          continue;
        }
        throw new AutionalNetworkError(lastError.message || 'Network request failed after retries');
      }

      // 5xx 重试, 4xx 不重试
      if (response.status >= 500 && attempt < this.maxRetries) {
        lastError = new Error(`HTTP ${response.status}`);
        await new Promise(r => setTimeout(r, this.baseDelay * Math.pow(2, attempt)));
        continue;
      }

      if (response.status === 401 && !url.includes('/api/v1/auth/login') && !url.includes('/api/v1/auth/refresh')) {
        return this.handle401<T>(url, requestInit);
      }

      return this.handleResponse<T>(response);
    }

    throw lastError
      ? new AutionalNetworkError(lastError.message)
      : new AutionalNetworkError('Request failed');
  }

  /**
   * 刷新会话（401 路径与请求前预刷新路径的唯一刷新入口，并发共享在飞 promise）。
   * 只负责去重：失败语义由调用方决定 —— 预刷新路径吞错保会话；
   * 401 路径在 handle401 中执行清会话 + 强制登出（无论 promise 由谁创建）。
   */
  private startRefresh(): Promise<void> {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          await this.refreshTokenFn();
        } finally {
          this.refreshPromise = null;
        }
      })();
    }

    return this.refreshPromise;
  }

  private async handle401<T>(url: string, requestInit: RequestInit): Promise<T> {
    try {
      await this.startRefresh();
    } catch {
      this.tokenManager.clear();
      if (!this.redirectingToLogin) {
        this.redirectingToLogin = true;
        this.onForceLogout?.();
        throw new AutionalAuthError('SESSION_EXPIRED', 'Session expired, please login again', 401);
      }
      throw new AutionalAuthError('REFRESH_FAILED', 'Token refresh failed', 401);
    }

    const newToken = this.tokenManager.getAccessToken();
    if (newToken) {
      const headers = { ...(requestInit.headers as Record<string, string>) };
      headers['Authorization'] = `Bearer ${newToken}`;
      const response = await this.http.request(url, { ...requestInit, headers });
      return this.handleResponse<T>(response);
    }

    throw new AutionalAuthError('NOT_AUTHENTICATED', 'Not authenticated', 401);
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
        throw new AutionalApiError(
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
      throw new AutionalApiError(code, message, response.status);
    } catch (e) {
      if (e instanceof AutionalError) throw e;
      throw new AutionalNetworkError(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}
