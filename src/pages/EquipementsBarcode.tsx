import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { showSuccess, showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';

export default function EquipementsBarcode() {
  const [scannedCode, setScannedCode] = useState('');
  const navigate = useNavigate();

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedCode(data);
      showSuccess("Code scanné: " + data);
      // Redirection vers la page d'ajout avec le code scanné
      setTimeout(() => {
        navigate(`/equipements/nouveau?barcode=${encodeURIComponent(data)}`);
      }, 1500);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    showError("Erreur lors du scan du code barre");
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Scanner le code barre</h1>
        <div className="mb-4">
          <BarcodeReader 
            onError={handleError} 
            onScan={handleScan} 
            style={{ 
              width: "100%", 
              height: "300px", 
              minHeight: "300px", 
              border: "1px solid #ddd" 
            }}
          />
        </div>
        {scannedCode && (
          <div className="mt-4">
            <p className="text-green-600">Code scanné: {scannedCode}</p>
            <Button 
              onClick={() => navigate(`/equipements/nouveau?barcode=${encodeURIComponent(scannedCode)}`)} 
              className="bg-red-600 hover:bg-red-700"
            >
              Continuer
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}