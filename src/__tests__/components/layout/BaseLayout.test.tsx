import { render, screen } from '@testing-library/react';
import { BaseLayout } from '@/components/layout/BaseLayout';

describe('BaseLayout Component', () => {
  describe('Rendering', () => {
    it('renders the base layout container', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      const layoutContainer = screen.getByTestId('base-layout');
      expect(layoutContainer).toBeInTheDocument();
    });

    it('renders children content in the main section', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      const mainContent = screen.getByTestId('main-content');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveTextContent('Test Content');
    });

    it('renders header by default', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders footer by default', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Header/Footer Visibility', () => {
    it('hides header when showHeader is false', () => {
      render(<BaseLayout showHeader={false}>Test Content</BaseLayout>);

      const header = screen.queryByRole('banner');
      expect(header).not.toBeInTheDocument();
    });

    it('hides footer when showFooter is false', () => {
      render(<BaseLayout showFooter={false}>Test Content</BaseLayout>);

      const footer = screen.queryByRole('contentinfo');
      expect(footer).not.toBeInTheDocument();
    });

    it('can hide both header and footer', () => {
      render(
        <BaseLayout showHeader={false} showFooter={false}>
          Test Content
        </BaseLayout>
      );

      const header = screen.queryByRole('banner');
      const footer = screen.queryByRole('contentinfo');

      expect(header).not.toBeInTheDocument();
      expect(footer).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has main landmark with role="main"', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(<BaseLayout>Test Content</BaseLayout>);

      // Check for semantic landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to main content', () => {
      render(<BaseLayout className="custom-class">Test Content</BaseLayout>);

      const mainContent = screen.getByTestId('main-content');
      expect(mainContent).toHaveClass('custom-class');
    });
  });

  describe('Complex Children', () => {
    it('renders complex children correctly', () => {
      render(
        <BaseLayout>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
        </BaseLayout>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
