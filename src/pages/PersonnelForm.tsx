"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getInitials } from '@/lib/utils';

interface Personnel {
  id?: number;
  nom: string;
  prenom: string;
  email: string | null;
  caserne: string | null;
  grade: string | null;
  photo: string | null;
  matricule: string | null;
}

const PersonnelForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<Personnel>({
    nom: '',
    prenom: '',
    email: null,
    caserne: null,
    grade: null,
    photo: null,
    matricule: null
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchPersonnel();
    }
  }, [isEdit, id]);

  const fetchPersonnel = async () => {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Erreur lors du chargement du personnel');
      console.error(error);
    } else {
      setFormData(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSelectChange = (name: keyof Personnel, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('personnel')
          .update(formData)
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Personnel mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('personnel')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Personnel créé avec succès');
      }
      
      navigate('/personnel');
    } catch (error) {
      console.error('Error saving personnel:', error);
      toast.error(isEdit 
        ? 'Erreur lors de la mise à jour du personnel' 
        : 'Erreur lors de la création du personnel'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? 'Modifier le Personnel' : 'Ajouter un Personnel'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    name="matricule"
                    value={formData.matricule || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="caserne">Caserne</Label>
                  <Select 
                    value={formData.caserne || 'none'} 
                    onValueChange={(value) => handleSelectChange('caserne', value === 'none' ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une caserne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Aucune --</SelectItem>
                      <SelectItem value="Centre">Centre</SelectItem>
                      <SelectItem value="Nord">Nord</SelectItem>
                      <SelectItem value="Sud">Sud</SelectItem>
                      <SelectItem value="Est">Est</SelectItem>
                      <SelectItem value="Ouest">Ouest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select 
                    value={formData.grade || 'none'} 
                    onValueChange={(value) => handleSelectChange('grade', value === 'none' ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Aucun --</SelectItem>
                      <SelectItem value="Pompier">Pompier</SelectItem>
                      <SelectItem value="Caporal">Caporal</SelectItem>
                      <SelectItem value="Sergent">Sergent</SelectItem>
                      <SelectItem value="Adjudant">Adjudant</SelectItem>
                      <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                      <SelectItem value="Capitaine">Capitaine</SelectItem>
                      <SelectItem value="Commandant">Commandant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/personnel')}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PersonnelForm;