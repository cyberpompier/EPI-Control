"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface Controle {
  id: string;
  date_controle: string;
  resultat: string;
  observations: string | null;
  actions_correctives: string | null;
  controleur: {
    nom: string;
    prenom: string;
  } | null;
}

interface Equipement {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  date_mise_en_service?: string;
  statut: string;
}

const HistoriqueEquipement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState<Equipement | null>(null);
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEquipement();
      fetchControles();
    }
  }, [id]);

  const fetchEquipement = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEquipement(data);
    } catch (error) {
      console.error('Error fetching equipement:', error);
    }
  };

  const fetchControles = async () => {
    try {
      const { data, error } = await supabase
        .from('controles')
        .select(`
          id,
          date_controle,
          resultat,
          observations,
          actions_correctives,
          controleur_id,
          personnel!controles_controleur_id_fkey (nom, prenom)
        `)
        .eq('equipement_id', id)
        .order('date_controle', { ascending: false });

      if (error) throw error;
      
      const controlesWithControleur = data.map(controle => ({
        ...controle,
        controleur: controle.personnel || null
      }));
      
      setControles(controlesWithControleur);
    } catch (error) {
      console.error('Error fetching controles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultatColor = (resultat: string) => {
    switch (resultat) {
      case 'conforme':
        return 'bg-green-100 text-green-800';
      case 'non_conforme':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Historique des contrôles</h1>
      </div>

      {equipement && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{equipement.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Numéro de série</p>
                <p className="font-medium">{equipement.numero_serie}</p>
              </div>
              {equipement.marque && (
                <div>
                  <p className="text-sm text-gray-500">Marque</p>
                  <p className="font-medium">{equipement.marque}</p>
                </div>
              )}
              {equipement.modele && (
                <div>
                  <p className="text-sm text-gray-500">Modèle</p>
                  <p className="font-medium">{equipement.modele}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <Badge 
                  className={
                    equipement.statut === 'en_service' ? 'bg-green-100 text-green-800' :
                    equipement.statut === 'en_reparation' ? 'bg-yellow-100 text-yellow-800' :
                    equipement.statut === 'hors_service' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {equipement.statut.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contrôles effectués</CardTitle>
        </CardHeader>
        <CardContent>
          {controles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun contrôle effectué pour cet équipement</p>
          ) : (
            <div className="space-y-4">
              {controles.map((controle) => (
                <Card key={controle.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Contrôle du {new Date(controle.date_controle).toLocaleDateString('fr-FR')}</h3>
                        <Badge className={getResultatColor(controle.resultat)}>
                          {controle.resultat.replace('_', ' ')}
                        </Badge>
                      </div>
                      {controle.controleur && (
                        <div className="text-sm text-gray-500">
                          Contrôlé par {controle.controleur.prenom} {controle.controleur.nom}
                        </div>
                      )}
                    </div>
                    
                    {controle.observations && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Observations :</p>
                        <p className="text-sm">{controle.observations}</p>
                      </div>
                    )}
                    
                    {controle.actions_correctives && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Actions correctives :</p>
                        <p className="text-sm">{controle.actions_correctives}</p>
                      </div>
                    )}
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

export default HistoriqueEquipement;