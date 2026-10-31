/**
 * OAuth client guard (skill 5.2b step 4 / fix plan L1-3).
 *
 * Why: a tenant's *portal* client (`Default Client for <slug>`, `kind=portal`) only
 * whitelists the platform portal hosts. Using it as a third-party app's `appId`
 * passes every build check and then fails on the first real login with
 * `invalid_request: redirect_uri not registered for this client`.
 *
 * This guard rejects that client id *before* any file is written, and offers a
 * machine-checkable probe (`--check-client`) that CI/agents can assert on.
 */

export interface OAuthClientInfo {
  client_name?: string;
  kind?: string;
}

export type ClientProbe =
  | { status: 'found'; info: OAuthClientInfo }
  | { status: 'not-found' }
  | { status: 'unreachable'; detail: string };

export type GuardVerdict =
  | { status: 'ok'; info: OAuthClientInfo }
  | { status: 'portal'; info: OAuthClientInfo }
  | { status: 'not-found' }
  | { status: 'unverified'; detail: string };

const PORTAL_NAME_PREFIX = 'Default Client for';

/**
 * `kind=portal` is authoritative; the name prefix is a fallback for servers that
 * predate the `kind` field (L2-3) or for legacy rows.
 */
export function isPortalClient(info: OAuthClientInfo | null | undefined): boolean {
  if (!info) return false;
  if ((info.kind ?? '').trim().toLowerCase() === 'portal') return true;
  return (info.client_name ?? '').trim().startsWith(PORTAL_NAME_PREFIX);
}

export function clientInfoUrl(issuer: string, appId: string): string {
  const base = issuer.replace(/\/+$/, '');
  return `${base}/oauth/api/v1/oauth/client/${encodeURIComponent(appId)}`;
}

/** Public, non-sensitive client metadata (name / kind). Never returns secrets. */
export async function probeClient(
  issuer: string,
  appId: string,
  timeoutMs = 8000,
): Promise<ClientProbe> {
  try {
    const res = await fetch(clientInfoUrl(issuer, appId), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 404) return { status: 'not-found' };
    if (!res.ok) return { status: 'unreachable', detail: `HTTP ${res.status}` };
    const body = (await res.json()) as { data?: OAuthClientInfo };
    return { status: 'found', info: body.data ?? {} };
  } catch (err) {
    return { status: 'unreachable', detail: err instanceof Error ? err.message : String(err) };
  }
}

export async function checkOAuthClient(issuer: string, appId: string): Promise<GuardVerdict> {
  const probe = await probeClient(issuer, appId);
  if (probe.status === 'not-found') return { status: 'not-found' };
  if (probe.status === 'unreachable') return { status: 'unverified', detail: probe.detail };
  if (isPortalClient(probe.info)) return { status: 'portal', info: probe.info };
  return { status: 'ok', info: probe.info };
}

/** Human-readable one-liner for CLI output. */
export function describeVerdict(appId: string, verdict: GuardVerdict): string {
  switch (verdict.status) {
    case 'ok':
      return `OAuth client OK: ${appId}${verdict.info.client_name ? ` (${verdict.info.client_name})` : ''}`;
    case 'portal': {
      const name = verdict.info.client_name ?? 'Default Client for …';
      const why = verdict.info.kind ? `kind=${verdict.info.kind}` : 'name matches the portal-client pattern';
      return [
        `Refusing appId ${appId}: this is the tenant PORTAL client (${name}, ${why}).`,
        'Its redirect_uris only cover the platform portal hosts, so your app login would fail with',
        '"invalid_request: redirect_uri not registered".',
        'Register a dedicated app client (admin console → OAuth clients), then use ITS client_id as appId.',
      ].join('\n');
    }
    case 'not-found':
      return `OAuth client ${appId} not found on this issuer. Check the client_id (or the --region flag).`;
    case 'unverified':
      return `Could not verify OAuth client ${appId} (${verdict.detail}). Continuing WITHOUT verification — confirm manually that it is your app client, not the portal client.`;
  }
}
