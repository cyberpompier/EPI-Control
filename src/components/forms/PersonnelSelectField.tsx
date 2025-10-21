"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, ControllerRenderProps } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";

type Personnel = {
  id: number;
  nom: string | null;
  prenom: string | null;
  matricule?: string | null;
  caserne?: string | null;
};

function formatLabel(p: Personnel) {
  const nom = p.nom ?? "";
  const prenom = p.prenom ?? "";
  const mat = p.matricule ? ` • ${p.matricule}` : "";
  const cas = p.caserne ? ` • ${p.caserne}` : "";
  return `${prenom} ${nom}${mat}${cas}`.trim();
}

export default function PersonnelSelectField() {
  const form = useFormContext();
  const [options, setOptions] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("personnel")
          .select("id, nom, prenom, matricule, caserne")
          .order("nom", { ascending: true });

        if (!mounted) return;
        if (error) throw error;
        setOptions(data ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <FormField
      control={form.control}
      name="personnel_id"
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItem>
          <FormLabel>Assigner au personnel</FormLabel>
          <Select
            disabled={loading}
            value={
              typeof field.value === "number"
                ? String(field.value)
                : field.value
                ? String(field.value)
                : "none"
            }
            onValueChange={(v) => {
              if (v === "none") {
                (form as any).setValue("personnel_id", null, { shouldDirty: true });
              } else {
                const parsed = Number(v);
                (form as any).setValue("personnel_id", Number.isFinite(parsed) ? parsed : null, {
                  shouldDirty: true,
                });
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un personnel"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Personnel</SelectLabel>
                <SelectItem value="none">Non assigné</SelectItem>
                {options.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {formatLabel(p)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}