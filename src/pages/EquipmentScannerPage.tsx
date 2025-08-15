import React, { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import EquipmentForm from '@/components/EquipmentForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EquipmentScannerPage = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [equipmentData, setEquipmentData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState<'scanning' | 'form'>('scanning');

  const handleScanSuccess = async (decodedText: string) => {
    setIsLoading(true);
    setScannedCode(decodedText);
    toast.loading("Recherche de l'équipement...");

    const { data, error } = await supabase
      .from('equipements')
      .select('*, personnel(nom, prenom)')
      .eq('numero_serie', decodedText)
      .single();

    toast.dismiss();

    if (error && error.code !== 'PGRST116') {
      toast.error('Erreur lors de la recherche.');
      setIsLoading(false);
      return;
    }

    if (data) {
      toast.success('Équipement trouvé !');
      setEquipmentData(data);
    } else {
      toast('Équipement inconnu. Créez une nouvelle fiche.');
      setEquipmentData(null);
    }
    setIsLoading(false);
    setView('form');
  };

  const resetScanner = () => {
    setScannedCode(null);
    setEquipmentData(null);
    setView('scanning');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scanner un équipement</h1>
      
      {view === 'scanning' && (
        <div className="max-w-md mx-auto border rounded-lg p-4">
          <p className="text-center mb-2 text-gray-600">Veuillez scanner le code-barres.</p>
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            onScanFailure={(err) => console.warn(err)}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Chargement...</p>
        </div>
      )}

      {view === 'form' && scannedCode && (
        <div>
          <EquipmentForm
            scannedCode={scannedCode}
            initialData={equipmentData}
            onSave={resetScanner}
          />
          <Button 
            variant="link"
            onClick={resetScanner} 
            className="mt-4"
          >
            Scanner un autre équipement
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquipmentScannerPage;