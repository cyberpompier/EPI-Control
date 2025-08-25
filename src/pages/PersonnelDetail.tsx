"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pencil, ArrowLeft } from 'lucide-react';
import EditPersonnelModal from '@/components/EditPersonnelModal';
import { toast } from 'sonner';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  caserne: string;
  grade: string;
  matricule: string;
  photo: string;
}

const PersonnelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pompier, setPompier] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPersonnel();
    }
  }, [id]);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPompier(data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast.error('Erreur lors du chargement du personnel');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedPersonnel: Personnel) => {
    setPompier(updatedPersonnel);
    setIsEditModalOpen(false);
    toast.success('Personnel mis à jour avec succès');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!pompier) {
    return <div className="flex justify-center items-center h-64">Personnel non trouvé</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
                <AvatarFallback className="text-2xl">
                  {pompier.prenom?.charAt(0)}{pompier.nom?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{pompier.prenom} {pompier.nom}</h2>
              <p className="text-muted-foreground">{pompier.grade}</p>
              <Badge className="mt-2">{pompier.caserne}</Badge>
              
              <Button 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Éditer
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Matricule</h3>
                <p>{pompier.matricule || 'Non renseigné'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{pompier.email || 'Non renseigné'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Équipements assignés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Aucun équipement assigné pour le moment.</p>
          </CardContent>
        </Card>
      </div>
      
      <EditPersonnelModal
        personnel={pompier}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default PersonnelDetail;