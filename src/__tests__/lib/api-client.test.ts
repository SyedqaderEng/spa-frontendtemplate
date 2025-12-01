import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  apiClient,
  get,
  post,
  put,
  patch,
  del,
  setGlobalErrorHandler,
  removeGlobalErrorHandler,
} from '@/lib/api-client';

// Create mock adapter for axios
let mock: MockAdapter;

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

// Mock window.dispatchEvent
const dispatchEventMock = jest.fn();
Object.defineProperty(window, 'dispatchEvent', { value: dispatchEventMock });

describe('API Client', () => {
  beforeEach(() => {
    mock = new MockAdapter(apiClient);
    jest.clearAllMocks();
    localStorageMock.clear();
    removeGlobalErrorHandler();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('Authorization Header', () => {
    it('attaches Authorization header when token exists', async () => {
      localStorageMock.getItem.mockReturnValue('test-token');
      mock.onGet('/test').reply(200, { data: 'success' });

      await get('/test');

      expect(mock.history.get[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('does not attach Authorization header when no token exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      mock.onGet('/test').reply(200, { data: 'success' });

      await get('/test');

      expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
    });

    it('includes Authorization header in POST requests', async () => {
      localStorageMock.getItem.mockReturnValue('post-token');
      mock.onPost('/test').reply(200, { data: 'created' });

      await post('/test', { name: 'test' });

      expect(mock.history.post[0].headers?.Authorization).toBe('Bearer post-token');
    });

    it('includes Authorization header in PUT requests', async () => {
      localStorageMock.getItem.mockReturnValue('put-token');
      mock.onPut('/test').reply(200, { data: 'updated' });

      await put('/test', { name: 'test' });

      expect(mock.history.put[0].headers?.Authorization).toBe('Bearer put-token');
    });

    it('includes Authorization header in PATCH requests', async () => {
      localStorageMock.getItem.mockReturnValue('patch-token');
      mock.onPatch('/test').reply(200, { data: 'patched' });

      await patch('/test', { name: 'test' });

      expect(mock.history.patch[0].headers?.Authorization).toBe('Bearer patch-token');
    });

    it('includes Authorization header in DELETE requests', async () => {
      localStorageMock.getItem.mockReturnValue('delete-token');
      mock.onDelete('/test').reply(200, { data: 'deleted' });

      await del('/test');

      expect(mock.history.delete[0].headers?.Authorization).toBe('Bearer delete-token');
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('test-token');
    });

    it('GET request returns data', async () => {
      const responseData = { id: 1, name: 'Test' };
      mock.onGet('/users/1').reply(200, responseData);

      const result = await get('/users/1');

      expect(result).toEqual(responseData);
    });

    it('POST request sends data and returns response', async () => {
      const requestData = { name: 'New User' };
      const responseData = { id: 1, name: 'New User' };
      mock.onPost('/users').reply(201, responseData);

      const result = await post('/users', requestData);

      expect(result).toEqual(responseData);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(requestData);
    });

    it('PUT request sends data and returns response', async () => {
      const requestData = { name: 'Updated User' };
      const responseData = { id: 1, name: 'Updated User' };
      mock.onPut('/users/1').reply(200, responseData);

      const result = await put('/users/1', requestData);

      expect(result).toEqual(responseData);
    });

    it('PATCH request sends partial data and returns response', async () => {
      const requestData = { name: 'Patched' };
      const responseData = { id: 1, name: 'Patched' };
      mock.onPatch('/users/1').reply(200, responseData);

      const result = await patch('/users/1', requestData);

      expect(result).toEqual(responseData);
    });

    it('DELETE request returns response', async () => {
      const responseData = { message: 'Deleted' };
      mock.onDelete('/users/1').reply(200, responseData);

      const result = await del('/users/1');

      expect(result).toEqual(responseData);
    });

    it('GET request with params', async () => {
      const responseData = [{ id: 1 }, { id: 2 }];
      mock.onGet('/users').reply(200, responseData);

      const result = await get('/users', { page: 1, limit: 10 });

      expect(result).toEqual(responseData);
      expect(mock.history.get[0].params).toEqual({ page: 1, limit: 10 });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('test-token');
    });

    it('handles 400 Bad Request error', async () => {
      mock.onGet('/test').reply(400, { message: 'Bad Request' });

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Bad Request',
        statusCode: 400,
      });
    });

    it('handles 401 Unauthorized error and clears token', async () => {
      mock.onGet('/test').reply(401, { message: 'Unauthorized' });

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(dispatchEventMock).toHaveBeenCalled();
    });

    it('handles 404 Not Found error', async () => {
      mock.onGet('/test').reply(404, { message: 'Not Found' });

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Not Found',
        statusCode: 404,
      });
    });

    it('handles 500 Server Error', async () => {
      mock.onGet('/test').reply(500, { message: 'Internal Server Error' });

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Internal Server Error',
        statusCode: 500,
      });
    });

    it('handles network errors', async () => {
      mock.onGet('/test').networkError();

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Unable to connect to the server. Please check your internet connection.',
        statusCode: 0,
      });
    });

    it('handles timeout errors', async () => {
      mock.onGet('/test').timeout();

      await expect(get('/test')).rejects.toMatchObject({
        message: 'Request timed out. Please try again.',
        statusCode: 408,
      });
    });

    it('returns validation errors from response', async () => {
      const errorResponse = {
        message: 'Validation failed',
        errors: {
          email: ['Email is required'],
          password: ['Password must be at least 8 characters'],
        },
      };
      mock.onPost('/test').reply(422, errorResponse);

      await expect(post('/test', {})).rejects.toMatchObject({
        message: 'Validation failed',
        statusCode: 422,
        errors: errorResponse.errors,
      });
    });
  });

  describe('Global Error Handler', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('test-token');
    });

    it('calls global error handler when set', async () => {
      const errorHandler = jest.fn();
      setGlobalErrorHandler(errorHandler);

      mock.onGet('/test').reply(500, { message: 'Server Error' });

      await expect(get('/test')).rejects.toBeDefined();

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Server Error',
          statusCode: 500,
        })
      );
    });

    it('does not call global error handler after removal', async () => {
      const errorHandler = jest.fn();
      setGlobalErrorHandler(errorHandler);
      removeGlobalErrorHandler();

      mock.onGet('/test').reply(500, { message: 'Server Error' });

      await expect(get('/test')).rejects.toBeDefined();

      expect(errorHandler).not.toHaveBeenCalled();
    });
  });

  describe('Request Configuration', () => {
    it('sets Content-Type header to application/json', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      mock.onPost('/test').reply(200, {});

      await post('/test', { data: 'test' });

      expect(mock.history.post[0].headers?.['Content-Type']).toBe('application/json');
    });
  });
});
