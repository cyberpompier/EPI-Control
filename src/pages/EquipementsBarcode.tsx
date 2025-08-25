import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, Search } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import { showError, showSuccess } from '@/utils/toast';

const EquipementsBarcode = () => {
  const [codeBarre, setCodeBarre] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [equipement, setEquipement] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScanResult = (result: string) => {
    setCodeBarre(result);
    setIsScanning(false);
    searchEquipement(result);
  };

  const handleScanError = (error: string) => {
    setIsScanning(false);
    showError(error);
  };

  const searchEquipement = async (code: string) => {
    if (!code) return;
    
    setLoading(true);
    try {
      // Simulation de recherche d'équipement
      // Remplacer par un appel API réel
      setTimeout(() => {
        setEquipement({
          id: 1,
          type: 'Casque F1',
          marque: 'ABC Safety',
          modele: 'ProTech 2000',
          numero_serie: code,
          date_mise_en_service: '2023-01-15',
          date_fin_vie: '2026-01-15',
          statut: 'en_service',
          personnel: {
            nom: 'Dupont',
            prenom: 'Jean',
            matricule: 'P001234'
          }
        });
        setLoading(false);
        showSuccess('Équipement trouvé');
      }, 1000);
    } catch (error) {
      setLoading(false);
      showError('Erreur lors de la recherche');
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchEquipement(codeBarre);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Équipements</h1>
        </div>
      </header>

      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Recherche par code-barres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="code-barre">Code-barres</Label>
                  <Input
                    id="code-barre"
                    value={codeBarre}
                    onChange={(e) => setCodeBarre(e.target.value)}
                    placeholder="Saisir ou scanner le code-barres"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsScanning(!isScanning)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isScanning ? 'Arrêter' : 'Scanner'}
                  </Button>
                </div>
              </form>

              {isScanning && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Scanner un code-barres</h3>
                  <div className="h-64 w-full relative">
                    <BarcodeScanner 
                      onResult={handleScanResult} 
                      onError={handleScanError} 
                    />
                  </div>
                </div>
              )}

              {equipement && (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{equipement.type}</h3>
                      <p className="text-gray-600">{equipement.marque} - {equipement.modele}</p>
                    </div>
                    <Badge variant={equipement.statut === 'en_service' ? 'default' : 'destructive'}>
                      {equipement.statut === 'en_service' ? 'En service' : 'Hors service'}
                    </Badge>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Numéro de série</Label>
                      <p>{equipement.numero_serie}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Date de mise en service</Label>
                      <p>{equipement.date_mise_en_service}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Date de fin de vie</Label>
                      <p>{equipement.date_fin_vie}</p>
                    </div>
                    {equipement.personnel && (
                      <div>
                        <Label className="text-sm text-gray-500">Assigné à</Label>
                        <p>{equipement.personnel.prenom} {equipement.personnel.nom} ({equipement.personnel.matricule})</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipementsBarcode;