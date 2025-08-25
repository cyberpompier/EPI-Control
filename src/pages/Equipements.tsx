import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Barcode } from 'lucide-react';
import EPICard from '@/components/epi/EPICard';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';

export default function Equipements() {
  const [equipements, setEquipements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipements() {
      setLoading(true);
      const { data, error } = await supabase.from('equipements').select('*');
      if (error) {
        showError("Erreur lors du chargement des équipements");
      } else {
        setEquipements(data || []);
      }
      setLoading(false);
    }
    fetchEquipements();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        {/* Titre et boutons d'action */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold"></h1>
          <div className="flex space-x-2">
            <Link to="/equipements/barcode">
              <Button className="bg-red-600 hover:bg-red-700">
                <Barcode className="h-4 w-4 mr-2" />
                Code barre
              </Button>
            </Link>
            <Link to="/equipements/nouveau">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un équipement
              </Button>
            </Link>
          </div>
        </div>

        {/* Liste des équipements */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        ) : equipements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipements.map((equipement) => (
              <EPICard key={equipement.id} epi={equipement} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">Aucun équipement trouvé.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}