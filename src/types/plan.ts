import type { PlanName } from './subscription';

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: PlanName;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  isPopular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'free',
    displayName: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Basic security monitoring', included: true },
      { name: 'Up to 3 users', included: true },
      { name: 'Email support', included: true },
      { name: 'API access', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom integrations', included: false },
    ],
    isPopular: false,
  },
  {
    id: 'plan_pro',
    name: 'pro',
    displayName: 'Pro',
    description: 'Best for growing teams',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Advanced security monitoring', included: true },
      { name: 'Up to 25 users', included: true },
      { name: 'Priority email support', included: true },
      { name: 'API access', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom integrations', included: false },
    ],
    isPopular: true,
  },
  {
    id: 'plan_premium',
    name: 'premium',
    displayName: 'Premium',
    description: 'For large organizations',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Enterprise security monitoring', included: true },
      { name: 'Unlimited users', included: true },
      { name: '24/7 phone & email support', included: true },
      { name: 'Full API access', included: true },
      { name: 'Advanced analytics & reports', included: true },
      { name: 'Custom integrations', included: true },
    ],
    isPopular: false,
  },
];
