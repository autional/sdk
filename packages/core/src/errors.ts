export class AutionalError extends Error {
  code: string;
  status: number;
  detail?: string;

  constructor(code: string, message: string, status: number, detail?: string) {
    super(message);
    this.name = 'AutionalError';
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

export class AutionalAuthError extends AutionalError {
  constructor(code: string, message: string, status: number) {
    super(code, message, status);
    this.name = 'AutionalAuthError';
  }
}

export class AutionalNetworkError extends AutionalError {
  constructor(message: string) {
    super('NETWORK_ERROR', message, 0);
    this.name = 'AutionalNetworkError';
  }
}

export class AutionalApiError extends AutionalError {
  violations?: Array<{ field: string; message: string }>;

  constructor(code: string, message: string, status: number, violations?: Array<{ field: string; message: string }>) {
    super(code, message, status);
    this.name = 'AutionalApiError';
    this.violations = violations;
  }
}

export class AutionalConfigError extends AutionalError {
  constructor(message: string) {
    super('CONFIG_ERROR', message, 500);
    this.name = 'AutionalConfigError';
  }
}
