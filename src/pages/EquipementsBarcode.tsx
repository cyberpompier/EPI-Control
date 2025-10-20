"use client";

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';

export default function EquipementsBarcode() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (codes: IDetectedBarcode[]) => {
    if (!isScanning || !codes?.length) return;
    const value = codes[0]?.rawValue;
    if (value) {
      setIsScanning(false);
      setScannedResult(value);
      console.log('Scanned result:', value);
    }
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-semibold">Scanner d'équipements</h1>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {isScanning ? (
          <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              components={{ torch: true, zoom: true }}
              styles={{
                container: { width: '100%', height: '100%' },
                video: { width: '100%', height: '100%', objectFit: 'cover' },
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-3">Résultat du scan</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Code détecté :</p>
              <p className="mt-2 p-3 bg-gray-100 rounded font-mono break-all">
                {scannedResult}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsScanning(true);
                  setScannedResult(null);
                }}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                Scanner à nouveau
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 transition"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}