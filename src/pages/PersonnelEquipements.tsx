import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { Plus, QrCode } from 'lucide-react';
import EPICard from '@/components/epi/EPICard';
import { EPI } from '@/types/index';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

export default function PersonnelEquipements() {
  const { id } = useParams<{ id: string }>();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPersonnelAndEquipements();
    }
  }, [id]);

  const fetchPersonnelAndEquipements = async () => {
    setLoading(true);
    
    // Fetch personnel details
    const { data: personnelData, error: personnelError } = await supabase
      .from('personnel')
      .select('id, nom, prenom')
      .eq('id', id)
      .single();

    if (personnelError) {
      showError('Erreur lors du chargement des détails du personnel');
      console.error(personnelError);
      setLoading(false);
      return;
    }

    setPersonnel(personnelData);

    // Fetch associated equipment
    const { data: equipementsData, error: equipementsError } = await supabase
      .from('equipements')
      .select('*')
      .eq('personnel_id', id);

    if (equipementsError) {
      showError('Erreur lors du chargement des équipements');
      console.error(equipementsError);
    } else {
      // Transform database data to match EPI interface
      const transformedEpis = equipementsData?.map(item => ({
        id: item.id,
        type: item.type,
        marque: item.marque || '',
        modele: item.modele || '',
        numero_serie: item.numero_serie,
        date_mise_en_service: item.date_mise_en_service,
        date_fin_vie: item.date_fin_vie,
        personnel_id: item.personnel_id,
        statut: item.statut as 'conforme' | 'non_conforme' | 'en_attente',
        created_at: new Date().toISOString(),
        image: item.image || undefined
      })) || [];
      
      setEpis(transformedEpis);
    }

    setLoading(false);
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

  if (!personnel) {
    return (
      <Layout headerTitle="Personnel non trouvé">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold">Personnel non trouvé</h2>
          <p className="mt-2 text-gray-600">Le pompier que vous recherchez n'existe pas.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={`${personnel.prenom} ${personnel.nom}`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Équipements de {personnel.prenom} {personnel.nom}</h1>
          </div>
          <div className="flex gap-2">
            <Link to={`/equipements/new?personnel_id=${personnel.id}`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un équipement
              </Button>
            </Link>
            <Link to={`/equipements/barcode?personnel_id=${personnel.id}`}>
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Scanner un code-barres
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Équipements assignés</CardTitle>
          </CardHeader>
          <CardContent>
            {epis.length === 0 ? (
              <p className="text-center py-4 text-gray-500">Aucun équipement assigné à ce pompier.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {epis.map((epi) => (
                  <EPICard key={epi.id} epi={epi} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}