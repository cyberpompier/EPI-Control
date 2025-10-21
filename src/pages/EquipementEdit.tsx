"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import PersonnelSelectField from "@/components/forms/PersonnelSelectField";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  numero_serie: z.string().min(1, "Le numéro de série est requis"),
  personnel_id: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

type Equipement = {
  id: string;
  numero_serie: string | null;
  personnel_id: number | null;
};

export default function EquipementEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numero_serie: "",
      personnel_id: null,
    },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    supabase
      .from("equipements")
      .select("id, numero_serie, personnel_id")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) throw error;
        const e = data as Equipement;
        form.reset({
          numero_serie: e?.numero_serie ?? "",
          personnel_id: e?.personnel_id ?? null,
        });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    const { error } = await supabase
      .from("equipements")
      .update({
        numero_serie: values.numero_serie,
        personnel_id: values.personnel_id ?? null,
      })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La sauvegarde a échoué.",
      });
      throw error;
    }

    toast({
      title: "Enregistré",
      description: "L’équipement a été mis à jour.",
    });

    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Éditer l’équipement</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Numéro de série */}
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

              {/* Menu déroulant: Assigner au personnel (AJOUTÉ ICI) */}
              <PersonnelSelectField />
            </CardContent>

            <CardFooter className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="min-w-[120px]"
              >
                Annuler
              </Button>
              <Button type="submit" className="min-w-[140px]" disabled={loading}>
                Enregistrer
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}