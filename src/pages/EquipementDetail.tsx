import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { EPI, Pompier } from '@/types';
import { ArrowLeft, CheckCircle, AlertTriangle, Calendar, Clock, User, FileText, Camera, Shield } from 'lucide-react';

export default function EquipementDetail() {
  const { id } = useParams<{ id: string }>();
  const [epi, setEpi] = useState<any | null>(null);
  const [pompier, setPompier] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Données simulées pour l'équipement
  const mockEPI = {
    id: '2',
    type: 'veste',
    marque: 'Bristol',
    modele: 'ErgoTech Action',
    numero_serie: 'V54321',
    date_mise_en_service: '2021-06-10',
    date_fin_vie: '2026-06-10',
    pompier_id: 2,
    statut: 'non_conforme'
  };

  // Données simulées pour le pompier
  const mockPompier = {
    id: 2,
    nom: 'Martin',
    prenom: 'Marie',
    matricule: 'SP23456',
    caserne: 'Caserne Nord',
    grade: 'Caporal',
    email: 'marie.martin@sdis.fr'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulation de chargement
        setTimeout(() => {
          setEpi(mockEPI);
          setPompier(mockPompier);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
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

  if (!epi) {
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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'conforme':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'non_conforme':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{epi.marque} {epi.modele} | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/equipements" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux équipements
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="mr-2 text-3xl">{getTypeIcon(epi.type)}</span>
              {epi.marque} {epi.modele}
            </h1>
            <p className="text-gray-600">N° de série: {epi.numero_serie}</p>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Link to={`/controle/${epi.id}`}>
              <Button className="bg-red-600 hover:bg-red-700">
                Contrôler cet équipement
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Informations sur l'équipement
              </CardTitle>
              <Badge className={getStatusColor(epi.statut)}>
                {epi.statut === 'conforme' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Conforme
                  </span>
                ) : epi.statut === 'non_conforme' ? (
                  <span className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Non conforme
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> En attente
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Caractéristiques</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{epi.type.charAt(0).toUpperCase() + epi.type.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Marque</span>
                    <span className="font-medium">{epi.marque}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modèle</span>
                    <span className="font-medium">{epi.modele}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">N° Série</span>
                    <span className="font-medium font-mono">{epi.numero_serie}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Dates importantes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mise en service</span>
                    <span className="font-medium">{new Date(epi.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fin de vie</span>
                    <span className="font-medium">{new Date(epi.date_fin_vie).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut</span>
                    <span className={`font-medium ${epi.statut === 'conforme' ? 'text-green-600' : epi.statut === 'non_conforme' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {epi.statut === 'conforme' ? 'Conforme' : epi.statut === 'non_conforme' ? 'Non conforme' : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Pompier assigné
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pompier ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Identité</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nom</span>
                      <span className="font-medium">{pompier.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prénom</span>
                      <span className="font-medium">{pompier.prenom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grade</span>
                      <span className="font-medium">{pompier.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Matricule</span>
                      <span className="font-medium font-mono">{pompier.matricule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Caserne</span>
                      <span className="font-medium">{pompier.caserne}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link to={`/personnel/${pompier.id}`}>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le profil complet
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucun pompier assigné</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}