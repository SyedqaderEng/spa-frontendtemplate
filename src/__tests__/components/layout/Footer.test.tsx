import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('renders the footer with contentinfo role', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('renders the brand name', () => {
      render(<Footer />);

      const brandLink = screen.getByRole('link', { name: 'SPA Template' });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute('href', '/');
    });

    it('renders the description text', () => {
      render(<Footer />);

      const description = screen.getByText(/A modern, professional SaaS template/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Legal Links', () => {
    it('renders Privacy Policy link', () => {
      render(<Footer />);

      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('renders Terms of Service link', () => {
      render(<Footer />);

      const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');
    });
  });

  describe('Social Links', () => {
    it('renders Twitter link', () => {
      render(<Footer />);

      const twitterLink = screen.getByLabelText('Twitter');
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders GitHub link', () => {
      render(<Footer />);

      const githubLink = screen.getByLabelText('GitHub');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com');
      expect(githubLink).toHaveAttribute('target', '_blank');
    });

    it('renders LinkedIn link', () => {
      render(<Footer />);

      const linkedinLink = screen.getByLabelText('LinkedIn');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Copyright', () => {
    it('renders copyright notice with current year', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(new RegExp(`${currentYear} SPA Template`));
      expect(copyright).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<Footer className="custom-footer-class" />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('custom-footer-class');
    });
  });

  describe('Section Headers', () => {
    it('renders Legal section header', () => {
      render(<Footer />);

      const legalHeader = screen.getByText('Legal');
      expect(legalHeader).toBeInTheDocument();
    });

    it('renders Connect section header', () => {
      render(<Footer />);

      const connectHeader = screen.getByText('Connect');
      expect(connectHeader).toBeInTheDocument();
    });
  });
});
