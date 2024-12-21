import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProducersPage from '@/pages/ProducersPage';
import OurStory from '@/pages/OurStory';
import { AdminRoutes } from '@/pages/admin';
import LoginForm from './components/auth/LoginForm';
import { MainLayout } from './layouts/MainLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Cart = lazy(() => import('./pages/Cart'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Cart />
            </Suspense>
          }
        />
        <Route path="producers" element={<ProducersPage />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
      <Route path="admin/*" element={<AdminRoutes />} />
    </Routes>
  );
} 