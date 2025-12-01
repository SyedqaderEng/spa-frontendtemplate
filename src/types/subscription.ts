export type PlanName = 'free' | 'pro' | 'premium';

export interface Subscription {
  id: string;
  planName: PlanName;
  isActive: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

export const DEFAULT_SUBSCRIPTION: Subscription = {
  id: '',
  planName: 'free',
  isActive: false,
};
