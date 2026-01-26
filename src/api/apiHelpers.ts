/**
 * API helper utilities for tournament management
 * Provides various helper functions for making API calls, handling responses, and managing API state
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import instance from './axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

export interface RequestConfig extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Handles API errors and converts them to a standardized format
 * @param error - Axios error object
 * @returns Standardized API error
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.message || 'An unknown error occurred',
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
};

/**
 * Makes a GET request with error handling
 * @param url - API endpoint URL
 * @param config - Request configuration
 * @returns Promise with API response
 */
export const apiGet = async <T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Makes a POST request with error handling
 * @param url - API endpoint URL
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with API response
 */
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Makes a PUT request with error handling
 * @param url - API endpoint URL
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with API response
 */
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Makes a PATCH request with error handling
 * @param url - API endpoint URL
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with API response
 */
export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Makes a DELETE request with error handling
 * @param url - API endpoint URL
 * @param config - Request configuration
 * @returns Promise with API response
 */
export const apiDelete = async <T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Retries a failed API request with exponential backoff
 * @param requestFn - Function that makes the API request
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise with API response
 */
export const retryRequest = async <T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = handleApiError(error);

      // Don't retry on client errors (4xx) except 429 (Too Many Requests)
      if (lastError.status && lastError.status >= 400 && lastError.status < 500 && lastError.status !== 429) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calculate exponential backoff delay
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Request failed after retries');
};

/**
 * Checks if an error is a network error
 * @param error - Error object
 * @returns True if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return !axiosError.response && axiosError.request;
  }
  return false;
};

/**
 * Checks if an error is a timeout error
 * @param error - Error object
 * @returns True if error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout');
  }
  return false;
};

/**
 * Checks if an error is an authentication error (401)
 * @param error - Error object
 * @returns True if error is a 401 error
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
  }
  return false;
};

/**
 * Checks if an error is a server error (5xx)
 * @param error - Error object
 * @returns True if error is a 5xx error
 */
export const isServerError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    return status !== undefined && status >= 500 && status < 600;
  }
  return false;
};

/**
 * Creates a request with timeout
 * @param url - API endpoint URL
 * @param timeout - Timeout in milliseconds
 * @returns Request configuration with timeout
 */
export const createTimeoutConfig = (timeout: number = 30000): RequestConfig => {
  return {
    timeout,
  };
};

/**
 * Creates a request with retry configuration
 * @param retries - Number of retries
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Request configuration with retry settings
 */
export const createRetryConfig = (
  retries: number = 3,
  retryDelay: number = 1000
): RequestConfig => {
  return {
    retries,
    retryDelay,
  };
};

/**
 * Validates API response structure
 * @param response - API response
 * @param requiredFields - Array of required field names
 * @returns True if response has all required fields
 */
export const validateResponse = <T extends Record<string, any>>(
  response: T,
  requiredFields: (keyof T)[]
): boolean => {
  return requiredFields.every((field) => field in response && response[field] !== undefined);
};

/**
 * Formats API error message for display
 * @param error - API error
 * @returns Formatted error message
 */
export const formatErrorMessage = (error: ApiError): string => {
  if (error.status) {
    return `Error ${error.status}: ${error.message}`;
  }
  return error.message;
};

/**
 * Creates query string from object
 * @param params - Object with query parameters
 * @returns Query string
 */
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Builds URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }
  const queryString = createQueryString(params);
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}`;
};

/**
 * Debounces API calls to prevent excessive requests
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounceApiCall = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime;

      if (timeSinceLastCall >= delay) {
        lastCallTime = now;
        fn(...args).then(resolve).catch(reject);
      } else {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          fn(...args).then(resolve).catch(reject);
        }, delay - timeSinceLastCall);
      }
    });
  };
};

