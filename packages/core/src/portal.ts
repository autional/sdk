/**
 * 租户 slug 与门户 URL 工具。
 *
 * 控制台门户（admin/user/security/platform/authenticator）按 /<tenant-slug>/... 路由；
 * developer/status 为全局站（无需 slug）。裸根访问会落到品牌选择页（"找租户"），
 * 带 slug 才能直达本租户。
 */

export type PortalName =
  | 'admin' | 'user' | 'security' | 'platform' | 'authenticator'
  | 'developer' | 'status';

/** 需要租户 slug 路径段的门户 */
const TENANT_SCOPED_PORTALS: ReadonlySet<PortalName> = new Set([
  'admin', 'user', 'security', 'platform', 'authenticator',
]);

/** 基础设施子域（非租户）：issuer 多为 api.<root> / auth.<root>，其首段标签不得当租户 slug */
const INFRA_SUBDOMAINS: ReadonlySet<string> = new Set([
  'api', 'auth', 'www', 'admin', 'user', 'security', 'developer', 'status', 'platform', 'authenticator', 'cdn',
]);

/** issuer 路径首段中非租户 slug 的服务性前缀 */
const NON_TENANT_PATH_SEGMENTS: ReadonlySet<string> = new Set([
  'bff', 'oauth', 'identity', 'tenant', '.well-known',
]);

/** IP 主机（IPv4 或 IPv6）不是域名，任何基于标签推导的逻辑都须拒绝 */
function isIpHost(hostname: string): boolean {
  if (hostname.startsWith('[')) return true; // IPv6: [::1]
  return /^\d+(\.\d+){1,3}$/.test(hostname);
}

/**
 * 从 issuer 提取租户 slug：
 * - path-style:   https://api.autional.cn/acme  → 'acme'
 * - 子域式:       https://acme.auth.tianv.com   → 'acme'
 * - 共享 issuer:  https://api.autional.cn       → null（api 等基础设施子域不算租户）
 */
export function extractTenantSlugFromIssuer(issuer: string): string | null {
  try {
    const url = new URL(issuer);
    const firstPath = url.pathname.split('/').filter(Boolean)[0];
    if (firstPath && !NON_TENANT_PATH_SEGMENTS.has(firstPath.toLowerCase())) {
      return firstPath;
    }
    if (isIpHost(url.hostname)) return null;
    const parts = url.hostname.split('.');
    if (parts.length >= 3 && !INFRA_SUBDOMAINS.has(parts[0].toLowerCase())) {
      return parts[0];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 从 API 基址（issuer / apiUrl）推导门户地址。
 * 仅支持共享基址：剥离 api./auth./www. 等基础设施前缀取根域（api.autional.cn → autional.cn），
 * 门户主机 = <portal>.<root>。租户域门户已知 slug 时拼 /<slug>/；未知 slug 返回裸根。
 * 首标签非基础设施子域（租户子域式 acme.auth.tianv.com、IP、未知形态）无法安全推导根域 → null；
 * localhost、无点主机、非法 URL → null。
 */
export function buildPortalUrl(
  baseUrl: string,
  portal: PortalName,
  tenantSlug?: string | null,
): string | null {
  try {
    const url = new URL(baseUrl);
    const labels = url.hostname.split('.');
    if (labels.length < 2) return null;
    if (isIpHost(url.hostname)) return null;
    if (!INFRA_SUBDOMAINS.has(labels[0].toLowerCase())) return null;
    labels.shift();
    if (labels.length < 2) return null;
    const port = url.port ? `:${url.port}` : '';
    const host = `${portal}.${labels.join('.')}${port}`;
    const path = TENANT_SCOPED_PORTALS.has(portal) && tenantSlug ? `/${tenantSlug}/` : '/';
    return `${url.protocol}//${host}${path}`;
  } catch {
    return null;
  }
}
