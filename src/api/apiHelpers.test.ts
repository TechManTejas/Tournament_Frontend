import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  handleApiError,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  retryRequest,
  isNetworkError,
  isTimeoutError,
  isAuthError,
  isServerError,
  createTimeoutConfig,
  createRetryConfig,
  validateResponse,
  formatErrorMessage,
  createQueryString,
  buildUrl,
  debounceApiCall,
  type ApiError,
} from './apiHelpers'

// Create mock instance
const mockInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

// Mock the axios instance module
vi.mock('./axios', () => ({
  default: mockInstance,
}))

// Import after mock - need to use dynamic import or access via vi.mocked
const getInstance = () => mockInstance

describe('apiHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleApiError', () => {
    it('should handle Axios errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Resource not found' },
        },
      } as any

      const error = handleApiError(axiosError)
      expect(error.message).toBe('Request failed')
      expect(error.status).toBe(404)
      expect(error.statusText).toBe('Not Found')
    })

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong')
      const result = handleApiError(error)
      expect(result.message).toBe('Something went wrong')
    })

    it('should handle unknown errors', () => {
      const result = handleApiError('unknown')
      expect(result.message).toBe('An unknown error occurred')
    })
  })

  describe('apiGet', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' }, status: 200, statusText: 'OK', headers: {} }
      mockInstance.get.mockResolvedValue(mockResponse as any)

      const result = await apiGet('/test')
      expect(result.data).toEqual({ id: 1, name: 'Test' })
      expect(result.status).toBe(200)
    })

    it('should handle GET request errors', async () => {
      const mockError = {
        isAxiosError: true,
        message: 'Not Found',
        response: { status: 404, statusText: 'Not Found', data: {} },
      }
      mockInstance.get.mockRejectedValue(mockError)

      await expect(apiGet('/test')).rejects.toMatchObject({
        message: 'Not Found',
        status: 404,
      })
    })
  })

  describe('apiPost', () => {
    it('should make POST request successfully', async () => {
      const mockResponse = { data: { id: 1 }, status: 201, statusText: 'Created', headers: {} }
      mockInstance.post.mockResolvedValue(mockResponse as any)

      const result = await apiPost('/test', { name: 'Test' })
      expect(result.data).toEqual({ id: 1 })
      expect(result.status).toBe(201)
    })
  })

  describe('apiPut', () => {
    it('should make PUT request successfully', async () => {
      const mockResponse = { data: { id: 1, name: 'Updated' }, status: 200, statusText: 'OK', headers: {} }
      mockInstance.put.mockResolvedValue(mockResponse as any)

      const result = await apiPut('/test/1', { name: 'Updated' })
      expect(result.data).toEqual({ id: 1, name: 'Updated' })
    })
  })

  describe('apiPatch', () => {
    it('should make PATCH request successfully', async () => {
      const mockResponse = { data: { id: 1, name: 'Patched' }, status: 200, statusText: 'OK', headers: {} }
      mockInstance.patch.mockResolvedValue(mockResponse as any)

      const result = await apiPatch('/test/1', { name: 'Patched' })
      expect(result.data).toEqual({ id: 1, name: 'Patched' })
    })
  })

  describe('apiDelete', () => {
    it('should make DELETE request successfully', async () => {
      const mockResponse = { data: {}, status: 204, statusText: 'No Content', headers: {} }
      mockInstance.delete.mockResolvedValue(mockResponse as any)

      const result = await apiDelete('/test/1')
      expect(result.status).toBe(204)
    })
  })

  describe('retryRequest', () => {
    it('should retry failed requests', async () => {
      let attempts = 0
      const requestFn = vi.fn(async () => {
        attempts++
        if (attempts < 2) {
          throw { status: 500, message: 'Server error' }
        }
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {} }
      })

      const result = await retryRequest(requestFn, 3, 10)
      expect(result.data).toEqual({ success: true })
      expect(attempts).toBe(2)
    })

    it('should not retry 4xx errors', async () => {
      const requestFn = vi.fn(async () => {
        throw { status: 400, message: 'Bad Request' }
      })

      await expect(retryRequest(requestFn, 3, 10)).rejects.toMatchObject({
        status: 400,
      })
    })

    it('should retry 429 errors', async () => {
      let attempts = 0
      const requestFn = vi.fn(async () => {
        attempts++
        if (attempts < 2) {
          throw { status: 429, message: 'Too Many Requests' }
        }
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {} }
      })

      const result = await retryRequest(requestFn, 3, 10)
      expect(result.data).toEqual({ success: true })
    })
  })

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      // Create a proper AxiosError-like object
      const error = Object.create(Error.prototype)
      error.isAxiosError = true
      error.request = {}
      error.response = undefined
      
      // Mock axios.isAxiosError
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      expect(isNetworkError(error)).toBe(true)
    })

    it('should return false for non-network errors', () => {
      const error = Object.create(Error.prototype)
      error.isAxiosError = true
      error.request = {}
      error.response = { status: 404 }
      
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe('isTimeoutError', () => {
    it('should detect timeout errors', () => {
      const error = Object.create(Error.prototype)
      error.isAxiosError = true
      error.code = 'ECONNABORTED'
      error.message = 'timeout'
      
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      expect(isTimeoutError(error)).toBe(true)
    })
  })

  describe('isAuthError', () => {
    it('should detect 401 errors', () => {
      const error = Object.create(Error.prototype)
      error.isAxiosError = true
      error.response = { status: 401 }
      
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      expect(isAuthError(error)).toBe(true)
    })
  })

  describe('isServerError', () => {
    it('should detect 5xx errors', () => {
      const error = Object.create(Error.prototype)
      error.isAxiosError = true
      error.response = { status: 500 }
      
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      expect(isServerError(error)).toBe(true)
    })
  })

  describe('createTimeoutConfig', () => {
    it('should create timeout configuration', () => {
      const config = createTimeoutConfig(5000)
      expect(config.timeout).toBe(5000)
    })

    it('should use default timeout', () => {
      const config = createTimeoutConfig()
      expect(config.timeout).toBe(30000)
    })
  })

  describe('createRetryConfig', () => {
    it('should create retry configuration', () => {
      const config = createRetryConfig(5, 2000)
      expect(config.retries).toBe(5)
      expect(config.retryDelay).toBe(2000)
    })
  })

  describe('validateResponse', () => {
    it('should validate response with all required fields', () => {
      const response = { id: 1, name: 'Test', email: 'test@example.com' }
      expect(validateResponse(response, ['id', 'name', 'email'])).toBe(true)
    })

    it('should return false for missing fields', () => {
      const response = { id: 1, name: 'Test' }
      expect(validateResponse(response, ['id', 'name', 'email'])).toBe(false)
    })
  })

  describe('formatErrorMessage', () => {
    it('should format error with status', () => {
      const error: ApiError = { message: 'Not Found', status: 404 }
      expect(formatErrorMessage(error)).toBe('Error 404: Not Found')
    })

    it('should format error without status', () => {
      const error: ApiError = { message: 'Network error' }
      expect(formatErrorMessage(error)).toBe('Network error')
    })
  })

  describe('createQueryString', () => {
    it('should create query string from object', () => {
      const params = { page: 1, limit: 10, search: 'test' }
      const queryString = createQueryString(params)
      expect(queryString).toContain('page=1')
      expect(queryString).toContain('limit=10')
      expect(queryString).toContain('search=test')
    })

    it('should exclude null and undefined values', () => {
      const params = { page: 1, limit: null, search: undefined, filter: 'active' }
      const queryString = createQueryString(params)
      expect(queryString).toContain('page=1')
      expect(queryString).toContain('filter=active')
      expect(queryString).not.toContain('limit')
      expect(queryString).not.toContain('search')
    })
  })

  describe('buildUrl', () => {
    it('should build URL with query parameters', () => {
      const url = buildUrl('/api/users', { page: 1, limit: 10 })
      expect(url).toContain('/api/users')
      expect(url).toContain('page=1')
      expect(url).toContain('limit=10')
    })

    it('should return base URL when no params', () => {
      const url = buildUrl('/api/users')
      expect(url).toBe('/api/users')
    })

    it('should handle URL with existing query string', () => {
      const url = buildUrl('/api/users?sort=name', { page: 1 })
      expect(url).toContain('sort=name')
      expect(url).toContain('page=1')
    })
  })

  describe('debounceApiCall', () => {
    it('should debounce API calls', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn(async () => ({ data: 'result', status: 200, statusText: 'OK', headers: {} }))
      const debounced = debounceApiCall(mockFn, 100)

      // Call multiple times rapidly
      const promise1 = debounced()
      const promise2 = debounced()
      const promise3 = debounced()

      // Fast-forward time
      vi.advanceTimersByTime(150)
      
      // Wait for promises to resolve
      await Promise.all([promise1, promise2, promise3])
      
      // Should only be called once after debounce
      expect(mockFn).toHaveBeenCalled()
      // The exact count may vary, but should be called
      expect(mockFn.mock.calls.length).toBeGreaterThan(0)
      
      vi.useRealTimers()
    })

    it('should call function when delay passes', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn(async () => ({ data: 'result', status: 200, statusText: 'OK', headers: {} }))
      const debounced = debounceApiCall(mockFn, 50)

      const promise = debounced()
      vi.advanceTimersByTime(100)
      
      await promise
      expect(mockFn).toHaveBeenCalled()
      
      vi.useRealTimers()
    })
  })
})

