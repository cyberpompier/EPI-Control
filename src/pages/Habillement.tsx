import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Shirt } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';

interface HabillementItem {
  id: number;
  article: string;
  description: string;
  taille: string;
  image: string;
  code: string;
  personnel_id: number;
  status: string;
}

export default function Habillement() {
  const [items, setItems] = useState<HabillementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabillement = async () => {
      try {
        const { data, error } = await supabase.from('habillement').select('*');
        if (error) {
          throw error;
        }
        setItems(data || []);
      } catch (error: any) {
        console.error('Erreur lors de la récupération de l\'habillement:', error);
        showError(`Erreur lors de la récupération de l'habillement: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHabillement();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Habillement | EPI Control</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Habillement</h1>
          <p className="text-gray-600">Gestion de l'habillement du personnel</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un article
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shirt className="h-5 w-5 mr-2" />
                  {item.article}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm"><strong>Taille:</strong> {item.taille}</p>
                <p className="text-sm"><strong>Code:</strong> {item.code}</p>
                <p className="text-sm"><strong>Statut:</strong> {item.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Shirt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun article d'habillement</h3>
          <p className="mt-2 text-gray-500">
            Aucun article d'habillement n'a été ajouté pour le moment.
          </p>
        </div>
      )}
    </Layout>
  );
}