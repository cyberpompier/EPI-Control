import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PompierCard } from '@/components/personnel/PompierCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pompier } from '@/types/index';

export default function Personnel() {
  const [personnel, setPersonnel] = useState<Pompier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .order('nom');

    if (error) {
      console.error('Error fetching personnel:', error);
    } else {
      setPersonnel(data || []);
    }
    setLoading(false);
  };

  const filteredPersonnel = personnel.filter(p => 
    `${p.nom} ${p.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.caserne?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Personnel</h1>
          <Link to="/personnel/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un pompier
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, grade ou caserne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPersonnel.map((pompier) => (
              <PompierCard key={pompier.id} pompier={pompier} epiCount={{total: 0, conformes: 0, nonConformes: 0}} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}