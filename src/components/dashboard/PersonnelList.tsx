import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentActivity {
  id: number;
  nom: string;
  prenom: string;
  photo: string | null;
  grade: string;
  last_control_date: string;
}

export function PersonnelList() {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoading(true);
      const { data: controls, error } = await supabase
        .from('controles')
        .select(`
          date_controle,
          equipements (
            personnel (
              id,
              nom,
              prenom,
              photo,
              grade
            )
          )
        `)
        .order('date_controle', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching recent activity:", error);
      } else if (controls) {
        const uniquePersonnel = new Map<number, RecentActivity>();
        controls.forEach(control => {
          const personnel = (control.equipements as any)?.personnel;
          if (personnel && !uniquePersonnel.has(personnel.id)) {
            uniquePersonnel.set(personnel.id, {
              ...personnel,
              last_control_date: control.date_controle,
            });
          }
        });
        setRecentActivity(Array.from(uniquePersonnel.values()));
      }
      setLoading(false);
    };

    fetchRecentActivity();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente du Personnel</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Chargement...</div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center text-muted-foreground">Aucune activité récente.</div>
        ) : (
          <div className="space-y-6">
            {recentActivity.map((person) => (
              <div key={person.id} className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.photo || undefined} alt="Avatar" />
                  <AvatarFallback>{person.prenom?.[0]}{person.nom?.[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{person.prenom} {person.nom}</p>
                  <p className="text-sm text-muted-foreground">{person.grade}</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(person.last_control_date), { addSuffix: true, locale: fr })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}