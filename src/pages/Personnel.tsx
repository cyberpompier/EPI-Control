"use client";

import Layout from '@/components/layout/Layout';
import { useGetPersonnel } from '@/hooks/usePersonnel';

const Personnel = () => {
  const { data: personnel, isLoading } = useGetPersonnel();

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-gray-600">Gestion des sapeurs-pompiers et de leurs équipements</p>
        </div>
      </div>

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personnel?.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium">{person.nom} {person.prenom}</h3>
              <p className="text-sm text-gray-500">{person.grade}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Personnel;