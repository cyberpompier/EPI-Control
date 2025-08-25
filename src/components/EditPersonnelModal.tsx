"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PersonnelEditForm from './PersonnelEditForm';

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

interface EditPersonnelModalProps {
  personnel: Personnel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedPersonnel: Personnel) => void;
}

const EditPersonnelModal: React.FC<EditPersonnelModalProps> = ({ 
  personnel, 
  open, 
  onOpenChange,
  onSave
}) => {
  if (!personnel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le personnel</DialogTitle>
        </DialogHeader>
        <PersonnelEditForm 
          personnel={personnel} 
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonnelModal;