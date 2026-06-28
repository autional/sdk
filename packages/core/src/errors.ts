export class AuthmsError extends Error {
  code: string;
  status: number;
  detail?: string;

  constructor(code: string, message: string, status: number, detail?: string) {
    super(message);
    this.name = 'AuthmsError';
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

export class AuthmsAuthError extends AuthmsError {
  constructor(code: string, message: string, status: number) {
    super(code, message, status);
    this.name = 'AuthmsAuthError';
  }
}

export class AuthmsNetworkError extends AuthmsError {
  constructor(message: string) {
    super('NETWORK_ERROR', message, 0);
    this.name = 'AuthmsNetworkError';
  }
}

export class AuthmsApiError extends AuthmsError {
  violations?: Array<{ field: string; message: string }>;

  constructor(code: string, message: string, status: number, violations?: Array<{ field: string; message: string }>) {
    super(code, message, status);
    this.name = 'AuthmsApiError';
    this.violations = violations;
  }
}

export class AuthmsConfigError extends AuthmsError {
  constructor(message: string) {
    super('CONFIG_ERROR', message, 500);
    this.name = 'AuthmsConfigError';
  }
}
