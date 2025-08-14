import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import React, { useEffect, useState } from 'react';

interface EquipementDetailProps {
  equipement?: any;
  pompier?: any;
}

export default function EquipementDetail({ equipement, pompier }: EquipementDetailProps) {
  // Vous pouvez utiliser useParams pour récupérer l'ID de l'équipement
  const { id } = useParams();
  // Si equipement ou pompier ne sont pas passés en props, vous pouvez ajouter la logique pour les récupérer
  // Par exemple, faire une requête à votre API avec l'ID et set les états correspondants

  return (
    <div className="p-4">
      {/* Détails de l'équipement */}
      <div className="mt-6">
        <Link to={pompier ? `/personnel/${pompier.id}` : '#'}>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={pompier ? `https://i.pravatar.cc/150?u=${pompier.id}` : ''} alt={pompier ? `${pompier.prenom} ${pompier.nom}` : 'Profil'} />
            </Avatar>
            <div>
              <p className="font-semibold group-hover:underline">{pompier ? `${pompier.prenom} ${pompier.nom}` : 'Nom du pompier'}</p>
              <p className="text-sm text-gray-500">{pompier ? pompier.grade : 'Grade inconnu'}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}