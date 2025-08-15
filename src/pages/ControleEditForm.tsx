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

const controleSchema = z.object({
  resultat: z.enum(['conforme', 'non_conforme'], {
    required_error: "Le résultat du contrôle est requis.",
  }),
  observations: z.string().min(1, "Les observations sont requises."),
  actions_correctives: z.string().optional(),
  date_prochaine_verification: z.date({
    required_error: "La date de prochaine vérification est requise.",
  }),
});

type ControleFormData = z.infer<typeof controleSchema>;

export default function ControleEditForm() {
  const { id: controleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [controle, setControle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingControle, setLoadingControle] = useState(true);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ControleFormData>({
    resolver: zodResolver(controleSchema),
  });

  useEffect(() => {
    const fetchControle = async () => {
      if (!controleId) return;
      setLoadingControle(true);
      try {
        const { data, error } = await supabase
          .from('controles')
          .select('*, equipements(*)')
          .eq('id', controleId)
          .single();
        if (error) throw error;
        setControle(data);
        reset({
          resultat: data.resultat,
          observations: data.observations,
          actions_correctives: data.actions_correctives || '',
          date_prochaine_verification: new Date(data.date_prochaine_verification),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du contrôle:", error);
        showError("Impossible de charger les informations du contrôle.");
        navigate('/controles');
      } finally {
        setLoadingControle(false);
      }
    };
    fetchControle();
  }, [controleId, navigate, reset]);

  const onSubmit = async (data: ControleFormData) => {
    setIsLoading(true);
    try {
      if (!controleId || !controle) {
        showError("ID du contrôle manquant.");
        return;
      }

      const payload = {
        resultat: data.resultat,
        observations: data.observations,
        actions_correctives: data.actions_correctives,
        date_prochaine_verification: data.date_prochaine_verification.toISOString(),
      };

      const { error: updateError } = await supabase
        .from('controles')
        .update(payload)
        .eq('id', controleId);

      if (updateError) throw updateError;

      const { error: updateEquipementError } = await supabase
        .from('equipements')
        .update({ statut: data.resultat })
        .eq('id', controle.equipement_id);

      if (updateEquipementError) {
        console.error("Erreur lors de la mise à jour du statut de l'équipement:", updateEquipementError);
        showError("Le contrôle a été mis à jour, mais le statut de l'équipement n'a pas pu être mis à jour.");
      } else {
        showSuccess("Le contrôle a été mis à jour avec succès !");
      }
      
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

  if (!controle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Contrôle non trouvé</h2>
          <Link to="/controles">
            <Button>Retour aux contrôles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Modifier Contrôle | EPI Control</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Modifier le contrôle</CardTitle>
            <p className="text-gray-600">
              Pour l'équipement : {controle.equipements.type} {controle.equipements.marque} {controle.equipements.modele}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                {errors.resultat && <p className="text-sm text-red-500 flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.resultat.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => <Textarea id="observations" placeholder="Détails sur l'état de l'équipement, anomalies constatées..." {...field} />}
                />
                 {errors.observations && <p className="text-sm text-red-500 flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.observations.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actions_correctives">Actions correctives (si non conforme)</Label>
                <Controller
                  name="actions_correctives"
                  control={control}
                  render={({ field }) => <Textarea id="actions_correctives" placeholder="Mesures prises ou à prendre pour corriger les anomalies..." {...field} />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_prochaine_verification">Date de la prochaine vérification</Label>
                <Controller
                  name="date_prochaine_verification"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={fr}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                 {errors.date_prochaine_verification && <p className="text-sm text-red-500 flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.date_prochaine_verification.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Annuler</Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? "Mise à jour..." : "Mettre à jour le contrôle"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}