import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API + "/api/vendor";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // <--- THIS IS MANDATORY. It sends the cookie automatically.
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR
// We NO LONGER need to manually attach the token. The browser does it.
axiosInstance.interceptors.request.use(
    (config) => {
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