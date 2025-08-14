import { Pompier } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PompierCardProps {
  pompier: Pompier;
  epiCount?: {
    total: number;
    conformes: number;
    nonConformes: number;
  };
}

export default function PompierCard({ pompier, epiCount = { total: 0, conformes: 0, nonConformes: 0 } }: PompierCardProps) {
  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'capitaine':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'lieutenant':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'adjudant':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sergent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'caporal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 flex flex-row items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${pompier.id}`} alt={`${pompier.prenom} ${pompier.nom}`} />
          <AvatarFallback>{getInitials(pompier.nom, pompier.prenom)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{pompier.prenom} {pompier.nom}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={getGradeColor(pompier.grade)} variant="outline">
              {pompier.grade}
            </Badge>
            <span className="text-xs text-gray-500">#{pompier.matricule}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-500 mb-3">
          <div className="flex items-center mb-1">
            <Mail className="h-4 w-4 mr-2" />
            {pompier.email}
          </div>
          <div>Caserne: {pompier.caserne}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-semibold">{epiCount.total}</div>
            <div className="text-xs text-gray-500">Total EPI</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-md">
            <div className="text-lg font-semibold text-green-600">{epiCount.conformes}</div>
            <div className="text-xs text-gray-500">Conformes</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-md">
            <div className="text-lg font-semibold text-red-600">{epiCount.nonConformes}</div>
            <div className="text-xs text-gray-500">Non conformes</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t">
        <Link to={`/personnel/${pompier.id}/equipements`} className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <ClipboardList className="h-4 w-4 mr-2" />
            Voir les équipements
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}