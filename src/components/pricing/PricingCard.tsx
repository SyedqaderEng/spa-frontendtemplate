'use client';

import type { Plan } from '@/types/plan';

export interface PricingCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSubscribe?: (planId: string) => void;
  isLoading?: boolean;
}

export function PricingCard({
  plan,
  isCurrentPlan = false,
  onSubscribe,
  isLoading = false,
}: PricingCardProps) {
  const { id, displayName, description, price, currency, interval, features, isPopular } = plan;

  const formatPrice = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border p-8
        ${isPopular
          ? 'border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-600'
          : 'border-gray-200 bg-white shadow-sm'
        }
      `}
      data-testid={`pricing-card-${plan.name}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white"
          data-testid="popular-badge"
        >
          Most Popular
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900" data-testid="plan-name">
          {displayName}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-baseline justify-center gap-1">
        <span
          className={`text-5xl font-bold tracking-tight ${
            isPopular ? 'text-blue-600' : 'text-gray-900'
          }`}
          data-testid="plan-price"
        >
          {formatPrice(price, currency)}
        </span>
        {price > 0 && (
          <span className="text-sm text-gray-500">/{interval}</span>
        )}
      </div>

      {/* Features */}
      <ul className="mt-8 space-y-3 flex-1" data-testid="features-list">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span
              className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}
              data-testid={`feature-${index}`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="mt-8">
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 text-center text-sm font-semibold text-gray-500 cursor-not-allowed"
            data-testid="current-plan-button"
          >
            Current Plan
          </button>
        ) : (
          <button
            onClick={() => onSubscribe?.(id)}
            disabled={isLoading}
            className={`
              w-full rounded-lg px-6 py-3 text-center text-sm font-semibold
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${isPopular
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
              }
            `}
            data-testid="subscribe-button"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : price === 0 ? (
              'Get Started Free'
            ) : (
              'Subscribe'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default PricingCard;
