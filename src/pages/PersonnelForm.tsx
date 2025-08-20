import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';

const personnelSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  grade: z.string().min(1, "Le grade est requis"),
  caserne: z.string().min(1, "La caserne est requise"),
  matricule: z.string().min(1, "Le matricule est requis"),
});

type PersonnelFormData = z.infer<typeof personnelSchema>;

export default function PersonnelForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PersonnelFormData>({
    nom: '',
    prenom: '',
    grade: '',
    caserne: '',
    matricule: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      personnelSchema.parse(formData);
      
      // Insert new personnel
      const { error } = await supabase
        .from('personnel')
        .insert([formData]);

      if (error) throw error;

      showSuccess('Pompier ajouté avec succès');
      navigate('/personnel');
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
        console.error('Error adding personnel:', error);
        showError('Erreur lors de l\'ajout du pompier');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout headerTitle="Ajouter un pompier">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouveau pompier</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className={errors.prenom ? 'border-red-500' : ''}
                />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Input
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Grade"
                className={errors.grade ? 'border-red-500' : ''}
              />
              {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="caserne">Caserne *</Label>
              <Input
                id="caserne"
                name="caserne"
                value={formData.caserne}
                onChange={handleChange}
                placeholder="Caserne"
                className={errors.caserne ? 'border-red-500' : ''}
              />
              {errors.caserne && <p className="text-red-500 text-sm">{errors.caserne}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule *</Label>
              <Input
                id="matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Matricule"
                className={errors.matricule ? 'border-red-500' : ''}
              />
              {errors.matricule && <p className="text-red-500 text-sm">{errors.matricule}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/personnel')}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le pompier'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
}