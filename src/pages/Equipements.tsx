"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Equipements = () => {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipements(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des équipements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('equipements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the list
      fetchEquipements();
      
      toast({
        title: 'Succès',
        description: 'Équipement supprimé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredEquipements = equipements.filter(equipement =>
    equipement.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipement.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipement.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipement.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header responsive avec titre et boutons */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold">Liste des équipements</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/equipements/barcode">
              <Button variant="outline" className="w-full sm:w-auto">
                Scanner un code-barre
              </Button>
            </Link>
            <Link to="/equipements/new">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un équipement
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un équipement..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des équipements */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>N° Série</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun équipement trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredEquipements.map((equipement) => (
                <TableRow key={equipement.id}>
                  <TableCell>
                    {equipement.image ? (
                      <img 
                        src={equipement.image} 
                        alt={equipement.type} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center">Pas d'image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{equipement.type}</TableCell>
                  <TableCell>{equipement.marque || '-'}</TableCell>
                  <TableCell>{equipement.modele || '-'}</TableCell>
                  <TableCell>{equipement.numero_serie}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      equipement.statut === 'en_service' ? 'bg-green-100 text-green-800' :
                      equipement.statut === 'en_reparation' ? 'bg-yellow-100 text-yellow-800' :
                      equipement.statut === 'hors_service' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {equipement.statut === 'en_service' ? 'En service' :
                       equipement.statut === 'en_reparation' ? 'En réparation' :
                       equipement.statut === 'hors_service' ? 'Hors service' :
                       'En attente'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/equipements/${equipement.id}`)}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/equipements/${equipement.id}/edit`)}
                      >
                        Modifier
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Equipements;