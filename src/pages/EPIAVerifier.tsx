"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type EPIAVerifier = {
  equipement_id: string;
  type: string;
  numero_serie: string;
  date_prochaine_verification: string;
  personnel_nom?: string;
  personnel_prenom?: string;
  jours_retard: number;
};

export default function EPIAVerifier() {
  const navigate = useNavigate();
  const [epiList, setEpiList] = useState<EPIAVerifier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEPIAVerifier();
  }, []);

  const loadEPIAVerifier = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      // Récupérer les contrôles avec date de vérification dépassée
      const { data: controles, error: controlesError } = await supabase
        .from('controles')
        .select('equipement_id, date_prochaine_verification')
        .not('date_prochaine_verification', 'is', null)
        .lt('date_prochaine_verification', today);

      if (controlesError) {
        console.error('Erreur lors du chargement des contrôles:', controlesError);
        setIsLoading(false);
        return;
      }

      // Obtenir les équipements uniques
      const uniqueEquipementIds = [...new Set(controles?.map(c => c.equipement_id) || [])];

      if (uniqueEquipementIds.length === 0) {
        setEpiList([]);
        setIsLoading(false);
        return;
      }

      // Récupérer les détails des équipements
      const { data: equipements, error: equipError } = await supabase
        .from('equipements')
        .select('id, type, numero_serie, personnel_id')
        .in('id', uniqueEquipementIds);

      if (equipError) {
        console.error('Erreur lors du chargement des équipements:', equipError);
        setIsLoading(false);
        return;
      }

      // Récupérer les informations du personnel
      const personnelIds = equipements
        ?.filter(e => e.personnel_id)
        .map(e => e.personnel_id) || [];

      let personnelMap: Record<number, { nom: string; prenom: string }> = {};

      if (personnelIds.length > 0) {
        const { data: personnel, error: persError } = await supabase
          .from('personnel')
          .select('id, nom, prenom')
          .in('id', personnelIds);

        if (!persError && personnel) {
          personnelMap = personnel.reduce((acc, p) => {
            acc[p.id] = { nom: p.nom, prenom: p.prenom };
            return acc;
          }, {} as Record<number, { nom: string; prenom: string }>);
        }
      }

      // Combiner les données
      const epiData: EPIAVerifier[] = equipements?.map(equip => {
        const controle = controles?.find(c => c.equipement_id === equip.id);
        const dateVerif = controle?.date_prochaine_verification || '';
        const joursRetard = Math.floor(
          (new Date().getTime() - new Date(dateVerif).getTime()) / (1000 * 60 * 60 * 24)
        );

        const personnel = equip.personnel_id ? personnelMap[equip.personnel_id] : null;

        return {
          equipement_id: equip.id,
          type: equip.type,
          numero_serie: equip.numero_serie,
          date_prochaine_verification: dateVerif,
          personnel_nom: personnel?.nom,
          personnel_prenom: personnel?.prenom,
          jours_retard: joursRetard,
        };
      }) || [];

      // Trier par nombre de jours de retard (du plus urgent au moins urgent)
      epiData.sort((a, b) => b.jours_retard - a.jours_retard);

      setEpiList(epiData);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getUrgenceBadge = (joursRetard: number) => {
    if (joursRetard > 90) {
      return <Badge variant="destructive">Très urgent ({joursRetard}j)</Badge>;
    } else if (joursRetard > 30) {
      return <Badge className="bg-orange-500">Urgent ({joursRetard}j)</Badge>;
    } else {
      return <Badge className="bg-yellow-500">À vérifier ({joursRetard}j)</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            EPI nécessitant une vérification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : epiList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun EPI ne nécessite de vérification pour le moment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Numéro de série</TableHead>
                  <TableHead>Personnel</TableHead>
                  <TableHead>Date de vérification prévue</TableHead>
                  <TableHead>Urgence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epiList.map((epi) => (
                  <TableRow key={epi.equipement_id}>
                    <TableCell className="font-medium">{epi.type}</TableCell>
                    <TableCell>{epi.numero_serie}</TableCell>
                    <TableCell>
                      {epi.personnel_prenom && epi.personnel_nom
                        ? `${epi.personnel_prenom} ${epi.personnel_nom}`
                        : '—'}
                    </TableCell>
                    <TableCell>{formatDate(epi.date_prochaine_verification)}</TableCell>
                    <TableCell>{getUrgenceBadge(epi.jours_retard)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/controle/${epi.equipement_id}`)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Effectuer un contrôle
                      </Button>
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