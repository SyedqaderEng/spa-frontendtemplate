import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders the header with banner role', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders the brand/logo link', () => {
      render(<Header />);

      const brandLink = screen.getByLabelText('Home');
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute('href', '/');
    });

    it('renders navigation links', () => {
      render(<Header />);

      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('renders Pricing link', () => {
      render(<Header />);

      const pricingLink = screen.getByRole('link', { name: 'Pricing' });
      expect(pricingLink).toBeInTheDocument();
      expect(pricingLink).toHaveAttribute('href', '/pricing');
    });

    it('renders Login link', () => {
      render(<Header />);

      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders Dashboard link', () => {
      render(<Header />);

      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu button', () => {
      render(<Header />);

      const mobileMenuButton = screen.getByLabelText('Open main menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<Header className="custom-header-class" />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-header-class');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria labels', () => {
      render(<Header />);

      expect(screen.getByLabelText('Home')).toBeInTheDocument();
      expect(screen.getByLabelText('Open main menu')).toBeInTheDocument();
    });
  });
});
