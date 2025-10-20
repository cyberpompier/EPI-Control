"use client";

import React, { useRef, useState, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';

export default function EquipementsBarcode() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  
  const handleScan = (result: string) => {
    if (result && isScanning) {
      setIsScanning(false);
      setScannedResult(result);
      // Here you would typically navigate to the equipment details page
      console.log('Scanned result:', result);
    }
  };

  const handleError = (error: Error) => {
    console.error('QR Scan Error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Scanner d'équipements</h1>
        </div>
      </div>

      <div className="flex-1 relative">
        {isScanning ? (
          <>
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              containerStyle={{ width: '100%', height: '100%' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-4 border-2 border-white rounded-sm animate-pulse">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Résultat du scan</h2>
              <div className="mb-4">
                <p className="text-gray-600">Code-barres détecté :</p>
                <p className="mt-2 p-3 bg-gray-100 rounded font-mono break-all">{scannedResult}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsScanning(true);
                    setScannedResult(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Scanner à nouveau
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}