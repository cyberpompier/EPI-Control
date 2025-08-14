import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Personnel } from "@/types/personnel";

interface PompierCardProps {
  pompier: Personnel;
}

const getInitials = (nom: string, prenom: string) => {
  const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : '';
  const lastInitial = nom ? nom.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

export const PompierCard = ({ pompier }: PompierCardProps) => {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
        <AvatarFallback>{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{pompier.prenom} {pompier.nom}</h3>
        <p className="text-sm text-muted-foreground">{pompier.grade}</p>
        <p className="text-sm text-muted-foreground">{pompier.caserne}</p>
      </div>
    </div>
  );
};