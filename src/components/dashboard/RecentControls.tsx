import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

type Control = {
  id: string;
  date_controle: string;
  resultat: string;
  equipements: {
    id: string;
    type: string;
    numero_serie: string;
  } | null;
};

const RecentControls = () => {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentControls = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('controles')
        .select(`
          id,
          date_controle,
          resultat,
          equipements ( id, type, numero_serie )
        `)
        .order('date_controle', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent controls:', error);
      } else {
        setControls((data as any[]) || []);
      }
      setLoading(false);
    };

    fetchRecentControls();
  }, []);

  const getResultBadge = (resultat: string) => {
    switch (resultat?.toLowerCase()) {
      case 'conforme':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Conforme</Badge>;
      case 'non conforme':
      case 'non_conforme':
        return <Badge variant="destructive">Non Conforme</Badge>;
      default:
        return <Badge variant="secondary">{resultat || 'N/A'}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Derniers Contrôles</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-10">Chargement...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Résultat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.length > 0 ? (
                controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell>
                      <Link to={`/equipements/${control.equipements?.id}`} className="font-medium hover:underline">
                        {control.equipements?.type || 'N/A'}
                      </Link>
                      <div className="text-sm text-muted-foreground">{control.equipements?.numero_serie || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{format(new Date(control.date_controle), 'dd MMM yyyy', { locale: fr })}</TableCell>
                    <TableCell>{getResultBadge(control.resultat)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                    Aucun contrôle récent trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentControls;