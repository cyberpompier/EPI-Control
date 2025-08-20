import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Personnalisation du thème pour correspondre aux couleurs des pompiers
  const customTheme = {
    ...ThemeSupa,
    colors: {
      ...ThemeSupa.colors,
      brand: '#DC2626', // Rouge pompier
      brandAccent: '#991B1B', // Rouge foncé
    },
    dark: {
      ...ThemeSupa.dark,
      colors: {
        ...ThemeSupa.dark.colors,
        brand: '#DC2626',
        brandAccent: '#991B1B',
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder au système de contrôle des EPI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: customTheme }}
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                link_text: 'Vous avez déjà un compte? Connectez-vous',
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'S\'inscrire',
                loading_button_label: 'Inscription en cours...',
                link_text: 'Vous n\'avez pas de compte? Inscrivez-vous',
              },
              forgotten_password: {
                email_label: 'Adresse email',
                button_label: 'Réinitialiser le mot de passe',
                loading_button_label: 'Envoi en cours...',
                link_text: 'Mot de passe oublié?',
                confirmation_text: 'Vérifiez votre email pour le lien de réinitialisation',
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}