import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import AdminPaymentMethods from './pages/admin/AdminPaymentMethods';
import AdminSettings from './pages/admin/AdminSettings';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useStore } from './store/useStore';

export default function App() {
  const { initFirebase } = useStore();

  useEffect(() => {
    // Initialize mock data instead of real Firebase
    initFirebase();
  }, [initFirebase]);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Facing Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/orders" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="payment-methods" element={<AdminPaymentMethods />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<div className="p-8"><h2 className="text-xl font-bold">Coming Soon</h2><p className="text-slate-500 mt-2">This section of the admin panel is under construction.</p></div>} />
        </Route>
        
        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
