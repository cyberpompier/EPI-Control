import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import EPICard from '@/components/epi/EPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { EPI } from '@/types/index';

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function Equipements() {
  const [equipements, setEquipements] = useState<EPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let active = true;

    const fetchEquipements = async () => {
      setLoading(true);
      // Base query
      let query = supabase
        .from('equipements')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Recherche insensible à la casse sur toute la table
      const s = debouncedSearch.trim();
      if (s.length > 0) {
        query = query.ilike('numero_serie', `%${s}%`);
      }

      const { data, error } = await query.limit(2000); // large plafond pour couvrir "tout"
      if (!active) return;

      if (error) {
        console.error(error);
        toast.error("Impossible de charger les équipements");
        setEquipements([]);
      } else {
        setEquipements(data || []);
      }
      setLoading(false);
    };

    fetchEquipements();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const count = useMemo(() => equipements.length, [equipements]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Équipements</h1>
          <div className="w-full sm:w-96">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="search"
                placeholder="Rechercher par numéro de série..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                inputMode="text"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Liste des équipements</CardTitle>
            <div className="text-sm text-gray-500">{count} résultat{count > 1 ? 's' : ''}</div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 text-center text-gray-500">Chargement…</div>
            ) : equipements.length === 0 ? (
              <div className="py-16 text-center text-gray-500">Aucun équipement trouvé</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipements.map((epi) => (
                  <EPICard key={epi.id} epi={epi} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}