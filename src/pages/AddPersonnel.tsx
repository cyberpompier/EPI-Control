"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AddPersonnel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [personnel, setPersonnel] = useState({
    nom: '',
    prenom: '',
    email: '',
    matricule: '',
    caserne: '',
    grade: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonnel(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('personnel')
        .insert([{
          nom: personnel.nom,
          prenom: personnel.prenom,
          email: personnel.email,
          matricule: personnel.matricule,
          caserne: personnel.caserne,
          grade: personnel.grade
        }]);

      if (error) throw error;
      
      toast.success('Personnel ajouté avec succès');
      navigate('/personnel');
    } catch (error) {
      console.error('Error adding personnel:', error);
      toast.error('Erreur lors de l\'ajout du personnel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un membre du personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={personnel.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={personnel.prenom}
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
                value={personnel.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  name="matricule"
                  value={personnel.matricule}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="caserne">Caserne</Label>
                <Input
                  id="caserne"
                  name="caserne"
                  value={personnel.caserne}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                name="grade"
                value={personnel.grade}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/personnel')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter le personnel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPersonnel;