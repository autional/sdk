/**
 * `.well-known` 基址解析（单一真源）。
 *
 * OIDC / OAuth2 的发现文档与密钥端点**恒在 origin 根**：
 *   https://api.example.com/.well-known/jwks.json
 * 而业务 API 基址可能带路径前缀（本项目脚手架默认
 * `apiUrl = https://api.<root>/bff`）。
 *
 * 把带前缀的基址直接拼 `/.well-known/...` 会得到 404：
 *   https://api.autional.cn/bff/.well-known/jwks.json → 404
 * 于是 `verify: 'jwks'` 模式下所有受保护接口恒 401，而 `userinfo`
 * 模式（走 /bff/oauth/...）却正常 —— 典型"半残"故障。
 *
 * 与 `@autional/core` 的 Discovery 同口径（那边先剥 `/bff` 再取根）。
 */

/** 返回 `.well-known` 应挂载的 origin；无法解析时退化为去尾斜杠的原值。 */
export function wellKnownOrigin(base: string): string {
  const raw = (base || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw).origin;
  } catch {
    // 非绝对 URL（本地相对路径等）：保持旧行为，不臆造 origin。
    return raw.replace(/\/+$/, '');
  }
}

/** 在 origin 根上拼一个 `.well-known` 路径。 */
export function wellKnownURL(base: string, path: string): string {
  const origin = wellKnownOrigin(base);
  if (!origin) return '';
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
