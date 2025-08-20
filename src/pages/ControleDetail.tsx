import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import PDFGenerator from '@/components/pdf/PDFGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { Calendar, User, Wrench, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Controle, EPI, Pompier } from '@/types/index';

interface ControleData {
  id: number;
  date_controle: string;
  resultat: string;
  observations: string | null;
  actions_correctives: string | null;
  date_prochaine_verification: string | null;
  equipements: {
    id: number;
    type: string;
    marque: string | null;
    modele: string | null;
    numero_serie: string;
    personnel: {
      id: number;
      nom: string;
      prenom: string;
    } | null;
  } | null;
  personnel: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
}

export default function ControleDetail() {
  const { id } = useParams<{ id: string }>();
  const [controle, setControle] = useState<Controle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchControleDetails();
    }
  }, [id]);

  const fetchControleDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('controles')
      .select(`
        id,
        date_controle,
        resultat,
        observations,
        actions_correctives,
        date_prochaine_verification,
        equipements (
          id,
          type,
          marque,
          modele,
          numero_serie,
          personnel (
            id,
            nom,
            prenom
          )
        ),
        personnel (
          id,
          nom,
          prenom
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      showError('Erreur lors du chargement des détails du contrôle');
      console.error(error);
    } else if (data) {
      // Extract nested data correctly
      const equipementData = data.equipements && data.equipements.length > 0 
        ? data.equipements[0] 
        : null;
      const equipementPersonnel = equipementData?.personnel && equipementData.personnel.length > 0 
        ? equipementData.personnel[0] 
        : null;
      const controlePersonnel = data.personnel && data.personnel.length > 0 
        ? data.personnel[0] 
        : null;
        
      // Transform data to ensure proper typing
      const transformedData: Controle = {
        id: data.id,
        equipement_id: equipementData?.id || 0,
        controleur_id: '',
        date_controle: data.date_controle,
        resultat: data.resultat as 'conforme' | 'non_conforme',
        observations: data.observations || '',
        photos: [],
        actions_correctives: data.actions_correctives || '',
        date_prochaine_verification: data.date_prochaine_verification || '',
        equipements: equipementData ? {
          id: equipementData.id,
          type: equipementData.type as EPI['type'],
          marque: equipementData.marque || '',
          modele: equipementData.modele || '',
          numero_serie: equipementData.numero_serie,
          date_mise_en_service: '',
          date_fin_vie: '',
          personnel_id: equipementPersonnel?.id || 0,
          statut: 'en_attente',
          created_at: new Date().toISOString(),
          personnel: equipementPersonnel ? {
            id: equipementPersonnel.id,
            nom: equipementPersonnel.nom || '',
            prenom: equipementPersonnel.prenom || '',
            matricule: '',
            caserne: '',
            grade: '',
            email: '',
            photo: ''
          } : undefined
        } : undefined,
        pompier: controlePersonnel ? {
          id: controlePersonnel.id,
          nom: controlePersonnel.nom || '',
          prenom: controlePersonnel.prenom || '',
          matricule: '',
          caserne: '',
          grade: '',
          email: '',
          photo: ''
        } : undefined,
        controleur: controlePersonnel ? {
          prenom: controlePersonnel.prenom || '',
          nom: controlePersonnel.nom || '',
          role: 'controleur' // Provide a default role value
        } : undefined
      };
      setControle(transformedData);
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

  if (!controle) {
    return (
      <Layout headerTitle="Contrôle non trouvé">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold">Contrôle non trouvé</h2>
          <p className="mt-2 text-gray-600">Le contrôle que vous recherchez n'existe pas.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>
      </Layout>
    );
  }

  // Create the objects needed for PDFGenerator
  const epi: EPI = controle.equipements || {
    id: 0,
    type: 'Casque F1',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: '',
    date_fin_vie: '',
    personnel_id: 0,
    statut: 'en_attente',
    created_at: new Date().toISOString()
  };

  const pompier: Pompier = controle.pompier || {
    id: 0,
    nom: '',
    prenom: '',
    matricule: '',
    caserne: '',
    grade: '',
    email: '',
    photo: ''
  };

  const controleur = controle.controleur || {
    nom: '',
    prenom: '',
    role: 'controleur' // Provide a default role value
  };

  return (
    <Layout headerTitle={`Contrôle du ${format(new Date(controle.date_controle), 'dd/MM/yyyy', { locale: fr })}`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Contrôle du {format(new Date(controle.date_controle), 'dd MMMM yyyy', { locale: fr })}
            </h1>
            <p className="text-gray-600">
              {controle.equipements 
                ? `${controle.equipements.type} (${controle.equipements.numero_serie})`
                : 'Équipement inconnu'}
            </p>
          </div>
          <div className="flex gap-2">
            <PDFGenerator controle={controle} epi={epi} pompier={pompier} controleur={controleur} />
            <Link to={`/controles/${controle.id}/edit`}>
              <Button variant="outline">Modifier</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Détails du contrôle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Résultat</h3>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    controle.resultat === 'conforme' ? 'bg-green-100 text-green-800' :
                    controle.resultat === 'non_conforme' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {controle.resultat === 'conforme' ? 'Conforme' : 
                     controle.resultat === 'non_conforme' ? 'Non conforme' : controle.resultat}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Dates
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Contrôle effectué: {format(new Date(controle.date_controle), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  {controle.date_prochaine_verification && (
                    <p className="text-gray-600 text-sm">
                      Prochaine vérification: {format(new Date(controle.date_prochaine_verification), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>
                
                {controle.observations && (
                  <div>
                    <h3 className="font-medium">Observations</h3>
                    <p className="text-gray-600">{controle.observations}</p>
                  </div>
                )}
                
                {controle.actions_correctives && (
                  <div>
                    <h3 className="font-medium">Actions correctives</h3>
                    <p className="text-gray-600">{controle.actions_correctives}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {controle.equipements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Équipement contrôlé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{controle.equipements.type}</p>
                  <p className="text-sm text-gray-600">
                    {controle.equipements.marque} {controle.equipements.modele}
                  </p>
                  <p className="text-sm text-gray-600">
                    N° de série: {controle.equipements.numero_serie}
                  </p>
                  {controle.equipements.personnel && (
                    <div className="pt-2">
                      <h3 className="font-medium flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Assigné à
                      </h3>
                      <Link to={`/personnel/${controle.equipements.personnel.id}`} className="text-blue-600 hover:underline text-sm">
                        {controle.equipements.personnel.prenom} {controle.equipements.personnel.nom}
                      </Link>
                    </div>
                  )}
                  <div className="pt-2">
                    <Link to={`/equipements/${controle.equipements.id}`}>
                      <Button variant="outline" size="sm">
                        Voir l'équipement
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {controle.pompier && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Contrôleur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={`/personnel/${controle.pompier.id}`} className="text-blue-600 hover:underline">
                    {controle.pompier.prenom} {controle.pompier.nom}
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}