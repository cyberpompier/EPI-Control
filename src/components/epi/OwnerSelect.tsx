"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";
import supabaseClient from "@/integrations/supabase/client";

type Person = {
  id: number;
  nom: string | null;
  prenom: string | null;
};

type OwnerSelectProps = {
  epiId: string;                // uuid de l'équipement
  value: number | null;         // personnel_id actuel (ou null)
  onChange?: (newOwnerId: number | null) => void; // callback parent après succès sauvegarde
};

const OwnerSelect: React.FC<OwnerSelectProps> = ({ epiId, value, onChange }) => {
  const { toast } = useToast();
  const supabase = (supabaseClient as ReturnType<typeof createClient>);
  const [loading, setLoading] = React.useState(false);
  const [people, setPeople] = React.useState<Person[]>([]);
  const [ready, setReady] = React.useState(false);

  // valeur contrôlée interne en chaîne pour Radix ("none" pour null)
  const toValueStr = (v: number | null) => (v === null ? "none" : String(v));
  const [internal, setInternal] = React.useState<string>(toValueStr(value));

  React.useEffect(() => {
    setInternal(toValueStr(value));
  }, [value]);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("personnel")
        .select("id, nom, prenom")
        .order("nom", { ascending: true });
      if (!active) return;
      if (error) {
        toast({ title: "Erreur", description: "Impossible de charger la liste du personnel.", variant: "destructive" });
      } else {
        setPeople((data ?? []) as Person[]);
      }
      setReady(true);
    };
    load();
    return () => {
      active = false;
    };
  }, [supabase, toast]);

  const handleChange = async (val: string) => {
    if (loading) return;

    const newId = val === "none" ? null : Number(val);
    const prev = internal;

    // no-op si même valeur
    if (toValueStr(value) === val) return;

    // Optimistic UI
    setInternal(val);
    setLoading(true);

    const { error } = await supabase
      .from("equipements")
      .update({ personnel_id: newId })
      .eq("id", epiId)
      .select("personnel_id")
      .single();

    setLoading(false);

    if (error) {
      // revert
      setInternal(prev);
      toast({
        title: "Échec de l’affectation",
        description: "La modification du propriétaire n’a pas pu être enregistrée.",
        variant: "destructive",
      });
      return;
    }

    onChange?.(newId);
    toast({
      title: "Propriétaire mis à jour",
      description: newId === null ? "EPI désaffecté (Non assigné)." : "Affectation enregistrée.",
    });
  };

  // Détermine si la valeur actuelle correspond à une personne connue; sinon, bascule en "none" visuellement
  const knownIds = React.useMemo(() => new Set(people.map(p => String(p.id))), [people]);
  const displayValue = knownIds.has(internal) ? internal : "none";

  const currentLabel = React.useMemo(() => {
    if (displayValue === "none") return "Non assigné";
    const p = people.find(x => String(x.id) === displayValue);
    if (!p) return "Propriétaire";
    return `${p.prenom ?? ""} ${p.nom ?? ""}`.trim() || "Propriétaire";
  }, [displayValue, people]);

  return (
    <div className="min-w-[180px]">
      <Select
        value={displayValue}
        onValueChange={handleChange}
        disabled={!ready || loading}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="Propriétaire">
            {currentLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non assigné</SelectItem>
          {people.map((p) => (
            <SelectItem key={p.id} value={String(p.id)}>
              {`${p.prenom ?? ""} ${p.nom ?? ""}`.trim() || `Personnel #${p.id}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OwnerSelect;