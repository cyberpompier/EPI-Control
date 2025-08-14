import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Pompier, EPI, Controle } from '@/types';
import { ArrowLeft, User, Calendar, Shield, Wrench, Plus, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getStatusIcon, getStatusColor } from '@/utils/statusUtils';

export default function EquipementDetail() {
  const { id } = useParams<{ id: string }>();
  const [equipement, setEquipement] = useState<EPI | null>(null);
  const [pompier, setPompier] = useState<Pompier | null>(null);
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: equipementData, error: equipementError } = await supabase
          .from('equipements')
          .select('*')
          .eq('id', id)
          .single();

        if (equipementError) throw equipementError;
        setEquipement(equipementData);

        if (equipementData && equipementData.personnel_id) {
          const { data: pompierData, error: pompierError } = await supabase
            .from('personnel')
            .select('*')
            .eq('id', equipementData.personnel_id)
            .single();
          if (pompierError) throw pompierError;
          setPompier(pompierData);
        }

        const { data: controlesData, error: controlesError } = await supabase
          .from('controles')
          .select('*, controleur:profiles(prenom, nom)')
          .eq('equipement_id', id)
          .order('date_controle', { ascending: false });
        
        if (controlesError) throw controlesError;
        setControles(controlesData || []);

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
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

  if (!equipement) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Équipement non trouvé</h2>
          <p className="text-gray-600 mb-6">L'équipement demandé n'existe pas ou a été supprimé.</p>
          <Link to="/equipements">
            <Button>Retour aux équipements</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const getInitials = (nom?: string, prenom?: string) => {
    return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase();
  };

  const ControleIcon = ({ resultat }: { resultat: string }) => {
    switch (resultat) {
      case 'conforme': return <CheckCircle className="text-green-500" />;
      case 'non_conforme': return <XCircle className="text-red-500" />;
      default: return <AlertTriangle className="text-yellow-500" />;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{equipement.type} {equipement.modele} | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to={pompier ? `/personnel/${pompier.id}/equipements` : '/equipements'} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">{equipement.type} {equipement.marque} {equipement.modele}</h1>
            <p className="text-gray-600">N/S: {equipement.numero_serie}</p>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Link to={`/controles/nouveau?equipement=${equipement.id}`}>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contrôle
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations sur l'équipement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">{equipement.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Marque</p>
                  <p className="font-medium">{equipement.marque}</p>
                </div>
                <div>
                  <p className="text-gray-500">Modèle</p>
                  <p className="font-medium">{equipement.modele}</p>
                </div>
                <div>
                  <p className="text-gray-500">Numéro de série</p>
                  <p className="font-medium">{equipement.numero_serie}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mise en service</p>
                  <p className="font-medium">{new Date(equipement.date_mise_en_service).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fin de vie</p>
                  <p className="font-medium">{new Date(equipement.date_fin_vie).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Statut</p>
                  <Badge className={`${getStatusColor(equipement.statut)}`}>
                    {getStatusIcon(equipement.statut)}
                    {equipement.statut.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pompier assigné</CardTitle>
            </CardHeader>
            <CardContent>
              {pompier ? (
                <Link to={`/personnel/${pompier.id}`} className="flex items-center space-x-3 group">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${pompier.id}`} />
                    <AvatarFallback>{getInitials(pompier.nom, pompier.prenom)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold group-hover:underline">{pompier.prenom} {pompier.nom}</p>
                    <p className="text-sm text-gray-500">{pompier.grade}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center text-gray-500">
                  <User className="h-5 w-5 mr-2" />
                  <span>Non assigné</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Historique des contrôles</CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exporter l'historique
          </Button>
        </CardHeader>
        <CardContent>
          {controles.length > 0 ? (
            <div className="space-y-4">
              {controles.map(controle => (
                <div key={controle.id} className="flex items-start p-3 border rounded-lg bg-gray-50">
                  <div className="mr-3 pt-1">
                    <ControleIcon resultat={controle.resultat} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold capitalize">{controle.resultat.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{new Date(controle.date_controle).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{controle.observations}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Contrôlé par: {controle.controleur ? `${controle.controleur.prenom} ${controle.controleur.nom}` : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucun contrôle enregistré</h3>
              <p className="mt-2 text-gray-500 mb-4">Cet équipement n'a pas encore été contrôlé.</p>
              <Link to={`/controles/nouveau?equipement=${equipement.id}`}>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Effectuer le premier contrôle
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}