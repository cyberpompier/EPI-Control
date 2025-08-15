import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'react-hot-toast';

const equipmentSchema = z.object({
  numero_serie: z.string().min(1, "Le numéro de série est requis"),
  type: z.string().min(1, "Le type est requis"),
  marque: z.string().optional(),
  modele: z.string().optional(),
  statut: z.string().min(1, "Le statut est requis"),
  personnel_id: z.string().nullable().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface EquipmentFormProps {
  initialData?: any;
  scannedCode: string;
  onSave: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ initialData, scannedCode, onSave }) => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const isEditing = !!initialData;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      numero_serie: initialData?.numero_serie || scannedCode,
      type: initialData?.type || '',
      marque: initialData?.marque || '',
      modele: initialData?.modele || '',
      statut: initialData?.statut || 'en_attente',
      personnel_id: initialData?.personnel_id?.toString() || null,
    },
  });

  useEffect(() => {
    const fetchPersonnel = async () => {
      const { data, error } = await supabase.from('personnel').select('id, nom, prenom');
      if (error) {
        toast.error('Erreur lors de la récupération du personnel.');
      } else {
        setPersonnelList(data as Personnel[]);
      }
    };
    fetchPersonnel();
  }, []);

  const onSubmit = async (formData: EquipmentFormData) => {
    const dataToSubmit = {
        ...formData,
        personnel_id: formData.personnel_id ? parseInt(formData.personnel_id, 10) : null,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from('equipements')
        .update(dataToSubmit)
        .eq('id', initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('equipements')
        .insert([dataToSubmit]);
      error = insertError;
    }

    if (error) {
      toast.error(`Erreur: ${error.message}`);
    } else {
      toast.success(`Équipement ${isEditing ? 'mis à jour' : 'créé'} !`);
      onSave();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier l'équipement" : "Nouvel équipement"}</CardTitle>
        <CardDescription>
          {isEditing ? `Modification de l'équipement assigné à ${initialData.personnel?.prenom || ''} ${initialData.personnel?.nom || 'personne'}.` : "Cet équipement n'est pas dans la base de données. Veuillez remplir ses informations."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="numero_serie">Numéro de série (Code-barres)</Label>
            <Input id="numero_serie" {...register('numero_serie')} readOnly className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" {...register('type')} />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>
          <div>
            <Label htmlFor="marque">Marque</Label>
            <Input id="marque" {...register('marque')} />
          </div>
          <div>
            <Label htmlFor="modele">Modèle</Label>
            <Input id="modele" {...register('modele')} />
          </div>
          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select onValueChange={(value) => setValue('statut', value)} defaultValue={watch('statut')}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en_service">En service</SelectItem>
                <SelectItem value="en_maintenance">En maintenance</SelectItem>
                <SelectItem value="hors_service">Hors service</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="personnel_id">Personnel assigné</Label>
            <Select onValueChange={(value) => setValue('personnel_id', value)} defaultValue={watch('personnel_id') || ''}>
              <SelectTrigger><SelectValue placeholder="Assigner à un pompier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Non assigné</SelectItem>
                {personnelList.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.prenom} {p.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentForm;