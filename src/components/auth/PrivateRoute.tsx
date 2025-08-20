import { useSession } from '@/components/auth/SessionProvider';
import { Layout } from '@/components/layout/Layout';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}