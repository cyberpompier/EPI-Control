import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

const formSchema = z.object({
  type: z.enum(['casque', 'veste', 'surpantalon', 'gants', 'rangers', 'autre'], {
    required_error: "Veuillez sélectionner un type d'équipement",
  }),
  marque: z.string().min(2, {
    message: "La marque doit contenir au moins 2 caractères",
  }),
  modele: z.string().min(2, {
    message: "Le modèle doit contenir au moins 2 caractères",
  }),
  numero_serie: z.string().min(3, {
    message: "Le numéro de série doit contenir au moins 3 caractères",
  }),
  date_mise_en_service: z.date({
    required_error: "Veuillez sélectionner une date de mise en service",
  }),
  date_fin_vie: z.date({
    required_error: "Veuillez sélectionner une date de fin de vie",
  }),
  pompier_id: z.string().min(1, {
    message: "Veuillez sélectionner un pompier",
  }),
});

export default function EquipementForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Données simulées pour les pompiers
  const mockPompiers = [
    { id: '1', nom: 'Dupont', prenom: 'Jean', grade: 'Sergent' },
    { id: '2', nom: 'Martin', prenom: 'Marie', grade: 'Caporal' },
    { id: '3', nom: 'Bernard', prenom: 'Thomas', grade: 'Caporal-chef' },
    { id: '4', nom: 'Dubois', prenom: 'Pierre', grade: 'Adjudant' },
    { id: '5', nom: 'Leroy', prenom: 'Sophie', grade: 'Lieutenant' },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'casque',
      marque: '',
      modele: '',
      numero_serie: '',
      pompier_id: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Dans une vraie application, vous enverriez les données à Supabase
      console.log('Données de l\'équipement:', values);
      
      // Simulation d'envoi
      setTimeout(() => {
        showSuccess('Équipement ajouté avec succès');
        navigate('/equipements');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipement:', error);
      showError('Erreur lors de l\'ajout de l\'équipement');
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'casque':
        return '🪖';
      case 'veste':
        return '🧥';
      case 'surpantalon':
        return '👖';
      case 'gants':
        return '🧤';
      case 'rangers':
        return '👢';
      default:
        return '🛡️';
    }
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="casque">🪖 Casque</SelectItem>
                              <SelectItem value="veste">🧥 Veste</SelectItem>
                              <SelectItem value="surpantalon">👖 Surpantalon</SelectItem>
                              <SelectItem value="gants">🧤 Gants</SelectItem>
                              <SelectItem value="rangers">👢 Rangers</SelectItem>
                              <SelectItem value="autre">🛡️ Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pompier_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pompier assigné</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un pompier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockPompiers.map((pompier) => (
                                <SelectItem key={pompier.id} value={pompier.id}>
                                  {pompier.grade} {pompier.prenom} {pompier.nom}
                                </SelectItem>
                              ))}
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
                        <FormControl>
                          <Input placeholder="Numéro de série unique" {...field} />
                        </FormControl>
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
                  <p className="text-xs text-gray-600 mb-2">Assigné à:</p>
                  <p className="font-medium">
                    {form.watch('pompier_id') ? 
                      mockPompiers.find(p => p.id === form.watch('pompier_id'))?.prenom + ' ' +
                      mockPompiers.find(p => p.id === form.watch('pompier_id'))?.nom
                      : 'Aucun pompier sélectionné'
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