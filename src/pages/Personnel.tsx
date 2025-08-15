"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PersonnelItem {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  matricule?: string;
  caserne?: string;
  grade?: string;
  photo?: string;
}

const Personnel = () => {
  const [personnel, setPersonnel] = useState<PersonnelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast.error('Erreur lors du chargement du personnel');
    } finally {
      setLoading(false);
    }
  };

  const filteredPersonnel = personnel.filter(member =>
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.matricule && member.matricule.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personnel</h1>
        <Button onClick={() => navigate('/personnel/ajouter')}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par nom, prénom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {filteredPersonnel.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun membre du personnel trouvé</p>
          <Button onClick={() => navigate('/personnel/ajouter')}>
            Ajouter votre premier membre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonnel.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={`${member.prenom} ${member.nom}`} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
<dyad-write path="src/pages/Personnel.tsx" description="Compléter le composant Personnel">
"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PersonnelItem {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  matricule?: string;
  caserne?: string;
  grade?: string;
  photo?: string;
}

const Personnel = () => {
  const [personnel, setPersonnel] = useState<PersonnelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast.error('Erreur lors du chargement du personnel');
    } finally {
      setLoading(false);
    }
  };

  const filteredPersonnel = personnel.filter(member =>
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.matricule && member.matricule.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personnel</h1>
        <Button onClick={() => navigate('/personnel/ajouter')}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par nom, prénom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {filteredPersonnel.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun membre du personnel trouvé</p>
          <Button onClick={() => navigate('/personnel/ajouter')}>
            Ajouter votre premier membre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonnel.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={`${member.prenom} ${member.nom}`} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-gray-500 font-bold">
                        {member.prenom?.charAt(0)}{member.nom?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {member.prenom} {member.nom}
                    </h3>
                    {member.grade && (
                      <p className="text-sm text-gray-600">{member.grade}</p>
                    )}
                    {member.matricule && (
                      <p className="text-sm text-gray-500">Matricule: {member.matricule}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/personnel/${member.id}`)}
                  >
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Personnel;