import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkOAuthClient,
  clientInfoUrl,
  describeVerdict,
  isPortalClient,
} from './oauth-client-guard.ts';

function stubFetch(impl: (url: string) => Promise<Response> | Response) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => impl(String(input))) as typeof fetch;
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
