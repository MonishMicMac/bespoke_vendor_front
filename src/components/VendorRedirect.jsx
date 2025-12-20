import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const VendorRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const vendorId = Cookies.get('vendor_id');
        if (vendorId) {
            navigate(`/vendors/${vendorId}`, { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default VendorRedirect;
