"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, History, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EPICardEditor from "./EPICardEditor";

type Equipement = {
  id: string;
  type?: string | null;
  marque?: string | null;
  modele?: string | null;
  numero_serie?: string | null;
  statut?: string | null;
  image?: string | null;
  [key: string]: any;
};

type EPICardProps = {
  epi: Equipement;
  onUpdated?: (updated: Equipement) => void;
};

const EPICard: React.FC<EPICardProps> = ({ epi, onUpdated }) => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const handleControler = () => {
    // Redirige vers la création d’un contrôle pour cet équipement
    navigate(`/controles/nouveau?equipement=${encodeURIComponent(epi.id)}`);
  };

  const handleHistorique = () => {
    // Redirige vers l’historique de l’équipement
    navigate(`/equipements/${encodeURIComponent(epi.id)}/historique`);
  };

  const handleSaved = (updated: Equipement) => {
    onUpdated?.(updated);
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Boutons d’action restaurés */}
        <div className="absolute left-2 top-2 z-10 flex gap-2">
          {/* Contrôler */}
          <Button
            size="icon"
            variant="secondary"
            aria-label="Contrôler l’équipement"
            onClick={handleControler}
          >
            <ClipboardCheck className="h-4 w-4" />
          </Button>

          {/* Éditer */}
          <Button
            size="icon"
            variant="secondary"
            aria-label="Éditer l’équipement"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Historique */}
          <Button
            size="icon"
            variant="secondary"
            aria-label="Historique de l’équipement"
            onClick={handleHistorique}
          >
            <History className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenu principal simple (garde l’aperçu actuel) */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {epi.image ? (
              <img
                src={epi.image}
                alt={epi.type ?? "Équipement"}
                className="h-20 w-20 rounded-md object-cover border"
              />
            ) : (
              <div className="h-20 w-20 rounded-md bg-muted border" />
            )}
            <div className="min-w-0">
              <div className="text-base font-semibold truncate">
                {epi.type ?? "Équipement"}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {epi.marque ?? ""} {epi.modele ?? ""}
              </div>
              <div className="text-sm text-muted-foreground">
                N° série: {epi.numero_serie ?? "—"}
              </div>
              <div className="mt-1 inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {epi.statut ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Éditeur */}
      <EPICardEditor
        open={editOpen}
        onOpenChange={setEditOpen}
        epi={epi}
        onSaved={handleSaved}
      />
    </>
  );
};

export default EPICard;