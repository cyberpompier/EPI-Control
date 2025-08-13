import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img src="/logo-pompier.svg" alt="Logo Pompiers" className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700">EPI Control</h1>
          <p className="text-gray-600 mt-2">
            Système de gestion des Équipements de Protection Individuelle
          </p>
        </div>
        
        <AuthForm />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Service Départemental d'Incendie et de Secours</p>
          <p className="mt-1">© 2023 Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}