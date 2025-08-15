"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  type: z.string().min(1, "Le type est requis."),
  marque: z.string().optional(),
  modele: z.string().optional(),
  numero_serie: z.string().min(1, "Le numéro de série est requis."),
  date_mise_en_service: z.date().optional().nullable(),
  date_fin_vie: z.date().optional().nullable(),
  statut: z.string().min(1, "Le statut est requis."),
  personnel_id: z.string().optional().nullable(),
});

type EquipmentFormValues = z.infer<typeof formSchema>;

interface EquipmentFormProps {
  equipment?: any;
}

const equipmentTypes = [
  "Casque F1", "Casque F2", "Veste TSI", "Pantalon TSI", "Bottes à Lacets",
  "Gant de protection", "Parka", "Blouson Softshell", "Surpantalon", "Veste de protection"
];

const statuses = ["En service", "En stock", "En maintenance", "Réformé"];

export default function EquipmentForm({ equipment }: EquipmentFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [personnelList, setPersonnelList] = useState<any[]>([]);
  const isEditing = !!equipment;

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: equipment?.type || '',
      marque: equipment?.marque || '',
      modele: equipment?.modele || '',
      numero_serie: equipment?.numero_serie || '',
      date_mise_en_service: equipment?.date_mise_en_service ? new Date(equipment.date_mise_en_service) : null,
      date_fin_vie: equipment?.date_fin_vie ? new Date(equipment.date_fin_vie) : null,
      statut: equipment?.statut || 'En stock',
      personnel_id: equipment?.personnel_id?.toString() || null,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const barcode = searchParams.get('barcode');
    if (barcode && !isEditing) {
      form.setValue('numero_serie', barcode);
    }
  }, [location, isEditing, form]);

  useEffect(() => {
    async function fetchPersonnel() {
      const { data, error } = await supabase.from('personnel').select('id, nom, prenom');
      if (error) {
        showError("Erreur lors de la récupération du personnel.");
        console.error(error);
      } else {
        setPersonnelList(data);
      }
    }
    fetchPersonnel();
  }, []);

  async function onSubmit(values: EquipmentFormValues) {
    setLoading(true);
    try {
      const submissionData: any = {
        ...values,
        date_mise_en_service: values.date_mise_en_service ? format(values.date_mise_en_service, 'yyyy-MM-dd') : null,
        date_fin_vie: values.date_fin_vie ? format(values.date_fin_vie, 'yyyy-MM-dd') : null,
        personnel_id: values.personnel_id ? parseInt(values.personnel_id, 10) : null,
      };

      if (!submissionData.marque) {
        submissionData.marque = submissionData.type;
      }
      if (!submissionData.modele) {
        submissionData.modele = submissionData.type;
      }

      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('equipements')
          .update(submissionData)
          .eq('id', equipment.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('equipements')
          .insert([submissionData]);
        error = insertError;
      }

      if (error) throw error;

      showSuccess(`Équipement ${isEditing ? 'mis à jour' : 'ajouté'} avec succès !`);
      navigate('/equipements');
    } catch (err: any) {
      showError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'équipement *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Input placeholder="Ex: MSA, Bristol, Haix..." {...field} value={field.value || ''} />
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
                  <Input placeholder="Ex: Gallet F1, XF, Fire Eagle..." {...field} value={field.value || ''} />
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
                <FormLabel>Numéro de série / Code-barres *</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez le numéro de série" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
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
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
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
                <FormLabel>Attribué à</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un personnel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Non attribué</SelectItem>
                    {personnelList.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.prenom} {p.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/equipements')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? 'Mettre à jour' : 'Ajouter l\'équipement'}
          </Button>
        </div>
      </form>
    </Form>
  );
}