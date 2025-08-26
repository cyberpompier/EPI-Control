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