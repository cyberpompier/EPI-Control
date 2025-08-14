export interface Pompier {
  id: number;
  nom: string | null;
  email: string | null;
  prenom: string | null;
  caserne: string | null;
  grade: string | null;
  photo: string | null;
  matricule: string | null;
}

export interface EPI {
  id: string;
  type: string;
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  personnel_id: number | null;
  statut: 'conforme' | 'non_conforme' | 'en_attente';
  created_at?: string;
}

export interface Controle {
  id: string;
  equipement_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  observations: string;
  photos?: string[];
  actions_correctives?: string;
  date_prochaine_verification?: string;
  created_at?: string;
  controleur?: {
    prenom: string;
    nom: string;
  };
}