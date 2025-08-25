"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';

const AddPersonnelForm = ({ personnelToEdit, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matricule: '',
    caserne: '',
    grade: ''
  });
  const supabase = createClient();

  useEffect(() => {
    if (personnelToEdit) {
      setFormData({
        nom: personnelToEdit.nom || '',
        prenom: personnelToEdit.prenom || '',
        matricule: personnelToEdit.matricule || '',
        caserne: personnelToEdit.caserne || '',
        grade: personnelToEdit.grade || ''
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        matricule: '',
        caserne: '',
        grade: ''
      });
    }
  }, [personnelToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (personnelToEdit) {
        // Update existing personnel
        const { error } = await supabase
          .from('personnel')
          .update(formData)
          .eq('id', personnelToEdit.id);

        if (error) throw error;
        toast.success('Pompier mis à jour avec succès');
      } else {
        // Create new personnel
        const { error } = await supabase
          .from('personnel')
          .insert([formData]);

        if (error) throw error;
        toast.success('Pompier ajouté avec succès');
      }
      
      onClose();
    } catch (error) {
      toast.error(personnelToEdit 
        ? 'Erreur lors de la mise à jour du pompier' 
        : 'Erreur lors de l\'ajout du pompier');
      console.error('Error saving personnel:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="matricule">Matricule</Label>
        <Input
          id="matricule"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="caserne">Caserne</Label>
        <Input
          id="caserne"
          name="caserne"
          value={formData.caserne}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Input
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {personnelToEdit ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default AddPersonnelForm;