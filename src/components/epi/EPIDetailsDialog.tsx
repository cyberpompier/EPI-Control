"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface EPI {
  id: string;
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

interface EPIDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  epi: EPI;
  onUpdate: (updatedEPI: EPI) => void;
}

export function EPIDetailsDialog({ isOpen, onClose, epi, onUpdate }: EPIDetailsDialogProps) {
  const [formData, setFormData] = useState<EPI>(epi);
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(epi);
  }, [epi]);

  useEffect(() => {
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

    if (isOpen) {
      fetchPersonnel();
    }
  }, [isOpen]);

  const handleChange = (field: keyof EPI, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
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
        .eq('id', formData.id)
        .select(`
          *,
          personnel (id, nom, prenom)
        `)
        .single();

      if (error) throw error;

      if (data) {
        onUpdate(data);
        toast.success("Équipement mis à jour avec succès");
        onClose();
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast.error("Erreur lors de la mise à jour de l'équipement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l&apos;Équipement</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="numero_serie">Numéro de série</Label>
              <Input
                id="numero_serie"
                value={formData.numero_serie}
                onChange={(e) => handleChange('numero_serie', e.target.value)}
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
                value={formData.personnel_id?.toString() || ''} 
                onValueChange={(value) => handleChange('personnel_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un personnel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non assigné</SelectItem>
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
          <div className="mt-4">
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}