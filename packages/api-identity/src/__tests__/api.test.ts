import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  login,
  register,
  refreshToken,
  getProfile,
  updateProfile,
  logout,
  verifyEmail,
  sendVerificationEmail,
  changePassword,
  forgotPassword,
  resetPassword,
  checkPermission,
  getPermissions,
  getTenants,
  switchTenant,
  requestRoleActivation,
  getRoleActivations,
  deleteAccount,
  getSessions,
  deleteSession,
  getMFAMethods,
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

describe('api-identity', () => {
  describe('login', () => {
    it('calls POST /identity/api/v1/auth/login', async () => {
      const data = { email: 'test@example.com', password: 'secret' };
      await login(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/login', data);
    });
  });

  describe('register', () => {
    it('calls POST /identity/api/v1/auth/register', async () => {
      const data = { email: 'test@example.com', password: 'secret', name: 'Test' };
      await register(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/register', data);
    });
  });

  describe('refreshToken', () => {
    it('calls POST /identity/api/v1/auth/refresh', async () => {
      const data = { refreshToken: 'token-123' };
      await refreshToken(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/refresh', data);
    });
  });

  describe('getProfile', () => {
    it('calls GET /identity/api/v1/auth/me', async () => {
      await getProfile(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me');
    });
  });

  describe('updateProfile', () => {
    it('calls PUT /identity/api/v1/auth/me', async () => {
      const data = { displayName: 'New Name' };
      await updateProfile(mockClient, data);
      expect(mockClient.put).toHaveBeenCalledWith('/identity/api/v1/auth/me', data);
    });
  });

  describe('logout', () => {
    it('calls POST /identity/api/v1/auth/logout', async () => {
      await logout(mockClient);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/logout');
    });
  });

  describe('verifyEmail', () => {
    it('calls POST /identity/api/v1/auth/verify-email', async () => {
      const data = { code: '123456' };
      await verifyEmail(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/verify-email', data);
    });
  });

  describe('sendVerificationEmail', () => {
    it('calls POST /identity/api/v1/auth/send-verification-email', async () => {
      const data = { email: 'test@example.com' };
      await sendVerificationEmail(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/send-verification-email', data);
    });
  });

  describe('changePassword', () => {
    it('calls PUT /identity/api/v1/auth/me/password', async () => {
      const data = { currentPassword: 'old', newPassword: 'new' };
      await changePassword(mockClient, data);
      expect(mockClient.put).toHaveBeenCalledWith('/identity/api/v1/auth/me/password', data);
    });
  });

  describe('forgotPassword', () => {
    it('calls POST /identity/api/v1/auth/forgot-password', async () => {
      const data = { email: 'test@example.com' };
      await forgotPassword(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/forgot-password', data);
    });
  });

  describe('resetPassword', () => {
    it('calls POST /identity/api/v1/auth/reset-password', async () => {
      const data = { token: 'reset-token', newPassword: 'new' };
      await resetPassword(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/reset-password', data);
    });
  });

  describe('checkPermission', () => {
    it('calls POST /identity/api/v1/auth/check-permission', async () => {
      const data = { resource: 'admin', action: 'read' };
      await checkPermission(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/check-permission', data);
    });
  });

  describe('getPermissions', () => {
    it('calls GET /identity/api/v1/auth/me/permissions', async () => {
      await getPermissions(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me/permissions');
    });
  });

  describe('getTenants', () => {
    it('calls GET /identity/api/v1/auth/me/tenants', async () => {
      await getTenants(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me/tenants');
    });
  });

  describe('switchTenant', () => {
    it('calls POST /identity/api/v1/auth/me/switch-tenant', async () => {
      const data = { tenantId: 'tenant-123' };
      await switchTenant(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/me/switch-tenant', data);
    });
  });

  describe('requestRoleActivation', () => {
    it('calls POST /identity/api/v1/auth/me/role-activations', async () => {
      const data = { role: 'admin', duration: 3600, justification: 'need access' };
      await requestRoleActivation(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/identity/api/v1/auth/me/role-activations', data);
    });
  });

  describe('getRoleActivations', () => {
    it('calls GET /identity/api/v1/auth/me/role-activations', async () => {
      await getRoleActivations(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me/role-activations');
    });
  });

  describe('deleteAccount', () => {
    it('calls DELETE /identity/api/v1/auth/me', async () => {
      await deleteAccount(mockClient);
      expect(mockClient.delete).toHaveBeenCalledWith('/identity/api/v1/auth/me');
    });
  });

  describe('getSessions', () => {
    it('calls GET /identity/api/v1/auth/me/sessions', async () => {
      await getSessions(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me/sessions');
    });
  });

  describe('deleteSession', () => {
    it('calls DELETE /identity/api/v1/auth/me/sessions/{id}', async () => {
      await deleteSession(mockClient, 'session-42');
      expect(mockClient.delete).toHaveBeenCalledWith('/identity/api/v1/auth/me/sessions/session-42');
    });
  });

  describe('getMFAMethods', () => {
    it('calls GET /identity/api/v1/auth/me/mfa-methods', async () => {
      await getMFAMethods(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/identity/api/v1/auth/me/mfa-methods');
    });
  });
});
