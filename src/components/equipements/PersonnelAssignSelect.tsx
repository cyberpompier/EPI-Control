"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

type PersonnelRow = {
  id: number | string;
  nom: string | null;
  prenom: string | null;
  grade?: string | null;
  caserne?: string | null;
};

type Props = {
  equipmentId?: string;
};

export default function PersonnelAssignSelect({ equipmentId }: Props) {
  const params = useParams();
  const { toast } = useToast();

  const equipId = useMemo(() => equipmentId ?? (params as any)?.id ?? null, [equipmentId, params]);
  const [personnel, setPersonnel] = useState<PersonnelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPersonnelId, setCurrentPersonnelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);

      const { data: pers, error: perr } = await supabase
        .from("personnel")
        .select("id, nom, prenom, grade, caserne")
        .order("nom", { ascending: true });

      if (!isMounted) return;

      if (perr) {
        toast({ variant: "destructive", title: "Erreur", description: perr.message });
        setPersonnel([]);
      } else {
        setPersonnel(pers || []);
      }

      if (equipId) {
        const { data: equip, error: eerr } = await supabase
          .from("equipements")
          .select("personnel_id")
          .eq("id", equipId)
          .single();

        if (!isMounted) return;

        if (eerr) {
          toast({ variant: "destructive", title: "Erreur", description: eerr.message });
          setCurrentPersonnelId(null);
        } else {
          const pid = (equip as any)?.personnel_id;
          setCurrentPersonnelId(pid != null ? String(pid) : null);
        }
      }

      setLoading(false);
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [equipId, toast]);

  const handleChange = async (value: string) => {
    if (!equipId) return;
    setSaving(true);

    const selectedId = value ? parseInt(value, 10) : null;

    const { error } = await supabase
      .from("equipements")
      .update({ personnel_id: selectedId })
      .eq("id", equipId);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setCurrentPersonnelId(value || null);
      toast({ title: "Assignation mise à jour", description: "L'équipement a été assigné avec succès." });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-2">
      <Label>Assigner à un personnel</Label>
      <Select
        value={currentPersonnelId ?? ""}
        onValueChange={handleChange}
        disabled={loading || saving || !equipId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un personnel"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">— Non assigné —</SelectItem>
          {personnel.map((p) => {
            const idStr = String(p.id);
            const name = [p.prenom, p.nom].filter(Boolean).join(" ");
            const extra = [p.grade, p.caserne].filter(Boolean).join(" • ");
            return (
              <SelectItem key={idStr} value={idStr}>
                {name || `Personnel #${idStr}`} {extra ? `— ${extra}` : ""}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}