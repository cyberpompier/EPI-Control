import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Habillement from './Habillement';

type Pompier = {
  id: number;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  caserne: string | null;
  grade: string | null;
  photo: string | null;
  matricule: string | null;
};

const PersonnelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pompier, setPompier] = useState<Pompier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPompier = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching pompier details:', error);
      } else {
        setPompier(data);
      }
      setLoading(false);
    };

    fetchPompier();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pompier) {
    return <div className="container mx-auto p-4">Pompier non trouvé.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
              <AvatarFallback className="text-xl">{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{pompier.prenom} {pompier.nom}</CardTitle>
            <p className="text-muted-foreground">{pompier.grade}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Matricule:</strong> {pompier.matricule || 'N/A'}</div>
            <div><strong>Email:</strong> {pompier.email || 'N/A'}</div>
            <div><strong>Caserne:</strong> {pompier.caserne || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="habillement" className="mt-6">
        <TabsList>
          <TabsTrigger value="habillement">Habillement</TabsTrigger>
          <TabsTrigger value="controles">Contrôles EPI</TabsTrigger>
        </TabsList>
        <TabsContent value="habillement">
          <Habillement personnelId={pompier.id} />
        </TabsContent>
        <TabsContent value="controles">
          <p>Les contrôles EPI seront bientôt disponibles ici.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonnelDetail;