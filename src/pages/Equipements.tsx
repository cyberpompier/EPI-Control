"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { EPICard } from '@/components/epi/EPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Barcode, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface EPI {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string | null;
  personnel_id: number | null;
  personnel: Personnel | null;
}

const Equipements = () => {
  const navigate = useNavigate();
  const [epis, setEpis] = useState<EPI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEPIS();
  }, []);

  const fetchEPIS = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        personnel (id, nom, prenom)
      `)
      .order('type');

    if (error) {
      toast.error('Erreur lors du chargement des équipements');
      console.error(error);
    } else {
      setEpis(data || []);
      // Extraire les types uniques pour le filtre
      const types = [...new Set((data || []).map(epi => epi.type))].filter(Boolean) as string[];
      setUniqueTypes(types);
    }
    setLoading(false);
  };

  const handleEPIUpdate = (updatedEPI: EPI) => {
    setEpis(prev => prev.map(epi => epi.id === updatedEPI.id ? updatedEPI : epi));
  };

  const filteredEpis = epis.filter(epi => {
    const matchesSearch = epi.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          epi.numero_serie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || epi.statut === statusFilter;
    
    const matchesType = typeFilter === 'all' || epi.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Gestion des Équipements</h1>
          <Button className="w-full md:w-auto" onClick={() => navigate('/equipements/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Équipement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <span>Liste des Équipements</span>
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredEpis.length}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-sm font-medium">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_service">En service</SelectItem>
                    <SelectItem value="en_reparation">En réparation</SelectItem>
                    <SelectItem value="hors_service">Hors service</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <Label className="text-sm font-medium">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>

            {/* Liste des équipements */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Chargement des équipements...</p>
              </div>
            ) : filteredEpis.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {epis.length === 0 
                    ? "Aucun équipement enregistré" 
                    : "Aucun équipement ne correspond aux filtres sélectionnés"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEpis.map((epi) => (
                  <EPICard 
                    key={epi.id} 
                    epi={epi} 
                    onUpdate={handleEPIUpdate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Equipements;