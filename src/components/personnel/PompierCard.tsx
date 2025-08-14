import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, Shield } from 'lucide-react';

interface Pompier {
  id: number;
  nom: string;
  prenom: string;
  // autres propriétés éventuelles
}

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
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{pompier.prenom} {pompier.nom}</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
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
          Voir les équipements assignés
        </Button>
      </Link>
    </div>
  );
}