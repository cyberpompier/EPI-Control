import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const controleEditSchema = z.object({
  resultat: z.enum(['conforme', 'non_conforme'], {
    required_error: "Le résultat du contrôle est requis.",
  }),
  observations: z.string().min(1, "Les observations sont requises."),
  actions_correctives: z.string().optional(),
  date_prochaine_verification: z.date({
    required_error: "La date de prochaine vérification est requise.",
  }),
});

type ControleEditFormData = z.infer<typeof controleEditSchema>;

export default function ControleEdit() {
  const { id: controleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingControle, setLoadingControle] = useState(true);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ControleEditFormData>({
    resolver: zodResolver(controleEditSchema),
    defaultValues: {
      resultat: 'conforme',
      observations: '',
      actions_correctives: '',
      date_prochaine_verification: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    }
  });

  useEffect(() => {
    const fetchControle = async () => {
      if (!controleId) {
        console.error("Aucun ID de contrôle fourni.");
        navigate('/controles');
        return;
      }
      setLoadingControle(true);
      try {
        const { data, error } = await supabase
          .from('controles')
          .select('*, date_prochaine_verification')
          .eq('id', controleId)
          .single();
        if (error) throw error;
        if (data && data.date_prochaine_verification) {
          reset({
            resultat: data.resultat,
            observations: data.observations,
            actions_correctives: data.actions_correctives || '',
            date_prochaine_verification: new Date(data.date_prochaine_verification),
          });
        } else {
          console.error("Aucune donnée trouvée pour ce contrôle.");
          showError("Aucune donnée trouvée.");
          navigate('/controles');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du contrôle:", error);
        showError("Impossible de charger les informations du contrôle.");
        navigate('/controles');
      } finally {
        setLoadingControle(false);
      }
    };
    fetchControle();
  }, [controleId, reset, navigate]);

  const onSubmit = async (data: ControleEditFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('controles')
        .update({
          resultat: data.resultat,
          observations: data.observations,
          actions_correctives: data.actions_correctives,
          date_prochaine_verification: format(data.date_prochaine_verification, 'yyyy-MM-dd'),
        })
        .eq('id', controleId);

      if (error) throw error;
      showSuccess("Contrôle mis à jour avec succès !");
      navigate(`/controles/${controleId}`);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du contrôle:", error);
      showError(`Une erreur est survenue: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingControle) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Modifier le contrôle | EPI Control</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Modifier le contrôle</CardTitle>
            <p className="text-gray-600">
              Vous modifiez le contrôle existant.
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resultat">Résultat du contrôle</Label>
                <Controller
                  name="resultat"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="resultat">
                        <SelectValue placeholder="Sélectionner un résultat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conforme">Conforme</SelectItem>
                        <SelectItem value="non_conforme">Non Conforme</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.resultat && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.resultat.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => <Textarea id="observations" placeholder="Modifier les observations..." {...field} />}
                />
                {errors.observations && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.observations.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actions_correctives">Actions correctives (si non conforme)</Label>
                <Controller
                  name="actions_correctives"
                  control={control}
                  render={({ field }) => <Textarea id="actions_correctives" placeholder="Modifier les actions correctives, le cas échéant..." {...field} />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_prochaine_verification">Date du prochain contrôle</Label>
                <Controller
                  name="date_prochaine_verification"
                  control={control}
                  render={({ field }) => {
                    const dateValue = field.value ? (field.value instanceof Date ? field.value : new Date(field.value)) : null;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full pl-3 text-left font-normal">
                            {dateValue ? format(dateValue, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.date_prochaine_verification && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.date_prochaine_verification.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Annuler</Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? "Mise à jour..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}