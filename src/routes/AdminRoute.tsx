import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { paths } from './paths';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isStaff } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to={paths.login} state={{ from: location }} replace />;
  if (!isStaff) return <Navigate to={paths.accessDenied} replace />;
  return <>{children}</>;
}
