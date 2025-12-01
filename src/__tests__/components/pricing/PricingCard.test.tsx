import { render, screen, fireEvent } from '@testing-library/react';
import { PricingCard } from '@/components/pricing/PricingCard';
import type { Plan } from '@/types/plan';

const mockFreePlan: Plan = {
  id: 'plan_free',
  name: 'free',
  displayName: 'Free',
  description: 'Perfect for getting started',
  price: 0,
  currency: 'USD',
  interval: 'month',
  features: [
    { name: 'Basic security', included: true },
    { name: 'Up to 3 users', included: true },
    { name: 'API access', included: false },
  ],
  isPopular: false,
};

const mockProPlan: Plan = {
  id: 'plan_pro',
  name: 'pro',
  displayName: 'Pro',
  description: 'Best for growing teams',
  price: 29,
  currency: 'USD',
  interval: 'month',
  features: [
    { name: 'Advanced security', included: true },
    { name: 'Up to 25 users', included: true },
    { name: 'API access', included: true },
  ],
  isPopular: true,
};

const mockPremiumPlan: Plan = {
  id: 'plan_premium',
  name: 'premium',
  displayName: 'Premium',
  description: 'For large organizations',
  price: 99,
  currency: 'USD',
  interval: 'month',
  features: [
    { name: 'Enterprise security', included: true },
    { name: 'Unlimited users', included: true },
    { name: 'Full API access', included: true },
  ],
  isPopular: false,
};

describe('PricingCard Component', () => {
  describe('Rendering', () => {
    it('renders the plan name', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByTestId('plan-name')).toHaveTextContent('Free');
    });

    it('renders the plan description', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByText('Perfect for getting started')).toBeInTheDocument();
    });

    it('renders the plan price correctly', () => {
      render(<PricingCard plan={mockProPlan} />);

      expect(screen.getByTestId('plan-price')).toHaveTextContent('$29');
    });

    it('renders free plan price as $0', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByTestId('plan-price')).toHaveTextContent('$0');
    });

    it('renders all features', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByText('Basic security')).toBeInTheDocument();
      expect(screen.getByText('Up to 3 users')).toBeInTheDocument();
      expect(screen.getByText('API access')).toBeInTheDocument();
    });

    it('renders features list', () => {
      render(<PricingCard plan={mockProPlan} />);

      const featuresList = screen.getByTestId('features-list');
      expect(featuresList).toBeInTheDocument();
      expect(featuresList.querySelectorAll('li')).toHaveLength(3);
    });
  });

  describe('Popular Badge', () => {
    it('shows Most Popular badge when isPopular is true', () => {
      render(<PricingCard plan={mockProPlan} />);

      expect(screen.getByTestId('popular-badge')).toBeInTheDocument();
      expect(screen.getByTestId('popular-badge')).toHaveTextContent('Most Popular');
    });

    it('does not show Most Popular badge when isPopular is false', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.queryByTestId('popular-badge')).not.toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('shows "Subscribe" button when not current plan', () => {
      render(<PricingCard plan={mockProPlan} isCurrentPlan={false} />);

      expect(screen.getByTestId('subscribe-button')).toHaveTextContent('Subscribe');
    });

    it('shows "Get Started Free" button for free plan', () => {
      render(<PricingCard plan={mockFreePlan} isCurrentPlan={false} />);

      expect(screen.getByTestId('subscribe-button')).toHaveTextContent('Get Started Free');
    });

    it('shows "Current Plan" button when isCurrentPlan is true', () => {
      render(<PricingCard plan={mockProPlan} isCurrentPlan={true} />);

      expect(screen.getByTestId('current-plan-button')).toBeInTheDocument();
      expect(screen.getByTestId('current-plan-button')).toHaveTextContent('Current Plan');
      expect(screen.queryByTestId('subscribe-button')).not.toBeInTheDocument();
    });

    it('disables "Current Plan" button', () => {
      render(<PricingCard plan={mockProPlan} isCurrentPlan={true} />);

      expect(screen.getByTestId('current-plan-button')).toBeDisabled();
    });

    it('shows loading state when isLoading is true', () => {
      render(<PricingCard plan={mockProPlan} isLoading={true} />);

      expect(screen.getByTestId('subscribe-button')).toHaveTextContent('Processing...');
    });

    it('disables button when isLoading is true', () => {
      render(<PricingCard plan={mockProPlan} isLoading={true} />);

      expect(screen.getByTestId('subscribe-button')).toBeDisabled();
    });
  });

  describe('Subscribe Callback', () => {
    it('calls onSubscribe with plan id when clicked', () => {
      const mockOnSubscribe = jest.fn();
      render(<PricingCard plan={mockProPlan} onSubscribe={mockOnSubscribe} />);

      fireEvent.click(screen.getByTestId('subscribe-button'));

      expect(mockOnSubscribe).toHaveBeenCalledWith('plan_pro');
    });

    it('does not call onSubscribe when button is disabled (current plan)', () => {
      const mockOnSubscribe = jest.fn();
      render(
        <PricingCard plan={mockProPlan} isCurrentPlan={true} onSubscribe={mockOnSubscribe} />
      );

      // Current plan button should be disabled and clicking should not call the handler
      const button = screen.getByTestId('current-plan-button');
      fireEvent.click(button);

      expect(mockOnSubscribe).not.toHaveBeenCalled();
    });

    it('does not crash when onSubscribe is not provided', () => {
      render(<PricingCard plan={mockProPlan} />);

      // Should not throw when clicking
      expect(() => {
        fireEvent.click(screen.getByTestId('subscribe-button'));
      }).not.toThrow();
    });
  });

  describe('Different Plans', () => {
    it('renders free plan correctly', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByTestId('plan-name')).toHaveTextContent('Free');
      expect(screen.getByTestId('plan-price')).toHaveTextContent('$0');
      expect(screen.queryByTestId('popular-badge')).not.toBeInTheDocument();
    });

    it('renders pro plan with popular badge', () => {
      render(<PricingCard plan={mockProPlan} />);

      expect(screen.getByTestId('plan-name')).toHaveTextContent('Pro');
      expect(screen.getByTestId('plan-price')).toHaveTextContent('$29');
      expect(screen.getByTestId('popular-badge')).toBeInTheDocument();
    });

    it('renders premium plan correctly', () => {
      render(<PricingCard plan={mockPremiumPlan} />);

      expect(screen.getByTestId('plan-name')).toHaveTextContent('Premium');
      expect(screen.getByTestId('plan-price')).toHaveTextContent('$99');
      expect(screen.queryByTestId('popular-badge')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has data-testid for the card', () => {
      render(<PricingCard plan={mockFreePlan} />);

      expect(screen.getByTestId('pricing-card-free')).toBeInTheDocument();
    });

    it('has data-testid for pro card', () => {
      render(<PricingCard plan={mockProPlan} />);

      expect(screen.getByTestId('pricing-card-pro')).toBeInTheDocument();
    });
  });
});
