// @ts-nocheck — vitest mock types
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setupTotp,
  verifyTotp,
  enableTotp,
  disableTotp,
  getMfaMethods,
  sendSmsCode,
  verifySmsCode,
  generateBackupCodes,
  getBackupCodes,
  getPushChallenge,
} from '../index';

const mockClient = {
  post: vi.fn().mockResolvedValue({}),
  get: vi.fn().mockResolvedValue({}),
  put: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('api-mfa', () => {
  describe('setupTotp', () => {
    it('calls POST /mfa/api/v1/mfa/totp/setup', async () => {
      await setupTotp(mockClient);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/totp/setup');
    });
  });

  describe('verifyTotp', () => {
    it('calls POST /mfa/api/v1/mfa/totp/verify', async () => {
      const data = { code: '123456' };
      await verifyTotp(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/totp/verify', data);
    });
  });

  describe('enableTotp', () => {
    it('calls POST /mfa/api/v1/mfa/totp/enable', async () => {
      const data = { code: '123456' };
      await enableTotp(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/totp/enable', data);
    });
  });

  describe('disableTotp', () => {
    it('calls POST /mfa/api/v1/mfa/totp/disable', async () => {
      await disableTotp(mockClient);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/totp/disable');
    });
  });

  describe('getMfaMethods', () => {
    it('calls GET /mfa/api/v1/mfa/methods', async () => {
      await getMfaMethods(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/mfa/api/v1/mfa/methods');
    });
  });

  describe('sendSmsCode', () => {
    it('calls POST /mfa/api/v1/mfa/sms/send', async () => {
      const data = { phone: '+8613800138000' };
      await sendSmsCode(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/sms/send', data);
    });
  });

  describe('verifySmsCode', () => {
    it('calls POST /mfa/api/v1/mfa/sms/verify', async () => {
      const data = { code: '654321' };
      await verifySmsCode(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/sms/verify', data);
    });
  });

  describe('generateBackupCodes', () => {
    it('calls POST /mfa/api/v1/mfa/backup-codes/generate', async () => {
      await generateBackupCodes(mockClient);
      expect(mockClient.post).toHaveBeenCalledWith('/mfa/api/v1/mfa/backup-codes/generate');
    });
  });

  describe('getBackupCodes', () => {
    it('calls GET /mfa/api/v1/mfa/backup-codes', async () => {
      await getBackupCodes(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/mfa/api/v1/mfa/backup-codes');
    });
  });

  describe('getPushChallenge', () => {
    it('calls GET /mfa/api/v1/mfa/push/challenge', async () => {
      await getPushChallenge(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/mfa/api/v1/mfa/push/challenge');
    });
  });
});
