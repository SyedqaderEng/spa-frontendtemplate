import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
} from '@/services/subscription';
import * as apiClient from '@/lib/api-client';

// Mock the api-client
jest.mock('@/lib/api-client', () => ({
  post: jest.fn(),
}));

const mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;

describe('Subscription Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('calls the checkout-session endpoint with plan ID', async () => {
      const mockResponse = {
        checkoutUrl: 'https://checkout.stripe.com/session123',
        sessionId: 'session123',
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await createCheckoutSession('plan_pro');

      expect(mockPost).toHaveBeenCalledWith('/subscriptions/checkout-session', {
        planId: 'plan_pro',
        successUrl: expect.stringContaining('/checkout/success'),
        cancelUrl: expect.stringContaining('/checkout/cancel'),
      });
      expect(result).toEqual(mockResponse);
    });

    it('uses custom success and cancel URLs when provided', async () => {
      const mockResponse = {
        checkoutUrl: 'https://checkout.stripe.com/session456',
        sessionId: 'session456',
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      await createCheckoutSession('plan_premium', {
        successUrl: 'http://localhost:3000/custom-success',
        cancelUrl: 'http://localhost:3000/custom-cancel',
      });

      expect(mockPost).toHaveBeenCalledWith('/subscriptions/checkout-session', {
        planId: 'plan_premium',
        successUrl: 'http://localhost:3000/custom-success',
        cancelUrl: 'http://localhost:3000/custom-cancel',
      });
    });

    it('throws error when API call fails', async () => {
      const error = new Error('Network error');
      mockPost.mockRejectedValueOnce(error);

      await expect(createCheckoutSession('plan_pro')).rejects.toThrow('Network error');
    });

    it('handles API error response', async () => {
      const apiError = {
        message: 'Invalid plan ID',
        statusCode: 400,
      };
      mockPost.mockRejectedValueOnce(apiError);

      await expect(createCheckoutSession('invalid_plan')).rejects.toEqual(apiError);
    });
  });

  describe('getSubscriptionStatus', () => {
    it('returns subscription status from API', async () => {
      const mockResponse = {
        planName: 'pro',
        isActive: true,
        currentPeriodEnd: '2024-02-01T00:00:00Z',
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await getSubscriptionStatus();

      expect(mockPost).toHaveBeenCalledWith('/subscriptions/status', {});
      expect(result).toEqual(mockResponse);
    });

    it('returns inactive status when no subscription', async () => {
      const mockResponse = {
        planName: 'free',
        isActive: false,
        currentPeriodEnd: null,
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await getSubscriptionStatus();

      expect(result.isActive).toBe(false);
      expect(result.planName).toBe('free');
    });
  });

  describe('cancelSubscription', () => {
    it('calls cancel endpoint and returns result', async () => {
      const mockResponse = {
        message: 'Subscription cancelled successfully',
        cancelledAt: '2024-01-15T10:00:00Z',
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await cancelSubscription();

      expect(mockPost).toHaveBeenCalledWith('/subscriptions/cancel', {});
      expect(result).toEqual(mockResponse);
    });

    it('throws error when cancellation fails', async () => {
      const error = new Error('Cannot cancel subscription');
      mockPost.mockRejectedValueOnce(error);

      await expect(cancelSubscription()).rejects.toThrow('Cannot cancel subscription');
    });
  });
});

describe('redirectToCheckout', () => {
  it('is exported from the service', async () => {
    // Test that the function exists and is exported
    const service = await import('@/services/subscription');
    expect(typeof service.redirectToCheckout).toBe('function');
  });
});
