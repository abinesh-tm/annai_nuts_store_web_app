import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

// Layouts
import StoreLayout from '../components/layout/StoreLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Store Pages
import HomePage from '../pages/store/HomePage';
import ProductListPage from '../pages/store/ProductListPage';
import ProductDetailPage from '../pages/store/ProductDetailPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import Aboutpage from '../pages/store/Abouthpage';
import Contactpage from '../pages/store/ContactPage';
import WishlistPage from '@/pages/store/wishlistPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';


// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage';
import ProductsPage from '../pages/admin/ProductsPage';
import OrdersPage from '../pages/admin/OrdersPage';
import CustomersPage from '../pages/admin/CustomersPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

