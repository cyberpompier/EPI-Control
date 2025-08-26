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

export interface Pompier {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  caserne: string;
  grade: string;
  photo: string;
  matricule: string;
}

export interface Controle {
  id: string;
  equipement_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  observations: string;
  photos: string[];
  actions_correctives: string;
  date_prochaine_verification: string;
  created_at: string;
}