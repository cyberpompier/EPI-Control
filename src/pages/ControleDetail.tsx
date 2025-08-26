"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Shield,
  FileText
} from 'lucide-react';
import PDFGenerator from '@/components/pdf/PDFGenerator';

const ControleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [controle, setControle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchControle();
  }, [id]);

  const fetchControle = async () => {
    try {
      const { data, error } = await supabase
        .from('controles')
        .select(`
          *,
          equipements (
            *,
            personnel (*)
          ),
          profiles (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setControle(data);
    } catch (error) {
      console.error('Error fetching controle:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultatColor = (resultat: string) => {
    switch (resultat) {
      case 'conforme': return 'bg-green-100 text-green-800';
      case 'non_conforme': return 'bg-red-100 text-red-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultatIcon = (resultat: string) => {
    switch (resultat) {
      case 'conforme': return <CheckCircle className="h-4 w-4" />;
      case 'non_conforme': return <XCircle className="h-4 w-4" />;
      case 'en_attente': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!controle) {
    return <div className="p-4">Contrôle non trouvé</div>;
  }

  return (
    <div className="p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/controles')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Détails du contrôle
            </CardTitle>
            <Badge className={getResultatColor(controle.resultat)}>
              <span className="flex items-center">
                {getResultatIcon(controle.resultat)}
                <span className="ml-1">
                  {controle.resultat === 'conforme' && 'Conforme'}
                  {controle.resultat === 'non_conforme' && 'Non conforme'}
                  {controle.resultat === 'en_attente' && 'En attente'}
                </span>
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Équipement contrôlé</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {controle.equipements?.type}</p>
                <p><span className="font-medium">Marque:</span> {controle.equipements?.marque}</p>
                <p><span className="font-medium">Modèle:</span> {controle.equipements?.modele}</p>
                <p><span className="font-medium">N° de série:</span> {controle.equipements?.numero_serie}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Informations du contrôle</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Date: {formatDate(controle.date_controle)}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    Contrôleur: {controle.profiles?.first_name} {controle.profiles?.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Observations</h3>
            <p className="bg-gray-50 p-3 rounded-md">
              {controle.observations || 'Aucune observation'}
            </p>
          </div>
          
          {controle.actions_correctives && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Actions correctives</h3>
              <p className="bg-gray-50 p-3 rounded-md">
                {controle.actions_correctives}
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <PDFGenerator 
              controle={controle}
              epi={controle.equipements}
              pompier={controle.equipements.personnel}
              controleur={controle.profiles} // This is now correctly typed
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControleDetail;