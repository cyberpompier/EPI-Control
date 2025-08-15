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
import { EPI } from '@/types';
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

export default function ControleForm() {
  const { id: equipementId } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState<EPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEquipement, setLoadingEquipement] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm<ControleFormData>({
    resolver: zodResolver(controleSchema),
    defaultValues: {
      date_prochaine_verification: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    }
  });

  useEffect(() => {
    const fetchEquipement = async () => {
      if (!equipementId) return;
      setLoadingEquipement(true);
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
        showError("Impossible de charger les informations de l'équipement.");
        navigate('/equipements');
      } finally {
        setLoadingEquipement(false);
      }
    };
    fetchEquipement();
  }, [equipementId, navigate]);

  const onSubmit = async (data: ControleFormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError("Vous devez être connecté pour enregistrer un contrôle.");
        navigate('/login');
        return;
      }

      if (!equipementId) {
        showError("ID de l'équipement manquant.");
        return;
      }

      const payload = {
        equipement_id: equipementId,
        controleur_id: user.id,
        date_controle: new Date().toISOString(),
        resultat: data.resultat,
        observations: data.observations,
        actions_correctives: data.actions_correctives,
        date_prochaine_verification: data.date_prochaine_verification 
          ? data.date_prochaine_verification.toISOString()
          : undefined,
      };

      const { error: insertError } = await supabase.from('controles').insert([payload]);

      if (insertError) {
        throw insertError;
      }

      const { error: updateError } = await supabase
        .from('equipements')
        .update({ statut: data.resultat })
        .eq('id', equipementId);

      if (updateError) {
        console.error("Erreur lors de la mise à jour du statut de l'équipement:", updateError);
        showError("Le contrôle a été enregistré, mais le statut de l'équipement n'a pas pu être mis à jour.");
      } else {
        showSuccess("Le contrôle a été enregistré avec succès !");
      }
      
      navigate(`/equipements/${equipementId}`);

    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du contrôle:", error);
      showError(`Une erreur est survenue: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingEquipement) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  if (!equipement) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Équipement non trouvé</h2>
          <Link to="/equipements">
            <Button>Retour aux équipements</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Nouveau Contrôle | EPI Control</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer un nouveau contrôle</CardTitle>
            <p className="text-gray-600">
              Pour l'équipement : {equipement.type} {equipement.marque} {equipement.modele}
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
                {isLoading ? "Enregistrement..." : "Enregistrer le contrôle"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}