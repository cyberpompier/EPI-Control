"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Pompier } from '@/types/personnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Users } from 'lucide-react';
import PompierCard from '@/components/personnel/PompierCard';

const Personnel = () => {
  const [pompiers, setPompiers] = useState<Pompier[]>([]);
  const [filteredPompiers, setFilteredPompiers] = useState<Pompier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPompiers();
  }, []);

  useEffect(() => {
    const filtered = pompiers.filter(pompier =>
      `${pompier.prenom} ${pompier.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pompier.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pompier.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPompiers(filtered);
  }, [searchTerm, pompiers]);

  const fetchPompiers = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setPompiers(data || []);
      setFilteredPompiers(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personnel</h1>
        <Button asChild>
          <Link to="/personnel/ajouter">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un pompier
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Liste du personnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="absolute ml-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher par nom, matricule ou grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredPompiers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">Aucun pompier trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Aucun pompier enregistré.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPompiers.map((pompier) => (
                <PompierCard key={pompier.id} pompier={pompier} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Personnel;