export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'controleur' | 'pompier';
  caserne: string;
}

export interface EPI {
  id: string;
  type: 'casque' | 'veste' | 'surpantalon' | 'gants' | 'rangers' | 'autre';
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  pompier_id: string;
  statut: 'conforme' | 'non_conforme' | 'en_attente';
}

export interface Controle {
  id: string;
  epi_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: 'conforme' | 'non_conforme';
  observations: string;
  photos: string[];
  actions_correctives: string;
  date_prochaine_verification: string;
}

export interface Pompier {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  caserne: string;
  grade: string;
  email: string;
}