"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Edit } from 'lucide-react';

interface EPICardProps {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numeroSerie: string;
  dateMiseEnService?: string;
  statut: string;
  image?: string;
  onEdit: (id: string) => void;
  onViewHistory: (id: string) => void;
}

const EPICard: React.FC<EPICardProps> = ({
  id,
  type,
  marque,
  modele,
  numeroSerie,
  dateMiseEnService,
  statut,
  image,
  onEdit,
  onViewHistory
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_service':
        return 'bg-green-100 text-green-800';
      case 'en_reparation':
        return 'bg-yellow-100 text-yellow-800';
      case 'hors_service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={type} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{type}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {marque && <p className="text-sm text-gray-600">Marque: {marque}</p>}
          {modele && <p className="text-sm text-gray-600">Modèle: {modele}</p>}
          <p className="text-sm text-gray-600">N° Série: {numeroSerie}</p>
          {dateMiseEnService && <p className="text-sm text-gray-600">Mise en service: {dateMiseEnService}</p>}
          <Badge className={getStatusColor(statut)}>
            {statut.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-gray-600"
          onClick={() => onViewHistory(id)}
        >
          <Clipboard className="h-4 w-4 mr-1" /> Historique
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-gray-600"
          onClick={() => onEdit(id)}
        >
          <Edit className="h-4 w-4 mr-1" /> Éditer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EPICard;