"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AddEquipement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [equipement, setEquipement] = useState({
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: '',
    date_fin_vie: '',
    statut: 'en_attente',
    observations: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipement(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEquipement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('equipements')
        .insert([{
          type: equipement.type,
          marque: equipement.marque,
          modele: equipement.modele,
          numero_serie: equipement.numero_serie,
          date_mise_en_service: equipement.date_mise_en_service,
          date_fin_vie: equipement.date_fin_vie,
          statut: equipement.statut,
          observations: equipement.observations
        }]);

      if (error) throw error;
      
      toast.success('Équipement ajouté avec succès');
      navigate('/equipements');
    } catch (error) {
      console.error('Error adding equipement:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un équipement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="type">Type d'équipement</Label>
              <Input
                id="type"
                name="type"
                value={equipement.type}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="marque">Marque</Label>
              <Input
                id="marque"
                name="marque"
                value={equipement.marque}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="modele">Modèle</Label>
              <Input
                id="modele"
                name="modele"
                value={equipement.modele}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="numero_serie">Numéro de série</Label>
              <Input
                id="numero_serie"
                name="numero_serie"
                value={equipement.numero_serie}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="date_mise_en_service">Date de mise en service</Label>
              <Input
                id="date_mise_en_service"
                name="date_mise_en_service"
                type="date"
                value={equipement.date_mise_en_service}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="date_fin_vie">Date de fin de vie</Label>
              <Input
                id="date_fin_vie"
                name="date_fin_vie"
                type="date"
                value={equipement.date_fin_vie}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select 
                name="statut" 
                value={equipement.statut} 
                onValueChange={(value) => handleSelectChange('statut', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_service">En service</SelectItem>
                  <SelectItem value="en_reparation">En réparation</SelectItem>
                  <SelectItem value="hors_service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                name="observations"
                value={equipement.observations}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/equipements')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter l\'équipement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEquipement;