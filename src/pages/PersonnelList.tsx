"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const PersonnelList = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .order('nom');

    if (error) {
      console.error('Error fetching personnel:', error);
    } else {
      setPersonnel(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste du Personnel</h1>
        <Link to="/personnel/new">
          <Button>Ajouter du Personnel</Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Prénom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Matricule</th>
              <th className="py-3 px-4 text-left">Grade</th>
              <th className="py-3 px-4 text-left">Caserne</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person) => (
              <tr key={person.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{person.nom}</td>
                <td className="py-3 px-4">{person.prenom}</td>
                <td className="py-3 px-4">{person.email}</td>
                <td className="py-3 px-4">{person.matricule}</td>
                <td className="py-3 px-4">{person.grade}</td>
                <td className="py-3 px-4">{person.caserne}</td>
                <td className="py-3 px-4">
                  <Link to={`/personnel/edit/${person.id}`}>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonnelList;