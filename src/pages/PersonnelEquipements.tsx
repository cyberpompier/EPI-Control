import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Shield, Calendar, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
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

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'conforme':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non_conforme':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'en_attente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'conforme':
        return <Badge className="bg-green-100 text-green-800">Conforme</Badge>;
      case 'non_conforme':
        return <Badge className="bg-red-100 text-red-800">Non conforme</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'casque':
        return '🪖';
      case 'veste':
        return '🧥';
      case 'surpantalon':
        return '👖';
      case 'gants':
        return '🧤';
      case 'rangers':
        return '👢';
      default:
        return '🛡️';
    }
  };

  const isExpired = (dateFinVie: string) => {
    return new Date(dateFinVie) < new Date();
  };

  const isExpiringSoon = (dateFinVie: string) => {
    const today = new Date();
    const endDate = new Date(dateFinVie);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

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
  const equipementsExpires = equipements.filter(eq => isExpired(eq.date_fin_vie)).length;

  return (
    <Layout>
      <Helmet>
        <title>{personnel.prenom} {personnel.nom} - Équipements | EPI Control</title>
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
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
            <Card key={equipement.id} className="relative">
              {isExpired(equipement.date_fin_vie) && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-100 text-red-800">Expiré</Badge>
                </div>
              )}
              {isExpiringSoon(equipement.date_fin_vie) && !isExpired(equipement.date_fin_vie) && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-orange-100 text-orange-800">Expire bientôt</Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(equipement.type)}</span>
                    <div>
                      <CardTitle className="text-lg capitalize">{equipement.type}</CardTitle>
                      <p className="text-sm text-gray-600">{equipement.marque} {equipement.modele}</p>
                    </div>
                  </div>
                  {getStatusIcon(equipement.statut)}
                </div>
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
                      <p className={`text-sm ${isExpired(equipement.date_fin_vie) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {format(new Date(equipement.date_fin_vie), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    {getStatusBadge(equipement.statut)}
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