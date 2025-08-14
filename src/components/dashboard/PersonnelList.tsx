import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';

type Personnel = {
  id: number;
  nom: string | null;
  prenom: string | null;
  grade: string | null;
  photo: string | null;
};

const PersonnelList = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('id, nom, prenom, grade, photo')
        .order('nom')
        .limit(5);

      if (error) {
        console.error('Error fetching personnel:', error);
      } else {
        setPersonnel(data || []);
      }
      setLoading(false);
    };

    fetchPersonnel();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Personnel</CardTitle>
        <Link to="/personnel">
          <Button variant="outline" size="sm">Voir tout</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {personnel.length > 0 ? (
              personnel.map((p) => (
                <Link to={`/personnel/${p.id}`} key={p.id} className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Avatar>
                    <AvatarImage src={p.photo || undefined} alt={`${p.prenom} ${p.nom}`} />
                    <AvatarFallback>{getInitials(p.nom || '', p.prenom || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-tight">{p.prenom} {p.nom}</p>
                    <p className="text-sm text-muted-foreground">{p.grade}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Users className="mx-auto h-8 w-8 mb-2" />
                <p>Aucun personnel trouvé.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonnelList;