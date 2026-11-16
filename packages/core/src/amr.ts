/**
 * AMR（Authentication Methods References）读侧归一化。
 *
 * 同一个 `amr` 概念在仓内出现在**三种载体**上，形态各不相同（见 ADR-028 §1.1 / §3）。
 * 调用方必须先认载体，再选函数，不能混用：
 *
 *  1. **JWT `custom.amr`**（服务令牌）→ **数组**：`["pwd","otp","mfa"]`（OIDC Core §2 要求数组）。
 *     早期令牌是单字符串 `"pwd"`。→ 用 {@link normalizeAmr} / {@link normalizeAmrOptional}。
 *     该载体**不写**逗号串，所以这里刻意不按 `,` 切分。
 *  2. **会话 DTO**（service-session `/auth/me/sessions` 的 `amr` 字段）→ **逗号串**：
 *     `"pwd,otp"`（映射见 `service-session/internal/handler/dto/mapper.go`，形态不变）。
 *     → 用 {@link normalizeSessionAmr}（按 `,` 切分 + trim + 去空）。
 *  3. **旧令牌**（兼容期内的存量 JWT）→ 单字符串 `"pwd"`：两种归一化都能吃掉。
 *
 * 读侧一律归一成数组再消费，避免调用方各自判断形态。脏数据（数字/对象/null）
 * 一律退化为空数组 —— 读侧不得因为一个 claim 形状异常就抛错。
 */

/** AMR claim 的两种线上形态（字符串或字符串数组） */
export type AmrClaim = string | string[];

/**
 * 把 AMR claim 归一成数组。
 *
 * - 字符串按**单个方法**处理：`"pwd"` → `["pwd"]`。
 *   本函数只服务 **JWT `custom.amr`** 载体，该载体从不写 `"pwd,oob"`，因此这里
 *   **不**按 `,` 切分 —— 切分只会给脏数据制造出歧义的方法名。
 *   会话 DTO 的逗号串请用 {@link normalizeSessionAmr}。
 * - 数组则过滤空串与非字符串元素（`["pwd", "", null]` → `["pwd"]`）。
 * - `undefined` / `null` / 其它非法类型 → `[]`。
 */
export function normalizeAmr(value: unknown): string[] {
  if (typeof value === 'string') {
    return value === '' ? [] : [value];
  }
  if (Array.isArray(value)) {
    const out: string[] = [];
    for (const item of value) {
      if (typeof item === 'string' && item !== '') out.push(item);
    }
    return out;
  }
  return [];
}

/**
 * 把 AMR claim 归一成数组或 `undefined`。
 *
 * 用于**可选**字段：保留「服务端没给该 claim」（`undefined`）与「给了但为空/脏」
 * （`[]`）的区别；调用方可用 `=== undefined` 判断"该 claim 完全缺失"。
 *
 * 只有 `undefined` / `null` 才映射为 `undefined`；其余值一律走 {@link normalizeAmr}
 * ——即"claim 存在但内容不可用"归入空数组而非"缺失"，读侧不得因脏数据抛错。
 */
export function normalizeAmrOptional(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  return normalizeAmr(value);
}

/**
 * 把**会话记录**载体（service-session DTO 的 `amr`）归一成数组。
 *
 * 会话 DTO 历史上是**逗号串**（`"pwd,otp"`；ADR-028 §1.1 行 D），也接受数组
 * （过渡期/已归一的服务端）。所以：
 *  - 字符串 → 按 `,` 切分 + 逐项 `trim` + 去空串：`"pwd, otp"` / `"pwd,,otp"` → `["pwd","otp"]`；
 *  - 数组 → 走 {@link normalizeAmr}（过滤空串/非字符串元素，**元素不再切分**）；
 *  - `undefined` / `null` / 其它类型 → `[]`（会话侧没有「claim 缺失」语义，只有「无可读方法」）。
 *
 * 注意与 {@link normalizeAmr} 的分工：那个服务 JWT 数组载体，`"pwd,oob"` 会原样成为
 * 单个元素；本函数才负责拆逗号。**不要**把两者互换使用。
 */
export function normalizeSessionAmr(value: unknown): string[] {
  if (typeof value === 'string') {
    const out: string[] = [];
    for (const part of value.split(',')) {
      const method = part.trim();
      if (method !== '') out.push(method);
    }
    return out;
  }
  return normalizeAmr(value);
}
