import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

type Pompier = {
  id: string | number;
  nom: string | null;
  prenom: string | null;
  grade?: string | null;
  caserne?: string | null;
  photo?: string | null;
};

type EpiStats = {
  total: number;
  conformes: number;
  nonConformes: number;
};

const getInitials = (nom: string, prenom: string) => {
  return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase();
};

const PompierCard = ({ pompier, epiCount }: { pompier: Pompier, epiCount: EpiStats }) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
            <AvatarFallback>{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{pompier.prenom} {pompier.nom}</h3>
            {pompier.grade && <p className="text-sm text-gray-500">{pompier.grade}</p>}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1" title="Total EPI">
                <Shield className="h-4 w-4" />
                <span>{epiCount.total}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600" title="EPI Conformes">
                <CheckCircle className="h-4 w-4" />
                <span>{epiCount.conformes}</span>
              </div>
              <div className="flex items-center gap-1 text-red-600" title="EPI Non-conformes">
                <AlertTriangle className="h-4 w-4" />
                <span>{epiCount.nonConformes}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {pompier.caserne && <Badge variant="outline">{pompier.caserne}</Badge>}
          <Button variant="outline" size="icon" asChild>
            <Link to={`/personnel/${pompier.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PompierCard;