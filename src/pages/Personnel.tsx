import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PompierCard from '@/components/personnel/PompierCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Pompier } from '@/types';
import { Link } from 'react-router-dom';
import { Plus, Search, Users } from 'lucide-react';

export default function Personnel() {
  const [pompiers, setPompiers] = useState<Pompier[]>([]);
  const [filteredPompiers, setFilteredPompiers] = useState<Pompier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [caserneFilter, setCaserneFilter] = useState('');

  // Données simulées pour les pompiers
  const mockPompiers: Pompier[] = [
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      matricule: 'SP12345',
      caserne: 'Caserne Centrale',
      grade: 'Sergent',
      email: 'jean.dupont@sdis.fr'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Marie',
      matricule: 'SP23456',
      caserne: 'Caserne Nord',
      grade: 'Caporal',
      email: 'marie.martin@sdis.fr'
    },
    {
      id: '3',
      nom: 'Bernard',
      prenom: 'Thomas',
      matricule: 'SP34567',
      caserne: 'Caserne Sud',
      grade: 'Caporal-chef',
      email: 'thomas.bernard@sdis.fr'
    },
    {
      id: '4',
      nom: 'Dubois',
      prenom: 'Pierre',
      matricule: 'SP45678',
      caserne: 'Caserne Centrale',
      grade: 'Adjudant',
      email: 'pierre.dubois@sdis.fr'
    },
    {
      id: '5',
      nom: 'Leroy',
      prenom: 'Sophie',
      matricule: 'SP56789',
      caserne: 'Caserne Est',
      grade: 'Lieutenant',
      email: 'sophie.leroy@sdis.fr'
    },
    {
      id: '6',
      nom: 'Moreau',
      prenom: 'Lucas',
      matricule: 'SP67890',
      caserne: 'Caserne Ouest',
      grade: 'Capitaine',
      email: 'lucas.moreau@sdis.fr'
    }
  ];

  // Données simulées pour les statistiques d'EPI par pompier
  const mockEpiStats = {
    '1': { total: 5, conformes: 4, nonConformes: 1 },
    '2': { total: 4, conformes: 2, nonConformes: 2 },
    '3': { total: 6, conformes: 5, nonConformes: 1 },
    '4': { total: 3, conformes: 3, nonConformes: 0 },
    '5': { total: 5, conformes: 4, nonConformes: 1 },
    '6': { total: 4, conformes: 3, nonConformes: 1 }
  };

  useEffect(() => {
    const fetchPompiers = async () => {
      try {
        // Dans une vraie application, vous récupéreriez les données depuis Supabase
        // const { data, error } = await supabase.from('pompiers').select('*');
        // if (error) throw error;
        // setPompiers(data);
        
        // Simulation de chargement
        setTimeout(() => {
          setPompiers(mockPompiers);
          setFilteredPompiers(mockPompiers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération des pompiers:', error);
        setLoading(false);
      }
    };
    
    fetchPompiers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPompiers(value, gradeFilter, caserneFilter);
  };

  const handleGradeFilterChange = (value: string) => {
    setGradeFilter(value);
    filterPompiers(searchTerm, value, caserneFilter);
  };

  const handleCaserneFilterChange = (value: string) => {
    setCaserneFilter(value);
    filterPompiers(searchTerm, gradeFilter, value);
  };

  const filterPompiers = (search: string, grade: string, caserne: string) => {
    let filtered = [...pompiers];
    
    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(pompier => 
        pompier.nom.toLowerCase().includes(searchLower) ||
        pompier.prenom.toLowerCase().includes(searchLower) ||
        pompier.matricule.toLowerCase().includes(searchLower) ||
        pompier.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par grade
    if (grade) {
      filtered = filtered.filter(pompier => pompier.grade === grade);
    }
    
    // Filtre par caserne
    if (caserne) {
      filtered = filtered.filter(pompier => pompier.caserne === caserne);
    }
    
    setFilteredPompiers(filtered);
  };

  // Extraire les grades et casernes uniques pour les filtres
  const grades = [...new Set(pompiers.map(p => p.grade))];
  const casernes = [...new Set(pompiers.map(p => p.caserne))];

  return (
    <Layout>
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
            onChange={handleSearch}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={gradeFilter} onValueChange={handleGradeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les grades</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={caserneFilter} onValueChange={handleCaserneFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Caserne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les casernes</SelectItem>
              {casernes.map(caserne => (
                <SelectItem key={caserne} value={caserne}>{caserne}</SelectItem>
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
              epiCount={mockEpiStats[pompier.id as keyof typeof mockEpiStats]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun pompier trouvé</h3>
          <p className="mt-2 text-gray-500">
            Aucun pompier ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link to="/personnel/nouveau">
          <Button size="lg" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </Layout>
  );
}