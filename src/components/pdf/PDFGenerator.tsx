"use client";

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Controle } from '@/types/controle';
import { EPI } from '@/types/epi';
import { Pompier } from '@/types/personnel';

interface PDFGeneratorProps {
  controle: Controle;
  epi: EPI;
  pompier: Pompier;
  controleur: any; // Add controleur property to fix TS2322 error
}

const PDFGenerator = ({ controle, epi, pompier, controleur }: PDFGeneratorProps) => {
  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Rapport de Contrôle', 105, 20, { align: 'center' });
    
    // Add EPI information
    doc.setFontSize(12);
    doc.text(`Équipement: ${epi.type}`, 20, 40);
    doc.text(`Marque: ${epi.marque}`, 20, 50);
    doc.text(`Modèle: ${epi.modele}`, 20, 60);
    doc.text(`N° de série: ${epi.numero_serie}`, 20, 70);
    
    // Add personnel information
    doc.text(`Pompier: ${pompier.prenom} ${pompier.nom}`, 20, 90);
    doc.text(`Matricule: ${pompier.matricule}`, 20, 100);
    
    // Add control information
    doc.text(`Date du contrôle: ${new Date(controle.date_controle).toLocaleDateString('fr-FR')}`, 20, 120);
    doc.text(`Résultat: ${controle.resultat}`, 20, 130);
    doc.text(`Observations: ${controle.observations}`, 20, 140);
    
    // Add controller information if available
    if (controleur) {
      doc.text(`Contrôleur: ${controleur.first_name} ${controleur.last_name}`, 20, 150);
    }
    
    // Save the PDF
    doc.save(`controle-${epi.numero_serie}-${controle.date_controle}.pdf`);
  };

  return (
    <button 
      onClick={generatePDF}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Générer le PDF
    </button>
  );
};

export default PDFGenerator;