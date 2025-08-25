import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/components/auth/SessionProvider';
import Layout from '../layout/Layout';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // ✅ toutes les pages protégées passent automatiquement par Layout
  return <Layout>{children}</Layout>;
}
