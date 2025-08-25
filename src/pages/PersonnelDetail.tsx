"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Calendar, Hash, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  caserne: string;
  grade: string;
  photo: string;
  matricule: string;
}

interface Equipment {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string;
  image: string;
}

const PersonnelDetail = () => {
  const { id } = useParams();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnelAndEquipment = async () => {
      if (!id) return;
      
      try {
        // Fetch personnel details
        const { data: personnelData, error: personnelError } = await supabase
          .from('personnel')
          .select('*')
          .eq('id', id)
          .single();

        if (personnelError) throw personnelError;

        // Fetch assigned equipment
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipements')
          .select('*')
          .eq('personnel_id', id);

        if (equipmentError) throw equipmentError;

        setPersonnel(personnelData);
        setEquipment(equipmentData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelAndEquipment();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!personnel) {
    return <div className="flex justify-center items-center h-screen">Personnel non trouvé</div>;
  }

  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'en_service': return 'default';
      case 'en_reparation': return 'destructive';
      case 'hors_service': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails du Personnel</h1>
        <Button>
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personnel Information Card */}
        <Card className="lg:col-span-1 relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={() => console.log('Edit personnel')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <CardHeader className="text-center">
            {personnel.photo ? (
              <img 
                src={personnel.photo} 
                alt={`${personnel.prenom} ${personnel.nom}`} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-500" />
              </div>
            )}
            <CardTitle>{personnel.prenom} {personnel.nom}</CardTitle>
            <CardDescription>{personnel.grade}</CardDescription>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Matricule:</span>
              </div>
              <p className="text-sm">{personnel.matricule || 'Non renseigné'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Caserne:</span>
              </div>
              <p className="text-sm">{personnel.caserne || 'Non renseigné'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
              </div>
              <p className="text-sm">{personnel.email || 'Non renseigné'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Assignment Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Équipements Assignés</CardTitle>
            <CardDescription>Liste des équipements assignés à ce personnel</CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun équipement assigné</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Assigner un équipement
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.marque} {item.modele}
                          </p>
                        </div>
                        <Badge variant={getBadgeVariant(item.statut)}>
                          {item.statut.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm">
                        <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>N° Série: {item.numero_serie}</span>
                      </div>
                      
                      {item.date_mise_en_service && (
                        <div className="mt-2 flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            Mise en service: {new Date(item.date_mise_en_service).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonnelDetail;