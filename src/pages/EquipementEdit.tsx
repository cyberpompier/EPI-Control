"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  type: z.string().min(1, 'Le type est requis'),
  marque: z.string(),
  modele: z.string(), // Permet les valeurs vides
  numero_serie: z.string().min(1, 'Le numéro de série est requis'),
  date_mise_en_service: z.string().min(1, 'La date de mise en service est requise'),
  date_fin_vie: z.string().optional(),
  statut: z.string().min(1, 'Le statut est requis'),
});

const EquipementEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      marque: '',
      modele: '',
      numero_serie: '',
      date_mise_en_service: '',
      date_fin_vie: '',
      statut: 'en_attente',
    },
  });

  useEffect(() => {
    if (id) {
      fetchEquipement();
    }
  }, [id]);

  const fetchEquipement = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setEquipement(data);
      form.reset({
        type: data.type || '',
        marque: data.marque || '',
        modele: data.modele || '',
        numero_serie: data.numero_serie || '',
        date_mise_en_service: data.date_mise_en_service || '',
        date_fin_vie: data.date_fin_vie || '',
        statut: data.statut || 'en_attente',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement de l\'équipement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      const equipementData = {
        ...values,
        date_mise_en_service: values.date_mise_en_service || null,
        date_fin_vie: values.date_fin_vie || null,
      };

      if (id) {
        // Update existing equipement
        const { error } = await supabase
          .from('equipements')
          .update(equipementData)
          .eq('id', id);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Équipement mis à jour avec succès',
        });
      } else {
        // Create new equipement
        const { error } = await supabase
          .from('equipements')
          .insert(equipementData);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Équipement créé avec succès',
        });
      }
      
      navigate('/equipements');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Modifier l\'Équipement' : 'Ajouter un Équipement'}
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'équipement *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Casque, Bottes, Gants..." {...field} />
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
                  <Input placeholder="Modèle de l'équipement" {...field} />
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
                <FormLabel>Numéro de série *</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de série unique" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date_mise_en_service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de mise en service *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_fin_vie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin de vie</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut *</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="w-full p-2 border border-gray-300 rounded-md"
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/equipements')}
            >
              Annuler
            </Button>
            <Button type="submit">
              {id ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EquipementEdit;