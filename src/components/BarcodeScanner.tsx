import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const scannerContainerId = "reader";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const BarcodeScanner = ({ onScanSuccess, onScanFailure }: BarcodeScannerProps) => {
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerContainerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    let isScanning = true;

    const successCallback = (decodedText: string, decodedResult: any) => {
        if (isScanning) {
            isScanning = false;
            html5QrcodeScanner.clear();
            onScanSuccess(decodedText);
        }
    };

    html5QrcodeScanner.render(successCallback, onScanFailure);

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.getState()) {
          html5QrcodeScanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner.", error);
          });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={scannerContainerId} style={{ width: '100%' }} />;
};

export default BarcodeScanner;