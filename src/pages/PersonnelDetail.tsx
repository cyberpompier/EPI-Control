"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Award, Hash, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

type Equipement = {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  statut: string;
  image: string | null;
};

export default function PersonnelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pompier, setPompier] = useState<Pompier | null>(null);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPompierDetails();
      loadEquipements();
    }
  }, [id]);

  const loadPompierDetails = async () => {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors du chargement du pompier:', error);
      navigate('/personnel');
      return;
    }

    setPompier(data);
  };

  const loadEquipements = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select('*')
      .eq('personnel_id', id)
      .order('type');

    if (error) {
      console.error('Erreur lors du chargement des équipements:', error);
      setEquipements([]);
    } else {
      setEquipements(data || []);
    }
    setIsLoading(false);
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getStatutBadge = (statut: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      en_service: { label: 'En service', variant: 'default' },
      en_attente: { label: 'En attente', variant: 'secondary' },
      en_maintenance: { label: 'En maintenance', variant: 'outline' },
      reforme: { label: 'Réformé', variant: 'destructive' },
    };

    const status = statusMap[statut] || { label: statut, variant: 'secondary' };
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  if (!pompier) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/personnel')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button
            onClick={() => navigate(`/personnel/${id}/edit`)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du pompier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
                <AvatarFallback className="text-2xl">
                  {getInitials(pompier.prenom, pompier.nom)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {pompier.prenom} {pompier.nom}
                  </h2>
                  <p className="text-lg text-muted-foreground">{pompier.grade}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Matricule:</span>
                    <span className="font-medium">{pompier.matricule}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium">{pompier.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Caserne:</span>
                    <span className="font-medium">{pompier.caserne}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Grade:</span>
                    <span className="font-medium">{pompier.grade}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>EPI attribués ({equipements.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement des équipements...</div>
            ) : equipements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun EPI attribué à ce pompier.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Marque</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Numéro de série</TableHead>
                    <TableHead>Date de mise en service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipements.map((equip) => (
                    <TableRow key={equip.id}>
                      <TableCell className="font-medium">{equip.type}</TableCell>
                      <TableCell>{equip.marque || '—'}</TableCell>
                      <TableCell>{equip.modele || '—'}</TableCell>
                      <TableCell className="font-mono text-sm">{equip.numero_serie}</TableCell>
                      <TableCell>{formatDate(equip.date_mise_en_service)}</TableCell>
                      <TableCell>{getStatutBadge(equip.statut)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/equipement/${equip.id}`)}
                        >
                          Voir détails
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
    </Layout>
  );
}