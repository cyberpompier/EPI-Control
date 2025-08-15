"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface HabillementItem {
  id: number;
  article: string;
  description: string | null;
  taille: string | null;
  code: string | null;
  status: string | null;
}

const Habillement = () => {
  const [habillement, setHabillement] = useState<HabillementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabillement();
  }, []);

  const fetchHabillement = async () => {
    try {
      const { data, error } = await supabase
        .from('habillement')
        .select('*')
        .order('article', { ascending: true });

      if (error) throw error;
      setHabillement(data || []);
    } catch (error) {
      console.error('Error fetching habillement:', error);
      toast.error('Erreur lors du chargement de l\'habillement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'attribue':
        return 'bg-blue-100 text-blue-800';
      case 'en_reparation':
        return 'bg-yellow-100 text-yellow-800';
      case 'hors_service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHabillement = habillement.filter(item =>
    item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habillement</h1>
        <Button onClick={() => navigate('/habillement/ajouter')}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un article
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par article ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des articles d'habillement</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHabillement.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun article d'habillement trouvé</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHabillement.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.article}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}
                    <div className="space-y-2">
                      {item.taille && (
                        <p className="text-sm">
                          <span className="font-medium">Taille:</span> {item.taille}
                        </p>
                      )}
                      {item.code && (
                        <p className="text-sm">
                          <span className="font-medium">Code:</span> {item.code}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status || 'Non défini'}
                        </span>
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

export default Habillement;