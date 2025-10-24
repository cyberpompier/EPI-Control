"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Award, Hash, Edit, ClipboardCheck, History, User } from 'lucide-react';

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
  date_fin_vie: string | null;
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
    const statusMap: Record<string, { label: string; className: string }> = {
      en_service: { label: 'En service', className: 'bg-green-100 text-green-800 border-green-200' },
      en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      en_maintenance: { label: 'En maintenance', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      reforme: { label: 'Réformé', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const status = statusMap[statut] || { label: statut, className: 'bg-gray-100 text-gray-800 border-gray-200' };
    return (
      <Badge className={`${status.className} border`}>
        {status.label}
      </Badge>
    );
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipements.map((equip) => (
                  <Card key={equip.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {equip.image ? (
                            <img 
                              src={equip.image} 
                              alt={equip.type}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Award className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{equip.type}</h3>
                          </div>
                        </div>
                        {getStatutBadge(equip.statut)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        {equip.marque && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Marque</span>
                            <span className="font-medium">{equip.marque}</span>
                          </div>
                        )}
                        {equip.modele && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Modèle</span>
                            <span className="font-medium">{equip.modele}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">N° Série</span>
                          <span className="font-mono font-medium text-xs">{equip.numero_serie}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigné à</span>
                          <span className="font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {pompier.prenom} {pompier.nom}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mise en service</span>
                          <span className="font-medium">{formatDate(equip.date_mise_en_service)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fin de vie</span>
                          <span className="font-medium">{formatDate(equip.date_fin_vie)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(`/equipement/${equip.id}/historique`)}
                        >
                          <History className="h-4 w-4 mr-1" />
                          Historique
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(`/equipement/${equip.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Éditer
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => navigate(`/controle/${equip.id}`)}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Contrôler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}