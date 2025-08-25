"use client";

import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null; // Ou un composant de chargement
  }

  return <>{children}</>;
};

export default PrivateRoute;