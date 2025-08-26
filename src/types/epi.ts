export type EPIStatut = 'en_attente' | 'en_service' | 'en_reparation' | 'hors_service';

export interface EPI {
  id: string;
  type: string;
  marque?: string | null;
  modele?: string | null;
  numero_serie: string;
  date_mise_en_service?: string | null;
  date_fin_vie?: string | null;
  statut: EPIStatut;
  image?: string | null;
  personnel_id?: number | string | null;
  created_at?: string | null;
}