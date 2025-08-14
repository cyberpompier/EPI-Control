export interface User {
  id: string; // UUID from auth.users
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'controleur' | 'pompier';
  caserne: string;
}

export interface EPI {
  id: string; // UUID
  type: 'casque' | 'veste' | 'surpantalon' | 'gants' | 'rangers' | 'autre';
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  pompier_id: number; // Corresponds to personnel.id (bigint)
  statut: 'conforme' | 'non_conforme' | 'en_attente';
}

export interface Controle {
  id: string; // UUID
  epi_id: string; // UUID
  controleur_id: string; // UUID from auth.users
  date_controle: string;
  resultat: 'conforme' | 'non_conforme';
  observations: string;
  photos: string[];
  actions_correctives: string;
  date_prochaine_verification: string;
}

export interface Pompier {
  id: number; // bigint
  nom: string;
  prenom: string;
  matricule: string;
  caserne: string;
  grade: string;
  email: string;
}