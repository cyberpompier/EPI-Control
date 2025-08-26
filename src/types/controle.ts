export type ControleResultat = 'conforme' | 'non_conforme' | 'en_attente';

export interface Controle {
  id: string;
  equipement_id: string;
  controleur_id: string;
  date_controle: string;
  resultat: ControleResultat;
  observations?: string | null;
  photos?: string[] | null;
  actions_correctives?: string | null;
  date_prochaine_verification?: string | null;
  created_at?: string | null;
}