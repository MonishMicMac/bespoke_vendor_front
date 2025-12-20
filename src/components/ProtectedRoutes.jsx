import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainLayout from './layout/MainLayout';

const ProtectedRoutes = () => {
    // Check for token in cookies
    // Check for vendor_id in cookies (access_token is HttpOnly and cannot be read by JS)
    const isAuthenticated = Cookies.get('vendor_id');

    if (!isAuthenticated) {
        // If no vendor_id, redirect to login
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the MainLayout which contains the Sidebar/Header and the Outlet for child routes
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default ProtectedRoutes;
