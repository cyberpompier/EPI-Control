import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react';
import { showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

interface Equipement {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  date_fin_vie: string | null;
  statut: string;
  created_at: string;
  image: string | null;
}

interface Controle {
  id: string;
  date_controle: string;
  resultat: string;
  observations: string | null;
  actions_correctives: string | null;
  date_prochaine_verification: string | null;
}

const EquipementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState<Equipement | null>(null);
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchEquipement = async () => {
      try {
        // Récupérer les détails de l'équipement
        const { data: equipementData, error: equipementError } = await supabase
          .from('equipements')
          .select('*')
          .eq('id', id)
          .single();

        if (equipementError) throw equipementError;

        setEquipement(equipementData);

        // Récupérer les contrôles associés
        const { data: controlesData, error: controlesError } = await supabase
          .from('controles')
          .select('*')
          .eq('equipement_id', id)
          .order('date_controle', { ascending: false });

        if (controlesError) throw controlesError;

        setControles(controlesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError('Impossible de charger les détails de l\'équipement');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!equipement) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Équipement non trouvé
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_service': return 'bg-green-100 text-green-800';
      case 'en_reparation': return 'bg-yellow-100 text-yellow-800';
      case 'hors_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultatIcon = (resultat: string) => {
    switch (resultat) {
      case 'conforme': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non_conforme': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'conditionnel': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Détails de l'équipement</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations de l'équipement */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{equipement.type}</span>
                <Badge className={getStatutColor(equipement.statut)}>
                  {equipement.statut.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Marque</h3>
                  <p>{equipement.marque || 'Non spécifiée'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Modèle</h3>
                  <p>{equipement.modele || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Numéro de série</h3>
                  <p>{equipement.numero_serie}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Date de mise en service</h3>
                  <p>
                    {equipement.date_mise_en_service 
                      ? new Date(equipement.date_mise_en_service).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Date de fin de vie</h3>
                  <p>
                    {equipement.date_fin_vie 
                      ? new Date(equipement.date_fin_vie).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image de l'équipement */}
          {equipement.image && (
            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={equipement.image} 
                  alt={equipement.type}
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to={`/controle/${equipement.id}`}>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau contrôle
                </Button>
              </Link>
              
              <Link to={`/equipement/edit/${equipement.id}`}>
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier l'équipement
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Dernier contrôle */}
          {controles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dernier contrôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {new Date(controles[0].date_controle).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="flex items-center mt-1">
                      {getResultatIcon(controles[0].resultat)}
                      <span className="ml-2 capitalize">
                        {controles[0].resultat.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Link to={`/controle/${equipement.id}/${controles[0].id}`}>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Historique des contrôles */}
      {controles.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Historique des contrôles ({controles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {controles.map((controle) => (
                <div key={controle.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    {getResultatIcon(controle.resultat)}
                    <div className="ml-4">
                      <p className="font-semibold">
                        {new Date(controle.date_controle).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {controle.resultat.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Link to={`/controle/${equipement.id}/${controle.id}`}>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipementDetail;