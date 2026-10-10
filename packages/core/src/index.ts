export { Autional } from './autional';
export type { AutionalConfig } from './autional';
export { createPlatformBinding } from './binding';
export type { BindingConfig, PlatformBinding } from './binding';
export { setLocale, getLocale, t } from './i18n';
export type { LocaleKey } from './i18n';
export { TokenManager } from './token-manager';
export { ApiClient } from './api-client';
export { AuthClient } from './auth-client';
export { Discovery } from './discovery';
export { TabSync } from './sync';
export type { AutionalPlugin } from './plugin';
export { browserPlatform, memoryPlatform } from './platform';
export type { AutionalPlatform, StorageAdapter, HttpAdapter, CryptoAdapter } from './platform';
export {
  processPasswordForTransmission,
  solveProofOfWork,
  type TransmissionResult,
  type KeyExchangeFn,
} from './crypto';
export {
  generatePkce,
  generateState,
  buildAuthorizeUrl,
  resolveSsoAuthorizeUrl,
  savePkceSession,
  loadPkceSession,
  clearPkceSession,
} from './pkce';
export type { PkceChallenge, PkceSession } from './pkce';
export {
  AutionalError,
  AutionalAuthError,
  AutionalNetworkError,
  AutionalApiError,
  AutionalConfigError,
} from './errors';
export type {
  User,
  AuthResult,
  LoginRequest,
  RegisterRequest,
  OAuthOptions,
  AuthMode,
  TokenClaims,
  AutionalEvent,
  SecurityAlert,
  PasswordPolicyConfig,
  TenantAuthConfig,
  BrandingInfo,
  RegisteredApis,
} from './types';
export { ERROR_CODES } from './types';
