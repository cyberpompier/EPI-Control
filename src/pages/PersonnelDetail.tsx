"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Hash, User, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EPICard from '@/components/EPICard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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
  date_fin_vie: string;
  image: string;
}

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersonnel, setEditedPersonnel] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        setEditedPersonnel(personnelData);
        setEquipment(equipmentData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelAndEquipment();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPersonnel(personnel);
  };

  const handleSave = async () => {
    if (!editedPersonnel) return;
    
    try {
      const { error } = await supabase
        .from('personnel')
        .update({
          nom: editedPersonnel.nom,
          prenom: editedPersonnel.prenom,
          email: editedPersonnel.email,
          caserne: editedPersonnel.caserne,
          grade: editedPersonnel.grade,
          matricule: editedPersonnel.matricule
        })
        .eq('id', editedPersonnel.id);

      if (error) throw error;

      setPersonnel(editedPersonnel);
      setIsEditing(false);
      toast.success('Informations mises à jour avec succès');
    } catch (error) {
      console.error('Error updating personnel:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleInputChange = (field: keyof Personnel, value: string) => {
    if (editedPersonnel) {
      setEditedPersonnel({
        ...editedPersonnel,
        [field]: value
      });
    }
  };

  const filteredEquipment = equipment.filter(item =>
    item.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!personnel) {
    return <div className="flex justify-center items-center h-screen">Personnel non trouvé</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails du Personnel</h1>
        {!isEditing && (
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personnel Information Card */}
        <Card className="lg:col-span-1 relative">
          <CardHeader className="text-center">
            {personnel.photo ? (
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={personnel.photo} alt={`${personnel.prenom} ${personnel.nom}`} />
                <AvatarFallback>{personnel.prenom.charAt(0)}{personnel.nom.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-500" />
              </div>
            )}
            <CardTitle>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedPersonnel?.prenom || ''}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Prénom"
                  />
                  <Input
                    value={editedPersonnel?.nom || ''}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom"
                  />
                </div>
              ) : (
                `${personnel.prenom} ${personnel.nom}`
              )}
            </CardTitle>
            <CardDescription>
              {isEditing ? (
                <Select 
                  value={editedPersonnel?.grade || ''} 
                  onValueChange={(value) => handleInputChange('grade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pompier">Pompier</SelectItem>
                    <SelectItem value="Caporal">Caporal</SelectItem>
                    <SelectItem value="Caporal-chef">Caporal-chef</SelectItem>
                    <SelectItem value="Sergent">Sergent</SelectItem>
                    <SelectItem value="Sergent-chef">Sergent-chef</SelectItem>
                    <SelectItem value="Adjudant">Adjudant</SelectItem>
                    <SelectItem value="Adjudant-chef">Adjudant-chef</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                    <SelectItem value="Capitaine">Capitaine</SelectItem>
                    <SelectItem value="Commandant">Commandant</SelectItem>
                    <SelectItem value="Lieutenant-colonel">Lieutenant-colonel</SelectItem>
                    <SelectItem value="Colonel">Colonel</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                personnel.grade
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    value={editedPersonnel?.matricule || ''}
                    onChange={(e) => handleInputChange('matricule', e.target.value)}
                    placeholder="Matricule"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caserne">Caserne</Label>
                  <Input
                    id="caserne"
                    value={editedPersonnel?.caserne || ''}
                    onChange={(e) => handleInputChange('caserne', e.target.value)}
                    placeholder="Caserne"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedPersonnel?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    Enregistrer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Matricule:</span>
                  </div>
                  <p className="text-sm">{personnel.matricule || 'Non renseigné'}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Caserne:</span>
                  </div>
                  <p className="text-sm">{personnel.caserne || 'Non renseigné'}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                  </div>
                  <p className="text-sm">{personnel.email || 'Non renseigné'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Equipment Assignment Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Équipements Assignés</CardTitle>
            <CardDescription>Liste des équipements assignés à ce personnel</CardDescription>
            <div className="relative pt-4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro de série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
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
            ) : filteredEquipment.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun équipement ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEquipment.map((item) => (
                  <EPICard
                    key={item.id}
                    id={item.id}
                    type={item.type}
                    marque={item.marque}
                    modele={item.modele}
                    numero_serie={item.numero_serie}
                    statut={item.statut}
                    date_mise_en_service={item.date_mise_en_service}
                    date_fin_vie={item.date_fin_vie}
                    image={item.image}
                  />
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