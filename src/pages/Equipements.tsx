import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Barcode } from 'lucide-react';

export default function Equipements() {
  return (
    <div className="p-4">
      {/* Boutons d'action */}
      <div className="flex justify-end space-x-2 mt-4 sm:mt-0">
        <Link to="/equipements/barcode">
          <Button className="bg-red-600 hover:bg-red-700">
            <Barcode className="h-4 w-4 mr-2" />
            Code barre
          </Button>
        </Link>
        <Link to="/equipements/nouveau">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un équipement
          </Button>
        </Link>
      </div>
      {/* Autres contenus de la page */}
    </div>
  );
}