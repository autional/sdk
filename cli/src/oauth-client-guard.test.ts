import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkOAuthClient,
  clientInfoUrl,
  corsPreflightUrl,
  describeCorsVerdict,
  describeVerdict,
  isPortalClient,
  normalizeOriginInput,
  probeCors,
  probeAuthorize,
  authorizePreflightUrl,
} from './oauth-client-guard.ts';

function stubFetch(impl: (url: string) => Promise<Response> | Response) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => impl(String(input))) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

/** 捕获 call init（method / headers），供 CORS 预检用例断言。 */
function stubFetchWithInit(impl: (url: string, init?: RequestInit) => Promise<Response> | Response) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => impl(String(input), init)) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

test('isPortalClient: kind=portal wins', () => {
  assert.equal(isPortalClient({ client_name: 'My App', kind: 'portal' }), true);
});

test('isPortalClient: name prefix is the fallback', () => {
  assert.equal(isPortalClient({ client_name: 'Default Client for acme', kind: '' }), true);
  assert.equal(isPortalClient({ client_name: 'animal-world-match' }), false);
  assert.equal(isPortalClient(null), false);
});

test('clientInfoUrl: no double slash, appId encoded', () => {
  assert.equal(
    clientInfoUrl('https://api.autional.cn/', 'client-A/B'),
    'https://api.autional.cn/oauth/api/v1/oauth/client/client-A%2FB',
  );
});

test('checkOAuthClient: portal client is refused', async () => {
  const restore = stubFetch(
    () =>
      new Response(JSON.stringify({ data: { client_name: 'Default Client for acme', kind: 'portal' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  );
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-1');
    assert.equal(verdict.status, 'portal');
    assert.match(describeVerdict('client-1', verdict), /PORTAL client/);
  } finally {
    restore();
  }
});

test('checkOAuthClient: app client passes', async () => {
  const restore = stubFetch(
    () =>
      new Response(JSON.stringify({ data: { client_name: 'animal-world-match', kind: '' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  );
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-2');
    assert.equal(verdict.status, 'ok');
    assert.match(describeVerdict('client-2', verdict), /OAuth client OK/);
  } finally {
    restore();
  }
});

test('checkOAuthClient: 404 = not found (hard fail)', async () => {
  const restore = stubFetch(() => new Response('{}', { status: 404 }));
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-3');
    assert.equal(verdict.status, 'not-found');
  } finally {
    restore();
  }
});

test('checkOAuthClient: network failure = unverified (warn only)', async () => {
  const restore = stubFetch(() => {
    throw new Error('ECONNREFUSED');
  });
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-4');
    assert.equal(verdict.status, 'unverified');
    assert.match(describeVerdict('client-4', verdict), /WITHOUT verification/);
  } finally {
    restore();
  }
});

/* ---- CORS 预检（skill 5.2b 第 5 步）---- */

test('corsPreflightUrl: no double slash, hits the token endpoint', () => {
  assert.equal(
    corsPreflightUrl('https://api.autional.cn/'),
    'https://api.autional.cn/oauth/api/v1/oauth/token',
  );
});

test('normalizeOriginInput: origin only, https (localhost may use http)', () => {
  assert.deepEqual(normalizeOriginInput('https://app.example.com/'), { ok: true, origin: 'https://app.example.com' });
  assert.deepEqual(normalizeOriginInput('http://localhost:3000'), { ok: true, origin: 'http://localhost:3000' });
  assert.equal(normalizeOriginInput('http://app.example.com').ok, false, 'non-local http must be rejected');
  assert.equal(normalizeOriginInput('https://app.example.com/callback').ok, false, 'path must be rejected');
  assert.equal(normalizeOriginInput('https://app.example.com?x=1').ok, false, 'query must be rejected');
  assert.equal(normalizeOriginInput('not-a-url').ok, false);
  assert.equal(normalizeOriginInput('').ok, false);
});

test('probeCors: exact echo = ok (and sends OPTIONS + Origin)', async () => {
  let seenMethod = '';
  let seenOrigin = '';
  const restore = stubFetchWithInit((url, init) => {
    seenMethod = init?.method ?? '';
    seenOrigin = String((init?.headers as Record<string, string> | undefined)?.Origin ?? '');
    assert.equal(url, 'https://api.example.test/oauth/api/v1/oauth/token');
    return new Response(null, {
      status: 204,
      headers: { 'access-control-allow-origin': 'https://app.example.com' },
    });
  });
  try {
    const verdict = await probeCors('https://api.example.test', 'https://app.example.com');
    assert.equal(verdict.status, 'ok');
    assert.equal(seenMethod, 'OPTIONS');
    assert.equal(seenOrigin, 'https://app.example.com');
  } finally {
    restore();
  }
});

test('probeCors: missing ACAO = no-echo (unregistered / not propagated)', async () => {
  const restore = stubFetchWithInit(() => new Response(null, { status: 404 }));
  try {
    const verdict = await probeCors('https://api.example.test', 'https://app.example.com');
    assert.equal(verdict.status, 'no-echo');
    if (verdict.status === 'no-echo') {
      assert.equal(verdict.echoed, null);
      assert.equal(verdict.httpStatus, 404);
    }
    const text = describeCorsVerdict('https://app.example.com', verdict);
    assert.match(text, /cors_origins/);
    assert.match(text, /60s/);
  } finally {
    restore();
  }
});

test('probeCors: wrong echo = no-echo (fails closed)', async () => {
  const restore = stubFetchWithInit(
    () => new Response(null, { status: 204, headers: { 'access-control-allow-origin': 'https://other.example.com' } }),
  );
  try {
    const verdict = await probeCors('https://api.example.test', 'https://app.example.com');
    assert.equal(verdict.status, 'no-echo');
    if (verdict.status === 'no-echo') assert.equal(verdict.echoed, 'https://other.example.com');
  } finally {
    restore();
  }
});

test('probeCors: network failure = unreachable', async () => {
  const restore = stubFetchWithInit(() => {
    throw new Error('ECONNREFUSED');
  });
  try {
    const verdict = await probeCors('https://api.example.test', 'https://app.example.com');
    assert.equal(verdict.status, 'unreachable');
    assert.match(describeCorsVerdict('https://app.example.com', verdict), /Could not reach/);
  } finally {
    restore();
  }
});

test('probeCors: invalid origin never hits the network', async () => {
  let called = false;
  const restore = stubFetchWithInit(() => {
    called = true;
    return new Response(null, { status: 204 });
  });
  try {
    const verdict = await probeCors('https://api.example.test', 'https://app.example.com/path');
    assert.equal(verdict.status, 'invalid-origin');
    assert.equal(called, false);
  } finally {
    restore();
  }
});

/* ---- tenant / scope / authorize 预检（2026-11-05 加固）---- */

test('checkOAuthClient: rejects a client owned by another tenant', async () => {
  const restore = stubFetch(
    () =>
      new Response(JSON.stringify({ data: { client_name: 'app-a', tenant_id: 'tenant-B', scopes: ['openid'] } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  );
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-a', { tenantId: 'tenant-A' });
    assert.equal(verdict.status, 'tenant-mismatch');
    assert.match(describeVerdict('client-a', verdict), /tenant/);
  } finally {
    restore();
  }
});

test('checkOAuthClient: rejects a client missing required scope', async () => {
  const restore = stubFetch(
    () =>
      new Response(JSON.stringify({ data: { client_name: 'app-a', tenant_id: 'tenant-A', scopes: ['profile'] } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  );
  try {
    const verdict = await checkOAuthClient('https://api.example.test', 'client-a', {
      tenantId: 'tenant-A',
      requiredScopes: ['openid'],
    });
    assert.equal(verdict.status, 'missing-scope');
  } finally {
    restore();
  }
});

test('authorizePreflightUrl: api plane, encoded callback, PKCE S256', () => {
  const u = authorizePreflightUrl('https://api.autional.cn/', 'client-1', 'https://app.example.com/oauth/callback');
  assert.match(u, /^https:\/\/api\.autional\.cn\/oauth\/api\/v1\/oauth\/authorize\?/);
  assert.match(u, /client_id=client-1/);
  assert.match(u, /code_challenge_method=S256/);
  assert.match(u, /redirect_uri=https%3A%2F%2Fapp\.example\.com%2Foauth%2Fcallback/);
});

test('probeAuthorize: 302 back to callback with login_required passes', async () => {
  const callback = 'https://app.example.com/oauth/callback';
  const restore = stubFetchWithInit(() =>
    new Response(null, {
      status: 302,
      headers: { location: `${callback}?error=login_required&state=preflight` },
    }),
  );
  try {
    const verdict = await probeAuthorize('https://api.example.test', 'client-1', callback);
    assert.equal(verdict.status, 'ok');
  } finally {
    restore();
  }
});

test('probeAuthorize: 400 redirect_uri not registered fails', async () => {
  const restore = stubFetchWithInit(() => new Response('{"error":"invalid_request"}', { status: 400 }));
  try {
    const verdict = await probeAuthorize('https://api.example.test', 'client-1', 'https://app.example.com/oauth/callback');
    assert.equal(verdict.status, 'not-redirected');
  } finally {
    restore();
  }
});
