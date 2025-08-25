"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const PersonnelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [personnel, setPersonnel] = useState<Personnel>({
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    matricule: '',
    grade: '',
    caserne: '',
    photo: '',
  });

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

    setPersonnel(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonnel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('personnel')
      .update(personnel)
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du personnel',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Le personnel a été mis à jour avec succès',
      });
      navigate(`/personnel/${id}`);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modifier le Personnel</h1>
        <Button onClick={() => navigate(`/personnel/${id}`)}>Retour au détail</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={personnel.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={personnel.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  name="matricule"
                  value={personnel.matricule}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={personnel.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  name="grade"
                  value={personnel.grade}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="caserne">Caserne</Label>
                <Input
                  id="caserne"
                  name="caserne"
                  value={personnel.caserne}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/personnel/${id}`)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelEdit;