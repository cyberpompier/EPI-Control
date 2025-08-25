import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search } from 'lucide-react';

interface Equipment {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  image: string;
}

const Equipements = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const { data, error } = await supabase
        .from('equipements')
        .select('*');
      
      if (error) {
        console.error('Error fetching equipment:', error);
        return;
      }
      
      setEquipment(data || []);
      setFilteredEquipment(data || []);
    };
    
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEquipment(equipment);
    } else {
      const filtered = equipment.filter(item => 
        item.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  }, [searchTerm, equipment]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Équipements</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de série..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/equipements/barcode">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{item.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.marque} {item.modele}
              </p>
              <p className="text-sm mt-2">
                N° Série: {item.numero_serie}
              </p>
              <p className="text-sm mt-1">
                Statut: {item.statut}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Equipements;