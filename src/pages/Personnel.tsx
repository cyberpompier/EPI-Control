"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import PersonnelTable from '../components/PersonnelTable';
import AddPersonnelForm from '../components/AddPersonnelForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Personnel = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [personnelToEdit, setPersonnelToEdit] = useState(null);

  const handleAddPersonnel = () => {
    setPersonnelToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditPersonnel = (personnel) => {
    setPersonnelToEdit(personnel);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setPersonnelToEdit(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Gestion du Personnel</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleAddPersonnel}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un pompier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {personnelToEdit ? 'Modifier un pompier' : 'Ajouter un pompier'}
              </DialogTitle>
            </DialogHeader>
            <AddPersonnelForm 
              personnelToEdit={personnelToEdit}
              onClose={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <PersonnelTable onEdit={handleEditPersonnel} />
    </div>
  );
};

export default Personnel;