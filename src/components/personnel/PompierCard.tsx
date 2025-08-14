"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { Pompier } from '@/types';

interface EpiCount {
  total: number;
  conformes: number;
  nonConformes: number;
}

interface PompierCardProps {
  pompier: Pompier;
  epiCount?: EpiCount;
}

const PompierCard: React.FC<PompierCardProps> = ({ pompier, epiCount }) => {
  // Utilise une valeur par défaut si epiCount est undefined
  const count: EpiCount = epiCount || { total: 0, conformes: 0, nonConformes: 0 };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="text-lg font-bold">
          {pompier.prenom} {pompier.nom}
        </h2>
        <p className="text-sm text-gray-600">{pompier.grade}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm">Équipements totaux: {count.total}</p>
          <p className="text-sm">Conformes: {count.conformes}</p>
          <p className="text-sm">Non conformes: {count.nonConformes}</p>
        </div>
        <Button asChild variant="outline" className="w-full flex items-center justify-center">
          <Link to={`/personnel/${pompier.id}/equipements`}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Voir les équipements
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PompierCard;