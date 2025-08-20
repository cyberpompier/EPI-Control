import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  caserne: string;
  grade: string;
  email: string;
}

interface Equipement {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  statut: string;
  created_at: string;
}

export default function PersonnelEquipements() {
  const { id } = useParams<{ id: string }>();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Récupérer les informations du personnel
        const { data: personnelData, error: personnelError } = await supabase
          .from('personnel')
          .select('*')
          .eq('id', id)
          .single();

        if (personnelError) throw personnelError;
        setPersonnel(personnelData);

        // Récupérer les équipements assignés à ce personnel
        const { data: equipementsData, error: equipementsError } = await supabase
          .from('equipements')
          .select('*')
          .eq('personnel_id', id);

        if (equipementsError) throw equipementsError;
        setEquipements(equipementsData || []);

      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        showError(`Erreur lors de la récupération des données: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  if (!personnel) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Personnel non trouvé</h2>
          <p className="text-gray-600 mt-2">Le membre du personnel demandé n'existe pas.</p>
          <Link to="/personnel">
            <Button className="mt-4">Retour au personnel</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const equipementsConformes = equipements.filter(eq => eq.statut === 'conforme').length;
  const equipementsNonConformes = equipements.filter(eq => eq.statut === 'non_conforme').length;
  const equipementsEnAttente = equipements.filter(eq => eq.statut === 'en_attente').length;
  const equipementsExpires = equipements.filter(eq => new Date(eq.date_fin_vie) < new Date()).length;

  return (
    <Layout>
      <Helmet>
        <title>{`${personnel.prenom} ${personnel.nom} - Équipements | EPI Control`}</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/personnel" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au personnel
        </Link>
        
        <div className="flex items-center mb-4">
          <User className="h-8 w-8 text-gray-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">{personnel.grade} {personnel.prenom} {personnel.nom}</h1>
            <p className="text-gray-600">Matricule: {personnel.matricule} • {personnel.caserne}</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{equipements.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{equipementsConformes}</div>
              <div className="text-sm text-gray-600">Conformes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{equipementsNonConformes}</div>
              <div className="text-sm text-gray-600">Non conformes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{equipementsExpires}</div>
              <div className="text-sm text-gray-600">Expirés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {equipements.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center">
              <Badge className="bg-red-100 text-red-800">Expiré</Badge>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucun équipement assigné</h3>
            <p className="text-gray-600 mt-2">
              Ce membre du personnel n'a aucun équipement assigné pour le moment.
            </p>
            <Link to="/equipements/nouveau">
              <Button className="mt-4 bg-red-600 hover:bg-red-700">
                Assigner un équipement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipements.map((equipement) => (
            // Assuming EPICard is used here or similar component.
            <Card key={equipement.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg capitalize">{equipement.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Numéro de série</p>
                    <p className="text-sm text-gray-600">{equipement.numero_serie}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mise en service</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(equipement.date_mise_en_service), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fin de vie</p>
                      <p className={`text-sm ${new Date(equipement.date_fin_vie) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {format(new Date(equipement.date_fin_vie), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge>
                      {equipement.statut === 'conforme' ? 'Conforme' : equipement.statut === 'non_conforme' ? 'Non conforme' : 'En attente'}
                    </Badge>
                    <Link to={`/equipements/${equipement.id}`}>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}