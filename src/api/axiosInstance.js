import axios from 'axios';
import Cookies from 'js-cookie';

// import.meta.env.VITE_API will be "http://3.7.112.78/bespoke/public" after build
const BASE_URL = import.meta.env.VITE_API;

const axiosInstance = axios.create({
    // This combines your domain with the specific API path
    baseURL: `${BASE_URL}/api/vendor`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// INTERCEPTORS
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 API Call to:', config.baseURL + config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            // Cookies.remove('vendor_id');
            // window.location.href = '/vendor/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;