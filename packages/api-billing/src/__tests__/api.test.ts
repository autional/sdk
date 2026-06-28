import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPlans,
  getSubscription,
  subscribe,
  cancelSubscription,
  getUsage,
  getInvoices,
  getInvoice,
  getBalance,
  getFeatureGates,
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

describe('api-billing', () => {
  describe('getPlans', () => {
    it('calls GET /billing/api/v1/public/plans', async () => {
      await getPlans(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/public/plans');
    });
  });

  describe('getSubscription', () => {
    it('calls GET /billing/api/v1/billing/subscription', async () => {
      await getSubscription(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/subscription');
    });
  });

  describe('subscribe', () => {
    it('calls POST /billing/api/v1/billing/subscribe', async () => {
      const data = { planId: 'plan-pro' };
      await subscribe(mockClient, data);
      expect(mockClient.post).toHaveBeenCalledWith('/billing/api/v1/billing/subscribe', data);
    });
  });

  describe('cancelSubscription', () => {
    it('calls POST /billing/api/v1/billing/subscription/cancel', async () => {
      await cancelSubscription(mockClient);
      expect(mockClient.post).toHaveBeenCalledWith('/billing/api/v1/billing/subscription/cancel');
    });
  });

  describe('getUsage', () => {
    it('calls GET /billing/api/v1/billing/usage', async () => {
      await getUsage(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/usage');
    });
  });

  describe('getInvoices', () => {
    it('calls GET /billing/api/v1/billing/invoices', async () => {
      await getInvoices(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/invoices');
    });
  });

  describe('getInvoice', () => {
    it('calls GET /billing/api/v1/billing/invoice/{id}', async () => {
      await getInvoice(mockClient, 'inv-001');
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/invoice/inv-001');
    });
  });

  describe('getBalance', () => {
    it('calls GET /billing/api/v1/billing/balance', async () => {
      await getBalance(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/balance');
    });
  });

  describe('getFeatureGates', () => {
    it('calls GET /billing/api/v1/billing/feature-gates', async () => {
      await getFeatureGates(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith('/billing/api/v1/billing/feature-gates');
    });
  });
});
