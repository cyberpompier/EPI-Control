import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { AlertTriangle, Calendar, User, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EPI {
  id: number;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string | null;
  statut: string;
  image: string | null;
  personnel_id: number;
  created_at: string;
  personnel: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
}

export default function EquipementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epi, setEpi] = useState<EPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEquipementDetails();
    }
  }, [id]);

  const fetchEquipementDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        id,
        type,
        marque,
        modele,
        numero_serie,
        date_mise_en_service,
        date_fin_vie,
        statut,
        image,
        personnel (
          id,
          nom,
          prenom
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      showError('Erreur lors du chargement des détails de l\'équipement');
      console.error(error);
    } else if (data) {
      // Transform the data to match EPI interface
      const transformedData = {
        ...data,
        personnel_id: data.personnel?.id || 0,
        created_at: new Date().toISOString()
      };
      setEpi(transformedData);
    }
    setLoading(false);
  };

  const handleDeleteEquipement = async () => {
    if (!epi) return;

    const { error } = await supabase
      .from('equipements')
      .delete()
      .eq('id', epi.id);

    if (error) {
      showError('Erreur lors de la suppression de l\'équipement');
      console.error(error);
    } else {
      navigate('/equipements');
    }
  };

  if (loading) {
    return (
      <Layout headerTitle="Chargement...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!epi) {
    return (
      <Layout headerTitle="Équipement non trouvé">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-bold">Équipement non trouvé</h2>
          <p className="mt-2 text-gray-600">L'équipement que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button className="mt-4" onClick={() => navigate('/equipements')}>
            Retour à la liste
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={epi.type}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{epi.type}</h1>
            <p className="text-gray-600">{epi.marque} {epi.modele}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/equipements/${epi.id}/edit`}>
              <Button variant="outline">Modifier</Button>
            </Link>
            <Button variant="destructive" onClick={handleDeleteEquipement}>
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'équipement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Numéro de série</h3>
                  <p className="text-gray-600">{epi.numero_serie}</p>
                </div>
                <div>
                  <h3 className="font-medium">Statut</h3>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    epi.statut === 'en_service' ? 'bg-green-100 text-green-800' :
                    epi.statut === 'en_maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    epi.statut === 'reforme' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {epi.statut === 'en_service' ? 'En service' :
                     epi.statut === 'en_maintenance' ? 'En maintenance' :
                     epi.statut === 'reforme' ? 'Réformé' : epi.statut}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Dates importantes
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Mise en service: {format(new Date(epi.date_mise_en_service), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  {epi.date_fin_vie && (
                    <p className="text-gray-600 text-sm">
                      Fin de vie: {format(new Date(epi.date_fin_vie), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>
                {epi.personnel && (
                  <div>
                    <h3 className="font-medium flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Assigné à
                    </h3>
                    <Link to={`/personnel/${epi.personnel.id}`} className="text-blue-600 hover:underline">
                      {epi.personnel.prenom} {epi.personnel.nom}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Historique des contrôles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500">Aucun contrôle enregistré pour cet équipement.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}