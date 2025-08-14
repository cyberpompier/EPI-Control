import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Controle } from '@/types/index';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle, AlertTriangle, FileText, Calendar, Download } from 'lucide-react';

export default function Controles() {
  const [controles, setControles] = useState<any[]>([]);
  const [filteredControles, setFilteredControles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('tous');

  useEffect(() => {
    const fetchControles = async () => {
      try {
        const { data, error } = await supabase
          .from('controles')
          .select('*, equipements(*, personnel(*)), controleur:profiles(prenom, nom, grade)')
          .order('date_controle', { ascending: false });
        
        if (error) throw error;
        
        setControles(data || []);
        setFilteredControles(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des contrôles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchControles();
  }, []);

  useEffect(() => {
    let newFiltered = [...controles];

    if (activeTab !== 'tous') {
      newFiltered = newFiltered.filter(c => c.resultat === activeTab.slice(0, -1));
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      newFiltered = newFiltered.filter(c => 
        (c.equipements?.type.toLowerCase().includes(searchLower)) ||
        (c.equipements?.marque.toLowerCase().includes(searchLower)) ||
        (c.equipements?.modele.toLowerCase().includes(searchLower)) ||
        (`${c.equipements?.personnel?.prenom} ${c.equipements?.personnel?.nom}`.toLowerCase().includes(searchLower))
      );
    }
    
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      let startDate: Date;

      switch (dateFilter) {
        case 'today':
          startDate = new Date(today.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(today.getTime() - 7 * oneDay);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          break;
        case 'year':
          startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          break;
        default:
          startDate = new Date(0);
      }
      newFiltered = newFiltered.filter(c => new Date(c.date_controle) >= startDate);
    }
    
    setFilteredControles(newFiltered);
  }, [searchTerm, dateFilter, activeTab, controles]);

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="tous" onValueChange={setActiveTab} className="mb-6">
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
                          <span className="mr-2 text-xl">{getTypeIcon(controle.equipements?.type || '')}</span>
                          {controle.equipements?.marque} {controle.equipements?.modele}
                        </h3>
                        <p className="text-gray-600">
                          {controle.equipements?.personnel?.grade} {controle.equipements?.personnel?.prenom} {controle.equipements?.personnel?.nom}
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
                        <span>Contrôlé par: {controle.controleur?.grade} {controle.controleur?.prenom} {controle.controleur?.nom}</span>
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
                        <Link to={`/controle/${controle.equipements.id}`}>
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