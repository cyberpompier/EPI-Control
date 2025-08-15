import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/');
        } else {
          navigate('/login');
        }
      });
    }, 1000); // Small delay to ensure session is established

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold">Authentification en cours...</h1>
          <p className="text-gray-600">Veuillez patienter, nous vous redirigeons.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AuthCallback;