"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar,
  Wrench,
  User
} from 'lucide-react';

interface EPI {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  statut: 'en_service' | 'en_reparation' | 'hors_service';
  image: string;
  personnel_id?: number;
}

interface EPICardProps {
  epi: EPI;
  onUpdateStatus?: (id: string, newStatus: EPI['statut']) => void;
}

const EPICard = ({ epi, onUpdateStatus }: EPICardProps) => {
  const getStatusColor = (status: EPI['statut']) => {
    switch (status) {
      case 'en_service':
        return 'bg-green-100 text-green-800 border-green-800';
      case 'en_reparation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-800';
      case 'hors_service':
        return 'bg-red-100 text-red-800 border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-800';
    }
  };

  const getStatusIcon = (status: EPI['statut']) => {
    switch (status) {
      case 'en_service':
        return <CheckCircle className="h-4 w-4" />;
      case 'en_reparation':
        return <Wrench className="h-4 w-4" />;
      case 'hors_service':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: EPI['statut']) => {
    switch (status) {
      case 'en_service':
        return 'En service';
      case 'en_reparation':
        return 'En réparation';
      case 'hors_service':
        return 'Hors service';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleStatusUpdate = (newStatus: EPI['statut']) => {
    if (onUpdateStatus) {
      onUpdateStatus(epi.id, newStatus);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold">{epi.type}</h3>
            <p className="text-sm text-gray-500">{epi.marque} - {epi.modele}</p>
          </div>
          <Badge className={`${getStatusColor(epi.statut)} border`} variant="outline">
            <span className="flex items-center">
              {getStatusIcon(epi.statut)}
              <span className="ml-1">
                {getStatusText(epi.statut)}
              </span>
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <img 
            src={epi.image || 'https://placehold.co/100x100?text=Image+non+disponible'} 
            alt={epi.type} 
            className="w-16 h-16 object-cover rounded-md mr-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/100x100?text=Image+non+disponible';
            }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium">N° série: {epi.numero_serie}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <User className="h-4 w-4 mr-1" />
              {epi.personnel_id ? `Assigné #${epi.personnel_id}` : 'Non assigné'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Mise en service: {formatDate(epi.date_mise_en_service)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Fin de vie: {formatDate(epi.date_fin_vie)}</span>
          </div>
        </div>

        {onUpdateStatus && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={epi.statut === 'en_service' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate('en_service')}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              En service
            </Button>
            <Button 
              size="sm" 
              variant={epi.statut === 'en_reparation' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate('en_reparation')}
              className="flex-1"
            >
              <Wrench className="h-4 w-4 mr-1" />
              Réparation
            </Button>
            <Button 
              size="sm" 
              variant={epi.statut === 'hors_service' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate('hors_service')}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Hors service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EPICard;