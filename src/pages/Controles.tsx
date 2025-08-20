import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';

interface Controle {
  id: string;
  date_controle: string;
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  date_prochaine_verification: string;
  equipements: {
    id: string;
    type: string;
    marque: string;
    modele: string;
  } | null;
  profiles: {
    nom: string;
    prenom: string;
  } | null;
}

export default function ControlesPage() {
  const [controles, setControles] = useState<Controle[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchControles = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const equipmentId = searchParams.get('equipement');
        
        // Construire la requête de base
        let query = supabase
          .from('controles')
          .select(`
            id,
            date_controle,
            resultat,
            date_prochaine_verification,
            equipements ( id, type, marque, modele ),
            profiles ( nom, prenom )
          `)
          .order('date_controle', { ascending: false });
          
        // Appliquer le filtre si le paramètre d'équipement est présent
        if (equipmentId) {
          query = query.eq('equipement_id', equipmentId);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        // Correction du cast en passant d'abord par unknown
        setControles(data as unknown as Controle[] || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des contrôles:", error);
        showError("Impossible de charger les contrôles.");
      } finally {
        setLoading(false);
      }
    };

    fetchControles();
  }, [location.search]);

  const getResultBadge = (resultat: string) => {
    switch (resultat) {
      case 'conforme':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Conforme</Badge>;
      case 'non_conforme':
        return <Badge variant="destructive">Non Conforme</Badge>;
      case 'en_attente':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">En attente</Badge>;
      default:
        return <Badge variant="outline">{resultat}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Liste des Contrôles | EPI Control</title>
      </Helmet>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Liste des Contrôles</h1>
          <p className="text-gray-600">Consultez et gérez l'historique des contrôles d'équipements.</p>
        </div>
        <Link to="/equipements">
          <Button className="bg-red-600 hover:bg-red-700 mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contrôle
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Contrôleur</TableHead>
                <TableHead>Date du contrôle</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead>Prochaine vérification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controles.length > 0 ? (
                controles.map((controle) => (
                  <TableRow key={controle.id}>
                    <TableCell>
                      {controle.equipements 
                        ? `${controle.equipements.marque} ${controle.equipements.modele} (${controle.equipements.type})`
                        : 'Équipement non trouvé'}
                    </TableCell>
                    <TableCell>
                      {controle.profiles 
                        ? `${controle.profiles.prenom} ${controle.profiles.nom}`
                        : 'Contrôleur inconnu'}
                    </TableCell>
                    <TableCell>{formatDate(controle.date_controle)}</TableCell>
                    <TableCell>{getResultBadge(controle.resultat)}</TableCell>
                    <TableCell>{formatDate(controle.date_prochaine_verification)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/controles/${controle.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/controles/${controle.id}/modifier`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Aucun contrôle trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}