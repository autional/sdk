import type { HttpAdapter } from './platform/types';

interface OIDCDiscoveryMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  end_session_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  grant_types_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
  [key: string]: unknown;
}

export class Discovery {
  private http: HttpAdapter;
  private metadata: OIDCDiscoveryMetadata | null = null;
  private discoveryBaseUrl: string;

  /**
   * @param http HTTP adapter
   * @param discoveryBaseUrl discovery 请求使用的基础 URL（proxy 模式用 apiUrl，否则留空用 issuer）
   */
  constructor(http: HttpAdapter, discoveryBaseUrl?: string) {
    this.http = http;
    // 去掉 /bff 等 BFF 路径前缀，回到根路径访问 /.well-known
    this.discoveryBaseUrl = (discoveryBaseUrl || '')
      .replace(/\/bff\/?$/, '')
      .replace(/\/$/, '');
  }

  async discover(issuer: string): Promise<OIDCDiscoveryMetadata> {
    if (this.metadata) return this.metadata;

    // proxy 模式：使用 discoveryBaseUrl（同源），否则直连 issuer
    const base = this.discoveryBaseUrl || issuer.replace(/\/$/, '');
    const url = `${base}/.well-known/openid-configuration`;

    const response = await this.http.request(url);
    if (!response.ok) {
      throw new Error(`OIDC Discovery failed: HTTP ${response.status}`);
    }

    const json = await response.json() as Record<string, unknown>;

    const metadata = (json.data ?? json) as OIDCDiscoveryMetadata;

    if (!metadata.issuer || !metadata.authorization_endpoint || !metadata.token_endpoint) {
      throw new Error('OIDC Discovery response missing required fields (issuer, authorization_endpoint, token_endpoint)');
    }

    this.metadata = metadata;
    return metadata;
  }

  getAuthorizationEndpoint(): string | null {
    return this.metadata?.authorization_endpoint ?? null;
  }

  getTokenEndpoint(): string | null {
    return this.metadata?.token_endpoint ?? null;
  }

  getEndSessionEndpoint(): string | null {
    return this.metadata?.end_session_endpoint ?? null;
  }

  getJWKSUri(): string | null {
    return this.metadata?.jwks_uri ?? null;
  }

  getMetadata(): OIDCDiscoveryMetadata | null {
    return this.metadata;
  }
}
