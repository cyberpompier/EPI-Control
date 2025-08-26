"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, User } from 'lucide-react';
import { EPIDetailsDialog } from './EPIDetailsDialog';
import { getStatusColor, getStatusIcon } from '@/lib/utils.tsx';

// ... rest of the component code remains the same
interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface EPI {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string | null;
  personnel_id: number | null;
  personnel: Personnel | null;
}

interface EPICardProps {
  epi: EPI;
  onUpdate: (updatedEPI: EPI) => void;
}

export function EPICard({ epi, onUpdate }: EPICardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEPI, setCurrentEPI] = useState(epi);

  const handleUpdate = (updatedEPI: EPI) => {
    setCurrentEPI(updatedEPI);
    onUpdate(updatedEPI);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{currentEPI.type}</CardTitle>
            <Badge className={getStatusColor(currentEPI.statut)} variant="outline">
              <span className="flex items-center">
                {getStatusIcon(currentEPI.statut)}
                <span className="ml-1">
                  {currentEPI.statut === 'en_service' ? 'En service' : 
                   currentEPI.statut === 'en_reparation' ? 'En réparation' : 
                   currentEPI.statut === 'hors_service' ? 'Hors service' : 
                   currentEPI.statut === 'en_attente' ? 'En attente' : 
                   currentEPI.statut}
                </span>
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium w-24">N° Série:</span>
              <span>{currentEPI.numero_serie}</span>
            </div>
            
            {currentEPI.marque && (
              <div className="flex items-center">
                <span className="font-medium w-24">Marque:</span>
                <span>{currentEPI.marque}</span>
              </div>
            )}
            
            {currentEPI.modele && (
              <div className="flex items-center">
                <span className="font-medium w-24">Modèle:</span>
                <span>{currentEPI.modele}</span>
              </div>
            )}
            
            {currentEPI.date_mise_en_service && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Mis en service: {new Date(currentEPI.date_mise_en_service).toLocaleDateString()}</span>
              </div>
            )}
            
            {currentEPI.personnel && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{currentEPI.personnel.prenom} {currentEPI.personnel.nom}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Voir / Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      <EPIDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        epi={currentEPI}
        onUpdate={handleUpdate}
      />
    </>
  );
}