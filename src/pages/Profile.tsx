"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/components/auth/SessionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useSession(); // Fixed: use session instead of user
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    } else if (session?.user) {
      fetchProfile();
    }
  }, [session, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id) // Use session.user.id
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!session) {
    return <div className="p-4">Vous devez être connecté pour voir cette page</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profil utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input 
                  id="email" 
                  value={session.user.email} 
                  readOnly 
                  className="bg-gray-100"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role">Rôle</Label>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <Input 
                  id="role" 
                  value={profile?.role || 'Non défini'} 
                  readOnly 
                  className="bg-gray-100"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="destructive" 
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    toast({
                      title: "Erreur",
                      description: "Impossible de se déconnecter",
                      variant: "destructive"
                    });
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;