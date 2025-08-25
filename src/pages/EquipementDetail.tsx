import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Calendar, User, Image, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { showError } from '@/utils/toast';

const EquipementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState<any>(null);
  const [controles, setControles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchEquipement = async () => {
      try {
        // Récupérer les détails de l'équipement
        const { data: equipementData, error: equipementError } = await supabase
          .from('equipements')
          .select(`
            *,
            personnel:personnel_id (nom, prenom)
          `)
          .eq('id', id)
          .single();

        if (equipementError) throw equipementError;

        // Récupérer les contrôles associés
        const { data: controlesData, error: controlesError } = await supabase
          .from('controles')
          .select(`
            *,
            controleur:controleur_id (nom, prenom)
          `)
          .eq('equipement_id', id)
          .order('date_controle', { ascending: false });

        if (controlesError) throw controlesError;

        setEquipement(equipementData);
        setControles(controlesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError('Erreur lors du chargement des données');
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-800 mb-4">Équipement non trouvé</div>
        <Button onClick={() => navigate('/equipements')}>Retour à la liste</Button>
      </div>
    );
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_service': return 'bg-green-100 text-green-800';
      case 'en_reparation': return 'bg-yellow-100 text-yellow-800';
      case 'hors_service': return 'bg-red-100 text-red-800';
      case 'en_attente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Détails de l'équipement</h1>
        <Button variant="outline" onClick={() => navigate('/equipements')}>
          Retour à la liste
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{equipement.type}</CardTitle>
              <p className="text-gray-600">{equipement.marque} - {equipement.modele}</p>
            </div>
            <Badge className={getStatusColor(equipement.statut)}>
              {equipement.statut.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-32">Numéro de série:</span>
                  <span>{equipement.numero_serie}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-32">Date de mise en service:</span>
                  <span>
                    {equipement.date_mise_en_service 
                      ? format(new Date(equipement.date_mise_en_service), 'dd MMMM yyyy', { locale: fr })
                      : 'Non spécifiée'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-32">Date de fin de vie:</span>
                  <span>
                    {equipement.date_fin_vie 
                      ? format(new Date(equipement.date_fin_vie), 'dd MMMM yyyy', { locale: fr })
                      : 'Non spécifiée'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-32">Assigné à:</span>
                  <span>
                    {equipement.personnel 
                      ? `${equipement.personnel.prenom} ${equipement.personnel.nom}`
                      : 'Non assigné'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Image</h3>
              {equipement.image ? (
                <div className="flex justify-center">
                  <img 
                    src={equipement.image} 
                    alt={equipement.type}
                    className="max-w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <Image className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Aucune image</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 mb-6">
        <Link to={`/equipements/${equipement.id}/modifier`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
        <Link to={`/controle/${equipement.id}`}>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrôle
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Historique des contrôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {controles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun contrôle enregistré pour cet équipement
            </div>
          ) : (
            <div className="space-y-4">
              {controles.map((controle) => (
                <div key={controle.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {format(new Date(controle.date_controle), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <Badge 
                      className={
                        controle.resultat === 'conforme' 
                          ? 'bg-green-100 text-green-800' 
                          : controle.resultat === 'non_conforme' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {controle.resultat.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Contrôlé par {controle.controleur?.prenom} {controle.controleur?.nom}
                    </span>
                  </div>
                  
                  {controle.observations && (
                    <div className="mb-2">
                      <span className="font-medium">Observations:</span>
                      <p className="ml-2 text-gray-700">{controle.observations}</p>
                    </div>
                  )}
                  
                  {controle.actions_correctives && (
                    <div>
                      <span className="font-medium">Actions correctives:</span>
                      <p className="ml-2 text-gray-700">{controle.actions_correctives}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipementDetail;