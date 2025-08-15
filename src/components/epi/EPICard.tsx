import { EPI } from '@/types/index';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clipboard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EPICardProps {
  epi: EPI;
}

export default function EPICard({ epi }: EPICardProps) {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'conforme':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'non_conforme':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'conforme':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non_conforme':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'en_attente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'casque':
        return '🪖';
      case 'veste':
        return '🧥';
      case 'surpantalon':
        return '👖';
      case 'gants':
        return '🧤';
      case 'rangers':
        return '👢';
      default:
        return '🛡️';
    }
  };

  // Calcul de la date d'expiration
  const today = new Date();
  const expiryDate = new Date(epi.date_fin_vie);
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {epi.image ? (
              <img 
                src={epi.image} 
                alt={epi.type} 
                className="mr-2 w-6 h-6 object-contain"
              />
            ) : (
              <span className="mr-2 text-xl">{getTypeIcon(epi.type)}</span>
            )}
            {epi.type.charAt(0).toUpperCase() + epi.type.slice(1)}
          </CardTitle>
          <Badge className={getStatusColor(epi.statut)} variant="outline">
            <span className="flex items-center">
              {getStatusIcon(epi.statut)}
              <span className="ml-1">
                {epi.statut === 'conforme' ? 'Conforme' : 
                 epi.statut === 'non_conforme' ? 'Non conforme' : 'En attente'}
              </span>
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Marque</span>
            <span className="text-sm">{epi.marque}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Modèle</span>
            <span className="text-sm">{epi.modele}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">N° Série</span>
            <span className="text-sm font-mono">{epi.numero_serie}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Mise en service</span>
            <span className="text-sm">{new Date(epi.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Fin de vie</span>
            <span className={`text-sm ${isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-yellow-600 font-bold' : ''}`}>
              {new Date(epi.date_fin_vie).toLocaleDateString('fr-FR')}
              {isExpired && ' (Expiré)'}
              {isExpiringSoon && ` (Dans ${daysUntilExpiry} jours)`}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t flex justify-between">
        <Button variant="outline" size="sm" className="text-gray-600">
          <Clipboard className="h-4 w-4 mr-1" /> Historique
        </Button>
        <Link to={`/controle/${epi.id}`}>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Contrôler
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}