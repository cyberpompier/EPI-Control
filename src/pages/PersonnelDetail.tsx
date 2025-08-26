"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { EPICard } from '@/components/epi/EPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, User, Mail, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string | null;
  caserne: string | null;
  grade: string | null;
  photo: string | null;
  matricule: string | null;
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
}

const PersonnelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [epis, setEpis] = useState<EPI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPersonnel();
      fetchEPIS();
    }
  }, [id]);

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
      setPersonnel(data);
    }
  };

  const fetchEPIS = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        personnel (id, nom, prenom)
      `)
      .eq('personnel_id', id)
      .order('type');

    if (error) {
      toast.error('Erreur lors du chargement des EPI');
      console.error(error);
    } else {
      setEpis(data || []);
    }
    setLoading(false);
  };

  const handleEPIUpdate = (updatedEPI: EPI) => {
    setEpis(prev => prev.map(epi => epi.id === updatedEPI.id ? updatedEPI : epi));
  };

  const filteredEpis = epis.filter(epi =>
    epi.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!personnel) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête du personnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {personnel.photo ? (
                  <img 
                    src={personnel.photo} 
                    alt={`${personnel.prenom} ${personnel.nom}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{personnel.prenom} {personnel.nom}</h1>
                  <p className="text-gray-600">Détails du personnel</p>
                </div>
              </div>
              <Badge variant="secondary">
                {personnel.grade || 'Non spécifié'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{personnel.email || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Caserne</p>
                  <p>{personnel.caserne || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Matricule</p>
                  <p>{personnel.matricule || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Équipements</p>
                  <p className="font-semibold">{epis.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section des EPI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <span>Équipements assignés</span>
                <Badge className="ml-2" variant="secondary">
                  {filteredEpis.length}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un EPI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel EPI
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Chargement des équipements...</p>
              </div>
            ) : filteredEpis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Aucun équipement ne correspond à votre recherche" 
                    : "Aucun équipement assigné à ce personnel"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEpis.map((epi) => (
                  <EPICard 
                    key={epi.id} 
                    epi={epi} 
                    onUpdate={handleEPIUpdate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PersonnelDetail;