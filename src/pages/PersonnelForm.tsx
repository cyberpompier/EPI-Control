"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schéma de validation avec Zod
const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  grade: z.string().min(2, {
    message: "Le grade doit contenir au moins 2 caractères.",
  }),
  caserne: z.string().min(1, {
    message: "La caserne est requise.",
  }),
  matricule: z.string().min(1, {
    message: "Le matricule est requis.",
  }),
});

interface PersonnelFormProps {
  personnel?: {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    grade: string;
    caserne: string;
    matricule: string;
  };
  onSubmit: (data: any) => void;
  isEditing: boolean;
}

export function PersonnelForm({ personnel, onSubmit, isEditing }: PersonnelFormProps) {
  const [loading, setLoading] = useState(false);
  const [caserneOptions, setCaserneOptions] = useState<string[]>([]);

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: personnel?.nom || "",
      prenom: personnel?.prenom || "",
      email: personnel?.email || "",
      grade: personnel?.grade || "",
      caserne: personnel?.caserne || "",
      matricule: personnel?.matricule || "",
    },
  });

  // Charger les options de caserne depuis la base de données
  useEffect(() => {
    const fetchCaserneOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .select('caserne')
          .neq('caserne', null);
        
        if (error) throw error;
        
        // Extraire les valeurs uniques de caserne
        const uniqueCasernes = [...new Set(data.map(item => item.caserne).filter(Boolean))] as string[];
        setCaserneOptions(uniqueCasernes);
      } catch (error) {
        console.error('Erreur lors du chargement des casernes:', error);
        toast.error("Erreur lors du chargement des casernes");
      }
    };

    fetchCaserneOptions();
  }, []);

  // Gestion de la soumission du formulaire
  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(isEditing ? "Personnel mis à jour avec succès!" : "Personnel ajouté avec succès!");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier le Personnel" : "Ajouter un Nouveau Personnel"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations du membre du personnel." 
            : "Remplissez le formulaire pour ajouter un nouveau membre au personnel."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input placeholder="Grade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input placeholder="Matricule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Champ Caserne - Remplacement du Select par Input */}
            <FormField
              control={form.control}
              name="caserne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caserne</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Saisissez la caserne" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez le nom de la caserne où ce personnel est basé.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  En cours...
                </>
              ) : (
                isEditing ? "Mettre à Jour" : "Ajouter le Personnel"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}