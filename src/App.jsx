import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendorDetails from './pages/VendorDetails';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './components/ProtectedRoutes';

import VendorRedirect from './components/VendorRedirect';
import Product from './pages/product/Product';
import ProductList from './pages/product/ProductList';
import ProductDetails from './pages/product/ProductDetails';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';

function App() {
  return (
    <Router basename="/vendor">
      <div className="app-layout font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/vendors" element={<VendorRedirect />} />
            <Route path="/vendors/:id" element={<VendorDetails />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orderDetails/:id" element={<OrderDetail />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Route>

          {/* Protected Routes without MainLayout (Custom UI) */}
          <Route element={<ProtectedRoutes layout={false} />}>
            <Route path="/product/add" element={<Product />} />
            <Route path="/product/edit/:id" element={<Product />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
