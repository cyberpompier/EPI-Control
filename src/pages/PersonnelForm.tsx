"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function PersonnelForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
      loadPompier();
    }
  }, [id]);

  const loadPompier = async () => {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors du chargement du pompier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du pompier",
        variant: "destructive",
      });
      navigate('/personnel');
      return;
    }

    setFormData({
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      matricule: data.matricule || '',
      grade: data.grade || '',
      caserne: data.caserne || '',
      photo: data.photo || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('personnel')
          .update(formData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Le pompier a été modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from('personnel')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Le pompier a été ajouté avec succès",
        });
      }

      navigate('/personnel');
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le pompier: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/personnel')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Modifier un pompier' : 'Ajouter un pompier'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule *</Label>
                <Input
                  id="matricule"
                  value={formData.matricule}
                  onChange={(e) => handleChange('matricule', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caserne">Caserne *</Label>
                <Input
                  id="caserne"
                  value={formData.caserne}
                  onChange={(e) => handleChange('caserne', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">URL de la photo</Label>
                <Input
                  id="photo"
                  type="url"
                  value={formData.photo}
                  onChange={(e) => handleChange('photo', e.target.value)}
                  placeholder="https://exemple.com/photo.jpg"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate('/personnel')}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? "Enregistrement..." : id ? "Modifier" : "Ajouter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}