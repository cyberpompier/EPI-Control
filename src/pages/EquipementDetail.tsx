"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
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
  image?: string | null;
}

const EquipementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epi, setEpi] = useState<EPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEquipment();
    }
  }, [id]);

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        personnel (id, nom, prenom)
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Erreur lors du chargement de l'équipement");
      console.error(error);
    } else {
      setEpi(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-800 mb-4">Chargement...</div>
          <Button onClick={() => navigate('/equipements')}>Retour à la liste</Button>
        </div>
      </Layout>
    );
  }

  if (!epi) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-800 mb-4">Équipement non trouvé</div>
          <Button onClick={() => navigate('/equipements')}>Retour à la liste</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/equipements')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails de l'Équipement</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{epi.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {epi.image ? (
                  <img 
                    src={epi.image} 
                    alt={epi.type} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Pas d'image disponible</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Informations</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Type:</span>
                      <span>{epi.type}</span>
                    </div>
                    
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Numéro de série:</span>
                      <span>{epi.numero_serie}</span>
                    </div>
                    
                    {epi.marque && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Marque:</span>
                        <span>{epi.marque}</span>
                      </div>
                    )}
                    
                    {epi.modele && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Modèle:</span>
                        <span>{epi.modele}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Statut:</span>
                      <span className="capitalize">{epi.statut.replace('_', ' ')}</span>
                    </div>
                    
                    {epi.date_mise_en_service && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Date de mise en service:</span>
                        <span>{new Date(epi.date_mise_en_service).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {epi.personnel && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Assigné à:</span>
                        <span>{epi.personnel.prenom} {epi.personnel.nom}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EquipementDetail;