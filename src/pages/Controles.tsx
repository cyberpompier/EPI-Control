import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { supabase } from '../integrations/supabase/client';

type Controle = {
  id: string;
  equipement_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: string;
  observations?: string | null;
  actions_correctives?: string | null;
  date_prochaine_verification?: string | null;
  created_at?: string | null;
};

function formatDate(d?: string | null) {
  if (!d) return '-';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '-';
  return dt.toLocaleDateString();
}

function isUpcoming(dateStr?: string | null) {
  if (!dateStr) return false;
  const today = new Date();
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return false;

  // Normaliser à minuit pour comparaison en jours
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();

  const diffDays = Math.ceil((t1 - t0) / (1000 * 60 * 60 * 24));
  // Futur (>= 0) et dans les 30 prochains jours
  return diffDays >= 0 && diffDays <= 30;
}

export default function Controles() {
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('controles')
        .select('*')
        .order('date_prochaine_verification', { ascending: true });

      if (!active) return;

      if (error) {
        // Laisser remonter l'erreur dans la console pour diagnostic
        console.error('Erreur chargement contrôles:', error);
        setControles([]);
      } else {
        setControles(data || []);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const upcomingCount = useMemo(
    () => controles.filter((c) => isUpcoming(c.date_prochaine_verification)).length,
    [controles]
  );

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Contrôles</CardTitle>
            <div className="text-sm text-gray-500">
              {controles.length} élément{controles.length > 1 ? 's' : ''} • {upcomingCount} contrôle{upcomingCount > 1 ? 's' : ''} à venir
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Chargement…</div>
          ) : controles.length === 0 ? (
            <div className="py-10 text-center text-gray-500">Aucun contrôle trouvé</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Équipement</TableHead>
                  <TableHead className="whitespace-nowrap">Date contrôle</TableHead>
                  <TableHead className="whitespace-nowrap">Prochaine vérification</TableHead>
                  <TableHead className="whitespace-nowrap">Résultat</TableHead>
                  <TableHead className="whitespace-nowrap">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controles.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm">{c.equipement_id}</TableCell>
                    <TableCell className="text-sm">{formatDate(c.date_controle)}</TableCell>
                    <TableCell className="text-sm">{formatDate(c.date_prochaine_verification)}</TableCell>
                    <TableCell className="text-sm">{c.resultat || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {isUpcoming(c.date_prochaine_verification) ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 border border-amber-200"
                          title="La prochaine vérification est dans 30 jours ou moins"
                        >
                          Contrôle à venir
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}