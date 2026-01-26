// Import Axios library
import axios from "axios";
import { getUserDataFromStorage, clearUserDataFromStorage } from "../utils/storage";
import.meta.env

// Create a new instance of Axios
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000, // 30 seconds default timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request counter for tracking API calls
let requestCounter = 0;

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
    (config) => {
        // Retrieve the token from storage (get fresh data each time)
        const storage_data = getUserDataFromStorage();
        const token = storage_data?.token;

        // If a token exists, add it to the headers
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        // Add request ID for tracking
        requestCounter++;
        config.metadata = { requestId: requestCounter, startTime: Date.now() };

        // Add timestamp to headers for debugging
        config.headers['X-Request-ID'] = String(requestCounter);
        config.headers['X-Request-Time'] = new Date().toISOString();

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request ${requestCounter}] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        // Handle request errors
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh or other actions
instance.interceptors.response.use(
    (response) => {
        // Calculate request duration
        if (response.config.metadata) {
            const duration = Date.now() - response.config.metadata.startTime;
            if (import.meta.env.DEV) {
                console.log(`[API Response ${response.config.metadata.requestId}] ${response.status} (${duration}ms)`);
            }
        }

        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle response errors
        const status = error.response?.status;
        const requestId = error.config?.metadata?.requestId;

        if (import.meta.env.DEV) {
            console.error(`[API Error ${requestId || 'unknown'}] ${status || 'Network Error'}:`, error.message);
        }

        // Handle authentication errors
        if (status === 401) {
            // Clear user data and redirect to login
            clearUserDataFromStorage();
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        // Handle server errors (5xx)
        if (status && status >= 500) {
            console.error('Server error:', error.response?.data);
        }

        // Handle client errors (4xx)
        if (status && status >= 400 && status < 500) {
            if (status === 403) {
                console.warn('Forbidden: Insufficient permissions');
            } else if (status === 404) {
                console.warn('Resource not found');
            } else if (status === 429) {
                console.warn('Rate limit exceeded');
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error: No response from server');
        }

        return Promise.reject(error);
    }
);

/**
 * Sets a custom timeout for the axios instance
 * @param timeout - Timeout in milliseconds
 */
export const setTimeout = (timeout: number): void => {
    instance.defaults.timeout = timeout;
};

/**
 * Gets the current timeout setting
 * @returns Current timeout in milliseconds
 */
export const getTimeout = (): number => {
    return instance.defaults.timeout || 30000;
};

/**
 * Resets the request counter (useful for testing)
 */
export const resetRequestCounter = (): void => {
    requestCounter = 0;
};

/**
 * Gets the current request counter value
 * @returns Current request counter
 */
export const getRequestCounter = (): number => {
    return requestCounter;
};

export default instance;