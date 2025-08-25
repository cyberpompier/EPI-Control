"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'react-hot-toast';

const PersonnelTable = ({ onEdit }) => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom');

      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement du personnel');
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce pompier ?')) return;

    try {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPersonnel(personnel.filter(p => p.id !== id));
      toast.success('Pompier supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du pompier');
      console.error('Error deleting personnel:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Matricule</TableHead>
            <TableHead>Caserne</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-medium">{person.nom}</TableCell>
              <TableCell>{person.prenom}</TableCell>
              <TableCell>{person.matricule}</TableCell>
              <TableCell>{person.caserne}</TableCell>
              <TableCell>{person.grade}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(person)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(person.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PersonnelTable;