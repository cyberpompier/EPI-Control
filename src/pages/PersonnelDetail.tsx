import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import EPICard from '@/components/epi/EPICard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, Shield } from 'lucide-react';
import { showError } from '@/utils/toast';
import { EPI } from '@/types/index';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  grade: string;
  caserne: string;
  photo: string | null;
  matricule: string;
}

export default function PersonnelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPersonnelDetails();
    }
  }, [id]);

  const fetchPersonnelDetails = async () => {
    setLoading(true);
    
    // Fetch personnel details
    const { data: personnelData, error: personnelError } = await supabase
      .from('personnel')
      .select('*')
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

  const handleDeletePersonnel = async () => {
    if (!personnel) return;

    const { error } = await supabase
      .from('personnel')
      .delete()
      .eq('id', personnel.id);

    if (error) {
      showError('Erreur lors de la suppression du personnel');
      console.error(error);
    } else {
      navigate('/personnel');
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

  if (!personnel) {
    return (
      <Layout headerTitle="Personnel non trouvé">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-bold">Personnel non trouvé</h2>
          <p className="mt-2 text-gray-600">Le pompier que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button className="mt-4" onClick={() => navigate('/personnel')}>
            Retour à la liste
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
            <h1 className="text-3xl font-bold">{personnel.prenom} {personnel.nom}</h1>
            <p className="text-gray-600">Grade: {personnel.grade} | Caserne: {personnel.caserne}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/personnel/${personnel.id}/edit`}>
              <Button variant="outline">Modifier</Button>
            </Link>
            <Button variant="destructive" onClick={handleDeletePersonnel}>
              Supprimer
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Équipements assignés
            </CardTitle>
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