import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the auth context for the header
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Landing Page', () => {
  describe('Hero Section', () => {
    it('renders the main headline', () => {
      render(<Home />);

      expect(screen.getByText('Secure Your Digital')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure Today')).toBeInTheDocument();
    });

    it('renders the subheadline/description', () => {
      render(<Home />);

      expect(
        screen.getByText(/Enterprise-grade security solutions for modern businesses/i)
      ).toBeInTheDocument();
    });

    it('renders the primary CTA button (Get Started)', () => {
      render(<Home />);

      const ctaButton = screen.getByRole('link', { name: /get started free/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveAttribute('href', '/sign-up');
    });

    it('renders the secondary CTA button (View Pricing)', () => {
      render(<Home />);

      const pricingButton = screen.getByRole('link', { name: /view pricing/i });
      expect(pricingButton).toBeInTheDocument();
      expect(pricingButton).toHaveAttribute('href', '/pricing');
    });
  });

  describe('Navigation Header', () => {
    it('renders the navigation header', () => {
      render(<Home />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders the Pricing link in navigation', () => {
      render(<Home />);

      const pricingLinks = screen.getAllByRole('link', { name: /pricing/i });
      // One in nav, one in hero
      expect(pricingLinks.length).toBeGreaterThanOrEqual(1);
      expect(pricingLinks[0]).toHaveAttribute('href', '/pricing');
    });

    it('renders the Login link in navigation', () => {
      render(<Home />);

      const loginLink = screen.getByRole('link', { name: /login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders the Dashboard link in navigation', () => {
      render(<Home />);

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Features Section', () => {
    it('renders the features section heading', () => {
      render(<Home />);

      expect(
        screen.getByText(/Everything you need for complete security/i)
      ).toBeInTheDocument();
    });

    it('renders feature cards', () => {
      render(<Home />);

      expect(screen.getByText('Advanced Protection')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText('24/7 Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Data Encryption')).toBeInTheDocument();
      expect(screen.getByText('Easy Integration')).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('renders the CTA section heading', () => {
      render(<Home />);

      expect(screen.getByText(/Ready to get started/i)).toBeInTheDocument();
    });

    it('renders the free trial CTA button', () => {
      render(<Home />);

      const trialButton = screen.getByRole('link', { name: /start your free trial/i });
      expect(trialButton).toBeInTheDocument();
      expect(trialButton).toHaveAttribute('href', '/sign-up');
    });
  });

  describe('Footer', () => {
    it('renders the footer', () => {
      render(<Home />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('renders legal links in footer', () => {
      render(<Home />);

      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
    });
  });
});
