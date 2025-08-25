"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import ComboboxWithLocalStorage from "@/components/ComboboxWithLocalStorage"; // Import the new component

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  matricule: z.string().min(1, {
    message: "Le matricule est requis.",
  }),
  caserne: z.string().min(1, {
    message: "La caserne est requise.",
  }),
  grade: z.string().min(1, {
    message: "Le grade est requis.",
  }),
  email: z.string().email({
    message: "L'email doit être valide.",
  }).optional().or(z.literal('')),
  photo: z.string().url({
    message: "L'URL de la photo doit être valide.",
  }).optional().or(z.literal('')),
});

export default function PersonnelForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      matricule: "",
      caserne: "",
      grade: "",
      email: "",
      photo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await supabase.from("personnel").insert([values]);

    if (error) {
      toast.error("Erreur lors de l'ajout du personnel", {
        description: error.message,
      });
    } else {
      toast.success("Personnel ajouté avec succès !");
      navigate("/personnel");
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un nouveau personnel</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="caserne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caserne</FormLabel>
                <ComboboxWithLocalStorage
                  name={field.name}
                  control={form.control}
                  placeholder="Sélectionnez ou entrez une caserne"
                  emptyMessage="Aucune caserne trouvée."
                  localStorageKey="recent_casernes"
                />
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Photo</FormLabel>
                <FormControl>
                  <Input placeholder="URL de la photo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Ajouter le personnel</Button>
        </form>
      </Form>
    </div>
  );
}