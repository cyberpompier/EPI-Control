import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as z from 'zod';

// Define the schema using zod
const controleSchema = z.object({
  equipement_id: z.string().min(1, "L'équipement est requis"),
  date_controle: z.string().min(1, "La date de contrôle est requise"),
  resultat: z.enum(['conforme', 'non_conforme'], {
    required_error: "Le résultat est requis"
  }),
  observations: z.string().optional(),
  actions_correctives: z.string().optional(),
  date_prochaine_verification: z.string().optional().nullable(),
});

type ControleFormData = z.infer<typeof controleSchema>;

interface Equipement {
  id: number;
  type: string;
  numero_serie: string;
  personnel: {
    id: number;
    nom: string;
    prenom: string;
  } | null;
}

export default function ControleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<ControleFormData>({
    equipement_id: '',
    date_controle: format(new Date(), 'yyyy-MM-dd'),
    resultat: 'conforme',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: null,
  });
  
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipements();
    if (isEdit && id) {
      fetchControleDetails(id);
    }
  }, [isEdit, id]);

  const fetchEquipements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        id,
        type,
        numero_serie,
        personnel (
          id,
          nom,
          prenom
        )
      `)
      .order('type');

    if (error) {
      console.error('Error fetching equipements:', error);
    } else {
      // Extract personnel data correctly
      const transformedData = data?.map(item => ({
        id: item.id,
        type: item.type,
        numero_serie: item.numero_serie,
        personnel: item.personnel && item.personnel.length > 0 ? item.personnel[0] : null
      })) || [];
      
      setEquipements(transformedData);
    }
    setLoading(false);
  };

  const fetchControleDetails = async (controleId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('controles')
      .select('*')
      .eq('id', controleId)
      .single();

    if (error) {
      showError('Erreur lors du chargement des détails du contrôle');
      console.error(error);
      navigate('/controles');
    } else if (data) {
      setFormData({
        equipement_id: data.equipement_id?.toString() || '',
        date_controle: data.date_controle || format(new Date(), 'yyyy-MM-dd'),
        resultat: data.resultat || 'conforme',
        observations: data.observations || '',
        actions_correctives: data.actions_correctives || '',
        date_prochaine_verification: data.date_prochaine_verification || null,
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
      // Validate form data using zod
      const validatedData = controleSchema.parse(formData);
      
      let error;
      if (isEdit && id) {
        const { error: updateError } = await supabase
          .from('controles')
          .update(validatedData)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('controles')
          .insert([validatedData]);
        error = insertError;
      }

      if (error) throw error;
      
      showSuccess(`Contrôle ${isEdit ? 'mis à jour' : 'ajouté'} avec succès`);
      navigate('/controles');
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
        console.error('Error saving controle:', error);
        showError(`Erreur lors ${isEdit ? 'de la mise à jour' : 'de l\'ajout'} du contrôle`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout headerTitle={isEdit ? "Modification de contrôle" : "Ajout de contrôle"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={isEdit ? "Modification de contrôle" : "Ajout de contrôle"}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEdit ? "Modifier le contrôle" : "Ajouter un nouveau contrôle"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipement_id">Équipement *</Label>
              <Select 
                name="equipement_id" 
                value={formData.equipement_id} 
                onValueChange={(value) => handleSelectChange('equipement_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {equipements.map((equipement) => (
                    <SelectItem key={equipement.id} value={equipement.id.toString()}>
                      {equipement.type} - {equipement.numero_serie}
                      {equipement.personnel && ` (${equipement.personnel.prenom} ${equipement.personnel.nom})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.equipement_id && <p className="text-red-500 text-sm">{errors.equipement_id}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_controle">Date de contrôle *</Label>
              <Input
                id="date_controle"
                name="date_controle"
                type="date"
                value={formData.date_controle}
                onChange={handleChange}
                className={errors.date_controle ? 'border-red-500' : ''}
              />
              {errors.date_controle && <p className="text-red-500 text-sm">{errors.date_controle}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resultat">Résultat *</Label>
              <Select 
                name="resultat" 
                value={formData.resultat} 
                onValueChange={(value) => handleSelectChange('resultat', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un résultat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conforme">Conforme</SelectItem>
                  <SelectItem value="non_conforme">Non conforme</SelectItem>
                </SelectContent>
              </Select>
              {errors.resultat && <p className="text-red-500 text-sm">{errors.resultat}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations || ''}
                onChange={handleChange}
                placeholder="Observations sur l'état de l'équipement"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actions_correctives">Actions correctives</Label>
              <Textarea
                id="actions_correctives"
                name="actions_correctives"
                value={formData.actions_correctives || ''}
                onChange={handleChange}
                placeholder="Actions à entreprendre si non conforme"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_prochaine_verification">Date de prochaine vérification</Label>
              <Input
                id="date_prochaine_verification"
                name="date_prochaine_verification"
                type="date"
                value={formData.date_prochaine_verification || ''}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/controles')}>
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