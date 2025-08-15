import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/components/auth/AuthProvider';

const formSchema = z.object({
  resultat: z.enum(['conforme', 'non_conforme'], { required_error: "Le résultat est requis."}),
  observations: z.string().min(1, "Les observations sont requises."),
  actions_correctives: z.string().optional(),
  date_prochaine_verification: z.date({
    required_error: "La date de prochaine vérification est requise.",
  }),
});

export default function ControleEquipement() {
  const { equipementId } = useParams<{ equipementId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [equipement, setEquipement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observations: "",
      actions_correctives: "",
    },
  });

  useEffect(() => {
    const fetchEquipement = async () => {
      if (!equipementId) return;
      try {
        const { data, error } = await supabase
          .from('equipements')
          .select('*')
          .eq('id', equipementId)
          .single();
        if (error) throw error;
        setEquipement(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'équipement:", error);
        showError("Impossible de charger les détails de l'équipement.");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipement();
  }, [equipementId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!equipementId || !session?.user.id) {
        showError("Impossible de soumettre le formulaire. Données manquantes.");
        return;
    }
    try {
      const { error } = await supabase.from('controles').insert([
        {
          equipement_id: equipementId,
          controleur_id: session.user.id,
          resultat: values.resultat,
          observations: values.observations,
          actions_correctives: values.actions_correctives,
          date_prochaine_verification: values.date_prochaine_verification.toISOString(),
        },
      ]);
      if (error) throw error;

      const newStatus = values.resultat === 'conforme' ? 'conforme' : 'non_conforme';
      const { error: updateError } = await supabase
        .from('equipements')
        .update({ statut: newStatus })
        .eq('id', equipementId);
      
      if (updateError) throw updateError;

      showSuccess('Contrôle enregistré avec succès !');
      navigate(`/equipements/${equipementId}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contrôle:", error);
      showError("Une erreur est survenue lors de l'enregistrement du contrôle.");
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div></div></Layout>;
  }

  if (!equipement) {
    return <Layout><p className="text-center">Équipement non trouvé.</p></Layout>;
  }

  return (
    <Layout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nouveau Contrôle pour {equipement.type} - {equipement.numero_serie}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="resultat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Résultat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le résultat du contrôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="conforme">Conforme</SelectItem>
                        <SelectItem value="non_conforme">Non Conforme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observations</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez vos observations..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actions_correctives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actions Correctives (si nécessaire)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez les actions correctives..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_prochaine_verification"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de la prochaine vérification</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: require('date-fns/locale/fr') })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer le Contrôle'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}