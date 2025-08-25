import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { PompierCard } from '@/components/personnel/PompierCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Pompier } from '@/types/index';
import { Link } from 'react-router-dom';
import { Plus, Search, Users } from 'lucide-react';
import { showError } from '@/utils/toast';

interface EpiStats {
  total: number;
  conformes: number;
  nonConformes: number;
}

interface AllEpiStats {
  [pompierId: number]: EpiStats;
}

export default function Personnel() {
  const [pompiers, setPompiers] = useState<Pompier[]>([]);
  const [filteredPompiers, setFilteredPompiers] = useState<Pompier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [caserneFilter, setCaserneFilter] = useState('');
  const [epiStats, setEpiStats] = useState<AllEpiStats>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: pompiersData, error: pompiersError } = await supabase.from('personnel').select('*').order('nom', { ascending: true });
        if (pompiersError) throw pompiersError;
        
        const pompiersList = pompiersData || [];
        setPompiers(pompiersList);
        setFilteredPompiers(pompiersList);

        const { data: equipementsData, error: equipementsError } = await supabase.from('equipements').select('personnel_id, statut');
        if (equipementsError) throw equipementsError;

        const equipements = equipementsData || [];
        const stats: AllEpiStats = {};

        pompiersList.forEach(pompier => {
          stats[pompier.id] = { total: 0, conformes: 0, nonConformes: 0 };
        });

        equipements.forEach(equipement => {
          if (equipement.personnel_id && stats[equipement.personnel_id]) {
            stats[equipement.personnel_id].total++;
            if (equipement.statut === 'conforme') {
              stats[equipement.personnel_id].conformes++;
            } else if (equipement.statut === 'non_conforme') {
              stats[equipement.personnel_id].nonConformes++;
            }
          }
        });

        setEpiStats(stats);

      } catch (error: any) {
        showError(`Erreur lors du chargement des données: ${error.message}`);
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...pompiers];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(pompier => 
        (pompier.nom || '').toLowerCase().includes(searchLower) ||
        (pompier.prenom || '').toLowerCase().includes(searchLower) ||
        (pompier.matricule || '').toLowerCase().includes(searchLower) ||
        (pompier.email || '').toLowerCase().includes(searchLower)
      );
    }
    
    if (gradeFilter && gradeFilter !== 'all') {
      filtered = filtered.filter(pompier => pompier.grade === gradeFilter);
    }
    
    if (caserneFilter && caserneFilter !== 'all') {
      filtered = filtered.filter(pompier => pompier.caserne === caserneFilter);
    }
    
    setFilteredPompiers(filtered);
  }, [searchTerm, gradeFilter, caserneFilter, pompiers]);

  const grades = [...new Set(pompiers.map(p => p.grade).filter(Boolean))];
  const casernes = [...new Set(pompiers.map(p => p.caserne).filter(Boolean))];

  return (
      <Helmet>
        <title>Personnel | EPI Control</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-gray-600">Gestion des sapeurs-pompiers et de leurs équipements</p>
        </div>
        <Link to="/personnel/nouveau">
          <Button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" /> Ajouter un pompier
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un pompier..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les grades</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade!}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={caserneFilter} onValueChange={setCaserneFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Caserne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les casernes</SelectItem>
              {casernes.map(caserne => (
                <SelectItem key={caserne} value={caserne!}>{caserne}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : filteredPompiers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPompiers.map((pompier) => (
            <PompierCard 
              key={pompier.id} 
              pompier={pompier} 
              epiCount={epiStats[pompier.id] || { total: 0, conformes: 0, nonConformes: 0 }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun pompier trouvé</h3>
          <p className="mt-2 text-gray-500">
            {pompiers.length === 0 
              ? "Aucun pompier n'est enregistré dans la base de données. Commencez par en ajouter un."
              : "Aucun pompier ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            }
          </p>
          {pompiers.length === 0 && (
            <Link to="/personnel/nouveau" className="mt-4 inline-block">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier pompier
              </Button>
            </Link>
          )}
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link to="/personnel/nouveau">
          <Button size="lg" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
  );
}