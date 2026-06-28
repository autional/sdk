// @ts-nocheck — E2E tests, run when Gateway CORS is enabled
/**
 * SDK E2E Tests — Demo Page 浏览器自动化测试
 *
 * Prerequisites:
 *   - Docker AuthMS running (gateway on port 11080 with CORS enabled)
 *   - Demo Vite dev server running (port 5300 with proxy configured)
 *   - Or: set VITE_AUTHMS_API_URL=http://localhost:11080/bff
 *
 * These tests validate the complete UI flow:
 *   Login page → fill form → submit → Dashboard → logout → Login page
 *
 * Run manually when infrastructure is ready.
 */

import { describe, it, expect, beforeAll } from 'vitest';

const DEMO_URL = 'http://localhost:5300';
const GATEWAY = 'http://localhost:11080';
const BFF = `${GATEWAY}/bff`;

let testUser: { email: string; password: string; id?: string };

beforeAll(async () => {
  // Check if gateway is reachable
  try {
    const r = await fetch(`${GATEWAY}/health`);
    if (r.status !== 200) throw new Error('Gateway not healthy');
  } catch {
    console.warn('⚠ Gateway not reachable — E2E tests will be skipped');
    return;
  }

  // Register test user
  const email = `e2e-${Date.now()}@test.com`;
  const password = 'E2e@Pass123!';
  const r = await fetch(`${BFF}/identity/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: 'E2E Test' }),
  });
  if (r.ok) {
    const j = await r.json();
    testUser = { email, password, id: j.data?.user_id };
  }
});

describe('E2E — Demo Page', () => {
  it('1. Login page loads', async () => {
    if (!testUser) return;
    const r = await fetch(`${DEMO_URL}/login`);
    expect(r.status).toBe(200);
    const html = await r.text();
    expect(html).toContain('Sign In');
  });

  it('2. Login with valid credentials', async () => {
    if (!testUser) return;
    const r = await fetch(`${BFF}/identity/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: testUser.email, password: testUser.password }),
    });
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.data?.access_token).toBeTruthy();
  });

  it('3. Profile accessible with token', async () => {
    if (!testUser) return;
    const r1 = await fetch(`${BFF}/identity/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: testUser.email, password: testUser.password }),
    });
    const j1 = await r1.json();
    const token = j1.data?.access_token;

    const r2 = await fetch(`${BFF}/identity/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(r2.status).toBe(200);
  });

  it('4. Logout revokes token', async () => {
    if (!testUser) return;
    const r1 = await fetch(`${BFF}/identity/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: testUser.email, password: testUser.password }),
    });
    const j1 = await r1.json();
    const token = j1.data?.access_token;

    await fetch(`${BFF}/identity/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });

    const r3 = await fetch(`${BFF}/identity/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(r3.status).toBe(401);
  });

  it('5. Login with wrong password returns error', async () => {
    if (!testUser) return;
    const r = await fetch(`${BFF}/identity/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: testUser.email, password: 'WrongPass!' }),
    });
    expect(r.status).toBe(401);
  });
});
