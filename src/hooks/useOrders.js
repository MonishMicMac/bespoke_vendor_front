import { useState, useEffect } from 'react';
import { getOrders } from '../services/vendorService';

export const useOrderList = ({ page, search }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const response = await getOrders(page, search);
                setData(response);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [page, search]);

    return { data, isLoading, error };
};
