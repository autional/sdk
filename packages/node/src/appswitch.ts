/**
 * App-switch helper: build a top-level `prompt=none` authorize URL.
 *
 * Use the `authorization_endpoint` from OIDC discovery (do not hardcode a host;
 * the live deployment uses auth.<root> while the API uses api.<root>).
 *
 * This is intentionally a URL builder, not a browser flow: the caller decides
 * whether to use a top-level navigation (recommended across sites) or a
 * same-site BFF redirect. Never rely on third-party cookies.
 */
export interface SilentAuthorizeOptions {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  /** Defaults to ['openid', 'read']. */
  scopes?: string[];
  state?: string;
  /** Extra authorize params (e.g. login_hint, acr_values). */
  extraParams?: Record<string, string>;
}

export function buildSilentAuthorizeUrl(options: SilentAuthorizeOptions): string {
  const url = new URL(options.authorizationEndpoint);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', options.clientId);
  url.searchParams.set('redirect_uri', options.redirectUri);
  url.searchParams.set('scope', (options.scopes ?? ['openid', 'read']).join(' '));
  url.searchParams.set('prompt', 'none');
  if (options.state) {
    url.searchParams.set('state', options.state);
  }
  for (const [key, value] of Object.entries(options.extraParams ?? {})) {
    if (key && value) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
