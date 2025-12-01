import { act, renderHook } from '@testing-library/react';
import {
  useUserStore,
  useUser,
  useSubscription,
  usePlanName,
  useIsSubscriptionActive,
  useIsProOrHigher,
  useIsPremium,
} from '@/store/useUserStore';
import type { User } from '@/types/auth';
import type { Subscription } from '@/types/subscription';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

// Mock subscription data
const mockSubscription: Subscription = {
  id: 'sub_123',
  planName: 'pro',
  isActive: true,
  currentPeriodStart: '2024-01-01',
  currentPeriodEnd: '2024-02-01',
};

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUserStore.getState().reset();
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isUserLoading).toBe(false);
      expect(state.userError).toBeNull();
      expect(state.subscription).toBeNull();
      expect(state.isSubscriptionLoading).toBe(false);
      expect(state.subscriptionError).toBeNull();
    });
  });

  describe('User Actions', () => {
    it('setUser updates user state', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
      });

      const state = useUserStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.userError).toBeNull();
    });

    it('setUser clears user when passed null', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().setUser(null);
      });

      expect(useUserStore.getState().user).toBeNull();
    });

    it('updateUser updates user properties', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().updateUser({ firstName: 'Updated' });
      });

      const user = useUserStore.getState().user;
      expect(user?.firstName).toBe('Updated');
      expect(user?.lastName).toBe('User');
    });

    it('updateUser does nothing when user is null', () => {
      act(() => {
        useUserStore.getState().updateUser({ firstName: 'Updated' });
      });

      expect(useUserStore.getState().user).toBeNull();
    });

    it('setUserLoading updates loading state', () => {
      act(() => {
        useUserStore.getState().setUserLoading(true);
      });

      expect(useUserStore.getState().isUserLoading).toBe(true);
    });

    it('setUserError sets error and clears loading', () => {
      act(() => {
        useUserStore.getState().setUserLoading(true);
        useUserStore.getState().setUserError('Test error');
      });

      const state = useUserStore.getState();
      expect(state.userError).toBe('Test error');
      expect(state.isUserLoading).toBe(false);
    });

    it('clearUser clears user and error', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().setUserError('Test error');
        useUserStore.getState().clearUser();
      });

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.userError).toBeNull();
    });
  });

  describe('Subscription Actions', () => {
    it('setSubscription updates subscription state', () => {
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const state = useUserStore.getState();
      expect(state.subscription).toEqual(mockSubscription);
      expect(state.subscriptionError).toBeNull();
    });

    it('updateSubscription updates subscription properties', () => {
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
        useUserStore.getState().updateSubscription({ planName: 'premium' });
      });

      const subscription = useUserStore.getState().subscription;
      expect(subscription?.planName).toBe('premium');
      expect(subscription?.isActive).toBe(true);
    });

    it('updateSubscription does nothing when subscription is null', () => {
      act(() => {
        useUserStore.getState().updateSubscription({ planName: 'premium' });
      });

      expect(useUserStore.getState().subscription).toBeNull();
    });

    it('setSubscriptionLoading updates loading state', () => {
      act(() => {
        useUserStore.getState().setSubscriptionLoading(true);
      });

      expect(useUserStore.getState().isSubscriptionLoading).toBe(true);
    });

    it('setSubscriptionError sets error and clears loading', () => {
      act(() => {
        useUserStore.getState().setSubscriptionLoading(true);
        useUserStore.getState().setSubscriptionError('Subscription error');
      });

      const state = useUserStore.getState();
      expect(state.subscriptionError).toBe('Subscription error');
      expect(state.isSubscriptionLoading).toBe(false);
    });

    it('clearSubscription clears subscription and error', () => {
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
        useUserStore.getState().setSubscriptionError('Test error');
        useUserStore.getState().clearSubscription();
      });

      const state = useUserStore.getState();
      expect(state.subscription).toBeNull();
      expect(state.subscriptionError).toBeNull();
    });
  });

  describe('Reset Action', () => {
    it('reset clears all state', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().setSubscription(mockSubscription);
        useUserStore.getState().setUserError('error');
        useUserStore.getState().setSubscriptionError('error');
        useUserStore.getState().reset();
      });

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.subscription).toBeNull();
      expect(state.userError).toBeNull();
      expect(state.subscriptionError).toBeNull();
      expect(state.isUserLoading).toBe(false);
      expect(state.isSubscriptionLoading).toBe(false);
    });
  });

  describe('Selector Hooks', () => {
    it('useUser returns user state', () => {
      act(() => {
        useUserStore.getState().setUser(mockUser);
      });

      const { result } = renderHook(() => useUser());
      expect(result.current).toEqual(mockUser);
    });

    it('useSubscription returns subscription state', () => {
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const { result } = renderHook(() => useSubscription());
      expect(result.current).toEqual(mockSubscription);
    });

    it('usePlanName returns plan name or free as default', () => {
      // Without subscription
      const { result: result1 } = renderHook(() => usePlanName());
      expect(result1.current).toBe('free');

      // With subscription
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const { result: result2 } = renderHook(() => usePlanName());
      expect(result2.current).toBe('pro');
    });

    it('useIsSubscriptionActive returns active status', () => {
      // Without subscription
      const { result: result1 } = renderHook(() => useIsSubscriptionActive());
      expect(result1.current).toBe(false);

      // With active subscription
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const { result: result2 } = renderHook(() => useIsSubscriptionActive());
      expect(result2.current).toBe(true);
    });

    it('useIsProOrHigher returns true for pro and premium', () => {
      // Free plan
      const { result: result1 } = renderHook(() => useIsProOrHigher());
      expect(result1.current).toBe(false);

      // Pro plan
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const { result: result2 } = renderHook(() => useIsProOrHigher());
      expect(result2.current).toBe(true);

      // Premium plan
      act(() => {
        useUserStore.getState().updateSubscription({ planName: 'premium' });
      });

      const { result: result3 } = renderHook(() => useIsProOrHigher());
      expect(result3.current).toBe(true);
    });

    it('useIsPremium returns true only for premium', () => {
      // Without subscription
      const { result: result1 } = renderHook(() => useIsPremium());
      expect(result1.current).toBe(false);

      // Pro plan
      act(() => {
        useUserStore.getState().setSubscription(mockSubscription);
      });

      const { result: result2 } = renderHook(() => useIsPremium());
      expect(result2.current).toBe(false);

      // Premium plan
      act(() => {
        useUserStore.getState().updateSubscription({ planName: 'premium' });
      });

      const { result: result3 } = renderHook(() => useIsPremium());
      expect(result3.current).toBe(true);
    });
  });
});
