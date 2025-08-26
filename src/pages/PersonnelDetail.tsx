"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Pompier, EPI } from '@/types/index';
import { ArrowLeft, Mail, MapPin, Shield, Plus, FileText, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EPICard from '@/components/epi/EPICard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PersonnelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pompier, setPompier] = useState<Pompier | null>(null);
  const [equipements, setEquipements] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPompierDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch pompier details
        const { data: pompierData, error: pompierError } = await supabase
          .from('personnel')
          .select('*')
          .eq('id', id)
          .single();

        if (pompierError) throw pompierError;
        setPompier(pompierData);

        // Fetch associated EPIs
        const { data: epiData, error: epiError } = await supabase
          .from('equipements')
          .select('*')
          .eq('personnel_id', id);

        if (epiError) throw epiError;
        setEquipements(epiData || []);
      } catch (error) {
        console.error('Error fetching pompier details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPompierDetails();
  }, [id]);

  const stats = {
    total: equipements.length,
    conformes: equipements.filter(e => e.statut === 'en_service').length,
    nonConformes: equipements.filter(e => e.statut === 'hors_service').length,
    enAttente: equipements.filter(e => e.statut === 'en_reparation').length
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!pompier) {
    return <div className="p-4">Pompier non trouvé</div>;
  }

  return (
    <div className="p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/personnel')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={pompier.photo} alt={`${pompier.prenom} ${pompier.nom}`} />
                <AvatarFallback>
                  {pompier.prenom.charAt(0)}{pompier.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{pompier.prenom} {pompier.nom}</h1>
                <p className="text-gray-500">Matricule: {pompier.matricule}</p>
              </div>
            </div>
            <Button onClick={() => navigate(`/personnel/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-gray-500" />
              <span>{pompier.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <span>{pompier.caserne}</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-gray-500" />
              <span>{pompier.grade}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-500">Équipements assignés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.conformes}</div>
            <p className="text-sm text-gray-500">En service</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.nonConformes}</div>
            <p className="text-sm text-gray-500">Hors service</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Équipements assignés</h2>
        <Button onClick={() => navigate(`/personnel/${id}/assigner-epi`)}>
          <Plus className="mr-2 h-4 w-4" />
          Assigner un EPI
        </Button>
      </div>

      {equipements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">Aucun équipement assigné</h3>
            <p className="mt-1 text-sm text-gray-500">
              Ce pompier n'a pas encore d'équipements assignés.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate(`/personnel/${id}/assigner-epi`)}
            >
              Assigner un EPI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipements.map(epi => <EPICard key={epi.id} epi={epi} />)}
        </div>
      )}
    </div>
  );
};

export default PersonnelDetail;