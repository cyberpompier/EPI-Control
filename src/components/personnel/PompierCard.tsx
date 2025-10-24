"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

type Equipement = {
  id: string;
  type: string;
  numero_serie: string;
};

type PompierCardProps = {
  pompier: Pompier;
};

export default function PompierCard({ pompier }: PompierCardProps) {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEquipements();
  }, [pompier.id]);

  const loadEquipements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('id, type, numero_serie')
        .eq('personnel_id', pompier.id);

      if (error) {
        console.error('Erreur lors du chargement des équipements:', error);
        setEquipements([]);
      } else {
        setEquipements(data || []);
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setEquipements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <Link to={`/personnel/${pompier.id}`} className="block h-full">
      <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
            <AvatarFallback>{getInitials(pompier.prenom, pompier.nom)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {pompier.prenom} {pompier.nom}
            </h3>
            <p className="text-sm text-muted-foreground">{pompier.grade}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Matricule:</span>
            <span className="font-medium">{pompier.matricule}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Caserne:</span>
            <span className="font-medium">{pompier.caserne}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-xs">{pompier.email}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">EPI attribués:</span>
            <Badge variant="secondary">{equipements.length}</Badge>
          </div>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Chargement...</p>
          ) : equipements.length > 0 ? (
            <div className="space-y-1">
              {equipements.slice(0, 3).map((equip) => (
                <div key={equip.id} className="text-xs text-muted-foreground flex justify-between">
                  <span>{equip.type}</span>
                  <span className="font-mono">{equip.numero_serie}</span>
                </div>
              ))}
              {equipements.length > 3 && (
                <p className="text-xs text-muted-foreground italic">
                  +{equipements.length - 3} autre(s)
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">Aucun EPI attribué</p>
          )}
        </div>
      </div>
    </Link>
  );
}