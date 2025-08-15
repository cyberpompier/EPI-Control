"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Controle {
  id: string;
  equipement_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: string;
  observations: string | null;
  actions_correctives: string | null;
  date_prochaine_verification: string | null;
  equipements: {
    type: string;
    numero_serie: string;
  } | null;
  personnel: {
    nom: string;
    prenom: string;
  } | null;
}

const Controles = () => {
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchControles();
  }, []);

  const fetchControles = async () => {
    try {
      const { data, error } = await supabase
        .from('controles')
        .select(`
          *,
          equipements (type, numero_serie),
          personnel (nom, prenom)
        `)
        .order('date_controle', { ascending: false });

      if (error) throw error;
      setControles(data || []);
    } catch (error) {
      console.error('Error fetching controles:', error);
      toast.error('Erreur lors du chargement des contrôles');
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

  const filteredControles = controles.filter(controle =>
    (controle.equipements?.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    controle.equipements?.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    controle.personnel?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    controle.personnel?.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contrôles</h1>
        <Button onClick={() => navigate('/controles/ajouter')}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contrôle
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par type d'équipement, numéro de série ou nom du contrôleur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredControles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun contrôle trouvé</p>
          ) : (
            <div className="space-y-4">
              {filteredControles.map((controle) => (
                <Card key={controle.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {controle.equipements?.type} - {controle.equipements?.numero_serie}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Contrôlé par {controle.personnel?.prenom} {controle.personnel?.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(controle.date_controle).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultatColor(controle.resultat)}`}>
                          {controle.resultat.replace('_', ' ')}
                        </span>
                        {controle.date_prochaine_verification && (
                          <p className="text-sm text-gray-500 mt-2">
                            Prochaine vérification: {new Date(controle.date_prochaine_verification).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
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

export default Controles;