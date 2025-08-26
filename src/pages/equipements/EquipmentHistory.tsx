import React, { useEffect, useState } from "react";
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

type Controle = {
  id: string;
  date_controle: string;
  resultat: string;
  observations: string | null;
  actions_correctives: string | null;
  photos: string[] | null;
  date_prochaine_verification: string | null;
  created_at: string;
};

export default function EquipmentHistory() {
  const { id } = useParams<{ id: string }>();
  const [equip, setEquip] = useState<Equipement | null>(null);
  const [history, setHistory] = useState<Controle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      supabase.from("equipements").select("id,type,modele,numero_serie,image").eq("id", id).single(),
      supabase
        .from("controles")
        .select("id,date_controle,resultat,observations,actions_correctives,photos,date_prochaine_verification,created_at")
        .eq("equipement_id", id)
        .order("date_controle", { ascending: false }),
    ])
      .then(([equipRes, histRes]) => {
        if (equipRes.error) {
          setError(equipRes.error.message);
          return;
        }
        setEquip(equipRes.data as Equipement);

        if (histRes.error) {
          setError(histRes.error.message);
          setHistory([]);
          return;
        }
        setHistory((histRes.data as Controle[]) ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <div className="p-6">Identifiant d’équipement manquant.</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Historique des contrôles</CardTitle>
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
            <p>Chargement de l’équipement…</p>
          )}

          <div className="flex gap-2">
            <Link to={`/equipements/${id}/controler`}>
              <Button variant="outline">Nouveau contrôle</Button>
            </Link>
            <Link to={`/equipements/${id}/edit`}>
              <Button variant="outline">Éditer</Button>
            </Link>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {loading ? (
            <p>Chargement de l’historique…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun contrôle enregistré pour cet équipement.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((c) => (
                <li key={c.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">
                      {new Date(c.date_controle || c.created_at).toLocaleDateString()}
                    </div>
                    <div className={c.resultat === "conforme" ? "text-green-600" : "text-red-600"}>
                      {c.resultat === "conforme" ? "Conforme" : "Non conforme"}
                    </div>
                  </div>
                  {c.observations && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Observations: </span>
                      {c.observations}
                    </div>
                  )}
                  {c.actions_correctives && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Actions: </span>
                      {c.actions_correctives}
                    </div>
                  )}
                  {c.photos && c.photos.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {c.photos.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`photo ${idx + 1}`} className="h-24 w-full object-cover rounded border" />
                        </a>
                      ))}
                    </div>
                  )}
                  {c.date_prochaine_verification && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Prochaine vérification: {new Date(c.date_prochaine_verification).toLocaleDateString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}