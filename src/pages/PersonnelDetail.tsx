"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  grade: string;
  caserne: string;
  photo?: string;
}

const getInitials = (nom: string, prenom: string) => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pompier, setPompier] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPersonnel();
    }
  }, [id]);

  const fetchPersonnel = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement du personnel',
        variant: 'destructive',
      });
      return;
    }

    setPompier(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  if (!pompier) {
    return <div className="container mx-auto py-8">Personnel non trouvé</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails du Personnel</h1>
        <Button onClick={() => navigate(`/personnel/${id}/edit`)}>Retour à la liste</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="absolute top-4 right-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/personnel/${id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
                <AvatarFallback className="text-xl">{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{pompier.prenom} {pompier.nom}</h2>
              <p className="text-muted-foreground">{pompier.grade}</p>
              <Badge className="mt-2">{pompier.caserne}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Matricule</label>
                <p>{pompier.matricule}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{pompier.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Caserne</label>
                <p>{pompier.caserne}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Grade</label>
                <p>{pompier.grade}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Équipements assignés</h3>
              <p className="text-muted-foreground">Aucun équipement assigné pour le moment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonnelDetail;