import { describe, it, expect, vi } from 'vitest';
import { Discovery } from '../discovery';

const VALID_METADATA = {
  issuer: 'https://auth.example.com',
  authorization_endpoint: 'https://auth.example.com/oauth/authorize',
  token_endpoint: 'https://auth.example.com/oauth/token',
  userinfo_endpoint: 'https://auth.example.com/oauth/userinfo',
  jwks_uri: 'https://auth.example.com/oauth/jwks',
  end_session_endpoint: 'https://auth.example.com/oauth/logout',
  scopes_supported: ['openid', 'profile', 'email'],
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'refresh_token'],
};

class MockHttp {
  calls = 0;
  responses: Map<string, any> = new Map();

  request = async (url: string) => {
    this.calls++;
    const res = this.responses.get(url);
    if (!res) return new Response('{}', { status: 404 });
    return new Response(JSON.stringify(res), { status: res.__status || 200 });
  };
}

const ISSUER = 'https://auth.example.com';
const WELL_KNOWN_URL = `${ISSUER}/.well-known/openid-configuration`;

describe('Discovery', () => {
  it('should discover with valid OIDC metadata', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, VALID_METADATA);

    const discovery = new Discovery(mockHttp);
    const metadata = await discovery.discover(ISSUER);

    expect(metadata.issuer).toBe(VALID_METADATA.issuer);
    expect(metadata.authorization_endpoint).toBe(VALID_METADATA.authorization_endpoint);
    expect(metadata.token_endpoint).toBe(VALID_METADATA.token_endpoint);
    expect(metadata.jwks_uri).toBe(VALID_METADATA.jwks_uri);
    expect(metadata.end_session_endpoint).toBe(VALID_METADATA.end_session_endpoint);
  });

  it('should unwrap DataResponse-wrapped metadata', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, {
      code: 0,
      message: 'success',
      data: VALID_METADATA,
    });

    const discovery = new Discovery(mockHttp);
    const metadata = await discovery.discover(ISSUER);

    expect(metadata.issuer).toBe(VALID_METADATA.issuer);
    expect(metadata.token_endpoint).toBe(VALID_METADATA.token_endpoint);
    expect(metadata.jwks_uri).toBe(VALID_METADATA.jwks_uri);
  });

  it('should throw on HTTP error', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, { __status: 500 });

    const discovery = new Discovery(mockHttp);
    await expect(discovery.discover(ISSUER)).rejects.toThrow(
      'OIDC Discovery failed: HTTP 500',
    );
  });

  it('should throw when metadata is missing required fields', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, { issuer: 'https://foo' });

    const discovery = new Discovery(mockHttp);
    await expect(discovery.discover(ISSUER)).rejects.toThrow(
      'OIDC Discovery response missing required fields',
    );
  });

  it('should cache metadata — second discover() returns cached without HTTP request', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, VALID_METADATA);

    const discovery = new Discovery(mockHttp);

    const first = await discovery.discover(ISSUER);
    expect(first.issuer).toBe(VALID_METADATA.issuer);
    expect(mockHttp.calls).toBe(1);

    const second = await discovery.discover(ISSUER);
    expect(second.issuer).toBe(VALID_METADATA.issuer);
    expect(mockHttp.calls).toBe(1);
  });

  it('should return the end_session_endpoint from discovered metadata', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, VALID_METADATA);

    const discovery = new Discovery(mockHttp);
    await discovery.discover(ISSUER);

    expect(discovery.getEndSessionEndpoint()).toBe('https://auth.example.com/oauth/logout');
  });

  it('should return the jwks_uri from discovered metadata', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, VALID_METADATA);

    const discovery = new Discovery(mockHttp);
    await discovery.discover(ISSUER);

    expect(discovery.getJWKSUri()).toBe('https://auth.example.com/oauth/jwks');
  });

  it('should call discover only once when cached', async () => {
    const mockHttp = new MockHttp();
    mockHttp.responses.set(WELL_KNOWN_URL, VALID_METADATA);

    const discovery = new Discovery(mockHttp);

    await discovery.discover(ISSUER);
    await discovery.discover(ISSUER);
    await discovery.discover(ISSUER);

    expect(mockHttp.calls).toBe(1);
  });
});
