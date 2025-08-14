import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ControleForm from '@/components/controle/ControleForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { EPI, Pompier } from '@/types';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export default function ControleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epi, setEpi] = useState<any | null>(null);
  const [pompier, setPompier] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Données simulées pour l'EPI
  const mockEPI = {
    id: '2',
    type: 'veste',
    marque: 'Bristol',
    modele: 'ErgoTech Action',
    numero_serie: 'V54321',
    date_mise_en_service: '2021-06-10',
    date_fin_vie: '2026-06-10',
    pompier_id: '2',
    statut: 'en_attente'
  };

  // Données simulées pour le pompier
  const mockPompier = {
    id: '2',
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
        // Dans une vraie application, vous récupéreriez les données depuis Supabase
        // const { data: epiData, error: epiError } = await supabase.from('equipements').select('*').eq('id', id).single();
        // if (epiError) throw epiError;
        // setEpi(epiData);
        
        // const { data: pompierData, error: pompierError } = await supabase.from('pompiers').select('*').eq('id', epiData.pompier_id).single();
        // if (pompierError) throw pompierError;
        // setPompier(pompierData);
        
        // Simulation de chargement
        setTimeout(() => {
          setEpi(mockEPI);
          setPompier(mockPompier);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        showError('Impossible de charger les informations de l\'équipement');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      // Dans une vraie application, vous enverriez les données à Supabase
      // const { data: result, error } = await supabase.from('controles').insert([data]);
      // if (error) throw error;
      
      // Simulation d'envoi
      console.log('Données du contrôle:', data);
      
      // Mise à jour du statut de l'EPI
      // await supabase.from('equipements').update({ statut: data.resultat }).eq('id', id);
      
      setTimeout(() => {
        showSuccess('Contrôle enregistré avec succès');
        navigate('/controles');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du contrôle:', error);
      showError('Erreur lors de l\'enregistrement du contrôle');
      setSubmitting(false);
    }
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

  if (!epi || !pompier) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Équipement non trouvé</h2>
          <p className="text-gray-600 mb-6">L'équipement demandé n'existe pas ou a été supprimé.</p>
          <Link to="/equipements">
            <Button>Retour à la liste des équipements</Button>
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

  return (
    <Layout>
      <Helmet>
        <title>Nouveau contrôle | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/equipements" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux équipements
        </Link>
        
        <h1 className="text-2xl font-bold">Nouveau contrôle</h1>
        <p className="text-gray-600">
          Contrôle de l'équipement: {epi.type} {epi.marque} {epi.modele}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ControleForm 
            epi={epi} 
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Équipement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{getTypeIcon(epi.type)}</div>
                <div>
                  <h3 className="font-medium">{epi.marque} {epi.modele}</h3>
                  <p className="text-sm text-gray-500">N° {epi.numero_serie}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{epi.type.charAt(0).toUpperCase() + epi.type.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mise en service</span>
                  <span className="font-medium">{new Date(epi.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fin de vie</span>
                  <span className="font-medium">{new Date(epi.date_fin_vie).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Pompier
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  <span className="text-gray-500">Caserne</span>
                  <span className="font-medium">{pompier.caserne}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Link to={`/personnel/${pompier.id}`}>
                  <Button variant="outline" className="w-full text-sm">
                    Voir tous les équipements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}