import type { EPIStatut } from '@/types/epi';

export const STATUS_LABELS: Record<EPIStatut, string> = {
  en_attente: 'en attente',
  en_service: 'en service',
  en_reparation: 'en reparation',
  hors_service: 'hors service',
};

export const STATUS_VALUES: Record<string, EPIStatut> = {
  'en attente': 'en_attente',
  'en_attente': 'en_attente',
  'en service': 'en_service',
  'en_service': 'en_service',
  'en reparation': 'en_reparation',
  'en_reparation': 'en_reparation',
  'hors service': 'hors_service',
  'hors_service': 'hors_service',
};

export function toDbStatus(input: string): EPIStatut {
  const key = input.trim().toLowerCase();
  const mapped = STATUS_VALUES[key];
  if (!mapped) {
    // Fallback sûr si une valeur inattendue arrive: rester en_attente
    return 'en_attente';
  }
  return mapped;
}

export function toLabel(status: string): string {
  const normalized = toDbStatus(status);
  return STATUS_LABELS[normalized];
}

export const EPI_STATUS_OPTIONS: Array<{ value: EPIStatut; label: string }> = (Object.keys(STATUS_LABELS) as EPIStatut[]).map((k) => ({
  value: k,
  label: STATUS_LABELS[k],
}));