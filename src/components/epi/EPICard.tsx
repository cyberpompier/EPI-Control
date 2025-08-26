"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Wrench, XCircle, Clock, Pencil, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EPI } from "@/types";
import { toDbStatus, toLabel } from "@/utils/epiStatus";

type Props = {
  epi: EPI;
};

// Conserver les couleurs d'origine
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

// Conserver les icônes d'origine
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
  const navigate = useNavigate();
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

      <CardContent className="pt-0 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
              {epi.image ? (
                <img
                  src={epi.image}
                  alt={`${epi.type}${epi.modele ? ` ${epi.modele}` : ""}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <Shield className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="space-y-1 truncate">
              {epi.marque && <p className="truncate">Marque: {epi.marque}</p>}
              {epi.numero_serie && <p className="truncate">N° série: {epi.numero_serie}</p>}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/equipements/${epi.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Éditer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EPICard;