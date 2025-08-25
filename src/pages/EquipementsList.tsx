"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const EquipementsList = () => {
  const [equipements, setEquipements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select('*')
      .order('type');

    if (error) {
      console.error('Error fetching equipements:', error);
    } else {
      setEquipements(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Équipements</h1>
        <Button>Ajouter un Équipement</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Marque</th>
              <th className="py-3 px-4 text-left">Modèle</th>
              <th className="py-3 px-4 text-left">Numéro de Série</th>
              <th className="py-3 px-4 text-left">Statut</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipements.map((equipement) => (
              <tr key={equipement.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{equipement.type}</td>
                <td className="py-3 px-4">{equipement.marque}</td>
                <td className="py-3 px-4">{equipement.modele}</td>
                <td className="py-3 px-4">{equipement.numero_serie}</td>
                <td className="py-3 px-4">{equipement.statut}</td>
                <td className="py-3 px-4">
                  <Button variant="outline" size="sm">Modifier</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipementsList;