"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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

type PersonnelOption = {
  id: string;
  nom?: string | null;
  prenom?: string | null;
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
  const [personnels, setPersonnels] = useState<PersonnelOption[]>([]);

  const [form, setForm] = useState({
    type: epi.type || "",
    marque: epi.marque || "",
    modele: epi.modele || "",
    numero_serie: epi.numero_serie || "",
    statut: epi.statut || "",
    image: epi.image || "",
    personnel_id: epi.personnel_id ? String(epi.personnel_id) : "",
  });

  // Re-initialiser le formulaire à l'ouverture
  useEffect(() => {
    if (open) {
      setForm({
        type: epi.type || "",
        marque: epi.marque || "",
        modele: epi.modele || "",
        numero_serie: epi.numero_serie || "",
        statut: epi.statut || "",
        image: epi.image || "",
        personnel_id: epi.personnel_id ? String(epi.personnel_id) : "",
      });
    }
  }, [open, epi]);

  // Charger la liste du personnel quand le dialog s'ouvre
  useEffect(() => {
    if (!open) return;
    supabase
      .from("personnel")
      .select("id, nom, prenom")
      .order("nom", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast({
            title: "Erreur de chargement du personnel",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        const options: PersonnelOption[] =
          (data || []).map((p: any) => ({
            id: typeof p.id === "string" ? p.id : String(p.id),
            nom: p.nom ?? null,
            prenom: p.prenom ?? null,
          })) || [];
        setPersonnels(options);
      });
  }, [open, toast]);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: any = {
      type: form.type || null,
      marque: form.marque || null,
      modele: form.modele || null,
      numero_serie: form.numero_serie || null,
      statut: form.statut || null,
      image: form.image || null,
      // transmettre null si "Non assigné"
      personnel_id: form.personnel_id === "" ? null : form.personnel_id,
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

  const displayName = (p: PersonnelOption) =>
    [p.prenom, p.nom].filter(Boolean).join(" ").trim() || p.id;

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

          <div className="grid gap-2">
            <Label>Propriétaire (personnel)</Label>
            <Select
              value={form.personnel_id}
              onValueChange={(v) => setForm((prev) => ({ ...prev, personnel_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un personnel (ou laisser vide)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Non assigné</SelectItem>
                {personnels.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {displayName(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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