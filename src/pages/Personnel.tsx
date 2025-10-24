"use client";

import { useState, useEffect } from 'react';
import PompierCard from '@/components/personnel/PompierCard';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type Pompier = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  caserne: string;
  grade: string;
  photo: string | null;
  matricule: string;
};

export default function Personnel() {
  const navigate = useNavigate();
  const [pompiers, setPompiers] = useState<Pompier[]>([]);
  const [filteredPompiers, setFilteredPompiers] = useState<Pompier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPompiers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPompiers(pompiers);
    } else {
      const filtered = pompiers.filter(
        (p) =>
          p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.caserne.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPompiers(filtered);
    }
  }, [searchTerm, pompiers]);

  const loadPompiers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .order('nom');

    if (error) {
      console.error('Erreur lors du chargement du personnel:', error);
    } else {
      setPompiers(data || []);
      setFilteredPompiers(data || []);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Personnel</h1>
          <Button onClick={() => navigate('/personnel/new')} className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un pompier
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule, grade ou caserne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredPompiers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Aucun pompier trouvé.' : 'Aucun pompier enregistré.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPompiers.map((pompier) => (
              <PompierCard key={pompier.id} pompier={pompier} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}