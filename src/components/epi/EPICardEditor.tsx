"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  personnel_id?: string | number | null;
  created_at?: string | null;
  [key: string]: any;
};

type EPICardEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  epi: Equipement;
  onSaved: (updated: Equipement) => void;
};

const EPICardEditor: React.FC<EPICardEditorProps> = ({ open, onOpenChange, epi, onSaved }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: epi.type || "",
    marque: epi.marque || "",
    modele: epi.modele || "",
    numero_serie: epi.numero_serie || "",
    statut: epi.statut || "",
    image: epi.image || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        type: epi.type || "",
        marque: epi.marque || "",
        modele: epi.modele || "",
        numero_serie: epi.numero_serie || "",
        statut: epi.statut || "",
        image: epi.image || "",
      });
    }
  }, [open, epi]);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
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
      .select()
      .maybeSingle();

    setSaving(false);

    if (error) {
      toast({
        title: "Erreur lors de l’enregistrement",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const updated: Equipement = { ...epi, ...data };
      onSaved(updated);
      toast({
        title: "Équipement mis à jour",
        description: "Les informations ont été enregistrées avec succès.",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Éditer l’équipement</DialogTitle>
          <DialogDescription>Modifiez les informations, puis enregistrez vos changements.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={form.type} onChange={onChange("type")} placeholder="Ex: Casque F1" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="marque">Marque</Label>
            <Input id="marque" value={form.marque} onChange={onChange("marque")} placeholder="Ex: MSA" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modele">Modèle</Label>
            <Input id="modele" value={form.modele} onChange={onChange("modele")} placeholder="Ex: Gallet" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numero_serie">N° de série</Label>
            <Input id="numero_serie" value={form.numero_serie} onChange={onChange("numero_serie")} placeholder="Ex: ABC123" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="statut">Statut</Label>
            <Input id="statut" value={form.statut} onChange={onChange("statut")} placeholder="Ex: en_service" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">URL image</Label>
            <Input id="image" value={form.image} onChange={onChange("image")} placeholder="https://..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
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