import { describe, it, expect } from 'vitest';
import { normalizeAmr, normalizeAmrOptional, normalizeSessionAmr } from '../amr';

describe('normalizeAmr', () => {
  it('wraps the legacy string form as a single method', () => {
    expect(normalizeAmr('pwd')).toEqual(['pwd']);
    expect(normalizeAmr('webauthn')).toEqual(['webauthn']);
  });

  it('does NOT split comma-separated strings (no such convention upstream)', () => {
    expect(normalizeAmr('pwd,oob')).toEqual(['pwd,oob']);
  });

  it('passes arrays through, preserving order', () => {
    expect(normalizeAmr(['pwd', 'oob'])).toEqual(['pwd', 'oob']);
    expect(normalizeAmr(['webauthn', 'hwk'])).toEqual(['webauthn', 'hwk']);
  });

  it('returns [] for missing values', () => {
    expect(normalizeAmr(undefined)).toEqual([]);
    expect(normalizeAmr(null)).toEqual([]);
  });

  it('returns [] for non-string, non-array dirty data instead of throwing', () => {
    expect(normalizeAmr(123)).toEqual([]);
    expect(normalizeAmr({})).toEqual([]);
    expect(normalizeAmr({ 0: 'pwd' })).toEqual([]);
    expect(normalizeAmr(true)).toEqual([]);
    expect(normalizeAmr(() => 'pwd')).toEqual([]);
  });

  it('drops empty strings and non-string elements from arrays', () => {
    expect(normalizeAmr(['pwd', '', 'oob'])).toEqual(['pwd', 'oob']);
    expect(normalizeAmr(['webauthn', null, 42, undefined, 'hwk'])).toEqual(['webauthn', 'hwk']);
    expect(normalizeAmr(['', ''])).toEqual([]);
    expect(normalizeAmr([])).toEqual([]);
  });

  it('treats an empty string as "no methods"', () => {
    expect(normalizeAmr('')).toEqual([]);
  });
});

describe('normalizeAmrOptional', () => {
  it('keeps absent claim distinguishable from empty', () => {
    expect(normalizeAmrOptional(undefined)).toBeUndefined();
    expect(normalizeAmrOptional(null)).toBeUndefined();
    expect(normalizeAmrOptional([])).toEqual([]);
    expect(normalizeAmrOptional('')).toEqual([]);
  });

  it('normalizes both wire forms like normalizeAmr', () => {
    expect(normalizeAmrOptional('pwd')).toEqual(['pwd']);
    expect(normalizeAmrOptional(['pwd', 'oob'])).toEqual(['pwd', 'oob']);
    expect(normalizeAmrOptional(['webauthn', 'hwk'])).toEqual(['webauthn', 'hwk']);
  });

  it('maps present-but-dirty claim to [] (present, no usable methods)', () => {
    expect(normalizeAmrOptional(123)).toEqual([]);
    expect(normalizeAmrOptional({})).toEqual([]);
  });
});

// 会话 DTO 载体（service-session）：线上是逗号串 "pwd,otp"，也接受数组。
// 注意与 normalizeAmr 的区别——"pwd,oob" 在那边是单个元素，在这里要拆成两个。
describe('normalizeSessionAmr', () => {
  it('splits the session DTO comma string into methods', () => {
    expect(normalizeSessionAmr('pwd,otp')).toEqual(['pwd', 'otp']);
  });

  it('trims whitespace around each method', () => {
    expect(normalizeSessionAmr('pwd, otp')).toEqual(['pwd', 'otp']);
    expect(normalizeSessionAmr('  pwd  ,  otp  ')).toEqual(['pwd', 'otp']);
  });

  it('drops empty segments caused by duplicated commas', () => {
    expect(normalizeSessionAmr('pwd,,otp')).toEqual(['pwd', 'otp']);
    expect(normalizeSessionAmr(',pwd,')).toEqual(['pwd']);
  });

  it('passes arrays through without re-splitting elements', () => {
    expect(normalizeSessionAmr(['pwd', 'otp'])).toEqual(['pwd', 'otp']);
    expect(normalizeSessionAmr(['pwd,otp'])).toEqual(['pwd,otp']);
    expect(normalizeSessionAmr(['pwd', '', 42])).toEqual(['pwd']);
  });

  it('wraps a single method string', () => {
    expect(normalizeSessionAmr('pop')).toEqual(['pop']);
    expect(normalizeSessionAmr('')).toEqual([]);
  });

  it('returns [] for missing or dirty data instead of throwing', () => {
    expect(normalizeSessionAmr(null)).toEqual([]);
    expect(normalizeSessionAmr(undefined)).toEqual([]);
    expect(normalizeSessionAmr(42)).toEqual([]);
    expect(normalizeSessionAmr({})).toEqual([]);
  });
});
