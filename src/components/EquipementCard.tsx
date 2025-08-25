"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EquipementCard = ({ equipement, onEdit, onDelete }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        const { error } = await supabase
          .from('equipements')
          .delete()
          .eq('id', equipement.id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Équipement supprimé avec succès',
        });

        if (onDelete) onDelete();
      } catch (error) {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'en_service':
        return 'default';
      case 'en_reparation':
        return 'secondary';
      case 'hors_service':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_service':
        return 'En service';
      case 'en_reparation':
        return 'En réparation';
      case 'hors_service':
        return 'Hors service';
      default:
        return 'En attente';
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg">{equipement.type}</span>
          <Badge variant={getStatusBadgeVariant(equipement.statut)}>
            {getStatusText(equipement.statut)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          {equipement.marque && (
            <p><span className="font-medium">Marque:</span> {equipement.marque}</p>
          )}
          {equipement.modele && (
            <p><span className="font-medium">Modèle:</span> {equipement.modele}</p>
          )}
          <p><span className="font-medium">N° de série:</span> {equipement.numero_serie}</p>
          <p><span className="font-medium">Date de mise en service:</span> {equipement.date_mise_en_service || 'Non spécifiée'}</p>
          {equipement.date_fin_vie && (
            <p><span className="font-medium">Date de fin de vie:</span> {equipement.date_fin_vie}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Link to={`/equipements/${equipement.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link to={`/equipements/${equipement.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EquipementCard;