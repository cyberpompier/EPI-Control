"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';
import EditPersonnelModal from './EditPersonnelModal';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  caserne: string;
  grade: string;
  matricule: string;
  photo: string;
}

interface PersonnelCardProps {
  personnel: Personnel;
  onPersonnelUpdate: (updatedPersonnel: Personnel) => void;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({ personnel, onPersonnelUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (updatedPersonnel: Personnel) => {
    onPersonnelUpdate(updatedPersonnel);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {personnel.photo ? (
              <img 
                src={personnel.photo} 
                alt={`${personnel.prenom} ${personnel.nom}`} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold">
                  {personnel.prenom?.charAt(0)}{personnel.nom?.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {personnel.prenom} {personnel.nom}
              </h3>
              <p className="text-sm text-gray-500 truncate">{personnel.grade}</p>
              <p className="text-sm text-gray-500 truncate">{personnel.caserne}</p>
              <p className="text-sm text-gray-500 truncate">{personnel.matricule}</p>
              {personnel.email && (
                <p className="text-sm text-gray-500 truncate">{personnel.email}</p>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <EditPersonnelModal
        personnel={personnel}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSave}
      />
    </>
  );
};

export default PersonnelCard;