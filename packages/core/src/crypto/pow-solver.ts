/**
 * PoW (Proof-of-Work) 求解器
 * 当 silentChallengeEnabled 时自动获取并求解 challenge
 *
 * 移植自 web/apps/auth-pages/src/lib/silent-challenge.ts
 */
const SOLVER_TIMEOUT_MS = 5000;

export async function solveProofOfWork(
  challenge: string,
  difficulty: number = 4,
  timeoutMs: number = SOLVER_TIMEOUT_MS,
): Promise<string> {
  const startTime = Date.now();
  const encoder = new TextEncoder();
  let nonce = 0;
  const prefix = '0'.repeat(difficulty);

  while (true) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('PoW solver timeout');
    }

    const data = encoder.encode(challenge + nonce);
    try {
      const hash = await crypto.subtle.digest('SHA-256', data);
      const hex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      if (hex.startsWith(prefix)) {
        return 'pow_' + nonce.toString(36);
      }
    } catch {
      // crypto.subtle not available — non-critical
    }
    nonce++;
    if (nonce % 1000 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}
