// @ts-nocheck — vitest mock types
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTenant,
  getTenant,
  updateTenant,
  listMembers,
  addMember,
  removeMember,
  inviteMember,
  acceptInvitation,
  getInvitations,
  getApplications,
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

describe('api-tenant', () => {
  describe('createTenant', () => {
    it('calls POST /tenant/api/v1/admin/tenants', async () => {
      const data = { name: 'Acme Corp', displayName: 'Acme', plan: 'pro' };
      await createTenant(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/tenant/api/v1/admin/tenants', data);
    });
  });

  describe('getTenant', () => {
    it('calls GET /tenant/api/v1/tenants/{id}', async () => {
      await getTenant(mockClient, 'tenant-123');
      expect(mockClient.get).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123');
    });
  });

  describe('updateTenant', () => {
    it('calls PUT /tenant/api/v1/tenants/{id}', async () => {
      const data = { displayName: 'Updated Name' };
      await updateTenant(mockClient, 'tenant-123', data);
      expect(mockClient.put).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123', data);
    });
  });

  describe('listMembers', () => {
    it('calls GET /tenant/api/v1/tenants/{id}/members', async () => {
      await listMembers(mockClient, 'tenant-123');
      expect(mockClient.get).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/members');
    });
  });

  describe('addMember', () => {
    it('calls POST /tenant/api/v1/tenants/{id}/members', async () => {
      const data = { email: 'user@example.com', role: 'admin' };
      await addMember(mockClient, 'tenant-123', data);
      expect(mockClient.post).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/members', data);
    });
  });

  describe('removeMember', () => {
    it('calls DELETE /tenant/api/v1/tenants/{id}/members/{userId}', async () => {
      await removeMember(mockClient, 'tenant-123', 'user-456');
      expect(mockClient.delete).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/members/user-456');
    });
  });

  describe('inviteMember', () => {
    it('calls POST /tenant/api/v1/tenants/{id}/invitations', async () => {
      const data = { email: 'user@example.com', role: 'member' };
      await inviteMember(mockClient, 'tenant-123', data);
      expect(mockClient.post).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/invitations', data);
    });
  });

  describe('acceptInvitation', () => {
    it('calls POST /tenant/api/v1/tenants/invitations/{token}/accept', async () => {
      await acceptInvitation(mockClient, 'invite-token-abc');
      expect(mockClient.post).toHaveBeenCalledWith('/tenant/api/v1/tenants/invitations/invite-token-abc/accept');
    });
  });

  describe('getInvitations', () => {
    it('calls GET /tenant/api/v1/tenants/{id}/invitations', async () => {
      await getInvitations(mockClient, 'tenant-123');
      expect(mockClient.get).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/invitations');
    });
  });

  describe('getApplications', () => {
    it('calls GET /tenant/api/v1/tenants/{id}/applications', async () => {
      await getApplications(mockClient, 'tenant-123');
      expect(mockClient.get).toHaveBeenCalledWith('/tenant/api/v1/tenants/tenant-123/applications');
    });
  });
});
