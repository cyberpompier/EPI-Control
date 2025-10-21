"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Equipement = {
  id: string;
  type?: string | null;
  marque?: string | null;
  modele?: string | null;
  numero_serie?: string | null;
  statut?: string | null;
  image?: string | null;
  personnel_id?: number | null;
  [key: string]: any;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  epi: Equipement;
  onSaved?: (updated: Equipement) => void;
};

const EPICardEditor: React.FC<Props> = ({ open, onOpenChange, epi, onSaved }) => {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    type: epi.type ?? "",
    marque: epi.marque ?? "",
    modele: epi.modele ?? "",
    numero_serie: epi.numero_serie ?? "",
    statut: epi.statut ?? "",
    image: epi.image ?? "",
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        type: epi.type ?? "",
        marque: epi.marque ?? "",
        modele: epi.modele ?? "",
        numero_serie: epi.numero_serie ?? "",
        statut: epi.statut ?? "",
        image: epi.image ?? "",
      });
    }
  }, [open, epi]);

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const payload: Partial<Equipement> = {
      type: form.type || null,
      marque: form.marque || null,
      modele: form.modele || null,
      numero_serie: form.numero_serie || null,
      statut: form.statut || null,
      image: form.image || null,
    };

    const { data, error } = await supabase
      .from("equipements")
      .update(payload)
      .eq("id", epi.id)
      .select("*")
      .single();

    setSaving(false);

    if (error) {
      toast({
        title: "Échec de l’enregistrement",
        description: "La mise à jour de l’EPI a échoué.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "EPI mis à jour", description: "Les modifications ont été enregistrées." });
    onSaved?.(data as Equipement);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Éditer l’EPI</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={form.type} onChange={handleChange("type")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="marque">Marque</Label>
            <Input id="marque" value={form.marque} onChange={handleChange("marque")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="modele">Modèle</Label>
            <Input id="modele" value={form.modele} onChange={handleChange("modele")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="numero_serie">Numéro de série</Label>
            <Input id="numero_serie" value={form.numero_serie} onChange={handleChange("numero_serie")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="statut">Statut</Label>
            <Input id="statut" value={form.statut} onChange={handleChange("statut")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image (URL)</Label>
            <Input id="image" value={form.image} onChange={handleChange("image")} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EPICardEditor;