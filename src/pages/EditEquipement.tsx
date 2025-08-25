import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

interface Equipement {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  date_fin_vie: string | null;
  statut: string;
  created_at: string;
  image: string | null;
}

const EditEquipement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState<Equipement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: '',
    date_fin_vie: '',
    statut: 'en_service',
  });

  useEffect(() => {
    if (!id) return;
    
    const fetchEquipement = async () => {
      try {
        const { data, error } = await supabase
          .from('equipements')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setEquipement(data);
        setFormData({
          type: data.type || '',
          marque: data.marque || '',
          modele: data.modele || '',
          numero_serie: data.numero_serie || '',
          date_mise_en_service: data.date_mise_en_service || '',
          date_fin_vie: data.date_fin_vie || '',
          statut: data.statut || 'en_service',
        });
      } catch (error) {
        console.error('Erreur lors du chargement de l\'équipement:', error);
        showError('Impossible de charger l\'équipement');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipement();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('equipements')
        .update({
          type: formData.type,
          marque: formData.marque || null,
          modele: formData.modele || null,
          numero_serie: formData.numero_serie,
          date_mise_en_service: formData.date_mise_en_service || null,
          date_fin_vie: formData.date_fin_vie || null,
          statut: formData.statut,
        })
        .eq('id', id);

      if (error) throw error;

      showSuccess('Équipement mis à jour avec succès');
      navigate(`/equipement/${id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      showError('Impossible de mettre à jour l\'équipement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!equipement) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Équipement non trouvé
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Modifier l'équipement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'équipement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="type">Type d'équipement *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="numero_serie">Numéro de série *</Label>
                <Input
                  id="numero_serie"
                  value={formData.numero_serie}
                  onChange={(e) => handleChange('numero_serie', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="marque">Marque</Label>
                <Input
                  id="marque"
                  value={formData.marque}
                  onChange={(e) => handleChange('marque', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="modele">Modèle</Label>
                <Input
                  id="modele"
                  value={formData.modele}
                  onChange={(e) => handleChange('modele', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date_mise_en_service">Date de mise en service</Label>
                <Input
                  id="date_mise_en_service"
                  type="date"
                  value={formData.date_mise_en_service}
                  onChange={(e) => handleChange('date_mise_en_service', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date_fin_vie">Date de fin de vie</Label>
                <Input
                  id="date_fin_vie"
                  type="date"
                  value={formData.date_fin_vie}
                  onChange={(e) => handleChange('date_fin_vie', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="statut">Statut *</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_service">En service</SelectItem>
                    <SelectItem value="en_reparation">En réparation</SelectItem>
                    <SelectItem value="hors_service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={saving}>
                {saving ? (
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

export default EditEquipement;