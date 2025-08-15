"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import EPICard from '@/components/epi/EPICard';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Equipement {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  date_mise_en_service?: string;
  statut: string;
  image?: string;
}

const Equipements = () => {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipements(data || []);
    } catch (error) {
      console.error('Error fetching equipements:', error);
      toast.error('Erreur lors du chargement des équipements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/equipements/${id}/edit`);
  };

  const handleViewHistory = (id: string) => {
    navigate(`/equipements/${id}/historique`);
  };

  const filteredEquipements = equipements.filter(equipement =>
    equipement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipement.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipement.marque && equipement.marque.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Équipements</h1>
        <Button onClick={() => navigate('/equipements/ajouter')}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un équipement
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par type, numéro de série ou marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {filteredEquipements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun équipement trouvé</p>
          <Button onClick={() => navigate('/equipements/ajouter')}>
            Ajouter votre premier équipement
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipements.map((equipement) => (
            <EPICard
              key={equipement.id}
              id={equipement.id}
              type={equipement.type}
              marque={equipement.marque}
              modele={equipement.modele}
              numeroSerie={equipement.numero_serie}
              dateMiseEnService={equipement.date_mise_en_service}
              statut={equipement.statut}
              image={equipement.image}
              onEdit={handleEdit}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipements;