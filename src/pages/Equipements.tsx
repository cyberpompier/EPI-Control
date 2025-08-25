"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EquipementCard from '@/components/EquipementCard';

const Equipements = () => {
  const [equipements, setEquipements] = useState([]);
  const [filteredEquipements, setFilteredEquipements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipements();
  }, []);

  useEffect(() => {
    const filtered = equipements.filter(equipement =>
      equipement.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipements(filtered);
  }, [searchTerm, equipements]);

  const fetchEquipements = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipements(data);
      setFilteredEquipements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des équipements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Titre et boutons d'action - Version responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Liste des équipements</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/equipements/barcode">
            <Button variant="outline">Scanner un code-barres</Button>
          </Link>
          <Link to="/equipements/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un équipement
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par type, marque, modèle ou numéro de série..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des équipements */}
      {filteredEquipements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'Aucun équipement ne correspond à votre recherche.' : 'Aucun équipement enregistré.'}
          </p>
          {!searchTerm && (
            <Link to="/equipements/new">
              <Button className="mt-4">Ajouter votre premier équipement</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipements.map((equipement) => (
            <EquipementCard
              key={equipement.id}
              equipement={equipement}
              onEdit={() => fetchEquipements()}
              onDelete={() => fetchEquipements()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipements;