// Import Axios library
import axios from "axios";
import { getCredentialsFromStorage } from "../utils/storage";
import.meta.env

const storage_data = getCredentialsFromStorage();

// Create a new instance of Axios
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
    (config) => {
        // Retrieve the token from your preferred method (e.g., localStorage)
        const token = storage_data.token;

        // If a token exists, add it to the headers
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh or other actions
instance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle response errors
        if (error.response.status === 401) {
            // Logout
        }

        return Promise.reject(error);
    }
);

export default instance;