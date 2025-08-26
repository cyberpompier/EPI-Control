"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { EPI } from '@/types/epi';
import ControleForm from '@/components/controle/ControleForm';
import { useSession } from '@/components/auth/SessionProvider';

const ControleFormPage = () => {
  const navigate = useNavigate();
  const { session } = useSession(); // Fixed: use session instead of user
  const { toast } = useToast();
  const { epiId } = useParams<{ epiId: string }>();
  const [epi, setEpi] = useState<EPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (epiId) {
      fetchEPI();
    }
  }, [epiId]);

  const fetchEPI = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('id', epiId)
        .single();

      if (error) throw error;
      setEpi(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'équipement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      
      // Add controleur_id to the form data
      const controleData = {
        ...formData,
        controleur_id: session?.user?.id // Use session.user.id instead of user.id
      };

      const { error } = await supabase
        .from('controles')
        .insert(controleData);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Contrôle enregistré avec succès"
      });

      navigate('/controles');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le contrôle",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/epi');
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!epi) {
    return <div className="p-4">Équipement non trouvé</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Nouveau contrôle</h1>
      <ControleForm 
        epi={epi} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
};

export default ControleFormPage;