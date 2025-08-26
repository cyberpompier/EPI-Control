import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clipboard, AlertTriangle, CheckCircle, Clock, Edit, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEPI } from '@/hooks/useEPI';
import { useState } from 'react';

interface EPICardProps {
  epi: any; // à typage large, car jointures possibles
}

export default function EPICard({ epi }: EPICardProps) {
  const { updateEPIStatus } = useEPI();
  const [updating, setUpdating] = useState(false);

  // 🔹 Config centralisée des statuts
  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: JSX.Element }> = {
    conforme: {
      label: "Conforme",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    non_conforme: {
      label: "Non conforme",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    },
    en_attente: {
      label: "En attente",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
    },
    default: {
      label: "Inconnu",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <AlertTriangle className="h-4 w-4 text-gray-600" />,
    },
  };

  const statusKey = epi.statut?.toLowerCase() || "default";
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.default;

  // 🔹 Fonction de mise à jour du statut
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === epi.statut) return; // inutile si pas de changement
    try {
      setUpdating(true);
      await updateEPIStatus(epi.id, newStatus);
      epi.statut = newStatus; // mise à jour locale immédiate
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Icônes type équipement
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'casque': return '🪖';
      case 'veste': return '🧥';
      case 'surpantalon': return '👖';
      case 'gants': return '🧤';
      case 'rangers': return '👢';
      default: return '🛡️';
    }
  };

  const ownerRaw = epi?.personnel;
  const owner = Array.isArray(ownerRaw) ? ownerRaw[0] : ownerRaw;
  const ownerName = owner ? `${owner.prenom ?? ''} ${owner.nom ?? ''}`.trim() : null;

  const today = new Date();
  const expiryDate = epi?.date_fin_vie ? new Date(epi.date_fin_vie) : null;
  const daysUntilExpiry = expiryDate ? Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {epi.image ? (
              <img src={epi.image} alt={epi.type} className="mr-2 w-6 h-6 object-contain" />
            ) : (
              <span className="mr-2 text-xl">{getTypeIcon(epi.type)}</span>
            )}
            {epi.type?.charAt(0).toUpperCase() + epi.type?.slice(1)}
          </CardTitle>

          {/* 🔹 Badge cliquable avec menu déroulant */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex items-center gap-1 ${status.color}`} 
                disabled={updating}
              >
                {status.icon}
                {status.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(STATUS_CONFIG).filter(s => s !== "default").map((key) => (
                <DropdownMenuItem key={key} onClick={() => handleStatusChange(key)}>
                  <span className="flex items-center gap-2">
                    {STATUS_CONFIG[key].icon}
                    {STATUS_CONFIG[key].label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* infos équipement identiques */}
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

          {/* Propriétaire */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Assigné à</span>
            {owner ? (
              <Link to={`/personnel/${owner.id}`} className="inline-flex items-center text-sm hover:underline">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                {ownerName || 'Sans nom'}
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Non assigné</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Mise en service</span>
            <span className="text-sm">
              {epi.date_mise_en_service ? new Date(epi.date_mise_en_service).toLocaleDateString('fr-FR') : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Fin de vie</span>
            <span className={`text-sm ${isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-yellow-600 font-bold' : ''}`}>
              {expiryDate ? expiryDate.toLocaleDateString('fr-FR') : '—'}
              {isExpired && ' (Expiré)'}
              {isExpiringSoon && daysUntilExpiry !== null && ` (Dans ${daysUntilExpiry} jours)`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to={`/controles?equipement=${epi.id}`}>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Clipboard className="h-4 w-4 mr-1" /> Historique
            </Button>
          </Link>
          <Link to={`/equipements/${epi.id}/modifier`}>
            <Button variant="outline" size="icon" aria-label="Modifier l'équipement">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Link to={`/controle/${epi.id}`}>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Contrôler
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
