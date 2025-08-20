import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as z from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const equipementSchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  marque: z.string().optional(),
  modele: z.string().optional(),
  numero_serie: z.string().min(1, "Le numéro de série est requis"),
  date_mise_en_service: z.string().min(1, "La date de mise en service est requise"),
  date_fin_vie: z.string().optional().nullable(),
  statut: z.enum(['en_service', 'en_maintenance', 'reforme']),
  personnel_id: z.string().optional().nullable(),
});

type EquipementFormData = z.infer<typeof equipementSchema>;

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

export default function EquipementForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<EquipementFormData>({
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: format(new Date(), 'yyyy-MM-dd'),
    date_fin_vie: null,
    statut: 'en_service',
    personnel_id: null,
  });
  
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPersonnelList();
    if (isEdit && id) {
      fetchEquipementDetails(id);
    }
  }, [isEdit, id]);

  const fetchPersonnelList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('personnel')
      .select('id, nom, prenom')
      .order('nom');

    if (error) {
      console.error('Error fetching personnel:', error);
    } else {
      setPersonnelList(data || []);
    }
    setLoading(false);
  };

  const fetchEquipementDetails = async (equipementId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select('*')
      .eq('id', equipementId)
      .single();

    if (error) {
      showError('Erreur lors du chargement des détails de l\'équipement');
      console.error(error);
      navigate('/equipements');
    } else if (data) {
      setFormData({
        type: data.type || '',
        marque: data.marque || '',
        modele: data.modele || '',
        numero_serie: data.numero_serie || '',
        date_mise_en_service: data.date_mise_en_service || '',
        date_fin_vie: data.date_fin_vie || null,
        statut: data.statut || 'en_service',
        personnel_id: data.personnel_id ? data.personnel_id.toString() : null,
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = equipementSchema.parse({
        ...formData,
        personnel_id: formData.personnel_id || null,
      });
      
      if (isEdit && id) {
        // Update existing equipment
        const { error } = await supabase
          .from('equipements')
          .update({
            ...validatedData,
            personnel_id: validatedData.personnel_id ? parseInt(validatedData.personnel_id) : null,
          })
          .eq('id', id);

        if (error) throw error;
        showSuccess('Équipement mis à jour avec succès');
      } else {
        // Insert new equipment
        const { error } = await supabase
          .from('equipements')
          .insert([{
            ...validatedData,
            personnel_id: validatedData.personnel_id ? parseInt(validatedData.personnel_id) : null,
          }]);

        if (error) throw error;
        showSuccess('Équipement ajouté avec succès');
      }

      navigate('/equipements');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error saving equipement:', error);
        showError(`Erreur lors ${isEdit ? 'de la mise à jour' : 'de l\'ajout'} de l'équipement`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout headerTitle={isEdit ? "Modification d'équipement" : "Ajout d'équipement"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={isEdit ? "Modification d'équipement" : "Ajout d'équipement"}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEdit ? "Modifier l'équipement" : "Ajouter un nouvel équipement"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type d'équipement"
                className={errors.type ? 'border-red-500' : ''}
              />
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marque">Marque</Label>
                <Input
                  id="marque"
                  name="marque"
                  value={formData.marque || ''}
                  onChange={handleChange}
                  placeholder="Marque"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modele">Modèle</Label>
                <Input
                  id="modele"
                  name="modele"
                  value={formData.modele || ''}
                  onChange={handleChange}
                  placeholder="Modèle"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numero_serie">Numéro de série *</Label>
              <Input
                id="numero_serie"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                placeholder="Numéro de série"
                className={errors.numero_serie ? 'border-red-500' : ''}
              />
              {errors.numero_serie && <p className="text-red-500 text-sm">{errors.numero_serie}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_mise_en_service">Date de mise en service *</Label>
                <Input
                  id="date_mise_en_service"
                  name="date_mise_en_service"
                  type="date"
                  value={formData.date_mise_en_service}
                  onChange={handleChange}
                  className={errors.date_mise_en_service ? 'border-red-500' : ''}
                />
                {errors.date_mise_en_service && <p className="text-red-500 text-sm">{errors.date_mise_en_service}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_fin_vie">Date de fin de vie</Label>
                <Input
                  id="date_fin_vie"
                  name="date_fin_vie"
                  type="date"
                  value={formData.date_fin_vie || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select 
                name="statut" 
                value={formData.statut} 
                onValueChange={(value) => handleSelectChange('statut', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_service">En service</SelectItem>
                  <SelectItem value="en_maintenance">En maintenance</SelectItem>
                  <SelectItem value="reforme">Réformé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personnel_id">Assigné à</Label>
              <Select 
                name="personnel_id" 
                value={formData.personnel_id || ''} 
                onValueChange={(value) => handleSelectChange('personnel_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pompier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non assigné</SelectItem>
                  {personnelList.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.prenom} {person.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/equipements')}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Ajouter')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
}