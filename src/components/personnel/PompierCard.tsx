import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, MapPin } from 'lucide-react';
import { Pompier } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EpiCount {
  total: number;
  conformes: number;
  nonConformes: number;
}

interface PompierCardProps {
  pompier: Pompier;
  epiCount: EpiCount;
}

export default function PompierCard({ pompier, epiCount }: PompierCardProps) {
  const getInitials = (nom: string, prenom: string) => {
    return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white">
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${pompier.id}`} alt={`${pompier.prenom} ${pompier.nom}`} />
          <AvatarFallback>{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold">{pompier.prenom || ''} {pompier.nom || ''}</h2>
          <p className="text-sm text-gray-500">{pompier.grade}</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4 flex items-center">
        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
        <span>{pompier.caserne}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="text-center p-2 bg-blue-50 rounded-md border border-blue-100">
          <div className="text-lg font-semibold text-blue-700">{epiCount.total}</div>
          <div className="text-xs text-gray-600">Total EPI</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-md border border-green-100">
          <div className="text-lg font-semibold text-green-700">{epiCount.conformes}</div>
          <div className="text-xs text-gray-600">Conformes</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-md border border-red-100">
          <div className="text-lg font-semibold text-red-700">{epiCount.nonConformes}</div>
          <div className="text-xs text-gray-600">Non conformes</div>
        </div>
      </div>
      
      <Link to={`/personnel/${pompier.id}/equipements`} className="w-full mt-4 block">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <ClipboardList className="h-4 w-4 mr-2" />
          Voir les équipements
        </Button>
      </Link>
    </div>
  );
}