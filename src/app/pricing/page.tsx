'use client';

import { BaseLayout } from '@/components/layout';
import { PricingCard } from '@/components/pricing';
import { PLANS } from '@/types/plan';
import { usePlanName } from '@/store';

export default function PricingPage() {
  const currentPlanName = usePlanName();

  const handleSubscribe = (planId: string) => {
    // This will be implemented in P-F-7
    console.log('Subscribe to plan:', planId);
  };

  return (
    <BaseLayout>
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Choose the plan that best fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.name === currentPlanName}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              All plans include SSL encryption, regular backups, and 99.9% uptime guarantee.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Need a custom plan? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
