export interface User {
  id: string; // UUID from auth.users
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'controleur' | 'pompier';
  caserne: string;
  grade: string;
  telephone?: string;
}

export interface EPI {
  id: string; // UUID
  type:
    | 'Casque F1'
    | 'Casque F2'
    | 'Parka'
    | 'Blouson Softshell'
    | 'Bottes à Lacets'
    | 'Gant de protection'
    | 'Pantalon TSI'
    | 'Veste TSI'
    | 'Veste de protection'
    | 'Surpantalon';
  marque: string;
  modele: string;
  numero_serie: string;
  date_mise_en_service: string;
  date_fin_vie: string;
  personnel_id: number; // Corresponds to personnel.id (bigint)
  statut: 'conforme' | 'non_conforme' | 'en_attente';
  created_at: string;
  personnel?: Pompier;
  image?: string; // Ajout de la propriété image
}

export interface Controle {
  id: string; // UUID
  equipement_id: string; // UUID
  controleur_id: string; // UUID from auth.users
  date_controle: string;
  resultat: 'conforme' | 'non_conforme';
  observations: string;
  photos: string[];
  actions_correctives: string;
  date_prochaine_verification: string;
  equipements?: EPI;
  pompier?: Pompier;
  controleur?: { prenom: string; nom: string; grade?: string; role?: string };
}

export interface Pompier {
  id: number; // bigint
  nom: string | null;
  prenom: string | null;
  matricule: string | null;
  caserne: string | null;
  grade: string | null;
  email: string | null;
  photo?: string | null;
}