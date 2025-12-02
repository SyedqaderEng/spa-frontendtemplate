'use client';

import { Suspense } from 'react';
import { CheckoutSuccessContent } from './CheckoutSuccessContent';
import { BaseLayout } from '@/components/layout';

function LoadingFallback() {
  return (
    <BaseLayout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20">
        <div className="mx-auto max-w-lg px-4 text-center" data-testid="success-page">
          <div data-testid="loading-state">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Processing your subscription...
            </h1>
            <p className="mt-2 text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
