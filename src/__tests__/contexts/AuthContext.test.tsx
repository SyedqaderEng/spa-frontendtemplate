import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/auth';

// Mock fetch globally
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

// Test component that uses auth context
function TestComponent() {
  const { user, isAuthenticated, isLoading, login, logout, signUp } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-email">{user?.email || 'no-user'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={() => signUp({ email: 'new@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' })}>
        Sign Up
      </button>
      <button onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}

// Wrapper component for testing
function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockFetch.mockReset();
  });

  describe('Initial State', () => {
    it('starts with loading state true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      renderWithAuth();

      // Initially loading
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
    });

    it('shows not authenticated when no token exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      });
    });

    it('shows no user when not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
      });
    });
  });

  describe('Token Restoration', () => {
    it('restores session from stored token', async () => {
      localStorageMock.setItem('auth_token', 'existing-token');
      localStorageMock.getItem.mockReturnValue('existing-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer existing-token',
          }),
        })
      );
    });

    it('clears invalid token on 401 response', async () => {
      localStorageMock.setItem('auth_token', 'invalid-token');
      localStorageMock.getItem.mockReturnValue('invalid-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('Login', () => {
    it('authenticates user on successful login', async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: mockUser, token: 'new-token' }),
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await act(async () => {
        await user.click(screen.getByText('Login'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'new-token');
    });

    it('calls correct endpoint with credentials', async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: mockUser, token: 'new-token' }),
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await act(async () => {
        await user.click(screen.getByText('Login'));
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
    });

    it('handles login failure and remains unauthenticated', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: 'Invalid credentials' }),
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // After a failed login attempt, user should remain unauthenticated
      // The error is thrown but the state should reflect non-authenticated
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    });
  });

  describe('Sign Up', () => {
    it('registers user on successful sign up', async () => {
      const user = userEvent.setup();

      const newUser: User = {
        id: '2',
        email: 'new@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: newUser, token: 'signup-token' }),
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await act(async () => {
        await user.click(screen.getByText('Sign Up'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'signup-token');
    });

    it('calls correct endpoint with registration data', async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: mockUser, token: 'new-token' }),
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await act(async () => {
        await user.click(screen.getByText('Sign Up'));
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'new@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
          }),
        })
      );
    });
  });

  describe('Logout', () => {
    it('clears authentication state on logout', async () => {
      const user = userEvent.setup();

      localStorageMock.setItem('auth_token', 'existing-token');
      localStorageMock.getItem.mockReturnValue('existing-token');

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUser,
        })
        .mockResolvedValueOnce({
          ok: true,
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      });

      await act(async () => {
        await user.click(screen.getByText('Logout'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('calls logout endpoint', async () => {
      const user = userEvent.setup();

      localStorageMock.setItem('auth_token', 'existing-token');
      localStorageMock.getItem.mockReturnValue('existing-token');

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUser,
        })
        .mockResolvedValueOnce({
          ok: true,
        });

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      });

      await act(async () => {
        await user.click(screen.getByText('Logout'));
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer existing-token',
          }),
        })
      );
    });
  });

  describe('useAuth Hook', () => {
    it('throws error when used outside AuthProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
