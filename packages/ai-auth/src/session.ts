/** Stateless encrypted session cookie (AES-GCM) and sliding idle expiry. */

import { decryptJson, encryptJson } from './crypto.js';
import type { AiSession } from './types.js';

export const SESSION_COOKIE_SUFFIX = 'session';

export function sessionCookieName(prefix: string): string {
  return `${prefix}-${SESSION_COOKIE_SUFFIX}`;
}

export interface SessionTtl {
  absoluteSeconds: number;
  idleSeconds: number;
}

export function newSession(input: {
  iss: string;
  sub: string;
  tenantId: string;
  clientId: string;
  email?: string;
  emailVerified?: boolean;
  ttl: SessionTtl;
}): AiSession {
  const now = Math.floor(Date.now() / 1000);
  return {
    iss: input.iss,
    sub: input.sub,
    tenantId: input.tenantId,
    clientId: input.clientId,
    ...(input.email ? { email: input.email } : {}),
    ...(input.emailVerified !== undefined ? { emailVerified: input.emailVerified } : {}),
    iat: now,
    exp: now + input.ttl.absoluteSeconds,
    idleExp: now + input.ttl.idleSeconds,
  };
}

export async function sealSession(secret: string, session: AiSession): Promise<string> {
  return encryptJson(secret, { v: 1, session });
}

export async function openSession(secret: string, value: string): Promise<AiSession | null> {
  const payload = await decryptJson<{ v?: number; session?: AiSession }>(secret, value);
  if (!payload || payload.v !== 1 || !payload.session) return null;
  const session = payload.session;
  if (
    typeof session.iss !== 'string' ||
    typeof session.sub !== 'string' ||
    typeof session.tenantId !== 'string' ||
    typeof session.clientId !== 'string' ||
    typeof session.iat !== 'number' ||
    typeof session.exp !== 'number' ||
    typeof session.idleExp !== 'number'
  ) {
    return null;
  }
  return session;
}

/** Returns a refreshed session with a new idle deadline, or null when expired. */
export function touchSession(session: AiSession, idleSeconds: number): AiSession | null {
  const now = Math.floor(Date.now() / 1000);
  if (session.exp <= now || session.idleExp <= now) return null;
  return { ...session, idleExp: now + idleSeconds };
}
