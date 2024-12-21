import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Spinner } from './components/ui/Spinner';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Cart = lazy(() => import('./pages/Cart'));
const ProducersPage = lazy(() => import('./pages/ProducersPage'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Login = lazy(() => import('./pages/auth/LoginPage'));
const Register = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPasswordPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProducts = lazy(() => import('./pages/admin/ProductsPage'));
const AdminProducers = lazy(() => import('@/pages/admin/ProducersPage'));
const AdminOrders = lazy(() => import('@/pages/admin/OrdersPage'));
const AdminUsers = lazy(() => import('@/pages/admin/UsersPage'));
const AdminReports = lazy(() => import('@/pages/admin/Reports'));
const AdminSettings = lazy(() => import('@/pages/admin/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function AppRoutes() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<Suspense fallback={<Spinner />}><Home /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<Spinner />}><Products /></Suspense>} />
        <Route path="cart" element={<Suspense fallback={<Spinner />}><Cart /></Suspense>} />
        <Route path="producers" element={<Suspense fallback={<Spinner />}><ProducersPage /></Suspense>} />
        <Route path="our-story" element={<Suspense fallback={<Spinner />}><OurStory /></Suspense>} />

        {/* Auth routes */}
        <Route
          path="login"
          element={
            !isAuthenticated ? (
              <Suspense fallback={<Spinner />}><Login /></Suspense>
            ) : (
              <Navigate to={isAdmin() ? '/admin' : '/'} replace />
            )
          }
        />
        <Route
          path="register"
          element={
            !isAuthenticated ? (
              <Suspense fallback={<Spinner />}><Register /></Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="forgot-password" element={<Suspense fallback={<Spinner />}><ForgotPassword /></Suspense>} />
        <Route path="reset-password" element={<Suspense fallback={<Spinner />}><ResetPassword /></Suspense>} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            isAuthenticated && isAdmin() ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Suspense fallback={<Spinner />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Spinner />}><AdminProducts /></Suspense>} />
          <Route path="producers" element={<Suspense fallback={<Spinner />}><AdminProducers /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<Spinner />}><AdminOrders /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<Spinner />}><AdminUsers /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<Spinner />}><AdminReports /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<Spinner />}><AdminSettings /></Suspense>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
} 