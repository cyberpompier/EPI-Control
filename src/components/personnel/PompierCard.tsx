import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pompier } from "@/types/index";
import { Link } from "react-router-dom";
import { Shield, CheckCircle, XCircle } from "lucide-react";

interface EpiStats {
  total: number;
  conformes: number;
  nonConformes: number;
}

interface PompierCardProps {
  pompier: Pompier;
  epiCount: EpiStats;
}

const getInitials = (nom: string | null, prenom: string | null) => {
  const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : '';
  const lastInitial = nom ? nom.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

export const PompierCard = ({ pompier, epiCount }: PompierCardProps) => {
  return (
    <Link to={`/personnel/${pompier.id}`} className="block h-full">
      <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
            <AvatarFallback>{getInitials(pompier.nom, pompier.prenom)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{pompier.prenom} {pompier.nom}</h3>
            <p className="text-sm text-muted-foreground">{pompier.grade}</p>
            <p className="text-sm text-muted-foreground">{pompier.caserne}</p>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex justify-around text-xs text-muted-foreground">
            <div className="text-center flex flex-col items-center">
              <Shield className="h-4 w-4 mb-1" />
              <span>{epiCount.total} EPI</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <CheckCircle className="h-4 w-4 mb-1 text-green-500" />
              <span>{epiCount.conformes}</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <XCircle className="h-4 w-4 mb-1 text-red-500" />
              <span>{epiCount.nonConformes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};