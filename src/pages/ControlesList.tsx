"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileCheck, 
  PlusCircle,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Controle {
  id: number;
  equipement_id: number;
  controleur_id: number;
  date_controle: string;
  resultat: string;
  observations?: string;
  created_at: string;
  equipement?: {
    type: string;
    marque?: string;
    modele?: string;
  };
  controleur?: {
    nom: string;
    prenom: string;
  };
}

const ControlesList = () => {
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchControles();
  }, []);

  const fetchControles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('controles')
        .select(`
          *,
          equipement:equipements(type, marque, modele),
          controleur:personnel(nom, prenom)
        `)
        .order('date_controle', { ascending: false });
      
      if (error) throw error;
      
      setControles(data || []);
    } catch (error) {
      console.error('Error fetching controles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultatColor = (resultat: string) => {
    switch (resultat.toLowerCase()) {
      case 'conforme':
        return 'text-green-600';
      case 'non conforme':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
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
          <h1 className="text-3xl font-bold text-gray-900">Contrôles</h1>
          <p className="mt-2 text-gray-600">
            Historique des contrôles d'équipements
          </p>
        </div>
        <Button asChild>
          <Link to="/controles/form">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau contrôle
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {controles.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contrôle trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer un nouveau contrôle.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/controles/form">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau contrôle
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {controles.map((controle) => (
                <Card key={controle.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {new Date(controle.date_controle).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mt-1">
                          {controle.equipement?.type || 'Équipement inconnu'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {controle.equipement?.marque} {controle.equipement?.modele}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            Contrôlé par: {controle.controleur?.prenom} {controle.controleur?.nom}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultatColor(controle.resultat)} bg-gray-100`}>
                          <Shield className="mr-1.5 h-4 w-4" />
                          {controle.resultat}
                        </span>
                        <Button asChild variant="outline" size="sm" className="mt-4">
                          <Link to={`/controles/${controle.id}`}>
                            Voir détails
                          </Link>
                        </Button>
                      </div>
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

export default ControlesList;