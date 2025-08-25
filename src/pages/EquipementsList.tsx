"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  PlusCircle,
  Calendar,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Equipement {
  id: number;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  date_mise_en_service?: string;
  statut: string;
  personnel_id?: number;
  created_at: string;
  image?: string;
  personnel?: {
    nom: string;
    prenom: string;
  };
}

const EquipementsList = () => {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipements')
        .select(`
          *,
          personnel:personnel(nom, prenom)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEquipements(data || []);
    } catch (error) {
      console.error('Error fetching equipements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'en service':
        return 'text-green-600';
      case 'en réparation':
        return 'text-yellow-600';
      case 'hors service':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Équipements</h1>
          <p className="mt-2 text-gray-600">
            Gestion des équipements de protection individuelle
          </p>
        </div>
        <Button asChild>
          <Link to="/equipements/form">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvel équipement
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {equipements.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun équipement trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par ajouter un nouvel équipement.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/equipements/form">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvel équipement
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipements.map((equipement) => (
                <Card key={equipement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {equipement.image ? (
                        <img 
                          src={equipement.image} 
                          alt={equipement.type}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                          <Shield className="text-gray-500 h-8 w-8" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {equipement.type}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {equipement.marque} {equipement.modele}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          S/N: {equipement.numero_serie}
                        </p>
                        {equipement.date_mise_en_service && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>
                              Mise en service: {new Date(equipement.date_mise_en_service).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                        {equipement.personnel && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <User className="mr-1 h-4 w-4" />
                            <span>
                              {equipement.personnel.prenom} {equipement.personnel.nom}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(equipement.statut)} bg-gray-100`}>
                        {equipement.statut}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/equipements/${equipement.id}`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipementsList;