import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { showError } from '@/utils/toast';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

const BarcodeScanner = ({ onResult, onError }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Obtenir la liste des appareils vidéo
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          throw new Error('Aucune caméra trouvée');
        }

        // Sélectionner la première caméra disponible
        const deviceId = videoInputDevices[0].deviceId;

        // Démarrer la lecture
        if (videoRef.current && codeReaderRef.current) {
          await codeReaderRef.current.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result, _, controls) => {
              if (result) {
                // Arrêter le scanner après la première lecture
                controls.stop();
                onResult(result.getText());
              }
            }
          );
        }
      } catch (error: any) {
        console.error('Erreur lors de l\'initialisation du scanner:', error);
        showError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
        if (onError) onError('Impossible d\'accéder à la caméra');
      }
    };

    initializeScanner();

    // Nettoyage
    return () => {
      if (codeReaderRef.current) {
        try {
          // @ts-ignore - contournement de l'erreur TypeScript
          codeReaderRef.current.reset();
        } catch (error) {
          console.warn('Erreur lors du reset du scanner:', error);
        }
      }
    };
  }, [onResult, onError]);

  return (
    <div className="w-full h-full">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BarcodeScanner;