"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Barcode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Equipment {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  date_fin_vie: string | null;
  statut: string;
  image: string | null;
}

const Equipements = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des équipements:', error);
    } else {
      setEquipments(data || []);
    }
  };

  const filteredEquipments = equipments.filter(equipment =>
    equipment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipment.marque && equipment.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (equipment.modele && equipment.modele.toLowerCase().includes(searchTerm.toLowerCase())) ||
    equipment.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Titre et boutons d'action */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Liste des équipements</h1>
        <div className="flex justify-between items-center">
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
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un équipement..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Liste des équipements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{equipment.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {equipment.marque} {equipment.modele}
                  </p>
                  <p className="text-sm">N°: {equipment.numero_serie}</p>
                </div>
                {equipment.image && (
                  <img 
                    src={equipment.image} 
                    alt={equipment.type}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-secondary rounded">
                  {equipment.statut}
                </span>
                <Link to={`/equipements/${equipment.id}`}>
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Equipements;