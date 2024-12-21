import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAdmin = useAuthStore(state => state.isAdmin);

  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 