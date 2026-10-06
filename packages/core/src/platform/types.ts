export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  keys?(): string[] | Promise<string[]>;
}

export interface HttpAdapter {
  request(input: string, init?: RequestInit): Promise<Response>;
}

export interface CryptoAdapter {
  generateCodeChallenge(verifier: string): Promise<string>;
  generateRandomString(length: number): string;
}

export interface AutionalPlatform {
  storage: StorageAdapter;
  http: HttpAdapter;
  crypto?: CryptoAdapter;
}
