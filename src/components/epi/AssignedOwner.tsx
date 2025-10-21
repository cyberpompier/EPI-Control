"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

type AssignedOwnerProps = {
  numeroSerie?: string | null;
  personnelId?: number | string | null;
  className?: string;
  showSerial?: boolean;
};

const AssignedOwner: React.FC<AssignedOwnerProps> = ({
  numeroSerie,
  personnelId,
  className,
  showSerial = true,
}) => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [resolvedSerial, setResolvedSerial] = useState<string | null>(numeroSerie ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!personnelId && !numeroSerie) {
        if (isMounted) {
          setFullName(null);
          setResolvedSerial(null);
        }
        return;
      }

      setLoading(true);

      let foundPersonnelId: number | string | null = personnelId ?? null;
      let serial = numeroSerie ?? null;

      if (!foundPersonnelId && numeroSerie) {
        const { data: equip, error: equipError } = await supabase
          .from("equipements")
          .select("personnel_id, numero_serie")
          .eq("numero_serie", numeroSerie)
          .maybeSingle();

        if (!equipError) {
          foundPersonnelId = equip?.personnel_id ?? null;
          serial = equip?.numero_serie ?? numeroSerie;
        } else {
          console.error("Erreur récupération équipement:", equipError);
        }
      }

      if (foundPersonnelId) {
        const { data: person, error: personError } = await supabase
          .from("personnel")
          .select("nom, prenom")
          .eq("id", foundPersonnelId)
          .maybeSingle();

        if (personError) {
          console.error("Erreur récupération personnel:", personError);
          if (isMounted) {
            setFullName(null);
            setResolvedSerial(serial);
            setLoading(false);
          }
          return;
        }

        const displayName = [person?.nom, person?.prenom].filter(Boolean).join(" ").trim();

        if (isMounted) {
          setFullName(displayName || null);
          setResolvedSerial(serial);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setFullName(null);
        setResolvedSerial(serial);
        setLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [numeroSerie, personnelId]);

  if (loading) {
    return (
      <div className={className}>
        <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
        {showSerial && <span className="mt-1 block h-3 w-24 animate-pulse rounded bg-gray-100" />}
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="text-sm font-medium text-gray-900">
        {fullName ?? "—"}
      </span>
      {showSerial && resolvedSerial ? (
        <span className="block text-xs text-gray-500 font-mono mt-0.5">
          {resolvedSerial}
        </span>
      ) : null}
    </div>
  );
};

export default AssignedOwner;