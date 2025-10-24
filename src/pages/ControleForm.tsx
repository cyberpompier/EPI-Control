"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Equipement = {
  id: string;
  type: string;
  numero_serie: string;
};

type Profile = {
  id: string;
  nom: string;
  prenom: string;
};

export default function ControleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [controleurs, setControleurs] = useState<Profile[]>([]);

  const [formData, setFormData] = useState({
    equipement_id: id || '',
    controleur_id: '',
    date_controle: new Date().toISOString().split('T')[0],
    resultat: '',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: '',
  });

  useEffect(() => {
    loadEquipements();
    loadControleurs();
  }, []);

  const loadEquipements = async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select('id, type, numero_serie')
      .order('type');

    if (error) {
      console.error('Erreur lors du chargement des équipements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipements",
        variant: "destructive",
      });
      return;
    }

    setEquipements(data || []);
  };

  const loadControleurs = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, prenom')
      .order('nom');

    if (error) {
      console.error('Erreur lors du chargement des contrôleurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrôleurs",
        variant: "destructive",
      });
      return;
    }

    setControleurs(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation des champs requis
      if (!formData.equipement_id || !formData.controleur_id || !formData.resultat) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Préparer les données pour l'insertion
      const controleData: any = {
        equipement_id: formData.equipement_id,
        controleur_id: formData.controleur_id,
        date_controle: formData.date_controle,
        resultat: formData.resultat,
        observations: formData.observations || null,
        actions_correctives: formData.actions_correctives || null,
        date_prochaine_verification: formData.date_prochaine_verification || null,
      };

      const { error } = await supabase
        .from('controles')
        .insert([controleData]);

      if (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer le contrôle: ${error.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Succès",
        description: "Le contrôle a été enregistré avec succès",
      });

      navigate('/equipements');
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      toast({
        title: "Erreur",
        description: `Une erreur inattendue s'est produite: ${error.message}`,
        variant: "destructive",
      });
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
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau Contrôle</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipement_id">Équipement *</Label>
              <Select
                value={formData.equipement_id}
                onValueChange={(value) => handleChange('equipement_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {equipements.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id}>
                      {equip.type} - {equip.numero_serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="controleur_id">Contrôleur *</Label>
              <Select
                value={formData.controleur_id}
                onValueChange={(value) => handleChange('controleur_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contrôleur" />
                </SelectTrigger>
                <SelectContent>
                  {controleurs.map((ctrl) => (
                    <SelectItem key={ctrl.id} value={ctrl.id}>
                      {ctrl.prenom} {ctrl.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un résultat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conforme">Conforme</SelectItem>
                  <SelectItem value="non_conforme">Non conforme</SelectItem>
                  <SelectItem value="reforme">Réformé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Observations sur le contrôle..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actions_correctives">Actions correctives</Label>
              <Textarea
                id="actions_correctives"
                value={formData.actions_correctives}
                onChange={(e) => handleChange('actions_correctives', e.target.value)}
                placeholder="Actions correctives à entreprendre..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_prochaine_verification">Date de prochaine vérification</Label>
              <Input
                id="date_prochaine_verification"
                type="date"
                value={formData.date_prochaine_verification}
                onChange={(e) => handleChange('date_prochaine_verification', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => navigate('/equipements')}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Enregistrement..." : "Enregistrer le contrôle"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}