"use client";
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pompier, setPompier] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPompier = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du personnel",
          variant: "destructive"
        });
        return;
      }

      setPompier(data);
    };

    fetchPompier();
  }, [id, toast]);

  const handleEditPersonnel = (personnelId: string) => {
    navigate(`/personnel/edit/${personnelId}`);
  };

  if (!pompier) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout>
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Détails du Personnel</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4"
              onClick={() => handleEditPersonnel(pompier.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
                  <AvatarFallback>
                    {pompier.prenom?.charAt(0)}{pompier.nom?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{pompier.prenom} {pompier.nom}</h3>
                <p className="text-muted-foreground">Matricule: {pompier.matricule || 'Non renseigné'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Grade</h4>
                  <p className="text-muted-foreground">{pompier.grade || 'Non renseigné'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Caserne</h4>
                  <p className="text-muted-foreground">{pompier.caserne || 'Non renseigné'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-muted-foreground">{pompier.email || 'Non renseigné'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
};

export default PersonnelDetail;