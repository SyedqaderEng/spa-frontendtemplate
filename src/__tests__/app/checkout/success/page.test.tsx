import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CheckoutSuccessPage from '@/app/checkout/success/page';
import { useUserStore } from '@/store/useUserStore';
import * as subscriptionService from '@/services/subscription';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn((key: string) => {
      if (key === 'session_id') return 'cs_test_session123';
      return null;
    }),
  }),
}));

// Mock subscription service
jest.mock('@/services/subscription', () => ({
  getSubscriptionStatus: jest.fn(),
}));

const mockGetSubscriptionStatus = subscriptionService.getSubscriptionStatus as jest.MockedFunction<
  typeof subscriptionService.getSubscriptionStatus
>;

describe('CheckoutSuccessPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useUserStore.getState().reset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('shows loading spinner initially', () => {
      mockGetSubscriptionStatus.mockImplementation(() => new Promise(() => {}));

      render(<CheckoutSuccessPage />);

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Processing your subscription...')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      mockGetSubscriptionStatus.mockResolvedValue({
        planName: 'pro',
        isActive: true,
        currentPeriodEnd: '2024-02-01T00:00:00Z',
      });
    });

    it('shows success message after loading', async () => {
      render(<CheckoutSuccessPage />);

      // Fast forward past the 1500ms delay
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument();
      });

      expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
    });

    it('shows transaction ID when session_id is present', async () => {
      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByText(/Transaction ID: cs_test_session123/)).toBeInTheDocument();
      });
    });

    it('navigates to dashboard when clicking "Go to Dashboard" button', async () => {
      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('go-to-dashboard-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('go-to-dashboard-button'));

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('navigates to pricing when clicking "View Plans" button', async () => {
      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('view-plans-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('view-plans-button'));

      expect(mockPush).toHaveBeenCalledWith('/pricing');
    });

    it('updates user store with subscription data', async () => {
      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument();
      });

      const subscription = useUserStore.getState().subscription;
      expect(subscription).not.toBeNull();
      expect(subscription?.planName).toBe('pro');
      expect(subscription?.isActive).toBe(true);
    });
  });

  describe('Error State', () => {
    it('shows error state when subscription verification fails', async () => {
      mockGetSubscriptionStatus.mockRejectedValue(new Error('Verification failed'));

      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      expect(screen.getByText('Payment Received')).toBeInTheDocument();
      expect(screen.getByText(/we encountered an issue verifying your subscription/)).toBeInTheDocument();
    });

    it('shows retry button in error state', async () => {
      mockGetSubscriptionStatus.mockRejectedValue(new Error('Verification failed'));

      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });
    });

    it('navigates to dashboard from error state', async () => {
      mockGetSubscriptionStatus.mockRejectedValue(new Error('Verification failed'));

      render(<CheckoutSuccessPage />);

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('go-to-dashboard-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('go-to-dashboard-button'));

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Layout', () => {
    it('renders within BaseLayout', () => {
      mockGetSubscriptionStatus.mockImplementation(() => new Promise(() => {}));

      render(<CheckoutSuccessPage />);

      expect(screen.getByTestId('success-page')).toBeInTheDocument();
    });
  });
});
