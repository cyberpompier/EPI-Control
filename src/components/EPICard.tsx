"use client";

import { Card, CardContent } from '@/components/ui/card';
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
    <Card key={id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          {image ? (
            <img 
              src={image} 
              alt={type} 
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
              <Hash className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{type}</h3>
                <p className="text-sm text-muted-foreground">
                  {marque} {modele}
                </p>
              </div>
              <Badge variant={getBadgeVariant(statut)}>
                {statut.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm">
                <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>N° Série: {numero_serie}</span>
              </div>
              
              {date_mise_en_service && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    Mise en service: {new Date(date_mise_en_service).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {date_fin_vie && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    Fin de vie: {new Date(date_fin_vie).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EPICard;