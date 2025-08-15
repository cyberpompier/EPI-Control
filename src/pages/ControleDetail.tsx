import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { showError } from '@/utils/toast';

interface Equipement {
  marque?: string | null;
  modele?: string | null;
}

interface Controle {
  id: string;
  equipements: Equipement | null;
  // Ajouter d'autres champs si nécessaire
}

const ControleDetail: React.FC = () => {
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  if (!controle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Contrôle non trouvé</h2>
          <p className="text-gray-600 mb-6">Le contrôle demandé n'existe pas ou a été supprimé.</p>
          <Link to="/controles" className="text-blue-500 hover:underline">Retour aux contrôles</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Détails du contrôle</h2>
        <div className="mb-6">
          <p className="text-gray-700"><span className="font-semibold">ID :</span> {controle.id}</p>
          <p className="text-gray-700">
            <span className="font-semibold">Équipement :</span> {controle.equipements ? `${controle.equipements.marque} ${controle.equipements.modele}` : 'Non spécifié'}
          </p>
          {/* Vous pouvez afficher d'autres détails du contrôle ici */}
        </div>
        <Link to="/controles" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Retour aux contrôles
        </Link>
      </div>
    </Layout>
  );
};

export default ControleDetail;