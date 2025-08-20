import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Controle {
  id: number;
  date_controle: string;
  resultat: string;
  observations: string | null;
  equipements: {
    id: number;
    type: string;
    marque: string | null;
    modele: string | null;
  } | null;
  personnel: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
}

export default function Controles() {
  const location = useLocation();
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);

  // Get equipment_id from URL query params if present
  const urlParams = new URLSearchParams(location.search);
  const equipmentId = urlParams.get('equipment_id');

  useEffect(() => {
    fetchControles();
  }, [equipmentId]);

  const fetchControles = async () => {
    setLoading(true);
    let query = supabase
      .from('controles')
      .select(`
        id,
        date_controle,
        resultat,
        observations,
        equipements (
          id,
          type,
          marque,
          modele
        ),
        personnel (
          id,
          nom,
          prenom
        )
      `)
      .order('date_controle', { ascending: false });

    if (equipmentId) {
      query = query.eq('equipement_id', equipmentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching controles:', error);
    } else {
      // Transform data to ensure proper typing
      const transformedData = data?.map(item => ({
        ...item,
        equipements: item.equipements ? {
          id: item.equipements[0]?.id || 0,
          type: item.equipements[0]?.type || '',
          marque: item.equipements[0]?.marque || null,
          modele: item.equipements[0]?.modele || null
        } : null,
        personnel: item.personnel ? {
          id: item.personnel[0]?.id || 0,
          nom: item.personnel[0]?.nom || '',
          prenom: item.personnel[0]?.prenom || ''
        } : null
      })) || [];
      
      setControles(transformedData);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Contrôles</h1>
          <Link to="/controles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau contrôle
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liste des contrôles</CardTitle>
            </CardHeader>
            <CardContent>
              {controles.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  Aucun contrôle enregistré.
                </p>
              ) : (
                <div className="space-y-4">
                  {controles.map((controle) => (
                    <div key={controle.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {controle.equipements 
                              ? `${controle.equipements.type} ${controle.equipements.marque || ''} ${controle.equipements.modele || ''}`
                              : 'Équipement inconnu'}
                          </h3>
                          {controle.personnel && (
                            <p className="text-sm text-gray-600">
                              Contrôlé par: {controle.personnel.prenom} {controle.personnel.nom}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          controle.resultat === 'conforme' ? 'bg-green-100 text-green-800' :
                          controle.resultat === 'non_conforme' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {controle.resultat === 'conforme' ? 'Conforme' : 
                           controle.resultat === 'non_conforme' ? 'Non conforme' : controle.resultat}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(new Date(controle.date_controle), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                      {controle.observations && (
                        <p className="mt-2 text-sm">{controle.observations}</p>
                      )}
                      <div className="mt-3">
                        <Link to={`/controles/${controle.id}`}>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}