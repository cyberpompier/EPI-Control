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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Camera } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { getInitials } from '@/lib/utils';

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères",
  }),
  matricule: z.string().min(5, {
    message: "Le matricule doit contenir au moins 5 caractères",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  grade: z.enum(['Sapeur', 'Caporal', 'Caporal-chef', 'Sergent', 'Adjudant', 'Lieutenant', 'Capitaine'], {
    required_error: "Veuillez sélectionner un grade",
  }),
  caserne: z.string().min(2, {
    message: "Veuillez sélectionner une caserne",
  }),
});

export default function PersonnelForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const casernes = [
    'Caserne Centrale',
    'Caserne Nord',
    'Caserne Sud',
    'Caserne Est',
    'Caserne Ouest'
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      matricule: '',
      email: '',
      grade: 'Sapeur',
      caserne: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('personnel').insert([values]);

      if (error) {
        throw error;
      }
      
      showSuccess('Pompier ajouté avec succès');
      navigate('/personnel');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du pompier:', error);
      showError(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'capitaine':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'lieutenant':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'adjudant':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sergent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'caporal':
      case 'caporal-chef':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{`Nouveau pompier | EPI Control`}</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/personnel" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au personnel
        </Link>
        
        <h1 className="text-2xl font-bold">Nouveau pompier</h1>
        <p className="text-gray-600">Ajouter un nouveau sapeur-pompier</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de famille" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="matricule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matricule</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SP12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="prenom.nom@sdis.fr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sapeur">Sapeur</SelectItem>
                              <SelectItem value="Caporal">Caporal</SelectItem>
                              <SelectItem value="Caporal-chef">Caporal-chef</SelectItem>
                              <SelectItem value="Sergent">Sergent</SelectItem>
                              <SelectItem value="Adjudant">Adjudant</SelectItem>
                              <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                              <SelectItem value="Capitaine">Capitaine</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="caserne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caserne</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une caserne" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {casernes.map((caserne) => (
                                <SelectItem key={caserne} value={caserne}>
                                  {caserne}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="outline" type="button" onClick={() => navigate('/personnel')}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                      {isLoading ? "Enregistrement..." : "Enregistrer le pompier"}
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
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src="" alt="Photo de profil" />
                    <AvatarFallback className="text-xl">
                      {form.watch('prenom') && form.watch('nom') ? 
                        getInitials(form.watch('nom'), form.watch('prenom')) : 
                        'PP'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-red-600 text-white p-2 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="font-medium text-lg">
                  {form.watch('prenom') || 'Prénom'} {form.watch('nom') || 'Nom'}
                </h3>
                
                {form.watch('grade') && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getGradeColor(form.watch('grade'))}`}>
                      {form.watch('grade')}
                    </span>
                  </div>
                )}
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-gray-600">Matricule</p>
                    <p className="font-medium">{form.watch('matricule') || 'Non défini'}</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-xs">{form.watch('email') || 'Non défini'}</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-gray-600">Caserne</p>
                    <p className="font-medium">{form.watch('caserne') || 'Non définie'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}