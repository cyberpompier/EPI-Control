"use client";

import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Equipment {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  statut: string;
  image: string;
}

const Equipements = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in a real app this would come from an API
  const equipmentData: Equipment[] = [
    {
      id: '1',
      type: 'Casque F1',
      marque: 'Stahl',
      modele: 'X3 Pro',
      numero_serie: 'SN-2023-001',
      date_mise_en_service: '2023-01-15',
      date_fin_vie: '2028-01-15',
      statut: 'en_service',
      image: 'https://quvdxjxszquqqcvesntn.supabase.co/storage/v1/object/public/banque%20image%20habillement/habillement/casque%20F1.jpg'
    },
    {
      id: '2',
      type: 'Gant de protection',
      marque: 'Ansell',
      modele: 'Ultraflex 3',
      numero_serie: 'SN-2023-002',
      date_mise_en_service: '2023-02-20',
      date_fin_vie: '2025-02-20',
      statut: 'en_service',
      image: 'https://quvdxjxszquqqcvesntn.supabase.co/storage/v1/object/public/banque%20image%20habillement/habillement/gants%20de%20protection.jpg'
    },
    {
      id: '3',
      type: 'Veste TSI',
      marque: 'Protecop',
      modele: 'TSI Max',
      numero_serie: 'SN-2023-003',
      date_mise_en_service: '2023-03-10',
      date_fin_vie: '2026-03-10',
      statut: 'en_service',
      image: 'https://quvdxjxszquqqcvesntn.supabase.co/storage/v1/object/public/banque%20image%20habillement/habillement/Veste%20TSI.jpg'
    }
  ];

  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipmentData;
    return equipmentData.filter(item => 
      item.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marque.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, equipmentData]);

  const handleAddEquipment = () => {
    navigate('/equipements/ajouter');
  };

  return (
    <Layout>
      <div className="p-4">
        {/* Titre et boutons d'action */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Équipements</h1>
          <Button onClick={handleAddEquipment}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un équipement
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rechercher un équipement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par numéro de série, type ou marque..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des équipements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{item.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <img 
                    src={item.image} 
                    alt={item.type} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/100x100?text=Image+non+disponible';
                    }}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Marque: {item.marque}</p>
                    <p className="text-sm text-gray-500">Modèle: {item.modele}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">N° série:</span> {item.numero_serie}</p>
                  <p className="text-sm"><span className="font-medium">Mise en service:</span> {new Date(item.date_mise_en_service).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">Fin de vie:</span> {new Date(item.date_fin_vie).toLocaleDateString()}</p>
                  <p className="text-sm">
                    <span className="font-medium">Statut:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      item.statut === 'en_service' 
                        ? 'bg-green-100 text-green-800' 
                        : item.statut === 'en_reparation' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {item.statut === 'en_service' ? 'En service' : 
                       item.statut === 'en_reparation' ? 'En réparation' : 'Hors service'}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm 
                ? "Aucun équipement ne correspond à votre recherche" 
                : "Aucun équipement disponible"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Equipements;