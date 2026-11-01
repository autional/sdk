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
