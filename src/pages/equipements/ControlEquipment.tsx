import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import supabase from "@/integrations/supabase/client";

type Equipement = {
  id: string;
  type: string;
  modele: string | null;
  numero_serie: string;
  image: string | null;
};

export default function ControlEquipment() {
  const { id } = useParams<{ id: string }>();
  const [equip, setEquip] = useState<Equipement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [resultat, setResultat] = useState("conforme");
  const [observations, setObservations] = useState("");
  const [actions, setActions] = useState("");
  const [dateProchaine, setDateProchaine] = useState<string>("");
  const [photosStr, setPhotosStr] = useState("");

  const photosArray = useMemo(() => {
    return photosStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [photosStr]);

  useEffect(() => {
    setError(null);
    supabase.auth.getSession().then(({ data }) => {
      setSessionUserId(data.session?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("equipements")
        .select("id,type,modele,numero_serie,image")
        .eq("id", id)
        .single();
      if (error) setError(error.message);
      else setEquip(data as Equipement);
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !sessionUserId) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("controles").insert([
      {
        equipement_id: id,
        controleur_id: sessionUserId,
        resultat,
        observations: observations || null,
        actions_correctives: actions || null,
        date_prochaine_verification: dateProchaine || null,
        photos: photosArray.length ? photosArray : null,
      },
    ]);

    if (error) setError(error.message);
    else window.location.href = `/equipements/${id}/historique`;

    setSaving(false);
  };

  if (!id) return <div className="p-6">Identifiant d’équipement manquant.</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Contrôler l’équipement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {equip ? (
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-muted rounded overflow-hidden">
                {equip.image ? (
                  <img src={equip.image} alt="equip" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">
                  {equip.type} {equip.modele ? `— ${equip.modele}` : ""}
                </div>
                <div>N° série: {equip.numero_serie}</div>
              </div>
            </div>
          ) : (
            <p>Chargement des infos…</p>
          )}

          {error && <p className="text-red-600">{error}</p>}

          {!sessionUserId ? (
            <div className="space-y-3">
              <p className="text-sm">
                Vous devez être connecté pour enregistrer un contrôle.
              </p>
              <Link to="/login">
                <Button>Se connecter</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Résultat</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={resultat}
                    onChange={(e) => setResultat(e.target.value)}
                  >
                    <option value="conforme">Conforme</option>
                    <option value="non_conforme">Non conforme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prochaine vérification</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={dateProchaine}
                    onChange={(e) => setDateProchaine(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Observations</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[80px]"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Actions correctives</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[80px]"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Photos (URLs séparées par des virgules)</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={photosStr}
                    onChange={(e) => setPhotosStr(e.target.value)}
                    placeholder="https://exemple.com/photo1.jpg, https://exemple.com/photo2.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Link to={`/equipements/${id}/historique`}>
                  <Button variant="outline">Voir l’historique</Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer le contrôle"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}