import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch for auth context
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function renderProtectedRoute(fallbackUrl?: string) {
  return render(
    <AuthProvider>
      <ProtectedRoute fallbackUrl={fallbackUrl}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockFetch.mockReset();
  });

  describe('Unauthenticated Users', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });
    });

    it('redirects unauthenticated users to sign-in page', async () => {
      renderProtectedRoute();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/sign-in');
      });
    });

    it('redirects to custom fallback URL when provided', async () => {
      renderProtectedRoute('/login');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('does not render protected content when not authenticated', async () => {
      renderProtectedRoute();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated Users', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        }),
      });
    });

    it('renders protected content for authenticated users', async () => {
      renderProtectedRoute();

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('does not redirect authenticated users', async () => {
      renderProtectedRoute();

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator while checking authentication', () => {
      localStorageMock.getItem.mockReturnValue('token');
      // Don't resolve the fetch to keep it in loading state
      mockFetch.mockImplementation(() => new Promise(() => {}));

      renderProtectedRoute();

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
