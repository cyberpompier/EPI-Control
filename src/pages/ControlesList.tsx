"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ControlesList = () => {
  const [controles, setControles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchControles();
  }, []);

  const fetchControles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('controles')
      .select('*')
      .order('date_controle', { ascending: false });

    if (error) {
      console.error('Error fetching controles:', error);
    } else {
      setControles(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Contrôles</h1>
        <Button>Ajouter un Contrôle</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Équipement</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Résultat</th>
              <th className="py-3 px-4 text-left">Contrôleur</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {controles.map((controle) => (
              <tr key={controle.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Équipement #{controle.equipement_id}</td>
                <td className="py-3 px-4">{new Date(controle.date_controle).toLocaleDateString()}</td>
                <td className="py-3 px-4">{controle.resultat}</td>
                <td className="py-3 px-4">Contrôleur #{controle.controleur_id}</td>
                <td className="py-3 px-4">
                  <Button variant="outline" size="sm">Voir Détails</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControlesList;