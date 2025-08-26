import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EPI } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Camera, X, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/utils/toast';

interface ControleFormProps {
  epi: EPI;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  resultat: z.enum(['conforme', 'non_conforme'], {
    required_error: "Veuillez sélectionner un résultat",
  }),
  observations: z.string().min(10, {
    message: "Les observations doivent contenir au moins 10 caractères",
  }),
  actions_correctives: z.string().optional(),
  date_prochaine_verification: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
});

export default function ControleForm({ epi, onSubmit, isLoading = false }: ControleFormProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Définir la date par défaut pour le prochain contrôle (6 mois à partir d'aujourd'hui)
  const defaultNextDate = new Date();
  defaultNextDate.setMonth(defaultNextDate.getMonth() + 6);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resultat: 'conforme',
      observations: '',
      actions_correctives: '',
      date_prochaine_verification: defaultNextDate,
    },
  });

  const handlePhotoCapture = () => {
    // Simuler l'ajout d'une photo (dans une vraie application, cela utiliserait l'API de la caméra)
    const mockPhoto = `https://source.unsplash.com/random/300x300?fire&${Date.now()}`;
    setPhotos([...photos, mockPhoto]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      // Simuler l'upload (dans une vraie application, cela enverrait les fichiers au serveur)
      Array.from(files).forEach(() => {
        const mockPhoto = `https://source.unsplash.com/random/300x300?equipment&${Date.now()}`;
        setPhotos(prev => [...prev, mockPhoto]);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (photos.length === 0 && values.resultat === 'non_conforme') {
      showError("Veuillez ajouter au moins une photo pour un équipement non conforme");
      return;
    }
    
    onSubmit({
      ...values,
      photos,
      epi_id: epi.id,
      date_controle: new Date().toISOString(),
    });
  };

  const watchResultat = form.watch('resultat');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Contrôle de l'équipement: {epi.type} {epi.marque} {epi.modele}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="resultat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Résultat du contrôle</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conforme" id="conforme" />
                        <label htmlFor="conforme" className="flex items-center cursor-pointer">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span>Conforme</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_conforme" id="non_conforme" />
                        <label htmlFor="non_conforme" className="flex items-center cursor-pointer">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                          <span>Non conforme</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
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
                    <Textarea
                      placeholder="Détaillez l'état de l'équipement..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Décrivez l'état général, les points vérifiés et les éventuelles anomalies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchResultat === 'non_conforme' && (
              <FormField
                control={form.control}
                name="actions_correctives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actions correctives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez les actions à entreprendre..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Indiquez les mesures à prendre pour remettre l'équipement en conformité.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="date_prochaine_verification"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date du prochain contrôle</FormLabel>
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
                  <FormDescription>
                    La date recommandée pour le prochain contrôle est dans 6 mois.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Photos</FormLabel>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handlePhotoCapture}
                >
                  <Camera className="h-4 w-4" />
                  Prendre une photo
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePhotoUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    Importer des photos
                  </Button>
                </div>
              </div>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {watchResultat === 'non_conforme' && photos.length === 0 && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Une photo est requise pour les équipements non conformes
                </p>
              )}
            </div>

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button variant="outline" type="button">Annuler</Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? "Enregistrement..." : "Enregistrer le contrôle"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}