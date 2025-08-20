import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ArrowLeft, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/utils/toast';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Pompier } from '@/types/index';
import Barcode from 'react-barcode';

const formSchema = z.object({
  type: z.enum([
    'Casque F1',
    'Casque F2',
    'Parka',
    'Blouson Softshell',
    'Bottes à Lacets',
    'Gant de protection',
    'Pantalon TSI',
    'Veste TSI',
    'Veste de protection',
    'Surpantalon',
  ], {
    required_error: "Veuillez sélectionner un type d'équipement",
  }),
  marque: z.string().min(2, { message: "La marque doit contenir au moins 2 caractères" }),
  modele: z.string().min(2, { message: "Le modèle doit contenir au moins 2 caractères" }),
  numero_serie: z.string().min(3, { message: "Le numéro de série doit contenir au moins 3 caractères" }),
  date_mise_en_service: z.date({ required_error: "Veuillez sélectionner une date de mise en service" }),
  date_fin_vie: z.date({ required_error: "Veuillez sélectionner une date de fin de vie" }),
  personnel_id: z.string().min(1, { message: "Veuillez sélectionner un membre du personnel" }),
});

export default function EquipementForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barcode = searchParams.get("barcode") || "";
  const [isLoading, setIsLoading] = useState(false);
  const [pompiers, setPompiers] = useState<Pompier[]>([]);
  const [loadingPompiers, setLoadingPompiers] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'Casque F1',
      marque: '',
      modele: '',
      numero_serie: barcode,
      personnel_id: '',
    },
  });

  useEffect(() => {
    // Mise à jour du champ numero_serie si un code barre est présent dans l'URL
    if (barcode) {
      form.setValue("numero_serie", barcode);
    }
  }, [barcode, form]);

  useEffect(() => {
    const fetchPompiers = async () => {
      setLoadingPompiers(true);
      try {
        const { data, error } = await supabase.from('personnel').select('*');
        if (error) throw error;
        setPompiers(data || []);
      } catch (error: any) {
        showError(`Erreur lors du chargement du personnel: ${error.message}`);
        console.error('Erreur lors de la récupération des pompiers:', error);
      } finally {
        setLoadingPompiers(false);
      }
    };
    fetchPompiers();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('equipements').insert([
        {
          type: values.type,
          marque: values.marque,
          modele: values.modele,
          numero_serie: values.numero_serie,
          date_mise_en_service: format(values.date_mise_en_service, "yyyy-MM-dd"),
          date_fin_vie: format(values.date_fin_vie, "yyyy-MM-dd"),
          personnel_id: parseInt(values.personnel_id),
          statut: 'en_attente',
        }
      ]);
      if (error) throw error;
      
      showSuccess('Équipement ajouté avec succès');
      navigate('/equipements');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'équipement:', error);
      showError(`Erreur lors de l'ajout de l'équipement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    if (!type) return '🛡️';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('casque')) return '🪖';
    if (lowerType.includes('veste') || lowerType.includes('parka') || lowerType.includes('blouson')) return '🧥';
    if (lowerType.includes('pantalon')) return '👖';
    if (lowerType.includes('gant')) return '🧤';
    if (lowerType.includes('botte')) return '👢';
    return '🛡️';
  };

  return (
    <Layout>
      <Helmet>
        <title>Nouvel équipement | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/equipements" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux équipements
        </Link>
        
        <h1 className="text-2xl font-bold">Nouvel équipement</h1>
        <p className="text-gray-600">Ajouter un nouvel équipement de protection individuelle</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Informations de l'équipement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'équipement</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Casque F1">Casque F1</SelectItem>
                              <SelectItem value="Casque F2">Casque F2</SelectItem>
                              <SelectItem value="Parka">Parka</SelectItem>
                              <SelectItem value="Blouson Softshell">Blouson Softshell</SelectItem>
                              <SelectItem value="Bottes à Lacets">Bottes à Lacets</SelectItem>
                              <SelectItem value="Gant de protection">Gant de protection</SelectItem>
                              <SelectItem value="Pantalon TSI">Pantalon TSI</SelectItem>
                              <SelectItem value="Veste TSI">Veste TSI</SelectItem>
                              <SelectItem value="Veste de protection">Veste de protection</SelectItem>
                              <SelectItem value="Surpantalon">Surpantalon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personnel_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membre du personnel assigné</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingPompiers ? "Chargement..." : "Sélectionnez un membre"} />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingPompiers ? (
                                <SelectItem value="__loading__" disabled>Chargement...</SelectItem>
                              ) : pompiers.length > 0 ? (
                                pompiers.map((pompier) => (
                                  <SelectItem key={pompier.id} value={String(pompier.id)}>
                                    {`${pompier.grade || ''} ${pompier.prenom || ''} ${pompier.nom || ''}`.trim()}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="__none__" disabled>Aucun membre trouvé</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marque"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marque</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: MSA, Bristol, Haix..." {...field} />
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
                            <Input placeholder="Ex: F1 XF, ErgoTech Action..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="numero_serie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de série</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl className="flex-1">
                            <Input placeholder="Numéro de série unique" {...field} />
                          </FormControl>
                          {field.value && (
                            <div className="w-1/3">
                              <Barcode value={String(field.value)} />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_mise_en_service"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de mise en service</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionnez une date</span>
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
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_fin_vie"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de fin de vie</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionnez une date</span>
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
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="outline" type="button" onClick={() => navigate('/equipements')}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                      {isLoading ? "Enregistrement..." : "Enregistrer l'équipement"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getTypeIcon(form.watch('type'))}
                </div>
                <h3 className="font-medium text-lg">
                  {form.watch('marque') || 'Marque'} {form.watch('modele') || 'Modèle'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {form.watch('numero_serie') || 'N° de série'}
                </p>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600 mb-2">Assigné à :</p>
                  <p className="font-medium">
                    {form.watch('personnel_id') ? 
                      pompiers.find(p => String(p.id) === form.watch('personnel_id'))?.prenom + ' ' +
                      pompiers.find(p => String(p.id) === form.watch('personnel_id'))?.nom
                      : 'Aucun membre sélectionné'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}