import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendorDetails from './pages/VendorDetails';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './components/ProtectedRoutes';

import VendorRedirect from './components/VendorRedirect';
import Product from './pages/product/Product';

function App() {
  return (
    <Router>
      <div className="app-layout font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/vendors" element={<VendorRedirect />} />
            <Route path="/vendors/:id" element={<VendorDetails />} />
  <Route path="/product/add" element={<Product />} />

            
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App

