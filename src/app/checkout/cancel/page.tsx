'use client';

import { useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layout';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <BaseLayout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20">
        <div className="mx-auto max-w-lg px-4 text-center" data-testid="cancel-page">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900" data-testid="cancel-title">
            Checkout Cancelled
          </h1>
          <p className="mt-2 text-gray-600" data-testid="cancel-message">
            Your checkout was cancelled and no charges were made to your account.
            If you have any questions, please contact our support team.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push('/pricing')}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              data-testid="back-to-pricing-button"
            >
              Back to Pricing
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              data-testid="go-home-button"
            >
              Go to Home
            </button>
          </div>
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
            <p className="mt-1 text-sm text-gray-600">
              If you encountered any issues during checkout, please{' '}
              <a
                href="/contact"
                className="text-blue-600 hover:underline"
              >
                contact our support team
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
