"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Search, 
  PlusCircle,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  grade: string;
  caserne: string;
  matricule: string;
  photo?: string;
}

const PersonnelList = () => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  useEffect(() => {
    const filtered = personnelList.filter(person => 
      person.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.caserne.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonnel(filtered);
  }, [searchTerm, personnelList]);

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      
      setPersonnelList(data || []);
      setFilteredPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personnel</h1>
          <p className="mt-2 text-gray-600">
            Gérez les membres de votre équipe
          </p>
        </div>
        <Button asChild>
          <Link to="/personnel/form">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un membre
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, prénom, grade, caserne ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredPersonnel.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun personnel trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Aucun résultat ne correspond à votre recherche.' : 'Commencez par ajouter un membre à votre équipe.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/personnel/form">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un membre
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonnel.map((person) => (
                <Card key={person.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {person.photo ? (
                          <img 
                            src={person.photo} 
                            alt={`${person.prenom} ${person.nom}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                            <User className="text-gray-500 h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {person.prenom} {person.nom}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{person.grade}</p>
                        <p className="text-sm text-gray-500 truncate">{person.caserne}</p>
                        <p className="text-sm text-gray-500 truncate">Matricule: {person.matricule}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to={`/personnel/${person.id}`}>Voir</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to={`/personnel/${person.id}/edit`}>Modifier</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelList;