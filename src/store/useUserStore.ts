import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import type { Subscription, PlanName } from '@/types/subscription';

export interface UserState {
  // User profile
  user: User | null;
  isUserLoading: boolean;
  userError: string | null;

  // Subscription
  subscription: Subscription | null;
  isSubscriptionLoading: boolean;
  subscriptionError: string | null;
}

export interface UserActions {
  // User actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setUserLoading: (isLoading: boolean) => void;
  setUserError: (error: string | null) => void;
  clearUser: () => void;

  // Subscription actions
  setSubscription: (subscription: Subscription | null) => void;
  updateSubscription: (updates: Partial<Subscription>) => void;
  setSubscriptionLoading: (isLoading: boolean) => void;
  setSubscriptionError: (error: string | null) => void;
  clearSubscription: () => void;

  // Combined actions
  reset: () => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  user: null,
  isUserLoading: false,
  userError: null,
  subscription: null,
  isSubscriptionLoading: false,
  subscriptionError: null,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // User actions
        setUser: (user) =>
          set({ user, userError: null }, false, 'setUser'),

        updateUser: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'updateUser'
          ),

        setUserLoading: (isUserLoading) =>
          set({ isUserLoading }, false, 'setUserLoading'),

        setUserError: (userError) =>
          set({ userError, isUserLoading: false }, false, 'setUserError'),

        clearUser: () =>
          set({ user: null, userError: null }, false, 'clearUser'),

        // Subscription actions
        setSubscription: (subscription) =>
          set({ subscription, subscriptionError: null }, false, 'setSubscription'),

        updateSubscription: (updates) =>
          set(
            (state) => ({
              subscription: state.subscription
                ? { ...state.subscription, ...updates }
                : null,
            }),
            false,
            'updateSubscription'
          ),

        setSubscriptionLoading: (isSubscriptionLoading) =>
          set({ isSubscriptionLoading }, false, 'setSubscriptionLoading'),

        setSubscriptionError: (subscriptionError) =>
          set(
            { subscriptionError, isSubscriptionLoading: false },
            false,
            'setSubscriptionError'
          ),

        clearSubscription: () =>
          set(
            { subscription: null, subscriptionError: null },
            false,
            'clearSubscription'
          ),

        // Combined actions
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          subscription: state.subscription,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useIsUserLoading = () => useUserStore((state) => state.isUserLoading);
export const useUserError = () => useUserStore((state) => state.userError);

export const useSubscription = () => useUserStore((state) => state.subscription);
export const useIsSubscriptionLoading = () =>
  useUserStore((state) => state.isSubscriptionLoading);
export const useSubscriptionError = () =>
  useUserStore((state) => state.subscriptionError);

// Derived selectors
export const usePlanName = (): PlanName =>
  useUserStore((state) => state.subscription?.planName ?? 'free');

export const useIsSubscriptionActive = (): boolean =>
  useUserStore((state) => state.subscription?.isActive ?? false);

export const useIsProOrHigher = (): boolean =>
  useUserStore((state) => {
    const plan = state.subscription?.planName;
    return plan === 'pro' || plan === 'premium';
  });

export const useIsPremium = (): boolean =>
  useUserStore((state) => state.subscription?.planName === 'premium');
