import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Camera, Scan, Search } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const EquipementsBarcode = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const selectedDeviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Activer automatiquement le scanner à l'ouverture de la page
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScannedCode(null);
      
      // Créer le lecteur
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      // Obtenir la liste des appareils vidéo
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('Aucune caméra trouvée');
      }

      // Sélectionner la caméra (arrière par défaut, avant si demandé)
      let deviceId = '';
      if (useFrontCamera) {
        // Chercher la caméra frontale
        const frontCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('avant')
        );
        deviceId = frontCamera ? frontCamera.deviceId : videoInputDevices[0].deviceId;
      } else {
        // Chercher la caméra arrière
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('arrière') ||
          device.label.toLowerCase().includes('rear')
        );
        deviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;
      }

      selectedDeviceIdRef.current = deviceId;
      
      // Démarrer la lecture
      if (videoRef.current && codeReaderRef.current) {
        await codeReaderRef.current.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, _, controls) => {
            if (result) {
              // Arrêter le scanner après la première lecture
              controls.stop();
              const code = result.getText();
              setScannedCode(code);
              setIsScanning(false);
              // Rechercher l'équipement dans la base de données
              searchEquipment(code);
            }
          }
        );
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      showError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setIsScanning(false);
    }
  };

  const searchEquipment = async (code: string) => {
    try {
      // Rechercher l'équipement par numéro de série
      const { data, error } = await supabase
        .from('equipements')
        .select('id')
        .eq('numero_serie', code)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Rediriger vers la page de détail de l'équipement
        navigate(`/equipements/${data.id}`);
      } else {
        // Si aucun équipement n'est trouvé, afficher un message
        showError('Aucun équipement trouvé avec ce code-barres');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'équipement:', error);
      showError('Erreur lors de la recherche d\'équipement');
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      try {
        (codeReaderRef.current as any).stopAsync();
      } catch (e) {
        // Si stopAsync n'existe pas, on essaie reset
        try {
          (codeReaderRef.current as any).reset();
        } catch (e2) {
          // Si reset n'existe pas non plus, on ignore
          console.warn('Impossible d\'arrêter le scanner proprement', e2);
        }
      }
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSearch = async () => {
    if (manualCode.trim()) {
      await searchEquipment(manualCode.trim());
    }
  };

  const toggleCamera = () => {
    stopScanning();
    setUseFrontCamera(!useFrontCamera);
    setTimeout(() => {
      startScanning();
    }, 500);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scan className="h-5 w-5 mr-2" />
            Scanner de codes-barres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Vue de la caméra */}
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {isScanning ? (
                <>
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-white rounded-lg w-64 h-64 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    {scannedCode 
                      ? `Dernier code scanné : ${scannedCode}` 
                      : 'Scanner un code-barres'}
                  </p>
                  <Button onClick={startScanning}>Activer la caméra</Button>
                </div>
              )}
            </div>

            {/* Contrôle de la caméra */}
            <div className="flex items-center justify-between">
              <Label htmlFor="front-camera">Utiliser la caméra frontale</Label>
              <Switch
                id="front-camera"
                checked={useFrontCamera}
                onCheckedChange={toggleCamera}
              />
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou rechercher manuellement
                </span>
              </div>
            </div>

            {/* Recherche manuelle */}
            <div className="flex space-x-2">
              <Input
                placeholder="Entrez le code-barres"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Button onClick={handleManualSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipementsBarcode;