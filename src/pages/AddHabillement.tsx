"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AddHabillement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [habillement, setHabillement] = useState({
    article: '',
    description: '',
    taille: '',
    code: '',
    status: 'disponible'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHabillement(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setHabillement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('habillement')
        .insert([{
          article: habillement.article,
          description: habillement.description || null,
          taille: habillement.taille || null,
          code: habillement.code || null,
          status: habillement.status
        }]);

      if (error) throw error;
      
      toast.success('Article d\'habillement ajouté avec succès');
      navigate('/habillement');
    } catch (error) {
      console.error('Error adding habillement:', error);
      toast.error('Erreur lors de l\'ajout de l\'article d\'habillement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un article d'habillement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="article">Article</Label>
              <Input
                id="article"
                name="article"
                value={habillement.article}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={habillement.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="taille">Taille</Label>
                <Input
                  id="taille"
                  name="taille"
                  value={habillement.taille}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={habillement.code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                name="status" 
                value={habillement.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="attribue">Attribué</SelectItem>
                  <SelectItem value="en_reparation">En réparation</SelectItem>
                  <SelectItem value="hors_service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/habillement')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter l\'article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHabillement;