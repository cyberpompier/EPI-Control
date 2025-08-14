import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type HabillementItem = {
  id: number;
  article: string;
  description: string | null;
  taille: string | null;
  code: string | null;
  status: string | null;
};

interface HabillementProps {
  personnelId: number;
}

const Habillement = ({ personnelId }: HabillementProps) => {
  const [habillement, setHabillement] = useState<HabillementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabillement = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('habillement')
        .select('*')
        .eq('personnel_id', personnelId);

      if (error) {
        console.error('Error fetching habillement:', error);
      } else {
        setHabillement(data || []);
      }
      setLoading(false);
    };

    fetchHabillement();
  }, [personnelId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dotation Habillement</CardTitle>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un article
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habillement.length > 0 ? (
                habillement.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.article}</TableCell>
                    <TableCell>{item.taille || 'N/A'}</TableCell>
                    <TableCell>{item.code || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'En service' ? 'default' : 'secondary'}>
                        {item.status || 'N/A'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Aucun article d'habillement trouvé pour ce personnel.
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

export default Habillement;