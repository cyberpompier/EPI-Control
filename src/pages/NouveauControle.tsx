import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { showSuccess, showError } from '@/utils/toast';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';

const NouveauControle = () => {
  const { equipementId } = useParams<{ equipementId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipement, setEquipement] = useState<any>(null);
  const [resultat, setResultat] = useState('');
  const [observations, setObservations] = useState('');
  const [actionsCorrectives, setActionsCorrectives] = useState('');
  const [dateProchaineVerification, setDateProchaineVerification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipementId) {
      const fetchEquipement = async () => {
        const { data, error } = await supabase
          .from('equipements')
          .select('*')
          .eq('id', equipementId)
          .single();
        
        if (error) {
          showError("Erreur lors de la récupération de l'équipement.");
          console.error(error);
        } else {
          setEquipement(data);
        }
      };
      fetchEquipement();
    }
  }, [equipementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultat || !user || !equipementId) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('controles').insert({
      equipement_id: equipementId,
      controleur_id: user.id,
      date_controle: new Date().toISOString(),
      resultat,
      observations,
      actions_correctives: actionsCorrectives,
      date_prochaine_verification: dateProchaineVerification || null,
    });

    setLoading(false);

    if (error) {
      showError('Erreur lors de la création du contrôle.');
      console.error(error);
    } else {
      showSuccess('Contrôle enregistré avec succès !');
      navigate('/controles');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Nouveau Contrôle | EPI Control</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Link to="/controles" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux contrôles
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer un nouveau contrôle</CardTitle>
            {equipement && <CardDescription>Pour l'équipement : {equipement.marque} {equipement.modele} (N/S: {equipement.numero_serie})</CardDescription>}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="resultat">Résultat du contrôle *</Label>
                <Select onValueChange={setResultat} value={resultat} required>
                  <SelectTrigger id="resultat">
                    <SelectValue placeholder="Sélectionner un résultat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Détails sur l'état de l'équipement..."
                />
              </div>
              <div>
                <Label htmlFor="actionsCorrectives">Actions correctives (si non conforme)</Label>
                <Textarea
                  id="actionsCorrectives"
                  value={actionsCorrectives}
                  onChange={(e) => setActionsCorrectives(e.target.value)}
                  placeholder="Mesures prises ou à prendre..."
                />
              </div>
              <div>
                <Label htmlFor="dateProchaineVerification">Date de la prochaine vérification</Label>
                <Input
                  id="dateProchaineVerification"
                  type="date"
                  value={dateProchaineVerification}
                  onChange={(e) => setDateProchaineVerification(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Enregistrement...' : 'Enregistrer le contrôle'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NouveauControle;