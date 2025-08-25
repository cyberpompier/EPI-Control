import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const NewControleForm = () => {
  const { equipementId } = useParams<{ equipementId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resultat: '',
    observations: '',
    actions_correctives: '',
    date_prochaine_verification: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipementId) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { error } = await supabase
        .from('controles')
        .insert({
          equipement_id: equipementId,
          controleur_id: user.id,
          date_controle: new Date().toISOString(),
          resultat: formData.resultat,
          observations: formData.observations || null,
          actions_correctives: formData.actions_correctives || null,
          date_prochaine_verification: formData.date_prochaine_verification || null,
        });

      if (error) throw error;

      showSuccess('Contrôle enregistré avec succès');
      navigate(`/equipement/${equipementId}`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      showError('Impossible d\'enregistrer le contrôle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Nouveau contrôle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du contrôle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="resultat">Résultat *</Label>
                <Select value={formData.resultat} onValueChange={(value) => handleChange('resultat', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un résultat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="conditionnel">Conditionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date_prochaine_verification">Date prochaine vérification</Label>
                <Input
                  id="date_prochaine_verification"
                  type="date"
                  value={formData.date_prochaine_verification}
                  onChange={(e) => handleChange('date_prochaine_verification', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="actions_correctives">Actions correctives</Label>
                <Textarea
                  id="actions_correctives"
                  value={formData.actions_correctives}
                  onChange={(e) => handleChange('actions_correctives', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewControleForm;