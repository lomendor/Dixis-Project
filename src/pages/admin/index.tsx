import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminRoute } from '@/features/auth/components/AdminRoute';
import Dashboard from './Dashboard';
import ProductsPage from './ProductsPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
} 