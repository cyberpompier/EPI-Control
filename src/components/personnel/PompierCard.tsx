"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssignedEPIList from './AssignedEPIList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PackageOpen } from 'lucide-react';

type Pompier = {
  id: number | string;
  nom?: string;
  prenom?: string;
  photo?: string | null;
  grade?: string | null;
  caserne?: string | null;
  [key: string]: any;
};

type EpiCount = {
  total: number;
  conformes: number;
  nonConformes: number;
};

type PompierCardProps = {
  pompier: Pompier;
  epiCount?: EpiCount; // optional to align with usage in Personnel.tsx
};

const PompierCard: React.FC<PompierCardProps> = ({ pompier }) => {
  const [open, setOpen] = useState(false);
  const fullName = [pompier.prenom, pompier.nom].filter(Boolean).join(' ').trim();

  const openDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Link to={`/personnel/${pompier.id}`} className="block h-full">
      <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
            <AvatarFallback>{(pompier.prenom?.[0] || '') + (pompier.nom?.[0] || '')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{fullName || 'Personnel'}</div>
            {pompier.grade ? <div className="text-sm text-muted-foreground">{pompier.grade}</div> : null}
            {pompier.caserne ? <div className="text-xs text-muted-foreground">{pompier.caserne}</div> : null}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Cliquer pour le détail</div>
          <Button size="sm" variant="secondary" className="gap-2" onClick={openDialog}>
            <PackageOpen className="h-4 w-4" />
            EPI assignés
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>EPI assignés</DialogTitle>
            <DialogDescription>
              Liste des équipements associés à {fullName || `l'ID ${pompier.id}`}.
            </DialogDescription>
          </DialogHeader>
          <AssignedEPIList personnelId={pompier.id} assigneeName={fullName} />
        </DialogContent>
      </Dialog>
    </Link>
  );
};

export { PompierCard };
export default PompierCard;