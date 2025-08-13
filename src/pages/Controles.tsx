import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Controle, EPI, Pompier } from '@/types';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle, AlertTriangle, FileText, Calendar, Download } from 'lucide-react';

export default function Controles() {
  const [controles, setControles] = useState<any[]>([]);
  const [filteredControles, setFilteredControles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Données simulées pour les contrôles
  const mockControles = [
    {
      id: '1',
      epi: { id: '1', type: 'casque', marque: 'MSA', modele: 'F1 XF' },
      pompier: { id: '1', nom: 'Dupont', prenom: 'Jean', grade: 'Sergent' },
      controleur: { id: '3', nom: 'Martin', prenom: 'Sophie', grade: 'Lieutenant' },
      date_controle: '2023-10-22',
      resultat: 'conforme',
      observations: 'Équipement en bon état général, aucune anomalie détectée.',
      date_prochaine_verification: '2024-04-22'
    },
    {
      id: '2',
      epi: { id: '2', type: 'veste', marque: 'Bristol', modele: 'ErgoTech Action' },
      pompier: { id: '2', nom: 'Martin', prenom: 'Marie', grade: 'Caporal' },
      controleur: { id: '3', nom: 'Martin', prenom: 'Sophie', grade: 'Lieutenant' },
      date_controle: '2023-10-21',
      resultat: 'non_conforme',
      observations: 'Usure importante au niveau des coudes et des poignets. Fermeture éclair défectueuse.',
      actions_correctives: 'Remplacement de la fermeture éclair et renforcement des zones usées.',
      date_prochaine_verification: '2023-11-21'
    },
    {
      id: '3',
      epi: { id: '5', type: 'rangers', marque: 'Haix', modele: 'Fire Eagle' },
      pompier: { id: '2', nom: 'Martin', prenom: 'Marie', grade: 'Caporal' },
      controleur: { id: '4', nom: 'Dubois', prenom: 'Pierre', grade: 'Adjudant' },
      date_controle: '2023-10-20',
      resultat: 'conforme',
      observations: 'Semelles en bon état, cuir légèrement usé mais conforme aux normes.',
      date_prochaine_verification: '2024-04-20'
    },
    {
      id: '4',
      epi: { id: '3', type: 'surpantalon', marque: 'Kermel', modele: 'FireFlex' },
      pompier: { id: '1', nom: 'Dupont', prenom: 'Jean', grade: 'Sergent' },
      controleur: { id: '4', nom: 'Dubois', prenom: 'Pierre', grade: 'Adjudant' },
      date_controle: '2023-10-19',
      resultat: 'conforme',
      observations: 'Équipement en parfait état, aucune anomalie.',
      date_prochaine_verification: '2024-04-19'
    },
    {
      id: '5',
      epi: { id: '6', type: 'casque', marque: 'Dräger', modele: 'HPS 7000' },
      pompier: { id: '3', nom: 'Bernard', prenom: 'Thomas', grade: 'Caporal-chef' },
      controleur: { id: '3', nom: 'Martin', prenom: 'Sophie', grade: 'Lieutenant' },
      date_controle: '2023-10-18',
      resultat: 'non_conforme',
      observations: 'Fissure détectée sur la coque externe. Visière rayée limitant la visibilité.',
      actions_correctives: 'Remplacement du casque nécessaire.',
      date_prochaine_verification: '2023-10-25'
    }
  ];

  useEffect(() => {
    const fetchControles = async () => {
      try {
        // Dans une vraie application, vous récupéreriez les données depuis Supabase
        // const { data, error } = await supabase.from('controles').select('*');
        // if (error) throw error;
        // setControles(data);
        
        // Simulation de chargement
        setTimeout(() => {
          setControles(mockControles);
          setFilteredControles(mockControles);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération des contrôles:', error);
        setLoading(false);
      }
    };
    
    fetchControles();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterControles(value, dateFilter);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    filterControles(searchTerm, value);
  };

  const filterControles = (search: string, date: string) => {
    let filtered = [...controles];
    
    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(controle => 
        controle.epi.type.toLowerCase().includes(searchLower) ||
        controle.epi.marque.toLowerCase().includes(searchLower) ||
        controle.epi.modele.toLowerCase().includes(searchLower) ||
        `${controle.pompier.prenom} ${controle.pompier.nom}`.toLowerCase().includes(searchLower) ||
        controle.pompier.grade.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par date
    if (date) {
      const today = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      
      switch (date) {
        case 'today':
          filtered = filtered.filter(controle => 
            new Date(controle.date_controle).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          const oneWeekAgo = new Date(today.getTime() - 7 * oneDay);
          filtered = filtered.filter(controle => 
            new Date(controle.date_controle) >= oneWeekAgo
          );
          break;
        case 'month':
          const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter(controle => 
            new Date(controle.date_controle) >= oneMonthAgo
          );
          break;
        case 'year':
          const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          filtered = filtered.filter(controle => 
            new Date(controle.date_controle) >= oneYearAgo
          );
          break;
      }
    }
    
    setFilteredControles(filtered);
  };

  const handleTabChange = (value: string) => {
    if (value === 'tous') {
      setFilteredControles(controles);
    } else if (value === 'conformes') {
      setFilteredControles(controles.filter(controle => controle.resultat === 'conforme'));
    } else if (value === 'non_conformes') {
      setFilteredControles(controles.filter(controle => controle.resultat === 'non_conforme'));
    }
  };

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
        <title>Contrôles | EPI Control</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Contrôles</h1>
          <p className="text-gray-600">Historique et gestion des contrôles d'équipements</p>
        </div>
        <Link to="/controles/nouveau">
          <Button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" /> Nouveau contrôle
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un contrôle..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select value={dateFilter} onValueChange={handleDateFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les périodes</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="tous" onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="conformes">Conformes</TabsTrigger>
          <TabsTrigger value="non_conformes">Non conformes</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : filteredControles.length > 0 ? (
        <div className="space-y-4">
          {filteredControles.map((controle) => (
            <Card key={controle.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className={`p-6 md:w-2/3 ${controle.resultat === 'conforme' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          <span className="mr-2 text-xl">{getTypeIcon(controle.epi.type)}</span>
                          {controle.epi.marque} {controle.epi.modele}
                        </h3>
                        <p className="text-gray-600">
                          {controle.pompier.grade} {controle.pompier.prenom} {controle.pompier.nom}
                        </p>
                      </div>
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
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Observations</h4>
                      <p className="text-sm">{controle.observations}</p>
                    </div>
                    
                    {controle.actions_correctives && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Actions correctives</h4>
                        <p className="text-sm">{controle.actions_correctives}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-1" />
                        <span>Contrôlé par: {controle.controleur.grade} {controle.controleur.prenom} {controle.controleur.nom}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span>Prochain contrôle: {new Date(controle.date_prochaine_verification).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 md:w-1/3 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                    <div>
                      <div className="text-sm text-gray-500 mb-4">
                        Date du contrôle: {new Date(controle.date_controle).toLocaleDateString('fr-FR')}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Link to={`/controles/${controle.id}`}>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Voir les détails
                          </Button>
                        </Link>
                        <Link to={`/controles/${controle.id}/pdf`}>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {controle.resultat === 'non_conforme' && (
                      <div className="mt-4 pt-4 border-t">
                        <Link to={`/controle/${controle.epi.id}`}>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            Recontrôler
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun contrôle trouvé</h3>
          <p className="mt-2 text-gray-500">
            Aucun contrôle ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link to="/controles/nouveau">
          <Button size="lg" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </Layout>
  );
}