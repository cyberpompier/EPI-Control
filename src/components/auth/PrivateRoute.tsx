"use client";

import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;