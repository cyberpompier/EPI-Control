export interface EPI {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  statut: 'en_service' | 'en_reparation' | 'hors_service';
  image: string;
  personnel_id?: number;
}