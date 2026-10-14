import { describe, it, expect } from 'vitest';
import { extractTenantSlugFromIssuer, buildPortalUrl } from '../portal';

describe('extractTenantSlugFromIssuer', () => {
  it('extracts a path-style slug', () => {
    expect(extractTenantSlugFromIssuer('https://api.autional.cn/acme')).toBe('acme');
    expect(extractTenantSlugFromIssuer('https://api.example.com/acme/portal')).toBe('acme');
  });

  it('extracts a subdomain-style slug', () => {
    expect(extractTenantSlugFromIssuer('https://acme.auth.tianv.com')).toBe('acme');
  });

  it('returns null for shared issuers on infra subdomains', () => {
    expect(extractTenantSlugFromIssuer('https://api.autional.cn')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://api.autional.cn/')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://auth.example.com')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://www.example.com')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://admin.tianv.com')).toBeNull();
  });

  it('ignores service path segments (bff/oauth/identity/... )', () => {
    expect(extractTenantSlugFromIssuer('https://api.example.com/bff/oauth')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://api.example.com/oauth')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://api.example.com/.well-known')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(extractTenantSlugFromIssuer('not-a-url')).toBeNull();
  });

  it('returns null for IP hosts (path-style still works for local dev)', () => {
    expect(extractTenantSlugFromIssuer('https://127.0.0.1')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://127.0.0.1:8080')).toBeNull();
    expect(extractTenantSlugFromIssuer('https://[::1]:3000')).toBeNull();
    expect(extractTenantSlugFromIssuer('http://localhost:3000/acme')).toBe('acme');
    expect(extractTenantSlugFromIssuer('http://127.0.0.1:3000/acme')).toBe('acme');
  });
});

describe('buildPortalUrl', () => {
  it('builds tenant-scoped portal URLs with the slug segment', () => {
    expect(buildPortalUrl('https://api.autional.cn', 'admin', 'acme')).toBe('https://admin.autional.cn/acme/');
    expect(buildPortalUrl('https://api.autional.cn', 'user', 'acme')).toBe('https://user.autional.cn/acme/');
    expect(buildPortalUrl('https://api.autional.cn', 'security', 'acme')).toBe('https://security.autional.cn/acme/');
    expect(buildPortalUrl('https://api.autional.cn', 'platform', 'acme')).toBe('https://platform.autional.cn/acme/');
    expect(buildPortalUrl('https://api.autional.cn', 'authenticator', 'acme')).toBe('https://authenticator.autional.cn/acme/');
    expect(buildPortalUrl('https://auth.tianv.com', 'user', 't1')).toBe('https://user.tianv.com/t1/');
  });

  it('falls back to the bare portal root when the slug is unknown', () => {
    expect(buildPortalUrl('https://api.autional.cn', 'admin', null)).toBe('https://admin.autional.cn/');
    expect(buildPortalUrl('https://api.autional.cn', 'user', '')).toBe('https://user.autional.cn/');
  });

  it('keeps developer/status as global sites (no slug segment)', () => {
    expect(buildPortalUrl('https://api.autional.cn', 'developer', 'acme')).toBe('https://developer.autional.cn/');
    expect(buildPortalUrl('https://api.autional.cn', 'status', 'acme')).toBe('https://status.autional.cn/');
  });

  it('preserves non-default ports', () => {
    expect(buildPortalUrl('https://api.example.com:8443', 'admin', 'x')).toBe('https://admin.example.com:8443/x/');
  });

  it('returns null when the root domain cannot be derived', () => {
    expect(buildPortalUrl('http://localhost:3000', 'admin', 'x')).toBeNull();
    expect(buildPortalUrl('not-a-url', 'admin', 'x')).toBeNull();
  });

  it('returns null for tenant-subdomain bases (no safe root to derive)', () => {
    expect(buildPortalUrl('https://acme.auth.tianv.com', 'admin', 'acme')).toBeNull();
  });

  it('returns null for IP hosts', () => {
    expect(buildPortalUrl('https://127.0.0.1:8080', 'admin', 'x')).toBeNull();
    expect(buildPortalUrl('https://[::1]:8080', 'admin', 'x')).toBeNull();
  });
});
