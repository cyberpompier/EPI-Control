"use client";

import React, { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from 'lucide-react';

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
  const [epis, setEpis] = useState<EPI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newEpi, setNewEpi] = useState({
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    statut: 'en_attente',
    date_mise_en_service: '',
    personnel_id: '',
    observations: ''
  });

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

  const handleNewEpiChange = (field: string, value: string) => {
    setNewEpi(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEpi = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .insert([{
          type: newEpi.type,
          marque: newEpi.marque || null,
          modele: newEpi.modele || null,
          numero_serie: newEpi.numero_serie,
          statut: newEpi.statut,
          date_mise_en_service: newEpi.date_mise_en_service || null,
          personnel_id: newEpi.personnel_id ? parseInt(newEpi.personnel_id) : null,
          observations: newEpi.observations || null
        }])
        .select(`
          *,
          personnel (id, nom, prenom)
        `)
        .single();

      if (error) throw error;

      if (data) {
        setEpis(prev => [...prev, data]);
        setShowNewDialog(false);
        setNewEpi({
          type: '',
          marque: '',
          modele: '',
          numero_serie: '',
          statut: 'en_attente',
          date_mise_en_service: '',
          personnel_id: '',
          observations: ''
        });
        toast.success("Équipement créé avec succès");
      }
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast.error("Erreur lors de la création de l'équipement");
    }
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
          <Button className="w-full md:w-auto" onClick={() => setShowNewDialog(true)}>
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

      {/* Dialog pour créer un nouvel équipement */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel Équipement</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-type">Type *</Label>
                <Input
                  id="new-type"
                  value={newEpi.type}
                  onChange={(e) => handleNewEpiChange('type', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="new-numero_serie">Numéro de série *</Label>
                <Input
                  id="new-numero_serie"
                  value={newEpi.numero_serie}
                  onChange={(e) => handleNewEpiChange('numero_serie', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="new-marque">Marque</Label>
                <Input
                  id="new-marque"
                  value={newEpi.marque}
                  onChange={(e) => handleNewEpiChange('marque', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="new-modele">Modèle</Label>
                <Input
                  id="new-modele"
                  value={newEpi.modele}
                  onChange={(e) => handleNewEpiChange('modele', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="new-statut">Statut</Label>
                <Select 
                  value={newEpi.statut} 
                  onValueChange={(value) => handleNewEpiChange('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_service">En service</SelectItem>
                    <SelectItem value="en_reparation">En réparation</SelectItem>
                    <SelectItem value="hors_service">Hors service</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-date_mise_en_service">Date de mise en service</Label>
                <div className="relative">
                  <Input
                    id="new-date_mise_en_service"
                    type="date"
                    value={newEpi.date_mise_en_service}
                    onChange={(e) => handleNewEpiChange('date_mise_en_service', e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="new-personnel">Assigné à</Label>
                <Select 
                  value={newEpi.personnel_id} 
                  onValueChange={(value) => handleNewEpiChange('personnel_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non assigné</SelectItem>
                    {/* Personnel options would be loaded here */}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="new-observations">Observations</Label>
                <Textarea
                  id="new-observations"
                  value={newEpi.observations}
                  onChange={(e) => handleNewEpiChange('observations', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEpi}>
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Equipements;