import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API + "/api/vendor";

const axiosInstance = axios.create({
    // ✅ MUST be relative path to trigger the Vite Tunnel
    baseURL: '/api/vendor',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR
// We NO LONGER need to manually attach the token. The browser does it.
axiosInstance.interceptors.request.use(
    (config) => {
        // Debugging: Log the request to ensure credentials are sent
        console.log('🚀 Axios Request:', config.method.toUpperCase(), config.url);
        console.log('🔑 withCredentials:', config.withCredentials);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            // If the cookie expires or is invalid
            Cookies.remove('vendor_id'); // Clear your local ID
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;