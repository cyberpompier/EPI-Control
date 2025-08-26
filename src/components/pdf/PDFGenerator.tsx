"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

type AnyRecord = Record<string, any>;

async function imageToJpegDataUrl(src: string, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Important pour éviter un canvas 'tainted' si l'image est hébergée ailleurs (ex: Supabase storage)
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas non supporté"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = src;
  });
}

interface PDFGeneratorProps extends AnyRecord {
  // Props inconnues du parent conservées via index signature
}

export default function PDFGenerator(props: PDFGeneratorProps) {
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Titre
    const title =
      props?.title ??
      props?.titre ??
      props?.equipement?.type ??
      props?.epi?.type ??
      "Rapport équipement";
    doc.setFontSize(16);
    doc.text(String(title), 14, 15);

    // Déterminer une URL d'image si elle existe dans les props usuelles
    const imageUrl: string | null =
      props?.imageUrl ??
      props?.image ??
      props?.equipement?.image ??
      props?.epi?.image ??
      props?.equipment?.image ??
      null;

    // Convertir l'image en JPEG DataURL avant de l'ajouter pour éviter l'erreur PNG corrompu
    if (imageUrl) {
      const jpegDataUrl = await imageToJpegDataUrl(imageUrl).catch(() => null);
      if (jpegDataUrl) {
        // Utiliser 'JPEG' explicitement
        doc.addImage(jpegDataUrl, "JPEG", 14, 22, 60, 60);
      }
    }

    // Infos additionnelles simples si disponibles (facultatif, ne casse rien si absent)
    const numeroSerie =
      props?.numero_serie ??
      props?.equipement?.numero_serie ??
      props?.epi?.numero_serie ??
      null;
    const modele =
      props?.modele ?? props?.equipement?.modele ?? props?.epi?.modele ?? null;

    doc.setFontSize(11);
    let y = 90;
    if (modele) {
      doc.text(`Modèle: ${String(modele)}`, 14, y);
      y += 7;
    }
    if (numeroSerie) {
      doc.text(`N° série: ${String(numeroSerie)}`, 14, y);
      y += 7;
    }

    doc.save("equipement.pdf");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generatePDF}
        className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
      >
        Générer le PDF
      </Button>
    </div>
  );
}