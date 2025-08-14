import React from 'react';
import { Link } from 'react-router-dom';

const EquipementDetail: React.FC = () => {
  // Pour résoudre les erreurs de compilation, une variable fictive "pompier" est définie.
  // Remplacez-la par les données réelles récupérées pour l'équipement.
  const pompier = {
    prenom: "John",
    nom: "Doe",
    grade: "Caporal"
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Détail de l'équipement</h1>
      <Link to={`/profile/${pompier.nom.toLowerCase()}-${pompier.prenom.toLowerCase()}`}>
        <div>
          <p className="font-semibold group-hover:underline">Voir le profil de {pompier.prenom} {pompier.nom}</p>
          <p className="text-sm text-gray-500">{pompier.grade}</p>
        </div>
      </Link>
    </div>
  );
};

export default EquipementDetail;