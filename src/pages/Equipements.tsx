"use client";

import React, { useEffect, useMemo, useState } from 'react';
import EPICard from '@/components/epi/EPICard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Equipement = {
  id: string;
  type?: string | null;
  marque?: string | null;
  modele?: string | null;
  numero_serie?: string | null;
  statut?: string | null;
  image?: string | null;
  personnel_id?: string | number | null;
  created_at?: string | null;
};

const Equipements: React.FC = () => {
  const [epis, setEpis] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipements')
        .select('id, type, marque, modele, numero_serie, statut, image, personnel_id, created_at')
        .order('created_at', { ascending: false });

      if (!active) return;

      if (error) {
        console.error('Erreur chargement équipements:', error);
        setEpis([]);
      } else {
        setEpis(
          (data ?? []).map((it) => ({
            ...it,
            id: typeof it.id === 'string' ? it.id : String(it.id),
            personnel_id:
              it.personnel_id === null || it.personnel_id === undefined
                ? null
                : typeof it.personnel_id === 'string'
                  ? it.personnel_id
                  : String(it.personnel_id),
          }))
        );
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return epis;
    return epis.filter((e) => {
      const fields = [
        e.type ?? '',
        e.marque ?? '',
        e.modele ?? '',
        e.numero_serie ?? '',
        e.statut ?? ''
      ].map((s) => s.toLowerCase());
      return fields.some((f) => f.includes(term));
    });
  }, [q, epis]);

  return (
    <div className="p-4 space-y-4">
      {/* Titre, recherche et actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Équipements</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (type, marque, modèle, n° série)"
            className="pl-9"
            aria-label="Rechercher un équipement"
          />
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-md border animate-pulse bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Aucun équipement trouvé{q ? ` pour “${q}”` : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((epi) => (
            <EPICard key={epi.id} epi={epi} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipements;