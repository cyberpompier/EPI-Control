import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface Equipement {
  marque?: string | null;
  modele?: string | null;
}

interface Controle {
  id: string;
  equipements: Equipement | null;
  // Ajouter d'autres champs si nécessaire
}

const ControleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [controle, setControle] = useState<Controle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchControle = async () => {
      const { data, error } = await supabase
        .from('controles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        showError("Erreur lors de la récupération du contrôle");
      } else {
        setControle(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchControle();
    }
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!controle) return <div>Contrôle non trouvé</div>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Détails du contrôle</h2>
      </CardHeader>
      <CardContent>
        <p>ID: {controle.id}</p>
        <p>
          Équipement: {controle.equipements ? `${controle.equipements.marque} ${controle.equipements.modele}` : 'Équipement non trouvé'}
        </p>
        {/* Vous pouvez ajouter d'autres informations sur le contrôle ici */}
      </CardContent>
    </Card>
  );
};

export default ControleDetails;