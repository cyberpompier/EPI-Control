import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { showError } from '@/utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';

const formSchema = z.object({
  type: z.string().min(1, 'Le type est requis'),
  marque: z.string().optional(),
  modele: z.string().optional(),
  numero_serie: z.string().min(1, 'Le numéro de série est requis'),
  personnel_id: z.string().optional(),
  statut: z.string().min(1, 'Le statut est requis'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EquipementForm() {
  const [pompiers, setPompiers] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPompiers, setLoadingPompiers] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      marque: '',
      modele: '',
      numero_serie: '',
      personnel_id: '',
      statut: 'en_attente',
    },
  });

  useEffect(() => {
    fetchPompiers();
    
    // Définir automatiquement les dates
    const today = new Date();
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(today.getFullYear() + 10);
    
    // On ne met pas ces valeurs dans le formulaire car elles ne sont pas affichées
    // mais elles seront utilisées lors de la soumission
  }, []);

  const fetchPompiers = async () => {
    try {
      setLoadingPompiers(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('id, nom, prenom')
        .order('nom');

      if (error) throw error;

      const options = data.map(pompier => ({
        value: pompier.id.toString(),
        label: `${pompier.nom} ${pompier.prenom}`,
      }));

      setPompiers(options);
    } catch (error) {
      showError('Erreur lors du chargement des pompiers');
      console.error('Error fetching pompiers:', error);
    } finally {
      setLoadingPompiers(false);
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Calculer automatiquement les dates
      const today = new Date();
      const tenYearsFromNow = new Date();
      tenYearsFromNow.setFullYear(today.getFullYear() + 10);
      
      // Formater les dates au format YYYY-MM-DD
      const formattedDateMiseEnService = today.toISOString().split('T')[0];
      const formattedDateFinVie = tenYearsFromNow.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('equipements')
        .insert({
          ...values,
          personnel_id: values.personnel_id ? parseInt(values.personnel_id) : null,
          date_mise_en_service: formattedDateMiseEnService,
          date_fin_vie: formattedDateFinVie,
        });

      if (error) throw error;

      toast({
        title: 'Équipement créé',
        description: "L'équipement a été créé avec succès.",
      });
      
      navigate('/equipements');
    } catch (error) {
      showError("Erreur lors de la création de l'équipement");
      console.error('Error creating equipement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout>
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvel équipement</CardTitle>
          <CardDescription>
            Ajoutez un nouvel équipement de protection individuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'équipement</FormLabel>
                      <FormControl>
                        <Input placeholder="Casque, gants, bottes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <FormControl>
                        <Input placeholder="Fabricant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modele"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input placeholder="Modèle spécifique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero_serie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de série</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro d'identification unique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personnel_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assigné à</FormLabel>
                      <FormControl>
                        <Combobox
                          options={pompiers}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          placeholder={loadingPompiers ? "Chargement..." : "Sélectionnez un membre"}
                          searchPlaceholder="Rechercher un pompier..."
                          emptyMessage="Aucun pompier trouvé"
                          disabled={loadingPompiers}
                        />
                      </FormControl>
                      <FormDescription>
                        Sélectionnez le pompier auquel cet équipement est assigné
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="en_service">En service</option>
                          <option value="en_reparation">En réparation</option>
                          <option value="hors_service">Hors service</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/equipements')}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer équipement'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
}