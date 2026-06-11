import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { paths } from './paths';

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isStaff } = useAuth();

  if (isLoading) return <Spinner />;
  if (isAuthenticated && isStaff) return <Navigate to={paths.dashboard} replace />;
  return <>{children}</>;
}
