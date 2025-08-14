import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Shield, LogOut, Camera, User, Bell, Settings } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useSession } from '@/components/auth/SessionProvider';

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    controleReminders: true,
    expiryAlerts: true,
    nonConformiteAlerts: true
  });

  useEffect(() => {
    const getProfile = async () => {
      if (authLoading) return;
      if (!authUser) {
        navigate('/login');
        return;
      }
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        if (profileError) throw profileError;
        const { data: personnelData, error: personnelError } = await supabase
          .from('personnel')
          .select('caserne, grade')
          .eq('email', authUser.email)
          .single();
        const fullProfile = { ...profileData, ...personnelData };
        setProfile(fullProfile);
        setFormData({
          nom: fullProfile.nom || '',
          prenom: fullProfile.prenom || '',
          email: authUser.email || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        showError('Erreur lors de la récupération du profil');
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [navigate, authUser, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    try {
      const { error } = await supabase.from('profiles').update({
        nom: formData.nom,
        prenom: formData.prenom,
      }).eq('id', profile.id);
      if (error) throw error;
      showSuccess('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showError('Erreur lors de la mise à jour du profil');
    }
  };

  const handleUpdateNotifications = async () => {
    showSuccess('Paramètres de notification mis à jour (simulation)');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showSuccess('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      showError('Erreur lors de la déconnexion');
    }
  };

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`Mon profil | EPI Control`}</title>
      </Helmet>
      
      {/* Rest of the component */}
    </Layout>
  );
}