import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PricingPage from '@/app/pricing/page';
import { useUserStore } from '@/store/useUserStore';
import * as subscriptionService from '@/services/subscription';
import * as AuthContext from '@/contexts/AuthContext';
import * as ToastContext from '@/contexts/ToastContext';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock subscription service
jest.mock('@/services/subscription', () => ({
  createCheckoutSession: jest.fn(),
  redirectToCheckout: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => {
  return {
    useAuth: jest.fn(),
  };
});

// Mock ToastContext
const mockShowError = jest.fn();
const mockShowInfo = jest.fn();
jest.mock('@/contexts/ToastContext', () => {
  return {
    useToast: jest.fn(() => ({
      toasts: [],
      showError: mockShowError,
      showInfo: mockShowInfo,
      showSuccess: jest.fn(),
      showWarning: jest.fn(),
      showToast: jest.fn(),
      removeToast: jest.fn(),
      clearAllToasts: jest.fn(),
    })),
    ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockUseAuth = AuthContext.useAuth as jest.MockedFunction<typeof AuthContext.useAuth>;

const mockCreateCheckoutSession = subscriptionService.createCheckoutSession as jest.MockedFunction<
  typeof subscriptionService.createCheckoutSession
>;
const mockRedirectToCheckout = subscriptionService.redirectToCheckout as jest.MockedFunction<
  typeof subscriptionService.redirectToCheckout
>;

describe('PricingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.getState().reset();

    // Default mock for useAuth - not authenticated
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      clearError: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('renders the pricing page with all plans', () => {
      render(<PricingPage />);

      expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-card-free')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-card-pro')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-card-premium')).toBeInTheDocument();
    });

    it('shows all plan prices', () => {
      render(<PricingPage />);

      const prices = screen.getAllByTestId('plan-price');
      expect(prices).toHaveLength(3);
    });

    it('displays the most popular badge on pro plan', () => {
      render(<PricingPage />);

      expect(screen.getByTestId('popular-badge')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn(),
      });
    });

    it('redirects to sign-in when clicking subscribe while not authenticated', async () => {
      render(<PricingPage />);

      // Use more specific selection - get the button from the pro card
      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');

      expect(proSubscribeButton).toBeInTheDocument();
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/sign-in?redirect=/pricing&plan=plan_pro');
      });
    });

    it('does not call checkout session when not authenticated', async () => {
      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });

      expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
    });
  });

  describe('Authenticated User - Checkout Flow', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn(),
      });
    });

    it('calls createCheckoutSession when clicking subscribe', async () => {
      mockCreateCheckoutSession.mockResolvedValueOnce({
        checkoutUrl: 'https://checkout.stripe.com/session123',
        sessionId: 'session123',
      });

      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockCreateCheckoutSession).toHaveBeenCalledWith('plan_pro');
      });
    });

    it('redirects to checkout URL after successful session creation', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/session123';
      mockCreateCheckoutSession.mockResolvedValueOnce({
        checkoutUrl,
        sessionId: 'session123',
      });

      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockRedirectToCheckout).toHaveBeenCalledWith(checkoutUrl);
      });
    });

    it('shows loading state while processing checkout', async () => {
      // Create a promise that we can control
      let resolveCheckout: (value: { checkoutUrl: string; sessionId: string }) => void;
      const checkoutPromise = new Promise<{ checkoutUrl: string; sessionId: string }>((resolve) => {
        resolveCheckout = resolve;
      });
      mockCreateCheckoutSession.mockReturnValueOnce(checkoutPromise);

      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument();
      });

      // Resolve the promise
      resolveCheckout!({
        checkoutUrl: 'https://checkout.stripe.com/session123',
        sessionId: 'session123',
      });

      await waitFor(() => {
        expect(mockRedirectToCheckout).toHaveBeenCalled();
      });
    });

    it('shows error toast when checkout fails', async () => {
      mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Payment service unavailable'));

      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Payment service unavailable');
      });
    });

    it('shows generic error message for non-Error objects', async () => {
      mockCreateCheckoutSession.mockRejectedValueOnce({ code: 'UNKNOWN' });

      render(<PricingPage />);

      const proCard = screen.getByTestId('pricing-card-pro');
      const proSubscribeButton = proCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(proSubscribeButton!);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to start checkout');
      });
    });
  });

  describe('Free Plan Handling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn(),
      });
    });

    it('shows free plan as current plan when user has no subscription', () => {
      // By default, usePlanName returns 'free' when there's no subscription
      render(<PricingPage />);

      const freeCard = screen.getByTestId('pricing-card-free');
      const currentPlanButton = freeCard.querySelector('[data-testid="current-plan-button"]');

      expect(currentPlanButton).toBeInTheDocument();
      expect(currentPlanButton).toHaveTextContent('Current Plan');
      expect(currentPlanButton).toBeDisabled();
    });

    it('shows info toast when clicking subscribe on free plan while on paid plan', async () => {
      // Set subscription to pro so free plan shows subscribe button
      useUserStore.getState().setSubscription({
        id: 'sub_123',
        planName: 'pro',
        isActive: true,
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
      });

      render(<PricingPage />);

      const freeCard = screen.getByTestId('pricing-card-free');
      const freeSubscribeButton = freeCard.querySelector('[data-testid="subscribe-button"]');

      expect(freeSubscribeButton).toBeInTheDocument();
      fireEvent.click(freeSubscribeButton!);

      await waitFor(() => {
        expect(mockShowInfo).toHaveBeenCalledWith('You are already on the free plan!');
      });
    });

    it('does not call checkout session for free plan', async () => {
      // Set subscription to pro so free plan shows subscribe button
      useUserStore.getState().setSubscription({
        id: 'sub_123',
        planName: 'pro',
        isActive: true,
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
      });

      render(<PricingPage />);

      const freeCard = screen.getByTestId('pricing-card-free');
      const freeSubscribeButton = freeCard.querySelector('[data-testid="subscribe-button"]');
      fireEvent.click(freeSubscribeButton!);

      await waitFor(() => {
        expect(mockShowInfo).toHaveBeenCalled();
      });

      expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
    });
  });

  describe('Current Plan Display', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn(),
      });
    });

    it('shows current plan button for user subscription', () => {
      // Set user subscription to pro
      useUserStore.getState().setSubscription({
        id: 'sub_123',
        planName: 'pro',
        isActive: true,
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
      });

      render(<PricingPage />);

      expect(screen.getByTestId('current-plan-button')).toBeInTheDocument();
      expect(screen.getByTestId('current-plan-button')).toHaveTextContent('Current Plan');
    });

    it('disables current plan button', () => {
      useUserStore.getState().setSubscription({
        id: 'sub_123',
        planName: 'pro',
        isActive: true,
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
      });

      render(<PricingPage />);

      expect(screen.getByTestId('current-plan-button')).toBeDisabled();
    });
  });

  describe('Multiple Plan Subscriptions', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn(),
      });
    });

    it('allows clicking premium plan button', async () => {
      mockCreateCheckoutSession.mockResolvedValue({
        checkoutUrl: 'https://checkout.stripe.com/session',
        sessionId: 'session',
      });

      render(<PricingPage />);

      // Find the premium subscribe button
      const premiumCard = screen.getByTestId('pricing-card-premium');
      const subscribeButton = premiumCard.querySelector('[data-testid="subscribe-button"]');

      expect(subscribeButton).toBeInTheDocument();
      fireEvent.click(subscribeButton!);

      await waitFor(() => {
        expect(mockCreateCheckoutSession).toHaveBeenCalledWith('plan_premium');
      });
    });
  });
});
