"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Equipement {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  date_mise_en_service?: string;
  date_fin_vie?: string;
  statut: string;
  observations?: string;
}

const EditEquipement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [equipement, setEquipement] = useState<Equipement>({
    id: '',
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: '',
    date_fin_vie: '',
    statut: 'en_attente',
    observations: ''
  });

  useEffect(() => {
    if (id) {
      fetchEquipement();
    }
  }, [id]);

  const fetchEquipement = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setEquipement({
        id: data.id,
        type: data.type,
        marque: data.marque || '',
        modele: data.modele || '',
        numero_serie: data.numero_serie,
        date_mise_en_service: data.date_mise_en_service || '',
        date_fin_vie: data.date_fin_vie || '',
        statut: data.statut,
        observations: data.observations || ''
      });
    } catch (error) {
      console.error('Error fetching equipement:', error);
      toast.error('Erreur lors du chargement de l\'équipement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipement(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEquipement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('equipements')
        .update({
          type: equipement.type,
          marque: equipement.marque,
          modele: equipement.modele,
          numero_serie: equipement.numero_serie,
          date_mise_en_service: equipement.date_mise_en_service,
          date_fin_vie: equipement.date_fin_vie,
          statut: equipement.statut,
          observations: equipement.observations
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Équipement mis à jour avec succès');
      navigate('/equipements');
    } catch (error) {
      console.error('Error updating equipement:', error);
      toast.error('Erreur lors de la mise à jour de l\'équipement');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'équipement</CardTitle>
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
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEquipement;