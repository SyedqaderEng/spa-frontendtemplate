'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layout';
import { useUserStore } from '@/store';
import { getSubscriptionStatus } from '@/services/subscription';

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSubscription, setSubscriptionLoading, setSubscriptionError } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setSubscriptionLoading(true);
        const subscription = await getSubscriptionStatus();
        setSubscription({
          id: sessionId || 'sub_new',
          planName: subscription.planName,
          isActive: subscription.isActive,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd || new Date().toISOString(),
        });
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify subscription';
        setSubscriptionError(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      }
    }

    // Give a moment for the backend to process the webhook
    const timer = setTimeout(() => {
      fetchSubscription();
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId, setSubscription, setSubscriptionLoading, setSubscriptionError]);

  return (
    <BaseLayout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20">
        <div className="mx-auto max-w-lg px-4 text-center" data-testid="success-page">
          {isLoading ? (
            <div data-testid="loading-state">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Processing your subscription...
              </h1>
              <p className="mt-2 text-gray-600">
                Please wait while we confirm your payment.
              </p>
            </div>
          ) : error ? (
            <div data-testid="error-state">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Payment Received
              </h1>
              <p className="mt-2 text-gray-600">
                Your payment was successful, but we encountered an issue verifying your subscription.
                Please check your dashboard or contact support if your subscription doesn&apos;t appear.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  data-testid="go-to-dashboard-button"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  data-testid="retry-button"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div data-testid="success-state">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Subscription Activated!
              </h1>
              <p className="mt-2 text-gray-600">
                Thank you for subscribing! Your account has been upgraded and you now have access
                to all premium features.
              </p>
              {sessionId && (
                <p className="mt-4 text-sm text-gray-500">
                  Transaction ID: {sessionId}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  data-testid="go-to-dashboard-button"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/pricing')}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  data-testid="view-plans-button"
                >
                  View Plans
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </BaseLayout>
  );
}
