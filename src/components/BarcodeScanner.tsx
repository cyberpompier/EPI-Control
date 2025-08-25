import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { showError } from '@/utils/toast';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

const BarcodeScanner = ({ onResult, onError }: BarcodeScannerProps) => {
  const scannerContainerId = 'barcode-scanner-container';
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const selectedDeviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Récupérer les préférences sauvegardées
        const savedDeviceId = localStorage.getItem('barcodeScannerDeviceId');
        selectedDeviceIdRef.current = savedDeviceId;

        // Créer le lecteur
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Obtenir la liste des appareils vidéo
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          throw new Error('Aucune caméra trouvée');
        }

        // Sélectionner la caméra (utiliser la préférée ou la première disponible)
        const deviceId = savedDeviceId && videoInputDevices.some(device => device.deviceId === savedDeviceId)
          ? savedDeviceId
          : videoInputDevices[0].deviceId;

        selectedDeviceIdRef.current = deviceId;
        
        // Sauvegarder le choix de la caméra
        localStorage.setItem('barcodeScannerDeviceId', deviceId);

        // Démarrer la lecture
        await startDecoding(deviceId);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du scanner:', error);
        showError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
        if (onError) onError('Impossible d\'accéder à la caméra');
      }
    };

    const startDecoding = async (deviceId: string) => {
      if (!codeReaderRef.current) return;

      try {
        await codeReaderRef.current.decodeFromVideoDevice(
          deviceId,
          scannerContainerId,
          (result, _, controls) => {
            if (result) {
              // Arrêter le scanner après la première lecture
              controls.stop();
              onResult(result.getText());
            }
          }
        );
      } catch (error) {
        if (error.name === 'NotFoundException') {
          // Aucun code-barres trouvé, continuer à scanner
          return;
        }
        console.error('Erreur lors du décodage:', error);
        showError('Erreur lors de la lecture du code-barres');
        if (onError) onError('Erreur lors de la lecture du code-barres');
      }
    };

    initializeScanner();

    // Nettoyage
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.stop();
      }
    };
  }, [onResult, onError]);

  return (
    <div 
      id={scannerContainerId} 
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default BarcodeScanner;