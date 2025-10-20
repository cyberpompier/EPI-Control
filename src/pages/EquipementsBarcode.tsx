
Then, I'll include the entire file content with modifications, keeping the consistent UI structure. In the `handleScan` function, I'll ensure it processes a detected barcode array. I’ll proceed without adding any TODO notes, and I’ll finish with a one-sentence summary and the appropriate chat summary tag.[REDACTED]</think>Je corrige la signature de la fonction de callback pour correspondre au type attendu par Scanner (tableau de codes détectés).

<dyad-write path="src/pages/EquipementsBarcode.tsx" description="Fix onScan handler to accept IDetectedBarcode[] and extract rawValue">
"use client";

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';

export default function EquipementsBarcode() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (!isScanning || !detectedCodes?.length) return;
    const value = detectedCodes[0]?.rawValue || '';
    if (value) {
      setIsScanning(false);
      setScannedResult(value);
      console.log('Scanned result:', value);
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
            <Scanner onScan={handleScan} onError={handleError} />
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