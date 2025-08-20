import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Search, Plus, QrCode } from 'lucide-react';
import EPICard from '@/components/epi/EPICard';
import { EPI } from '@/types/index';

interface Equipement {
  id: number;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string | null;
  statut: string;
  image: string | null;
  personnel: {
    nom: string;
    prenom: string;
  } | null;
}

export default function Equipements() {
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        id,
        type,
        marque,
        modele,
        numero_serie,
        date_mise_en_service,
        date_fin_vie,
        statut,
        image,
        personnel (
          nom,
          prenom
        )
      `)
      .order('type');

    if (error) {
      console.error('Error fetching equipements:', error);
    } else {
      // Transform the data to match EPI interface
      const transformedData = data?.map(item => {
        // Extract personnel data correctly
        const personnelData = item.personnel && item.personnel.length > 0 
          ? item.personnel[0] 
          : null;
          
        return {
          id: item.id,
          type: item.type as EPI['type'],
          marque: item.marque || '',
          modele: item.modele || '',
          numero_serie: item.numero_serie,
          date_mise_en_service: item.date_mise_en_service,
          date_fin_vie: item.date_fin_vie,
          personnel_id: personnelData ? 0 : 0, // This will be updated when we have personnel_id
          statut: item.statut as 'conforme' | 'non_conforme' | 'en_attente',
          created_at: new Date().toISOString(),
          image: item.image || undefined,
          personnel: personnelData ? {
            id: 0, // This will be updated when we have personnel_id
            nom: personnelData.nom || '',
            prenom: personnelData.prenom || '',
            matricule: '',
            caserne: '',
            grade: '',
            email: '',
            photo: ''
          } : undefined
        };
      }) || [];
      
      setEpis(transformedData);
    }
    setLoading(false);
  };

  const filteredEpis = epis.filter(epi => 
    epi.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (epi.personnel && 
      `${epi.personnel.nom} ${epi.personnel.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Équipements</h1>
          <div className="flex gap-2">
            <Link to="/equipements/barcode">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Scanner
              </Button>
            </Link>
            <Link to="/equipements/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par type, marque, modèle, numéro de série ou personnel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liste des équipements</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEpis.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  {searchTerm ? 'Aucun équipement trouvé pour cette recherche.' : 'Aucun équipement enregistré.'}
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEpis.map((epi) => (
                    <EPICard key={epi.id} epi={epi} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}