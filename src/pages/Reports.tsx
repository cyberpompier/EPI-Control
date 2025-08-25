"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PrivateRoute from '@/components/auth/PrivateRoute';

interface Controle {
  id: string;
  date_controle: string;
  resultat: string;
  equipements: {
    type: string;
    personnel: {
      caserne: string;
    }[];
  }[];
}

const Reports = () => {
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchControles = async () => {
    try {
      setLoading(true);
      const { data: controlesData, error: controlesError } = await supabase
        .from('controles')
        .select(`
          id,
          date_controle,
          resultat,
          equipements (
            type,
            personnel (
              caserne
            )
          )
        `);

      if (controlesError) throw controlesError;
      
      // Typage explicite pour résoudre l'erreur TS2345
      const formattedData = (controlesData || []).map((controle: any) => ({
        id: controle.id,
        date_controle: controle.date_controle,
        resultat: controle.resultat,
        equipements: controle.equipements?.map((equipement: any) => ({
          type: equipement.type || '',
          personnel: equipement.personnel ? [{
            caserne: equipement.personnel.caserne || ''
          }] : []
        })) || []
      }));
      
      setControles(formattedData as Controle[]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControles();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <PrivateRoute>
      <div>
        <h1>Rapports</h1>
        {controles.map((controle) => (
          <div key={controle.id}>
            <p>Date: {controle.date_controle}</p>
            <p>Résultat: {controle.resultat}</p>
          </div>
        ))}
      </div>
    </PrivateRoute>
  );
};

export default Reports;