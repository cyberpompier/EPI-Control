import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { showSuccess, showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle } from 'lucide-react';

export default function EquipementsBarcode() {
  const [scannedCode, setScannedCode] = useState('');
  const navigate = useNavigate();

  const handleResult = (result: any, error: any) => {
    if (result && !scannedCode) {
      const code = result.getText();
      if (code) {
        setScannedCode(code);
        showSuccess("Code-barres scanné : " + code);
        setTimeout(() => {
          navigate(`/equipements/nouveau?barcode=${encodeURIComponent(code)}`);
        }, 1500);
      }
    }

    if (error) {
      // Cette erreur se déclenche en continu lorsqu'aucun code-barres n'est trouvé,
      // il n'est donc pas utile d'afficher une notification à l'utilisateur.
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
                <p className="text-gray-500">Vous allez être redirigé...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mt-4"></div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Veuillez placer le code-barres de l'équipement devant la caméra.
                </p>
                <div className="relative w-full aspect-video bg-gray-200 rounded-md overflow-hidden border">
                  <QrReader
                    onResult={handleResult}
                    constraints={{ facingMode: 'environment' }}
                    containerStyle={{ width: '100%', height: '100%' }}
                    videoContainerStyle={{ width: '100%', height: '100%', paddingTop: 0 }}
                    videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">En attente du scan...</p>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 border-2 border-red-500 border-dashed rounded-lg"></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}