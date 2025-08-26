"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HabillementItem {
  id: number;
  article: string;
  description: string | null;
  taille: string | null;
  image: string | null;
  code: string | null;
  personnel_id: number | null;
  status: string | null;
}

const HabillementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habillement, setHabillement] = useState<HabillementItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHabillement();
    }
  }, [id]);

  const fetchHabillement = async () => {
    const { data, error } = await supabase
      .from('habillement')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Erreur lors du chargement de l\'article d\'habillement');
      console.error(error);
    } else {
      setHabillement(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-800 mb-4">Chargement...</div>
          <Button onClick={() => navigate('/habillement')}>Retour à la liste</Button>
        </div>
      </Layout>
    );
  }

  if (!habillement) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-800 mb-4">Article d'habillement non trouvé</div>
          <Button onClick={() => navigate('/habillement')}>Retour à la liste</Button>
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
            onClick={() => navigate('/habillement')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails de l'Article</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{habillement.article}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {habillement.image ? (
                  <img 
                    src={habillement.image} 
                    alt={habillement.article} 
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
                      <span className="font-medium">Article:</span>
                      <span>{habillement.article}</span>
                    </div>
                    
                    {habillement.description && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Description:</span>
                        <span>{habillement.description}</span>
                      </div>
                    )}
                    
                    {habillement.taille && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Taille:</span>
                        <span>{habillement.taille}</span>
                      </div>
                    )}
                    
                    {habillement.code && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Code:</span>
                        <span>{habillement.code}</span>
                      </div>
                    )}
                    
                    {habillement.status && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Statut:</span>
                        <span>{habillement.status}</span>
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

export default HabillementDetail;