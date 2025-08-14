import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Controle, EPI, Pompier } from '@/types/index';

interface PDFGeneratorProps {
  controle: Controle;
  epi: EPI;
  pompier: Pompier;
  controleur: {
    nom: string;
    prenom: string;
    grade: string;
  };
}

export default function PDFGenerator({ controle, epi, pompier, controleur }: PDFGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Rapport_Controle_EPI_${epi.type}_${pompier.nom}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={generatePDF} 
        className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Télécharger le rapport PDF
      </Button>
      
      <div className="hidden">
        <div ref={reportRef} className="p-8 bg-white w-[210mm]">
          <div className="border-b-2 border-red-600 pb-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-red-600">RAPPORT DE CONTRÔLE EPI</h1>
                <p className="text-gray-600">Service Départemental d'Incendie et de Secours</p>
              </div>
              <div className="text-right">
                <p className="font-bold">N° {controle.id}</p>
                <p>Date: {new Date(controle.date_controle).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-bold mb-2 text-red-600">Informations Pompier</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-2">Nom:</td>
                    <td>{pompier.nom}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Prénom:</td>
                    <td>{pompier.prenom}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Matricule:</td>
                    <td>{pompier.matricule}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Grade:</td>
                    <td>{pompier.grade}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Caserne:</td>
                    <td>{pompier.caserne}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-2 text-red-600">Informations Équipement</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-2">Type:</td>
                    <td>{epi.type}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Marque:</td>
                    <td>{epi.marque}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Modèle:</td>
                    <td>{epi.modele}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">N° Série:</td>
                    <td>{epi.numero_serie}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Mise en service:</td>
                    <td>{new Date(epi.date_mise_en_service).toLocaleDateString('fr-FR')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2">Fin de vie:</td>
                    <td>{new Date(epi.date_fin_vie).toLocaleDateString('fr-FR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-red-600">Résultat du contrôle</h2>
            <div className={`p-2 rounded-md ${controle.resultat === 'conforme' ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-bold">
                {controle.resultat === 'conforme' ? 'CONFORME' : 'NON CONFORME'}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-red-600">Observations</h2>
            <p className="p-2 border rounded-md min-h-[100px] text-sm">{controle.observations}</p>
          </div>
          
          {controle.resultat === 'non_conforme' && controle.actions_correctives && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 text-red-600">Actions correctives</h2>
              <p className="p-2 border rounded-md min-h-[80px] text-sm">{controle.actions_correctives}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-red-600">Prochain contrôle</h2>
            <p className="font-semibold">
              Date: {new Date(controle.date_prochaine_verification).toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          {controle.photos && controle.photos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 text-red-600">Photos</h2>
              <div className="grid grid-cols-2 gap-2">
                {controle.photos.map((photo, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold mb-1">Contrôleur</h3>
                <p>{controleur.grade} {controleur.prenom} {controleur.nom}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold mb-1">Signature</h3>
                <div className="h-16 w-40 border-b border-black"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Ce document est un rapport officiel de contrôle des Équipements de Protection Individuelle.</p>
            <p>SDIS - Service Départemental d'Incendie et de Secours</p>
          </div>
        </div>
      </div>
    </div>
  );
}