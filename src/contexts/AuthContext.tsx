'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  SignUpCredentials,
  User,
  AuthResponse,
} from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const TOKEN_KEY = 'auth_token';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  // Get token from storage
  const getStoredToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  // Store token
  const storeToken = useCallback((token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  // Remove token
  const removeToken = useCallback((): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // Get current token
  const getToken = useCallback((): string | null => {
    return state.token || getStoredToken();
  }, [state.token, getStoredToken]);

  // Fetch current user from backend
  const fetchCurrentUser = useCallback(async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          return null;
        }
        throw new Error('Failed to fetch user');
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }, [removeToken]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
        return;
      }

      const user = await fetchCurrentUser(token);

      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
      }
    };

    initializeAuth();
  }, [getStoredToken, fetchCurrentUser]);

  // Login function - calls backend auth endpoint
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();

      storeToken(data.token);

      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [storeToken]);

  // Sign up function - calls backend auth endpoint
  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data: AuthResponse = await response.json();

      storeToken(data.token);

      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [storeToken]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    const token = getToken();

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    }
  }, [getToken, removeToken]);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    const token = getToken();

    if (!token) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    const user = await fetchCurrentUser(token);

    if (user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        token,
      });
    } else {
      removeToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    }
  }, [getToken, fetchCurrentUser, removeToken]);

  const value: AuthContextType = {
    ...state,
    login,
    signUp,
    logout,
    getToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthContext };
