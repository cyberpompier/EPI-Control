import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

export default function EquipementsBarcode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Get personnel_id from URL query params
  const urlParams = new URLSearchParams(location.search);
  const personnelId = urlParams.get('personnel_id');

  useEffect(() => {
    if (personnelId) {
      fetchPersonnelDetails(parseInt(personnelId));
    }
  }, [personnelId]);

  const fetchPersonnelDetails = async (id: number) => {
    const { data, error } = await supabase
      .from('personnel')
      .select('id, nom, prenom')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching personnel:', error);
    } else {
      setPersonnel(data);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode) {
      await processBarcode(manualCode);
    }
  };

  const processBarcode = async (barcode: string) => {
    setLoading(true);
    try {
      // Check if equipment exists
      const { data: equipement, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('numero_serie', barcode)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (equipement) {
        // Equipment exists, redirect to detail page
        navigate(`/equipements/${equipement.id}`);
        showSuccess('Équipement trouvé');
      } else {
        // Equipment doesn't exist, redirect to create page with barcode prefilled
        navigate(`/equipements/new?barcode=${barcode}${personnelId ? `&personnel_id=${personnelId}` : ''}`);
        showSuccess('Nouvel équipement à créer');
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      showError('Erreur lors du traitement du code-barres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout headerTitle={personnel ? `Scanner pour ${personnel.prenom} ${personnel.nom}` : "Scanner un équipement"}>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Saisir un code-barres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personnel && (
              <div className="text-center p-2 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Assignation à: {personnel.prenom} {personnel.nom}
                </p>
              </div>
            )}
            
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <Label htmlFor="manualCode">Saisir le code manuellement</Label>
              <div className="flex gap-2">
                <Input
                  id="manualCode"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Code-barres"
                />
                <Button type="submit" disabled={!manualCode || loading}>
                  Valider
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}