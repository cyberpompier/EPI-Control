"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Wrench, XCircle, Clock } from "lucide-react";
import type { EPI } from "@/types";
import { toDbStatus, toLabel } from "@/utils/epiStatus";

type Props = {
  epi: EPI;
};

// Garde les classes/couleurs d'origine
function getStatusColor(status: string) {
  switch (status) {
    case "en_service":
      return "border-green-200 text-green-800 bg-green-50";
    case "en_reparation":
      return "border-yellow-200 text-yellow-800 bg-yellow-50";
    case "hors_service":
      return "border-red-200 text-red-800 bg-red-50";
    case "en_attente":
    default:
      return "border-gray-200 text-gray-800 bg-gray-50";
  }
}

// Garde les icônes d'origine
function getStatusIcon(status: string) {
  switch (status) {
    case "en_service":
      return <CheckCircle className="h-4 w-4" />;
    case "en_reparation":
      return <Wrench className="h-4 w-4" />;
    case "hors_service":
      return <XCircle className="h-4 w-4" />;
    case "en_attente":
    default:
      return <Clock className="h-4 w-4" />;
  }
}

const EPICard: React.FC<Props> = ({ epi }) => {
  // Normaliser uniquement pour la logique, sans impacter le rendu visuel
  const normalizedStatus = toDbStatus(String(epi.statut));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            <span className="truncate">
              {epi.type}
              {epi.modele ? ` — ${epi.modele}` : ""}
            </span>
          </CardTitle>
          <Badge className={getStatusColor(normalizedStatus)} variant="outline">
            <span className="flex items-center">
              {getStatusIcon(normalizedStatus)}
              <span className="ml-1">
                {toLabel(String(epi.statut))}
              </span>
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground space-y-1">
        {epi.marque && <p>Marque: {epi.marque}</p>}
        {epi.numero_serie && <p>N° série: {epi.numero_serie}</p>}
      </CardContent>
    </Card>
  );
};

export default EPICard;