"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface EPI {
  id?: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  statut: string;
  date_mise_en_service: string | null;
  personnel_id: number | null;
  personnel: Personnel | null;
  image?: string | null;
  date_fin_vie?: string | null;
  observations?: string | null;
}

const EquipementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<EPI>({
    type: '',
    marque: null,
    modele: null,
    numero_serie: '',
    statut: 'en_attente',
    date_mise_en_service: null,
    personnel_id: null,
    personnel: null,
    image: null,
    date_fin_vie: null,
    observations: null
  });
  
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPersonnel();
    
    if (!isNew && id) {
      fetchEquipment();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const fetchPersonnel = async () => {
    const { data, error } = await supabase
      .from('personnel')
      .select('id, nom, prenom')
      .order('nom');
    
    if (error) {
      toast.error("Erreur lors du chargement du personnel");
      console.error(error);
    } else {
      setPersonnelList(data || []);
    }
  };

  const fetchEquipment = async () => {
    if (!id || id === 'new') return;
    
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        personnel (id, nom, prenom)
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Erreur lors du chargement de l'équipement");
      console.error(error);
    } else {
      setFormData({
        ...data,
        personnel_id: data.personnel?.id || null,
        personnel: data.personnel || null
      });
    }
    setLoading(false);
  };

  const handleChange = (field: keyof EPI, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        // Création d'un nouvel équipement
        const { data, error } = await supabase
          .from('equipements')
          .insert([{
            type: formData.type,
            marque: formData.marque,
            modele: formData.modele,
            numero_serie: formData.numero_serie,
            statut: formData.statut,
            date_mise_en_service: formData.date_mise_en_service,
            personnel_id: formData.personnel_id,
            date_fin_vie: formData.date_fin_vie,
            observations: formData.observations
          }])
          .select()
          .single();

        if (error) throw error;

        toast.success("Équipement créé avec succès");
        navigate(`/equipements/${data.id}`);
      } else {
        // Mise à jour d'un équipement existant
        const { data, error } = await supabase
          .from('equipements')
          .update({
            type: formData.type,
            marque: formData.marque,
            modele: formData.modele,
            numero_serie: formData.numero_serie,
            statut: formData.statut,
            date_mise_en_service: formData.date_mise_en_service,
            personnel_id: formData.personnel_id,
            date_fin_vie: formData.date_fin_vie,
            observations: formData.observations
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        toast.success("Équipement mis à jour avec succès");
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error(isNew 
        ? "Erreur lors de la création de l'équipement" 
        : "Erreur lors de la mise à jour de l'équipement"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-800 mb-4">Chargement...</div>
          <Button onClick={() => navigate('/equipements')}>Retour à la liste</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/equipements')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Nouvel Équipement' : 'Détails de l\'Équipement'}
          </h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'Équipement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="numero_serie">Numéro de série *</Label>
                  <Input
                    id="numero_serie"
                    value={formData.numero_serie}
                    onChange={(e) => handleChange('numero_serie', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="marque">Marque</Label>
                  <Input
                    id="marque"
                    value={formData.marque || ''}
                    onChange={(e) => handleChange('marque', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="modele">Modèle</Label>
                  <Input
                    id="modele"
                    value={formData.modele || ''}
                    onChange={(e) => handleChange('modele', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select 
                    value={formData.statut} 
                    onValueChange={(value) => handleChange('statut', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_service">En service</SelectItem>
                      <SelectItem value="en_reparation">En réparation</SelectItem>
                      <SelectItem value="hors_service">Hors service</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date_mise_en_service">Date de mise en service</Label>
                  <div className="relative">
                    <Input
                      id="date_mise_en_service"
                      type="date"
                      value={formData.date_mise_en_service || ''}
                      onChange={(e) => handleChange('date_mise_en_service', e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="date_fin_vie">Date de fin de vie</Label>
                  <div className="relative">
                    <Input
                      id="date_fin_vie"
                      type="date"
                      value={formData.date_fin_vie || ''}
                      onChange={(e) => handleChange('date_fin_vie', e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="personnel">Assigné à</Label>
                  <Select 
                    value={formData.personnel_id?.toString() || 'none'} 
                    onValueChange={(value) => handleChange('personnel_id', value === 'none' ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un personnel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Non assigné</SelectItem>
                      {personnelList.map((person) => (
                        <SelectItem key={person.id} value={person.id.toString()}>
                          {person.prenom} {person.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="observations">Observations</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations || ''}
                    onChange={(e) => handleChange('observations', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {formData.image && (
              <div className="mt-6">
                <Label>Image</Label>
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Équipement" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EquipementDetail;