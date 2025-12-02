import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutCancelPage from '@/app/checkout/cancel/page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('CheckoutCancelPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the cancel page', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByTestId('cancel-page')).toBeInTheDocument();
    });

    it('displays the cancel title', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByTestId('cancel-title')).toHaveTextContent('Checkout Cancelled');
    });

    it('displays the cancel message', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByTestId('cancel-message')).toHaveTextContent(
        'Your checkout was cancelled and no charges were made to your account.'
      );
    });

    it('displays the help section', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByText('Need Help?')).toBeInTheDocument();
      // Use getAllByText since the phrase appears in multiple places
      const supportTextElements = screen.getAllByText(/contact our support team/);
      expect(supportTextElements.length).toBeGreaterThan(0);
    });

    it('displays support link', () => {
      render(<CheckoutCancelPage />);

      const supportLink = screen.getByRole('link', { name: /contact our support team/i });
      expect(supportLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('Navigation', () => {
    it('navigates to pricing when clicking "Back to Pricing" button', () => {
      render(<CheckoutCancelPage />);

      fireEvent.click(screen.getByTestId('back-to-pricing-button'));

      expect(mockPush).toHaveBeenCalledWith('/pricing');
    });

    it('navigates to home when clicking "Go to Home" button', () => {
      render(<CheckoutCancelPage />);

      fireEvent.click(screen.getByTestId('go-home-button'));

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Button Content', () => {
    it('displays correct text on "Back to Pricing" button', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByTestId('back-to-pricing-button')).toHaveTextContent('Back to Pricing');
    });

    it('displays correct text on "Go to Home" button', () => {
      render(<CheckoutCancelPage />);

      expect(screen.getByTestId('go-home-button')).toHaveTextContent('Go to Home');
    });
  });

  describe('Layout', () => {
    it('contains cancel icon', () => {
      render(<CheckoutCancelPage />);

      // Check for the X icon SVG
      const svg = screen.getByTestId('cancel-page').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has proper styling container', () => {
      render(<CheckoutCancelPage />);

      const container = screen.getByTestId('cancel-page');
      expect(container).toHaveClass('text-center');
    });
  });
});
