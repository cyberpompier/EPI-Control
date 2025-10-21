"use client";

import React from "react";
import { supabase } from "../../integrations/supabase/client";

type OwnerNameProps = {
  personnelId?: number | null;
  className?: string;
};

const OwnerName: React.FC<OwnerNameProps> = ({ personnelId, className }) => {
  const [displayName, setDisplayName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    if (!personnelId) {
      setDisplayName(null);
      return;
    }

    setLoading(true);

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("personnel")
          .select("nom, prenom")
          .eq("id", personnelId)
          .maybeSingle();

        if (!active) return;

        if (error || !data) {
          setDisplayName("Inconnu");
          return;
        }

        const prenom = (data as any).prenom ?? "";
        const nom = (data as any).nom ?? "";
        const full = `${prenom} ${nom}`.trim();
        setDisplayName(full || `#${personnelId}`);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [personnelId]);

  if (!personnelId) {
    return <span className={className ?? "text-sm text-gray-500"}>Non assigné</span>;
  }

  if (loading && !displayName) {
    return <span className={className ?? "text-sm text-gray-500"}>Chargement…</span>;
  }

  return (
    <span className={className ?? "text-sm text-gray-700"}>
      {displayName ?? "Inconnu"}
    </span>
  );
};

export default OwnerName;