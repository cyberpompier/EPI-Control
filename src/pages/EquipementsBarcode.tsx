import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import BarcodeScanner from '@/components/BarcodeScanner';

export default function EquipementsBarcode() {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText: string) => {
    setScannedCode(decodedText);
    setIsScanning(false);
    
    try {
      // Rechercher l'équipement par numéro de série
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('numero_serie', decodedText)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        showError('Équipement non trouvé');
        return;
      }

      if (data) {
        showSuccess('Équipement trouvé !');
        navigate(`/equipement/${data.id}`);
      } else {
        showError('Équipement non trouvé');
      }
    } catch (error) {
      console.error('Error searching equipement:', error);
      showError('Erreur lors de la recherche de l\'équipement');
    }
  };

  const handleManualSearch = async () => {
    if (!manualCode.trim()) {
      showError('Veuillez entrer un code-barres');
      return;
    }

    try {
      // Rechercher l'équipement par numéro de série
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('numero_serie', manualCode)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        showError('Équipement non trouvé');
        return;
      }

      if (data) {
        showSuccess('Équipement trouvé !');
        navigate(`/equipement/${data.id}`);
      } else {
        showError('Équipement non trouvé');
      }
    } catch (error) {
      console.error('Error searching equipement:', error);
      showError('Erreur lors de la recherche de l\'équipement');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Recherche par code-barres</CardTitle>
          <CardDescription>
            Scannez ou entrez manuellement le code-barres d'un équipement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Scanner un code-barres</h3>
            
            {!isScanning ? (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  {scannedCode 
                    ? `Dernier code scanné : ${scannedCode}` 
                    : 'Cliquez sur le bouton pour activer le scanner'}
                </p>
                <Button onClick={() => setIsScanning(true)}>
                  Activer le scanner
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-64 rounded-md overflow-hidden border">
                  <BarcodeScanner onResult={handleScanSuccess} />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsScanning(false)}
                  className="w-full"
                >
                  Arrêter le scanner
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recherche manuelle</h3>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="manual-code">Code-barres</Label>
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Entrez le code-barres"
                />
              </div>
              <Button onClick={handleManualSearch} className="self-end">
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}