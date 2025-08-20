import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { showSuccess, showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import { supabase } from '@/lib/supabase';

export default function EquipementsBarcode() {
  const [scannedCode, setScannedCode] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText: string) => {
    if (scannedCode) return; // Empêche les scans multiples

    setScannedCode(decodedText);
    showSuccess("Code-barres scanné : " + decodedText);

    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('id')
        .eq('numero_serie', decodedText)
        .single();

      // PGRST116 est le code d'erreur pour "aucune ligne trouvée", ce qui est normal ici.
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        showSuccess("Équipement trouvé. Redirection vers la page de modification...");
        setTimeout(() => {
          navigate(`/equipements/${data.id}/modifier`);
        }, 1500);
      } else {
        showSuccess("Équipement non trouvé. Redirection vers la page de création...");
        setTimeout(() => {
          navigate(`/equipements/nouveau?barcode=${encodeURIComponent(decodedText)}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Erreur lors de la recherche de l'équipement:", err);
      showError(`Erreur lors de la recherche: ${err.message}`);
      setTimeout(() => setScannedCode(''), 2000); // Réinitialiser pour permettre un nouveau scan
    }
  };

  return (
    <Layout>
      <div className="p-4 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Scanner le code-barres</CardTitle>
          </CardHeader>
          <CardContent>
            {scannedCode ? (
              <div className="flex flex-col items-center justify-center h-64">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-lg font-semibold">Code-barres scanné avec succès !</p>
                <p className="text-gray-600 font-mono text-xl my-2">{scannedCode}</p>
                <p className="text-gray-500">Recherche de l'équipement en cours...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mt-4"></div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Veuillez placer le code-barres de l'équipement devant la caméra.
                </p>
                <div className="w-full rounded-md overflow-hidden border">
                  <BarcodeScanner onScanSuccess={handleScanSuccess} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}