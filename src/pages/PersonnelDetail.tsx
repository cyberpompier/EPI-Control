"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EPICard from '@/components/epi/EPICard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Personnel = {
  id: string;
  nom?: string | null;
  prenom?: string | null;
  photo?: string | null;
};

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

const PersonnelDetail: React.FC = () => {
  const params = useParams();
  const personIdRaw = params.id;
  const personId = useMemo(() => (typeof personIdRaw === 'string' ? personIdRaw : ''), [personIdRaw]);

  const [person, setPerson] = useState<Personnel | null>(null);
  const [epis, setEpis] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!personId) return;

    async function load() {
      setLoading(true);
      const { data: p, error: pErr } = await supabase
        .from('personnel')
        .select('id, nom, prenom, photo')
        .eq('id', personId)
        .maybeSingle();

      if (!active) return;

      if (pErr) {
        console.error(pErr);
        setPerson(null);
      } else if (p) {
        const id = typeof p.id === 'string' ? p.id : String(p.id);
        setPerson({ id, nom: p.nom ?? null, prenom: p.prenom ?? null, photo: p.photo ?? null });
      } else {
        setPerson(null);
      }

      const { data: items, error: eErr } = await supabase
        .from('equipements')
        .select('id, type, marque, modele, numero_serie, statut, image, personnel_id, created_at')
        .eq('personnel_id', personId)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (eErr) {
        console.error(eErr);
        setEpis([]);
      } else {
        setEpis(
          (items ?? []).map((it) => ({
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
  }, [personId]);

  const fullName = [person?.prenom, person?.nom].filter(Boolean).join(' ').trim();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/equipements">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux équipements
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={person?.photo || undefined} alt={fullName || person?.id} />
            <AvatarFallback>{(person?.prenom?.[0] || '') + (person?.nom?.[0] || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {fullName || 'Personnel'}
            </h1>
            {person?.id ? (
              <Badge variant="outline" className="mt-1">ID: {person.id}</Badge>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {loading ? 'Chargement...' : `${epis.length} EPI`}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-md border animate-pulse bg-muted" />
          ))}
        </div>
      ) : epis.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Aucun EPI pour ce personnel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {epis.map((epi) => (
            <EPICard key={epi.id} epi={epi} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonnelDetail;