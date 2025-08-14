import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

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
    <div className="p-4 border rounded shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{pompier.prenom} {pompier.nom}</h2>
        <div className="mt-2">
          <p>Total EPI: {epiCount.total}</p>
          <p>Conformes: {epiCount.conformes}</p>
          <p>Non conformes: {epiCount.nonConformes}</p>
        </div>
      </div>
      <Link to={`/personnel/${pompier.id}/equipements`} className="w-full">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <ClipboardList className="h-4 w-4 mr-2" />
          Voir les équipements assignés
        </Button>
      </Link>
    </div>
  );
}