// src/hooks/useEPI.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { showError } from '@/utils/toast';
import { useSession } from '@/components/auth/SessionProvider';
import type { EPI } from '@/types'; // 🔹 on importe ton type global

export function useEPI() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { session } = useSession?.() ?? { session: null };

  // Contrôle d'accès (adapté à ton User.role)
  const hasPermissionToUpdate = useCallback(() => {
    try {
      const role =
        (session as any)?.user?.user_metadata?.role ||
        (session as any)?.user?.role;

      return ['admin', 'controleur'].includes(role);
    } catch (e) {
      console.warn('[useEPI] Vérification du rôle impossible', e);
      return false;
    }
  }, [session]);

  /**
   * Met à jour le statut d’un EPI
   */
  const updateEPIStatus = useCallback(
    async (
      id: string,
      newStatus: EPI['statut'], // 🔹 on utilise ton type défini
      options?: { onSuccess?: () => void; onError?: (err: any) => void }
    ) => {
      if (!id) throw new Error('ID requis pour updateEPIStatus');

      if (!hasPermissionToUpdate()) {
        toast.error("Action non autorisée");
        const err = new Error('Forbidden');
        options?.onError?.(err);
        return { error: err, success: false };
      }

      setIsUpdating(true);
      try {
        const { error } = await supabase
          .from('equipements')
          .update({ statut: newStatus })
          .eq('id', id);

        if (error) {
          showError('Erreur lors de la mise à jour du statut');
          options?.onError?.(error);
          return { error, success: false };
        }

        toast.success('Statut mis à jour');
        options?.onSuccess?.();
        return { error: null, success: true };
      } catch (err) {
        console.error(err);
        showError('Erreur inattendue lors de la mise à jour');
        options?.onError?.(err);
        return { error: err, success: false };
      } finally {
        setIsUpdating(false);
      }
    },
    [hasPermissionToUpdate]
  );

  return {
    updateEPIStatus,
    isUpdating,
    hasPermissionToUpdate,
  };
}
