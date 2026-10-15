/**
 * Cookie → localStorage 播种（C13 修复）。
 *
 * AutionalProvider 以 cookie 中的 access token 为服务端门依据；首次渲染时把
 * cookie 播种进 core 的存储键，供「有 cookie 但 localStorage 为空」的冷启动恢复。
 * 但旧实现无条件全量覆写 —— 抹掉 core 持久化的 refreshToken/user 等富字段，
 * 使刷新链断裂（每次带 cookie 载页 = 富会话被降级为裸 token）。
 * 现在：已有富会话 → 不播种；裸形态/损坏/空 → 播种。
 */

export const STORAGE_KEY = 'autional_tokens';

/** 已有富会话判定：refreshToken/user/tenantId/expiresAt 任一在存 */
function hasRichSession(existing: unknown): boolean {
  if (!existing || typeof existing !== 'object') return false;
  const rec = existing as Record<string, unknown>;
  return rec.refreshToken != null || rec.user != null || rec.tenantId != null || rec.expiresAt != null;
}

/**
 * 计算要写入的播种载荷。返回 null = 不写入（已有富会话，保留 core 持久化）。
 */
export function computeSeedPayload(existingRaw: string | null, token: string): string | null {
  if (existingRaw) {
    try {
      const existing = JSON.parse(existingRaw) as unknown;
      if (hasRichSession(existing)) return null;
    } catch { /* 存储损坏 → 按空处理，重新播种 */ }
  }
  return JSON.stringify({
    accessToken: token,
    refreshToken: null,
    user: null,
    tenantId: null,
    expiresAt: null,
  });
}

export function seedStorage(token: string): void {
  try {
    const payload = computeSeedPayload(localStorage.getItem(STORAGE_KEY), token);
    if (payload !== null) {
      localStorage.setItem(STORAGE_KEY, payload);
    }
  } catch { /* localStorage unavailable */ }
}
