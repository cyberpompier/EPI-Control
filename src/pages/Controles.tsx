import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface Equipement {
  marque?: string | null;
  modele?: string | null;
}

interface Controle {
  id: string;
  equipements: Equipement | null;
  // ... ajouter d'autres champs si nécessaire
}

const Controles: React.FC = () => {
  const [controles, setControles] = useState<Controle[]>([]);

  useEffect(() => {
    const fetchControles = async () => {
      const { data, error } = await supabase.from('controles').select('*');
      if (error) {
        showError("Erreur lors de la récupération des contrôles");
      } else {
        setControles(data || []);
      }
    };
    fetchControles();
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Liste des contrôles</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipement</TableHead>
              {/* Ajouter d'autres en-têtes si nécessaire */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {controles.map((controle) => (
              <TableRow key={controle.id}>
                <TableCell className="font-medium">
                  {controle.equipements ? `${controle.equipements.marque} ${controle.equipements.modele}` : 'Équipement non trouvé'}
                </TableCell>
                {/* Ajouter d'autres cellules si nécessaire */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Controles;