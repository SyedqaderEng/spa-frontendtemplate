import { BaseLayout } from '@/components/layout';

export default function PricingPage() {
  return (
    <BaseLayout>
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Choose the plan that best fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Pricing cards will be implemented in P-F-6 */}
          <div className="mt-16 text-center text-gray-500">
            <p>Pricing cards coming soon...</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
