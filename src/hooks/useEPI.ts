// src/hooks/useEPI.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { showError } from '@/utils/toast';
import { useSession } from '@/components/auth/SessionProvider';

export type EPIStatut = 'conforme' | 'non_conforme' | 'en_attente' | string;

export function useEPI() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { session } = useSession?.() ?? { session: null }; // useSession peut ne pas exister dans ton contexte — adapt

  // Contrôle d'accès simple : adapte selon comment tu stockes le rôle (user_metadata.role, claims, etc.)
  const hasPermissionToUpdate = useCallback(() => {
    try {
      const role =
        // supabase auth user metadata common locations — adapte si tu utilises un autre champ
        (session as any)?.user?.user_metadata?.role ||
        (session as any)?.user?.role ||
        (session as any)?.role;

      if (!role) {
        // si tu ne gères pas les rôles encore, autorise par défaut (ou change cette logique)
        console.warn('[useEPI] rôle utilisateur non trouvé — autorisation par défaut activée');
        return true;
      }

      // changer la liste si besoin (ex: ['admin','controleur'])
      return ['admin', 'controleur'].includes(role);
    } catch (e) {
      console.warn('[useEPI] impossible de vérifier le rôle', e);
      return true;
    }
  }, [session]);

  /**
   * Met à jour le statut d'un EPI.
   * - id : identifiant de l'équipement
   * - newStatus : 'conforme' | 'non_conforme' | 'en_attente' (ou autre si tu as étendu)
   * - options.onSuccess : callback facultatif (ex: refetch)
   * - options.onError : callback facultatif
   */
  const updateEPIStatus = useCallback(
    async (
      id: string | number,
      newStatus: EPIStatut,
      options?: { onSuccess?: () => void; onError?: (err: any) => void }
    ) => {
      if (!id) throw new Error('ID requis pour updateEPIStatus');

      // Permission check
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
          console.error('Supabase update error', error);
          showError('Erreur lors de la mise à jour du statut');
          options?.onError?.(error);
          return { error, success: false };
        }

        toast.success('Statut mis à jour');
        options?.onSuccess?.();
        return { error: null, success: true };
      } catch (err) {
        console.error('Erreur updateEPIStatus', err);
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
