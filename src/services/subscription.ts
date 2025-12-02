import { post } from '@/lib/api-client';
import type { PlanName } from '@/types/subscription';

export interface CheckoutSessionRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface SubscriptionStatusResponse {
  planName: PlanName;
  isActive: boolean;
  currentPeriodEnd: string | null;
}

/**
 * Creates a checkout session for subscription
 * Calls backend endpoint which handles Stripe/payment provider integration
 */
export async function createCheckoutSession(
  planId: string,
  options?: {
    successUrl?: string;
    cancelUrl?: string;
  }
): Promise<CheckoutSessionResponse> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const request: CheckoutSessionRequest = {
    planId,
    successUrl: options?.successUrl || `${baseUrl}/checkout/success`,
    cancelUrl: options?.cancelUrl || `${baseUrl}/checkout/cancel`,
  };

  return post<CheckoutSessionResponse>('/subscriptions/checkout-session', request);
}

/**
 * Redirects user to checkout page
 */
export function redirectToCheckout(checkoutUrl: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
  }
}

/**
 * Gets the current user's subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  return post<SubscriptionStatusResponse>('/subscriptions/status', {});
}

/**
 * Cancels the current subscription
 */
export async function cancelSubscription(): Promise<{
  message: string;
  cancelledAt: string;
}> {
  return post('/subscriptions/cancel', {});
}
