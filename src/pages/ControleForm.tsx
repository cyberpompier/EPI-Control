"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Equipement = {
  id: string;
  type: string;
  numero_serie: string;
};

export default function ControleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [equipement, setEquipement] = useState<Equipement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    date_controle: new Date().toISOString().split('T')[0],
    resultat: '',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: '',
  });

  useEffect(() => {
    loadCurrentUser();
    if (id) {
      loadEquipement();
    }
  }, [id]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(profile);
    }
  };

  const loadEquipement = async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select('id, type, numero_serie')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors du chargement de l\'équipement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'équipement",
        variant: "destructive",
      });
      navigate('/equipements');
      return;
    }

    setEquipement(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer un contrôle",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insérer le contrôle
      const { error: controleError } = await supabase
        .from('controles')
        .insert([{
          equipement_id: id,
          controleur_id: currentUser.id,
          date_controle: formData.date_controle,
          resultat: formData.resultat,
          observations: formData.observations,
          actions_correctives: formData.actions_correctives,
          date_prochaine_verification: formData.date_prochaine_verification || null,
        }]);

      if (controleError) throw controleError;

      // Mettre à jour le statut de l'équipement si nécessaire
      let newStatut = 'en_service';
      if (formData.resultat === 'non_conforme') {
        newStatut = 'en_maintenance';
      } else if (formData.resultat === 'reforme') {
        newStatut = 'reforme';
      }

      const { error: equipError } = await supabase
        .from('equipements')
        .update({ statut: newStatut })
        .eq('id', id);

      if (equipError) throw equipError;

      toast({
        title: "Succès",
        description: "Le contrôle a été enregistré avec succès",
      });

      navigate(`/equipement/${id}`);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le contrôle: ${error.message}`,
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

  if (!equipement) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(`/equipement/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Nouveau contrôle</CardTitle>
            <p className="text-sm text-muted-foreground">
              {equipement.type} - N° {equipement.numero_serie}
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date_controle">Date du contrôle *</Label>
                <Input
                  id="date_controle"
                  type="date"
                  value={formData.date_controle}
                  onChange={(e) => handleChange('date_controle', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultat">Résultat *</Label>
                <Select
                  value={formData.resultat}
                  onValueChange={(value) => handleChange('resultat', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un résultat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="reforme">À réformer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  placeholder="Notez vos observations..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actions_correctives">Actions correctives</Label>
                <Textarea
                  id="actions_correctives"
                  value={formData.actions_correctives}
                  onChange={(e) => handleChange('actions_correctives', e.target.value)}
                  placeholder="Actions à entreprendre..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_prochaine_verification">Date de la prochaine vérification</Label>
                <Input
                  id="date_prochaine_verification"
                  type="date"
                  value={formData.date_prochaine_verification}
                  onChange={(e) => handleChange('date_prochaine_verification', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate(`/equipement/${id}`)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer le contrôle"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}