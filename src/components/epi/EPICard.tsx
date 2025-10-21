"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import EPICardEditor from './EPICardEditor';
import { createClient } from '@supabase/supabase-js';

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
  [key: string]: any;
};

type Personnel = {
  id: string;
  nom?: string | null;
  prenom?: string | null;
  photo?: string | null;
};

type EPICardProps = {
  epi: Equipement;
  assigneeName?: string;
};

const supabaseUrl = "https://quvdxjxszquqqcvesntn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const formatFullName = (p?: Pick<Personnel, 'prenom' | 'nom'> | null) =>
  [p?.prenom, p?.nom].filter(Boolean).join(' ').trim();

const EPICard: React.FC<EPICardProps> = ({ epi, assigneeName }) => {
  const [owner, setOwner] = useState<Personnel | null>(null);
  const [localEpi, setLocalEpi] = useState<Equipement>(epi);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setLocalEpi(epi);
  }, [epi]);

  const ownerId = useMemo(() => {
    if (localEpi?.personnel_id === null || localEpi?.personnel_id === undefined) return null;
    return typeof localEpi.personnel_id === 'string' ? localEpi.personnel_id : String(localEpi.personnel_id);
  }, [localEpi?.personnel_id]);

  useEffect(() => {
    if (!ownerId) {
      setOwner(null);
      return;
    }
    supabase
      .from('personnel')
      .select('id, nom, prenom, photo')
      .eq('id', ownerId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          const id = typeof data.id === 'string' ? data.id : String(data.id);
          setOwner({ id, nom: data.nom ?? null, prenom: data.prenom ?? null, photo: data.photo ?? null });
        } else {
          setOwner(null);
        }
      });
  }, [ownerId]);

  const fullOwnerName = owner ? formatFullName(owner) : (assigneeName ?? '');

  return (
    <Card className="relative overflow-hidden">
      {/* Bouton Éditer */}
      <div className="absolute left-2 top-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          aria-label="Éditer l’équipement"
          onClick={() => setOpenEdit(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Badge Propriétaire */}
      <div className="absolute right-2 top-2 z-10">
        {owner ? (
          <Link
            to={`/personnel/${owner.id}`}
            aria-label={`Propriétaire: ${fullOwnerName}`}
            className="no-underline"
          >
            <Badge variant="secondary" className="flex items-center gap-2 pl-1.5 pr-2 py-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={owner.photo || undefined} alt={fullOwnerName} />
                <AvatarFallback>{(owner.prenom?.[0] || '') + (owner.nom?.[0] || '')}</AvatarFallback>
              </Avatar>
              <span className="text-xs">Propriétaire: {fullOwnerName || owner.id}</span>
            </Badge>
          </Link>
        ) : fullOwnerName ? (
          <Badge variant="secondary" className="flex items-center gap-2 pl-1.5 pr-2 py-1">
            <span className="text-xs">Propriétaire: {fullOwnerName}</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">Non assigné</Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{localEpi.type || localEpi.modele || 'Équipement'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {localEpi.image ? (
          <img
            src={localEpi.image}
            alt={localEpi.type || localEpi.modele || 'Image EPI'}
            className="w-full h-40 object-cover rounded-md border"
          />
        ) : (
          <div className="w-full h-40 rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-sm">
            Aucune image
          </div>
        )}

        <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
          {localEpi.marque ? (
            <>
              <span className="text-muted-foreground">Marque</span>
              <span className="font-medium">{localEpi.marque}</span>
            </>
          ) : null}
          {localEpi.modele ? (
            <>
              <span className="text-muted-foreground">Modèle</span>
              <span className="font-medium">{localEpi.modele}</span>
            </>
          ) : null}
          {localEpi.numero_serie ? (
            <>
              <span className="text-muted-foreground">N° série</span>
              <span className="font-medium">{localEpi.numero_serie}</span>
            </>
          ) : null}
          {localEpi.statut ? (
            <>
              <span className="text-muted-foreground">Statut</span>
              <span className="font-medium">{localEpi.statut}</span>
            </>
          ) : null}
        </div>
      </CardContent>

      {/* Dialog d'édition */}
      <EPICardEditor
        open={openEdit}
        onOpenChange={setOpenEdit}
        epi={localEpi}
        onSaved={(updated) => setLocalEpi(updated)}
      />
    </Card>
  );
};

export { EPICard };
export default EPICard;