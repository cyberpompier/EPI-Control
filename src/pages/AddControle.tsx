"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  numero_serie: string;
}

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

const AddControle = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [controle, setControle] = useState({
    equipement_id: '',
    controleur_id: '',
    date_controle: new Date().toISOString().split('T')[0],
    resultat: '',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();
    fetchEquipements();
    fetchPersonnel();
  }, []);

  const fetchEquipements = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('id, type, numero_serie')
        .order('type');

      if (error) throw error;
      setEquipements(data || []);
    } catch (error) {
      console.error('Error fetching equipements:', error);
      toast.error('Erreur lors du chargement des équipements');
    }
  };

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('id, nom, prenom')
        .order('nom');

      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast.error('Erreur lors du chargement du personnel');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setControle(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setControle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('controles')
        .insert([{
          equipement_id: controle.equipement_id,
          controleur_id: parseInt(controle.controleur_id),
          date_controle: controle.date_controle,
          resultat: controle.resultat,
          observations: controle.observations || null,
          actions_correctives: controle.actions_correctives || null,
          date_prochaine_verification: controle.date_prochaine_verification || null
        }]);

      if (error) throw error;
      
      toast.success('Contrôle ajouté avec succès');
      navigate('/controles');
    } catch (error) {
      console.error('Error adding controle:', error);
      toast.error('Erreur lors de l\'ajout du contrôle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un contrôle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="equipement_id">Équipement</Label>
              <Select 
                name="equipement_id" 
                value={controle.equipement_id} 
                onValueChange={(value) => handleSelectChange('equipement_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {equipements.map((equipement) => (
                    <SelectItem key={equipement.id} value={equipement.id}>
                      {equipement.type} - {equipement.numero_serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="controleur_id">Contrôleur</Label>
              <Select 
                name="controleur_id" 
                value={controle.controleur_id} 
                onValueChange={(value) => handleSelectChange('controleur_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contrôleur" />
                </SelectTrigger>
                <SelectContent>
                  {personnel.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.prenom} {person.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_controle">Date du contrôle</Label>
              <Input
                id="date_controle"
                name="date_controle"
                type="date"
                value={controle.date_controle}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="resultat">Résultat</Label>
              <Select 
                name="resultat" 
                value={controle.resultat} 
                onValueChange={(value) => handleSelectChange('resultat', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un résultat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conforme">Conforme</SelectItem>
                  <SelectItem value="non_conforme">Non conforme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                name="observations"
                value={controle.observations}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="actions_correctives">Actions correctives</Label>
              <Textarea
                id="actions_correctives"
                name="actions_correctives"
                value={controle.actions_correctives}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="date_prochaine_verification">Prochaine vérification</Label>
              <Input
                id="date_prochaine_verification"
                name="date_prochaine_verification"
                type="date"
                value={controle.date_prochaine_verification}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/controles')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter le contrôle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddControle;