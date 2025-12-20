import axiosInstance from '../api/axiosInstance';

// Mock data kept for reference or fallback if API is not ready
// const vendors = [ ... ]; 

export const getVendors = async (page = 1, limit = 5, filters = {}) => {
    try {
        // Construct query parameters
        const params = {
            page,
            limit,
            ...filters
        };

        // Adjust endpoint as per actual API content structure
        // Assuming base URL is .../api/vendor, so '/' might be the list
        const response = await axiosInstance.get('/', { params });

        // Return data in the expected format for the UI
        // You might need to adjust this mapping based on actual API response
        return {
            data: response.data.vendors || response.data.data || [],
            total: response.data.total || 0,
            page: response.data.page || page,
            totalPages: response.data.totalPages || 0
        };
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw error;
    }
};

export const getVendorById = async (id) => {
    try {
        const response = await axiosInstance.get(`/details/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vendor details:", error);
        throw error;
    }
};

