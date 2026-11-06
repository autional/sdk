import { test } from 'node:test';
import assert from 'node:assert/strict';

import { wellKnownOrigin, wellKnownURL } from '../wellknown.ts';

test('origin：剥离 /bff 路径前缀（脚手架默认 apiUrl）', () => {
  assert.equal(
    wellKnownOrigin('https://api.autional.cn/bff'),
    'https://api.autional.cn',
  );
});

test('origin：剥离 /oauth 路径前缀', () => {
  assert.equal(
    wellKnownOrigin('https://api.autional.cn/oauth'),
    'https://api.autional.cn',
  );
});

test('origin：保留端口', () => {
  assert.equal(wellKnownOrigin('https://api.example.test:8443/bff'), 'https://api.example.test:8443');
});

test('origin：空值返回空串', () => {
  assert.equal(wellKnownOrigin(''), '');
  assert.equal(wellKnownOrigin('   '), '');
});

test('origin：非绝对 URL 退化为去尾斜杠', () => {
  assert.equal(wellKnownOrigin('api.example.test/bff/'), 'api.example.test/bff');
});

test('URL：jwks 恒挂 origin 根', () => {
  assert.equal(
    wellKnownURL('https://api.autional.cn/bff', '/.well-known/jwks.json'),
    'https://api.autional.cn/.well-known/jwks.json',
  );
});

test('URL：jwt-status 恒挂 origin 根', () => {
  assert.equal(
    wellKnownURL('https://api.autional.cn/bff', '.well-known/jwt-status.json'),
    'https://api.autional.cn/.well-known/jwt-status.json',
  );
});

// 回归锁：2026-10-30 同类故障的形态 —— 路径前缀被带进 .well-known。
test('回归：结果不得包含业务路径前缀', () => {
  for (const base of ['https://api.autional.cn/bff', 'https://api.autional.cn/oauth']) {
    const url = wellKnownURL(base, '/.well-known/jwks.json');
    assert.ok(!url.includes('/bff'), `不应含 /bff: ${url}`);
    assert.ok(!url.includes('/oauth'), `不应含 /oauth: ${url}`);
    assert.ok(url.endsWith('/.well-known/jwks.json'));
  }
});

test('URL：空基址返回空串（调用方据此跳过验证而非打错地址）', () => {
  assert.equal(wellKnownURL('', '/.well-known/jwks.json'), '');
});
