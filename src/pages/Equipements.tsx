import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EPICard from '@/components/epi/EPICard';
import EPIFilter from '@/components/epi/EPIFilter';
import { Button } from '@/components/ui/button';
import { Plus, Filter, AlertTriangle, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { EPI } from '@/types/index';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { showError } from '@/utils/toast';

export default function Equipements() {
  const [equipements, setEquipements] = useState<EPI[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const { data, error } = await supabase.from('equipements').select('*');
        if (error) {
          throw error;
        }
        const fetchedEquipements = data || [];
        setEquipements(fetchedEquipements);
        setFilteredEquipements(fetchedEquipements);
      } catch (error: any) {
        console.error('Erreur lors de la récupération des équipements:', error);
        showError(`Erreur lors de la récupération des équipements: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipements();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...equipements];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(epi =>
        epi.marque.toLowerCase().includes(searchLower) ||
        epi.modele.toLowerCase().includes(searchLower) ||
        epi.numero_serie.toLowerCase().includes(searchLower) ||
        epi.type.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(epi => epi.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(epi => epi.statut === filters.status);
    }

    setFilteredEquipements(filtered);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'tous') {
      setFilteredEquipements(equipements);
    } else if (value === 'conformes') {
      setFilteredEquipements(equipements.filter(epi => epi.statut === 'conforme'));
    } else if (value === 'non_conformes') {
      setFilteredEquipements(equipements.filter(epi => epi.statut === 'non_conforme'));
    } else if (value === 'en_attente') {
      setFilteredEquipements(equipements.filter(epi => epi.statut === 'en_attente'));
    } else if (value === 'expires') {
      const today = new Date();
      setFilteredEquipements(equipements.filter(epi => new Date(epi.date_fin_vie) < today));
    }
  };

  // Vérifier les équipements expirés
  const expiredEquipments = equipements.filter(epi => new Date(epi.date_fin_vie) < new Date());

  return (
    <Layout>
      <Helmet>
        <title>Équipements | EPI Control</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Équipements</h1>
          <p className="text-gray-600">Gestion des équipements de protection individuelle</p>
        </div>
        <Link to="/equipements/nouveau">
          <Button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" /> Ajouter un équipement
          </Button>
        </Link>
      </div>
      
      {expiredEquipments.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            {expiredEquipments.length} équipement(s) ont dépassé leur date de fin de vie et doivent être remplacés.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <EPIFilter onFilterChange={handleFilterChange} />
      </div>
      
      <Tabs defaultValue="tous" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="conformes">Conformes</TabsTrigger>
          <TabsTrigger value="non_conformes">Non conformes</TabsTrigger>
          <TabsTrigger value="en_attente">En attente</TabsTrigger>
          <TabsTrigger value="expires">Expirés</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : filteredEquipements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipements.map((epi) => (
            <EPICard key={epi.id} epi={epi} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun équipement trouvé</h3>
          <p className="mt-2 text-gray-500">
            Aucun équipement ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link to="/equipements/nouveau">
          <Button size="lg" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </Layout>
  );
}