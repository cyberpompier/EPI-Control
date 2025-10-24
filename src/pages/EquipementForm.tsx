"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, ClipboardCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Personnel = {
  id: number;
  nom: string;
  prenom: string;
};

type Controle = {
  id: string;
  date_controle: string;
  resultat: string;
  date_prochaine_verification: string | null;
};

export default function EquipementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [dernierControle, setDernierControle] = useState<Controle | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    marque: '',
    modele: '',
    numero_serie: '',
    date_mise_en_service: '',
    date_fin_vie: '',
    personnel_id: '',
    statut: 'en_attente',
  });

  useEffect(() => {
    loadPersonnel();
    if (id) {
      loadEquipement();
      loadDernierControle();
    }
  }, [id]);

  const loadPersonnel = async () => {
    const { data, error } = await supabase
      .from('personnel')
      .select('id, nom, prenom')
      .order('nom');

    if (error) {
      console.error('Erreur lors du chargement du personnel:', error);
    } else {
      setPersonnel(data || []);
    }
  };

  const loadEquipement = async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors du chargement de l\'équipement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'équipement",
        variant: "destructive",
      });
      navigate('/equipements');
      return;
    }

    setFormData({
      type: data.type || '',
      marque: data.marque || '',
      modele: data.modele || '',
      numero_serie: data.numero_serie || '',
      date_mise_en_service: data.date_mise_en_service || '',
      date_fin_vie: data.date_fin_vie || '',
      personnel_id: data.personnel_id?.toString() || '',
      statut: data.statut || 'en_attente',
    });
  };

  const loadDernierControle = async () => {
    const { data, error } = await supabase
      .from('controles')
      .select('id, date_controle, resultat, date_prochaine_verification')
      .eq('equipement_id', id)
      .order('date_controle', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setDernierControle(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const equipementData = {
        type: formData.type,
        marque: formData.marque || null,
        modele: formData.modele || null,
        numero_serie: formData.numero_serie,
        date_mise_en_service: formData.date_mise_en_service || null,
        date_fin_vie: formData.date_fin_vie || null,
        personnel_id: formData.personnel_id ? parseInt(formData.personnel_id) : null,
        statut: formData.statut,
      };

      if (id) {
        const { error } = await supabase
          .from('equipements')
          .update(equipementData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "L'équipement a été modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from('equipements')
          .insert([equipementData]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "L'équipement a été ajouté avec succès",
        });
      }

      navigate('/equipements');
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer l'équipement: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getResultatBadge = (resultat: string) => {
    const resultMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      conforme: { label: 'Conforme', variant: 'default' },
      non_conforme: { label: 'Non conforme', variant: 'destructive' },
      reforme: { label: 'À réformer', variant: 'destructive' },
    };

    const result = resultMap[resultat] || { label: resultat, variant: 'secondary' };
    return <Badge variant={result.variant}>{result.label}</Badge>;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate('/equipements')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {id && dernierControle && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                Informations de contrôle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dernier contrôle</p>
                  <p className="font-medium">{formatDate(dernierControle.date_controle)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Résultat</p>
                  <div className="mt-1">{getResultatBadge(dernierControle.resultat)}</div>
                </div>
              </div>
              {dernierControle.date_prochaine_verification && (
                <div>
                  <p className="text-sm text-muted-foreground">Prochain contrôle prévu</p>
                  <p className="font-medium text-orange-600">
                    {formatDate(dernierControle.date_prochaine_verification)}
                  </p>
                </div>
              )}
              <Button
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => navigate(`/controle/${id}`)}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Effectuer un nouveau contrôle
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Modifier un équipement' : 'Ajouter un équipement'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type d'équipement *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  placeholder="Ex: Casque F1, ARI, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marque">Marque</Label>
                  <Input
                    id="marque"
                    value={formData.marque}
                    onChange={(e) => handleChange('marque', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modele">Modèle</Label>
                  <Input
                    id="modele"
                    value={formData.modele}
                    onChange={(e) => handleChange('modele', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_serie">Numéro de série *</Label>
                <Input
                  id="numero_serie"
                  value={formData.numero_serie}
                  onChange={(e) => handleChange('numero_serie', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_mise_en_service">Date de mise en service</Label>
                  <Input
                    id="date_mise_en_service"
                    type="date"
                    value={formData.date_mise_en_service}
                    onChange={(e) => handleChange('date_mise_en_service', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_fin_vie">Date de fin de vie</Label>
                  <Input
                    id="date_fin_vie"
                    type="date"
                    value={formData.date_fin_vie}
                    onChange={(e) => handleChange('date_fin_vie', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personnel_id">Attribué à</Label>
                <Select
                  value={formData.personnel_id}
                  onValueChange={(value) => handleChange('personnel_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pompier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non attribué</SelectItem>
                    {personnel.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.prenom} {p.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleChange('statut', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_service">En service</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_maintenance">En maintenance</SelectItem>
                    <SelectItem value="reforme">Réformé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate('/equipements')}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? "Enregistrement..." : id ? "Modifier" : "Ajouter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}