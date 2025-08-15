import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerId = "html5qr-code-full-region";

  useEffect(() => {
    if (!scannerRef.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        scannerContainerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [], // Use all supported types
        },
        false // verbose
      );

      const successCallback = (decodedText: string) => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner.", error);
          });
          scannerRef.current = null; // Prevent further scans
        }
        onScanSuccess(decodedText);
      };

      const errorCallback = (errorMessage: string) => {
        if (onScanFailure) {
          // This callback can be very noisy, so we don't call it by default
          // onScanFailure(errorMessage);
        }
      };

      html5QrcodeScanner.render(successCallback, errorCallback);
      scannerRef.current = html5QrcodeScanner;
    }

    // Cleanup function to clear the scanner
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={scannerContainerId} style={{ width: '100%' }} />;
};

export default BarcodeScanner;