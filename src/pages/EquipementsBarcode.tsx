"use client";

import React, { useEffect, useState, Suspense, lazy } from 'react';

const ScannerLazy = lazy(() =>
  import('@yudiel/react-qr-scanner').then((m) => ({ default: m.Scanner }))
);

export default function EquipementsBarcode() {
  const [mounted, setMounted] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = (codes: any[]) => {
    if (!isScanning || !codes?.length) return;
    const value = codes[0]?.rawValue;
    if (value) {
      setIsScanning(false);
      setScannedResult(value);
      setErrorMsg(null);
      // console.log('Scanned result:', value);
    }
  };

  const handleError = (error: unknown) => {
    const message =
      typeof error === 'string'
        ? error
        : (error as any)?.message || 'Erreur inconnue du scanner.';
    setErrorMsg(message);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-semibold">Scanner d'équipements</h1>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {!mounted ? (
          <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
        ) : isScanning ? (
          <div className="space-y-4">
            {errorMsg && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMsg}
                <div className="mt-2 text-xs text-red-600">
                  Vérifiez les permissions caméra du navigateur puis réessayez.
                </div>
              </div>
            )}
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-white/80">
                    Chargement du scanner…
                  </div>
                }
              >
                <ScannerLazy
                  onScan={handleScan}
                  onError={handleError}
                  components={{ torch: true, zoom: true }}
                  styles={{
                    container: { width: '100%', height: '100%' },
                    video: { width: '100%', height: '100%', objectFit: 'cover' },
                  }}
                />
              </Suspense>
            </div>
            <p className="text-xs text-gray-600">
              Astuce: orientez le code vers la caméra et assurez-vous d’une bonne luminosité.
            </p>
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
                  setErrorMsg(null);
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