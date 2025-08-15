import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PDFGenerator from '@/components/pdf/PDFGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { ArrowLeft, CheckCircle, AlertTriangle, User, FileText, Camera } from 'lucide-react';

export default function ControleDetail() {
  const { id } = useParams<{ id: string }>();
  const [controle, setControle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchControle = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('controles')
          .select('*, equipements(*, personnel(*)), profiles(id, nom, prenom, grade)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setControle(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du contrôle:', error);
        showError("Erreur lors de la récupération des détails du contrôle.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchControle();
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

  if (!controle || !controle.equipements) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Contrôle non trouvé</h2>
          <p className="text-gray-600 mb-6">Le contrôle demandé n'existe pas ou les données associées sont manquantes.</p>
          <Link to="/controles">
            <Button>Retour à la liste des contrôles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'casque': return '🪖';
      case 'veste': return '🧥';
      case 'surpantalon': return '👖';
      case 'gants': return '🧤';
      case 'rangers': return '👢';
      default: return '🛡️';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Détail du contrôle | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/controles" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux contrôles
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Détail du contrôle</h1>
            <p className="text-gray-600">
              Contrôle du {new Date(controle.date_controle).toLocaleDateString('fr-FR')} - {controle.equipements.marque} {controle.equipements.modele}
            </p>
          </div>
          
          {controle.equipements.personnel && controle.profiles && (
            <PDFGenerator 
              controle={controle}
              epi={controle.equipements}
              pompier={controle.equipements.personnel}
              controleur={controle.profiles}
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <span className="mr-2 text-xl">{getTypeIcon(controle.equipements.type)}</span>
                Informations sur l'équipement
              </CardTitle>
              <Badge className={controle.resultat === 'conforme' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                {controle.resultat === 'conforme' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Conforme
                  </span>
                ) : (
                  <span className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Non conforme
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Détails de l'équipement</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{controle.equipements.type.charAt(0).toUpperCase() + controle.equipements.type.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Marque</span>
                    <span className="font-medium">{controle.equipements.marque}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modèle</span>
                    <span className="font-medium">{controle.equipements.modele}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">N° Série</span>
                    <span className="font-medium font-mono">{controle.equipements.numero_serie}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mise en service</span>
                    <span className="font-medium">{new Date(controle.equipements.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fin de vie</span>
                    <span className="font-medium">{new Date(controle.equipements.date_fin_vie).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Détails du contrôle</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date du contrôle</span>
                    <span className="font-medium">{new Date(controle.date_controle).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contrôleur</span>
                    <span className="font-medium">{controle.profiles?.grade} {controle.profiles?.prenom} {controle.profiles?.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Résultat</span>
                    <span className={`font-medium ${controle.resultat === 'conforme' ? 'text-green-600' : 'text-red-600'}`}>
                      {controle.resultat === 'conforme' ? 'Conforme' : 'Non conforme'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prochain contrôle</span>
                    <span className="font-medium">{new Date(controle.date_prochaine_verification).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Observations</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md border">{controle.observations}</p>
            </div>
            
            {controle.actions_correctives && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Actions correctives</h3>
                <p className="text-sm bg-red-50 p-3 rounded-md border border-red-100">{controle.actions_correctives}</p>
              </div>
            )}
            
            {controle.photos && controle.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  Photos ({controle.photos.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {controle.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm">Agrandir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations sur le pompier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {controle.equipements.personnel ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Identité</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nom</span>
                      <span className="font-medium">{controle.equipements.personnel.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prénom</span>
                      <span className="font-medium">{controle.equipements.personnel.prenom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grade</span>
                      <span className="font-medium">{controle.equipements.personnel.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Matricule</span>
                      <span className="font-medium font-mono">{controle.equipements.personnel.matricule}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Affectation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Caserne</span>
                      <span className="font-medium">{controle.equipements.personnel.caserne}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium">{controle.equipements.personnel.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link to={`/personnel/${controle.equipements.personnel.id}`}>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le profil du pompier
                    </Button>
                  </Link>
                </div>
                
                {controle.resultat === 'non_conforme' && (
                  <div className="pt-2">
                    <Link to={`/controle/${controle.equipements.id}`}>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Recontrôler cet équipement
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun pompier n'était assigné à cet équipement au moment du contrôle.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}