import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSession } from '@/components/auth/SessionProvider';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ControleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    resultat: 'conforme' as 'conforme' | 'non_conforme',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResultatChange = (value: string) => {
    setFormData(prev => ({ ...prev, resultat: value as 'conforme' | 'non_conforme' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Vous devez être connecté pour effectuer un contrôle');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('controles')
        .insert({
          equipement_id: id,
          controleur_id: user.id,
          resultat: formData.resultat,
          observations: formData.observations,
          actions_correctives: formData.resultat === 'non_conforme' ? formData.actions_correctives : null,
          date_prochaine_verification: formData.date_prochaine_verification || null
        });

      if (error) throw error;

      // Mise à jour du statut de l'équipement
      const { error: updateError } = await supabase
        .from('equipements')
        .update({ statut: formData.resultat })
        .eq('id', id);

      if (updateError) throw updateError;

      showSuccess('Contrôle enregistré avec succès');
      navigate('/equipements');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du contrôle:', error);
      showError('Erreur lors de l\'enregistrement du contrôle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nouveau contrôle</h1>
        <p className="text-gray-600">Effectuez un contrôle sur l'équipement sélectionné</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations du contrôle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Résultat du contrôle</Label>
              <RadioGroup 
                value={formData.resultat} 
                onValueChange={handleResultatChange}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conforme" id="conforme" />
                  <Label htmlFor="conforme" className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" />
                    Conforme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_conforme" id="non_conforme" />
                  <Label htmlFor="non_conforme" className="flex items-center gap-2">
                    <AlertTriangle className="text-red-600" />
                    Non conforme
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Décrivez les observations du contrôle..."
                rows={4}
              />
            </div>

            {formData.resultat === 'non_conforme' && (
              <div className="space-y-2">
                <Label htmlFor="actions_correctives">Actions correctives</Label>
                <Textarea
                  id="actions_correctives"
                  name="actions_correctives"
                  value={formData.actions_correctives}
                  onChange={handleInputChange}
                  placeholder="Décrivez les actions correctives à entreprendre..."
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date_prochaine_verification">Date de prochaine vérification</Label>
              <Input
                type="date"
                id="date_prochaine_verification"
                name="date_prochaine_verification"
                value={formData.date_prochaine_verification}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate('/equipements')}>Annuler</Button>
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Enregistrement..." : "Enregistrer le contrôle"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
}