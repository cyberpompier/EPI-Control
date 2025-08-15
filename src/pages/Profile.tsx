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
import { Shield, LogOut, Camera, User, Bell, KeyRound } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useSession } from '@/components/auth/SessionProvider';
import { getInitials } from '@/lib/utils';

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
          .select('*, avatar')
          .eq('id', authUser.id)
          .single();
        if (profileError) throw profileError;
        
        const { data: personnelData } = await supabase
          .from('personnel')
          .select('caserne, grade, photo')
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
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        <title>Mon profil | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile?.avatar || profile?.photo || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(formData.nom, formData.prenom)}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold">{formData.prenom} {formData.nom}</h2>
              <p className="text-gray-500">{profile?.grade || 'Pompier'}</p>
              <p className="text-sm text-gray-500">{profile?.caserne || 'Caserne non spécifiée'}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal"><User className="h-4 w-4 mr-2" />Informations</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
              <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Sécurité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" name="prenom" value={formData.prenom} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" name="nom" value={formData.nom} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} disabled />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <Switch id="email-notifications" checked={notificationSettings.email} onCheckedChange={(val) => handleNotificationChange('email', val)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <Label htmlFor="push-notifications">Notifications Push</Label>
                    <Switch id="push-notifications" checked={notificationSettings.push} onCheckedChange={(val) => handleNotificationChange('push', val)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <Label htmlFor="controle-reminders">Rappels de contrôle</Label>
                    <Switch id="controle-reminders" checked={notificationSettings.controleReminders} onCheckedChange={(val) => handleNotificationChange('controleReminders', val)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <Label htmlFor="expiry-alerts">Alertes d'expiration</Label>
                    <Switch id="expiry-alerts" checked={notificationSettings.expiryAlerts} onCheckedChange={(val) => handleNotificationChange('expiryAlerts', val)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateNotifications}>Enregistrer les préférences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button><KeyRound className="h-4 w-4 mr-2" />Changer le mot de passe</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}