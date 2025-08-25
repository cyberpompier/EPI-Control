"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  matricule: z.string().min(1, 'Le matricule est requis'),
  grade: z.string().min(1, 'Le grade est requis'),
  caserne: z.string().min(1, 'La caserne est requise'),
});

type FormData = z.infer<typeof formSchema>;

const PersonnelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      matricule: '',
      grade: '',
      caserne: '',
    }
  });

  useEffect(() => {
    if (id) {
      fetchPersonnel();
    }
  }, [id]);

  const fetchPersonnel = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement du personnel',
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof FormData, data[key as keyof typeof data]);
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (id) {
        const { error } = await supabase
          .from('personnel')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Personnel mis à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('personnel')
          .insert(data);
        
        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Personnel créé avec succès',
        });
      }
      navigate('/personnel');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'enregistrement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Modifier le Personnel' : 'Ajouter du Personnel'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" {...register('nom')} />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" {...register('prenom')} />
            {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="matricule">Matricule</Label>
            <Input id="matricule" {...register('matricule')} />
            {errors.matricule && <p className="text-red-500 text-sm mt-1">{errors.matricule.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="grade">Grade</Label>
            <Input id="grade" {...register('grade')} />
            {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="caserne">Caserne</Label>
            <Input id="caserne" {...register('caserne')} />
            {errors.caserne && <p className="text-red-500 text-sm mt-1">{errors.caserne.message}</p>}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Créer'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/personnel')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonnelForm;