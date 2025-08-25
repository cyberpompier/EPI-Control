"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EPICard from '@/components/epi/EPICard';

interface Equipment {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  image: string;
}

const Equipements = () => {
  const [equipements, setEquipements] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const { data, error } = await supabase
          .from('equipements')
          .select('*');
        
        if (error) throw error;
        setEquipements(data || []);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipements();
  }, []);

  const filteredEquipements = equipements.filter(equipement => 
    equipement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipement.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipement.marque && equipement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (equipement.modele && equipement.modele.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Équipements</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un équipement
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rechercher un équipement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par type, numéro de série, marque ou modèle..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Équipements</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEquipements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun équipement trouvé' : 'Aucun équipement enregistré'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEquipements.map((equipement) => (
                <EPICard
                  key={equipement.id}
                  id={equipement.id}
                  type={equipement.type}
                  marque={equipement.marque}
                  modele={equipement.modele}
                  numero_serie={equipement.numero_serie}
                  statut={equipement.statut}
                  date_mise_en_service={equipement.date_mise_en_service}
                  date_fin_vie={equipement.date_fin_vie}
                  image={equipement.image}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Equipements;