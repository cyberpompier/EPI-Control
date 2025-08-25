"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Hash } from 'lucide-react';

interface EPICardProps {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  statut: string;
  date_mise_en_service?: string;
  date_fin_vie?: string;
  image?: string;
}

const EPICard = ({ 
  id, 
  type, 
  marque, 
  modele, 
  numero_serie, 
  statut, 
  date_mise_en_service, 
  date_fin_vie, 
  image 
}: EPICardProps) => {
  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'en_service': return 'default';
      case 'en_reparation': return 'destructive';
      case 'hors_service': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {image ? (
              <img 
                src={image} 
                alt={type} 
                className="w-10 h-10 object-cover rounded-md mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                <Hash className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <div>
              <span>{type}</span>
              <Badge variant={getBadgeVariant(statut)} className="ml-2">
                {statut.replace('_', ' ')}
              </Badge>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium w-32">Marque/Modèle:</span>
            <span>{marque} {modele}</span>
          </div>
          <div className="flex items-center text-sm">
            <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium w-32">N° Série:</span>
            <span>{numero_serie}</span>
          </div>
          {date_mise_en_service && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium w-32">Mise en service:</span>
              <span>{new Date(date_mise_en_service).toLocaleDateString()}</span>
            </div>
          )}
          {date_fin_vie && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium w-32">Fin de vie:</span>
              <span>{new Date(date_fin_vie).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EPICard;