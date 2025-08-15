"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EPICard from '@/components/epi/EPICard';
import { ArrowLeft, User } from 'lucide-react';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  matricule?: string;
  caserne?: string;
  grade?: string;
  photo?: string;
}

interface EPI {
  id: string;
  type: string;
  marque?: string;
  modele?: string;
  numero_serie: string;
  date_mise_en_service?: string;
  statut: string;
  image?: string;
}

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [equipements, setEquipements] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPersonnel();
      fetchEquipements();
    }
  }, [id]);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPersonnel(data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const fetchEquipements = async () => {
    try {
      const { data, error } = await supabase
        .from('equipements')
        .select('*')
        .eq('personnel_id', id);

      if (error) throw error;
      setEquipements(data || []);
    } catch (error) {
      console.error('Error fetching equipements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (epiId: string) => {
    navigate(`/equipements/${epiId}/edit`);
  };

  const handleViewHistory = (epiId: string) => {
    navigate(`/equipements/${epiId}/historique`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Détails du personnel</h1>
      </div>

      {personnel && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              {personnel.photo ? (
                <img 
                  src={personnel.photo} 
                  alt={`${personnel.prenom} ${personnel.nom}`} 
                  className="w-24 h-24 rounded-full object-cover mr-6"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6">
                  <User className="text-gray-500" size={48} />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{personnel.prenom} {personnel.nom}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personnel.matricule && (
                    <div>
                      <p className="text-sm text-gray-500">Matricule</p>
                      <p className="font-medium">{personnel.matricule}</p>
                    </div>
                  )}
                  {personnel.grade && (
                    <div>
                      <p className="text-sm text-gray-500">Grade</p>
                      <p className="font-medium">{personnel.grade}</p>
                    </div>
                  )}
                  {personnel.caserne && (
                    <div>
                      <p className="text-sm text-gray-500">Caserne</p>
                      <p className="font-medium">{personnel.caserne}</p>
                    </div>
                  )}
                  {personnel.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{personnel.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Équipements assignés</CardTitle>
        </CardHeader>
        <CardContent>
          {equipements.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun équipement assigné à ce membre du personnel</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipements.map((epi) => (
                <EPICard
                  key={epi.id}
                  id={epi.id}
                  type={epi.type}
                  marque={epi.marque}
                  modele={epi.modele}
                  numeroSerie={epi.numero_serie}
                  dateMiseEnService={epi.date_mise_en_service}
                  statut={epi.statut}
                  image={epi.image}
                  onEdit={handleEdit}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelDetail;