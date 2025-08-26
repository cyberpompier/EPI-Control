import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import supabase from "@/integrations/supabase/client";

type Equipement = {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  date_fin_vie: string | null;
  statut: string;
  image: string | null;
};

export default function EditEquipment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equip, setEquip] = useState<Equipement | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    supabase
      .from("equipements")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setEquip(data as Equipement);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equip) return;
    setSaving(true);
    setError(null);

    supabase
      .from("equipements")
      .update({
        type: equip.type,
        marque: equip.marque,
        modele: equip.modele,
        numero_serie: equip.numero_serie,
        date_mise_en_service: equip.date_mise_en_service,
        date_fin_vie: equip.date_fin_vie,
        statut: equip.statut,
        image: equip.image,
      })
      .eq("id", equip.id)
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          navigate(`/equipements/${equip.id}/historique`);
        }
      })
      .finally(() => setSaving(false));
  };

  if (!id) {
    return <div className="p-6">Identifiant d’équipement manquant.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Éditer l’équipement</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement…</p>
          ) : error ? (
            <div className="space-y-3">
              <p className="text-red-600">Erreur: {error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          ) : equip ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.type}
                    onChange={(e) => setEquip({ ...equip, type: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marque</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.marque ?? ""}
                    onChange={(e) => setEquip({ ...equip, marque: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Modèle</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.modele ?? ""}
                    onChange={(e) => setEquip({ ...equip, modele: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">N° série</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.numero_serie}
                    onChange={(e) => setEquip({ ...equip, numero_serie: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mise en service</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.date_mise_en_service ?? ""}
                    onChange={(e) => setEquip({ ...equip, date_mise_en_service: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fin de vie</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.date_fin_vie ?? ""}
                    onChange={(e) => setEquip({ ...equip, date_fin_vie: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.statut}
                    onChange={(e) => setEquip({ ...equip, statut: e.target.value })}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_service">En service</option>
                    <option value="en_reparation">En réparation</option>
                    <option value="hors_service">Hors service</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Image (URL)</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={equip.image ?? ""}
                    onChange={(e) => setEquip({ ...equip, image: e.target.value })}
                    placeholder="https://..."
                  />
                  {equip.image ? (
                    <img
                      src={equip.image}
                      alt="Aperçu"
                      className="mt-2 h-40 w-full object-cover rounded-md border"
                    />
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Link to={`/equipements/${equip.id}/historique`}>
                    <Button variant="outline">Voir l’historique</Button>
                  </Link>
                  <Link to={`/equipements/${equip.id}/controler`}>
                    <Button variant="outline">Contrôler</Button>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Enregistrement…" : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <p>Équipement introuvable.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}