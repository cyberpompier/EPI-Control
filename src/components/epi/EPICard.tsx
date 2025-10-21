"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Tag, Hash, PackageOpen } from 'lucide-react';

type AnyRecord = Record<string, any>;
type EPICardProps = {
  epi?: AnyRecord;
  assigneeName?: string; // nom complet du personnel (optionnel, prioritaire)
} & AnyRecord;

// Mappe le statut vers une variante de badge (style proche de la page équipement)
const getStatusVariant = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'en_service':
      return 'default';
    case 'en_reparation':
      return 'secondary';
    case 'hors_service':
      return 'destructive';
    case 'en_attente':
    default:
      return 'outline';
  }
};

const EPICard: React.FC<EPICardProps> = (props) => {
  const item: AnyRecord = props.epi ?? props;

  const type: string = item.type ?? '';
  const modele: string | undefined = item.modele ?? '';
  const marque: string | undefined = item.marque ?? '';
  const numero_serie: string | undefined = item.numero_serie ?? item.serial ?? '';
  const statut: string | undefined = item.statut ?? '';
  const image: string | undefined = item.image ?? '';
  const personnel_id: string | number | null | undefined = item.personnel_id ?? null;

  // Essayez d'afficher un nom si disponible (priorité à la prop assigneeName)
  const computedName =
    props.assigneeName ||
    [item.personnel_prenom, item.personnel_nom].filter(Boolean).join(' ').trim();

  const displayAssignee =
    computedName && computedName.length > 0
      ? computedName
      : personnel_id
      ? `ID ${personnel_id}`
      : 'Non assigné';

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-gray-500" />
            {type}
            {modele ? <span className="text-gray-500 font-normal">— {modele}</span> : null}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Statut */}
            {statut ? (
              <Badge variant={getStatusVariant(statut) as any} className="capitalize">
                {statut.replace('_', ' ')}
              </Badge>
            ) : null}
            {/* Assigné à */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>Assigné à:</span>
              <span className="font-medium">{displayAssignee}</span>
            </Badge>
          </div>
        </div>
        {marque ? <CardDescription className="mt-1">Marque: {marque}</CardDescription> : null}
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex gap-4">
          {image ? (
            <img
              src={image}
              alt={`${type} ${modele || ''}`}
              className="h-24 w-24 object-cover rounded-md border"
            />
          ) : null}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {numero_serie ? (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  <span>Numéro:</span>
                  <span className="font-medium">{numero_serie}</span>
                </Badge>
              ) : null}
              {type ? (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Type:</span>
                  <span className="font-medium">{type}</span>
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EPICard;