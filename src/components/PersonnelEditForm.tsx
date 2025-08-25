"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface PersonnelEditFormProps {
  personnel: Personnel;
  onSave: (updatedPersonnel: Personnel) => void;
  onCancel: () => void;
}

const PersonnelEditForm: React.FC<PersonnelEditFormProps> = ({ 
  personnel, 
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Personnel>(personnel);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('personnel')
        .update({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          caserne: formData.caserne,
          grade: formData.grade,
          matricule: formData.matricule,
          photo: formData.photo
        })
        .eq('id', formData.id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Personnel mis à jour avec succès');
      onSave(data);
    } catch (error) {
      console.error('Error updating personnel:', error);
      toast.error('Erreur lors de la mise à jour du personnel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricule">Matricule</Label>
          <Input
            id="matricule"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="caserne">Caserne</Label>
        <Input
          id="caserne"
          name="caserne"
          value={formData.caserne}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="photo">URL Photo</Label>
        <Input
          id="photo"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};

export default PersonnelEditForm;