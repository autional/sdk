/**
 * SDK UI i18n — 轻量多语言支持
 * 用于 Plugin UI 组件（MFA/Passkey/Tenant Switcher）
 */

export type LocaleKey =
  | 'mfa.setup.title' | 'mfa.setup.scan' | 'mfa.setup.verify' | 'mfa.setup.enable'
  | 'mfa.guard.title' | 'mfa.guard.placeholder' | 'mfa.guard.submit'
  | 'mfa.backup.title' | 'mfa.backup.warning' | 'mfa.backup.copy'
  | 'passkey.register' | 'passkey.login' | 'passkey.unsupported'
  | 'passkey.registering' | 'passkey.registerSuccess' | 'passkey.registerError'
  | 'tenant.switcher' | 'tenant.noTenants'
  | 'common.loading' | 'common.error' | 'common.retry' | 'common.cancel';

type LocaleMessages = Record<LocaleKey, string>;

const zh: LocaleMessages = {
  'mfa.setup.title': '设置两步验证',
  'mfa.setup.scan': '使用验证器 App 扫描二维码',
  'mfa.setup.verify': '输入验证码验证',
  'mfa.setup.enable': '启用',
  'mfa.guard.title': '请输入验证码',
  'mfa.guard.placeholder': '6 位验证码',
  'mfa.guard.submit': '验证',
  'mfa.backup.title': '备份恢复码',
  'mfa.backup.warning': '请安全保存这些恢复码。每个码只能使用一次。',
  'mfa.backup.copy': '复制全部',
  'passkey.register': '注册通行密钥',
  'passkey.login': '使用通行密钥登录',
  'passkey.unsupported': '当前设备不支持通行密钥',
  'passkey.registering': '正在注册...',
  'passkey.registerSuccess': '注册成功',
  'passkey.registerError': '注册失败',
  'tenant.switcher': '切换租户',
  'tenant.noTenants': '无可切换的租户',
  'common.loading': '加载中...',
  'common.error': '发生错误',
  'common.retry': '重试',
  'common.cancel': '取消',
};

const en: LocaleMessages = {
  'mfa.setup.title': 'Set Up Two-Factor Authentication',
  'mfa.setup.scan': 'Scan the QR code with your authenticator app',
  'mfa.setup.verify': 'Enter verification code',
  'mfa.setup.enable': 'Enable',
  'mfa.guard.title': 'Enter verification code',
  'mfa.guard.placeholder': '6-digit code',
  'mfa.guard.submit': 'Verify',
  'mfa.backup.title': 'Backup Recovery Codes',
  'mfa.backup.warning': 'Save these codes securely. Each code can only be used once.',
  'mfa.backup.copy': 'Copy All',
  'passkey.register': 'Register Passkey',
  'passkey.login': 'Sign in with Passkey',
  'passkey.unsupported': 'Passkeys are not supported on this device',
  'passkey.registering': 'Registering...',
  'passkey.registerSuccess': 'Registration successful',
  'passkey.registerError': 'Registration failed',
  'tenant.switcher': 'Switch Tenant',
  'tenant.noTenants': 'No tenants available',
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.retry': 'Retry',
  'common.cancel': 'Cancel',
};

const locales: Record<string, LocaleMessages> = { zh, en };
let currentLocale = 'en';

export function setLocale(locale: string): void {
  if (locales[locale]) currentLocale = locale;
}

export function getLocale(): string {
  return currentLocale;
}

export function t(key: LocaleKey): string {
  return locales[currentLocale]?.[key] ?? locales['en']?.[key] ?? key;
}
