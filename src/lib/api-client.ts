import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiError } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const TOKEN_KEY = 'auth_token';

// Error event for global error handling
type ErrorHandler = (error: ApiError) => void;
let globalErrorHandler: ErrorHandler | null = null;

export function setGlobalErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler;
}

export function removeGlobalErrorHandler(): void {
  globalErrorHandler = null;
}

// Get token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: undefined,
    };

    if (error.response?.data) {
      apiError.message = error.response.data.message || apiError.message;
      apiError.errors = error.response.data.errors;
    } else if (error.message === 'Network Error') {
      apiError.message = 'Unable to connect to the server. Please check your internet connection.';
      apiError.statusCode = 0;
    } else if (error.code === 'ECONNABORTED') {
      apiError.message = 'Request timed out. Please try again.';
      apiError.statusCode = 408;
    }

    // Handle 401 Unauthorized - clear token and redirect
    if (apiError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        // Dispatch custom event for auth state update
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    // Call global error handler if set
    if (globalErrorHandler) {
      globalErrorHandler(apiError);
    }

    return Promise.reject(apiError);
  }
);

// HTTP methods
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<T>(url, data);
  return response.data;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
}

export async function del<T>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}

// Export the axios instance for advanced usage
export { apiClient };

// Export a configured instance getter for testing
export function getApiClient(): AxiosInstance {
  return apiClient;
}
