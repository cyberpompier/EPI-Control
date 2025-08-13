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
import { User, Settings, Bell, Shield, LogOut, Camera } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    caserne: '',
    grade: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    controleReminders: true,
    expiryAlerts: true,
    nonConformiteAlerts: true
  });

  // Données simulées pour l'utilisateur
  const mockUser = {
    id: '3',
    email: 'sophie.leroy@sdis.fr',
    nom: 'Leroy',
    prenom: 'Sophie',
    telephone: '06 12 34 56 78',
    caserne: 'Caserne Est',
    grade: 'Lieutenant',
    role: 'controleur'
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        // Dans une vraie application, vous récupéreriez les données depuis Supabase
        // const { data: authData, error: authError } = await supabase.auth.getUser();
        // if (authError) throw authError;
        // if (!authData.user) {
        //   navigate('/login');
        //   return;
        // }
        
        // const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', authData.user.id).single();
        // if (userError) throw userError;
        // setUser(userData);
        // setFormData({
        //   nom: userData.nom || '',
        //   prenom: userData.prenom || '',
        //   email: userData.email || '',
        //   telephone: userData.telephone || '',
        //   caserne: userData.caserne || '',
        //   grade: userData.grade || ''
        // });
        
        // Simulation de chargement
        setTimeout(() => {
          setUser(mockUser);
          setFormData({
            nom: mockUser.nom || '',
            prenom: mockUser.prenom || '',
            email: mockUser.email || '',
            telephone: mockUser.telephone || '',
            caserne: mockUser.caserne || '',
            grade: mockUser.grade || ''
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        navigate('/login');
      }
    };
    
    getUser();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      // Dans une vraie application, vous enverriez les données à Supabase
      // const { error } = await supabase.from('users').update({
      //   nom: formData.nom,
      //   prenom: formData.prenom,
      //   telephone: formData.telephone
      // }).eq('id', user.id);
      // if (error) throw error;
      
      // Simulation de mise à jour
      console.log('Données du profil:', formData);
      
      showSuccess('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showError('Erreur lors de la mise à jour du profil');
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      // Dans une vraie application, vous enverriez les données à Supabase
      // const { error } = await supabase.from('notification_settings').update(notificationSettings).eq('user_id', user.id);
      // if (error) throw error;
      
      // Simulation de mise à jour
      console.log('Paramètres de notification:', notificationSettings);
      
      showSuccess('Paramètres de notification mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      showError('Erreur lors de la mise à jour des paramètres');
    }
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

  if (loading) {
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
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={`${user.prenom} ${user.nom}`} />
                    <AvatarFallback className="text-xl">{user.prenom?.charAt(0)}{user.nom?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold">{user.prenom} {user.nom}</h2>
                <p className="text-gray-500">{user.grade}</p>
                <p className="text-sm text-gray-500 mt-1">{user.caserne}</p>
                
                <div className="mt-4 w-full">
                  <div className="bg-red-50 text-red-800 px-3 py-2 rounded-md text-sm flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    {user.role === 'admin' ? 'Administrateur' : 
                     user.role === 'controleur' ? 'Contrôleur' : 'Pompier'}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-6 w-full flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input 
                        id="prenom" 
                        name="prenom" 
                        value={formData.prenom} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input 
                        id="nom" 
                        name="nom" 
                        value={formData.nom} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input 
                        id="telephone" 
                        name="telephone" 
                        value={formData.telephone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="caserne">Caserne</Label>
                      <Input 
                        id="caserne" 
                        name="caserne" 
                        value={formData.caserne} 
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input 
                        id="grade" 
                        name="grade" 
                        value={formData.grade} 
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateProfile} className="bg-red-600 hover:bg-red-700">
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Canaux de notification</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="font-normal">Notifications par email</Label>
                        <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="font-normal">Notifications push</Label>
                        <p className="text-sm text-gray-500">Recevoir des notifications sur votre appareil</p>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Types de notification</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="controle-reminders" className="font-normal">Rappels de contrôle</Label>
                        <p className="text-sm text-gray-500">Être notifié des contrôles à effectuer</p>
                      </div>
                      <Switch 
                        id="controle-reminders" 
                        checked={notificationSettings.controleReminders}
                        onCheckedChange={(checked) => handleNotificationChange('controleReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="expiry-alerts" className="font-normal">Alertes d'expiration</Label>
                        <p className="text-sm text-gray-500">Être notifié des EPI arrivant en fin de vie</p>
                      </div>
                      <Switch 
                        id="expiry-alerts" 
                        checked={notificationSettings.expiryAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('expiryAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="nonconformite-alerts" className="font-normal">Alertes de non-conformité</Label>
                        <p className="text-sm text-gray-500">Être notifié des EPI déclarés non conformes</p>
                      </div>
                      <Switch 
                        id="nonconformite-alerts" 
                        checked={notificationSettings.nonConformiteAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('nonConformiteAlerts', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateNotifications} className="bg-red-600 hover:bg-red-700">
                    Enregistrer les préférences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Changer le mot de passe
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}