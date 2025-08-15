"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Controle {
  id: string;
  name?: string;
  description?: string;
  // ajouter d'autres champs si nécessaire
}

const ControleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [controle, setControle] = useState<Controle | null>(null);

  useEffect(() => {
    if (id) {
      // Remplacer cette URL par l'endpoint de votre API ou votre logique de récupération
      fetch(`/api/controles/${id}`)
        .then((res) => res.json())
        .then((data) => setControle(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!controle) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Détails du contrôle</h1>
      <p>ID: {controle.id}</p>
      <p>Nom: {controle.name}</p>
      <p>Description: {controle.description}</p>
    </div>
  );
};

export default ControleDetail;