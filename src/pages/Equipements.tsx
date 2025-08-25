"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Barcode } from 'lucide-react';
import { createClient } from '@/integrations/supabase/client';

const Equipements = () => {
  const [equipements, setEquipements] = useState<any[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchEquipements();
  }, []);

  useEffect(() => {
    const filtered = equipements.filter(equipement => 
      equipement.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipements(filtered);
  }, [searchTerm, equipements]);

  const fetchEquipements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipements(data || []);
      setFilteredEquipements(data || []);
    } catch (error) {
      console.error('Error fetching equipements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_service': return 'bg-green-500';
      case 'en_reparation': return 'bg-yellow-500';
      case 'hors_service': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Liste des équipements</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex space-x-2">
            <Link to="/equipements/barcode">
              <Button variant="outline">
                <Barcode className="mr-2 h-4 w-4" />
                Code barre
              </Button>
            </Link>
            <Link to="/equipements/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un équipement
              </Button>
            </Link>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipements.map((equipement) => (
            <Card key={equipement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{equipement.type}</CardTitle>
                  <Badge className={getStatusColor(equipement.statut)} variant="secondary">
                    {equipement.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Marque:</span> {equipement.marque || 'Non spécifiée'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Modèle:</span> {equipement.modele || 'Non spécifié'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">N° série:</span> {equipement.numero_serie}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <Link to={`/equipements/${equipement.id}`}>
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(equipement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipements;