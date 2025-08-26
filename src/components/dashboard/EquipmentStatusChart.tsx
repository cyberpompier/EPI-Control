"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentStatusData {
  name: string;
  en_service: number;
  en_reparation: number;
  hors_service: number;
}

const EquipmentStatusChart = () => {
  const [chartData, setChartData] = useState<EquipmentStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching equipment data...');
        // Récupérer tous les équipements
        const { data: equipements, error } = await supabase
          .from('equipements')
          .select('type, statut');
        
        console.log('Equipment data fetched count:', equipements?.length);
        console.log('Sample equipment data:', equipements?.slice(0, 5));
        console.log('Error:', error);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (!equipements || equipements.length === 0) {
          console.log('No equipment data returned');
          setChartData([]);
          setLoading(false);
          return;
        }
        
        // Traiter les données pour les regrouper par type et statut
        const processedData: Record<string, EquipmentStatusData> = {};
        
        equipements.forEach(item => {
          const type = item.type || 'Non spécifié';
          const statut = item.statut;
          
          console.log('Processing item:', { type, statut });
          
          if (!processedData[type]) {
            processedData[type] = {
              name: type,
              en_service: 0,
              en_reparation: 0,
              hors_service: 0
            };
            console.log('Created new entry for type:', type);
          }
          
          switch (statut) {
            case 'en_service':
              processedData[type].en_service += 1;
              console.log(`Incremented en_service for ${type}:`, processedData[type].en_service);
              break;
            case 'en_reparation':
              processedData[type].en_reparation += 1;
              console.log(`Incremented en_reparation for ${type}:`, processedData[type].en_reparation);
              break;
            case 'hors_service':
              processedData[type].hors_service += 1;
              console.log(`Incremented hors_service for ${type}:`, processedData[type].hors_service);
              break;
            default:
              console.log('Unknown status:', statut);
              // Pour les statuts non reconnus
              break;
          }
        });
        
        // Convertir l'objet en tableau et limiter à 10 types pour une meilleure lisibilité
        const result = Object.values(processedData)
          .filter(item => (item.en_service + item.en_reparation + item.hors_service) > 0)
          .sort((a, b) => (b.en_service + b.en_reparation + b.hors_service) - (a.en_service + a.en_reparation + a.hors_service))
          .slice(0, 10);
        
        console.log('Final processed data (top 10):', result);
        setChartData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching equipment data:', err);
        setError(`Erreur lors du chargement des données: ${err.message || err}`);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Statut des Équipements</h2>
        <div className="h-80 flex items-center justify-center">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Statut des Équipements</h2>
        <div className="h-80 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Si aucune donnée n'est présente
  if (chartData.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Statut des Équipements</h2>
        <div className="h-80 flex items-center justify-center">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  console.log('Rendering chart with data:', chartData);

  return (
    <div className="p-4 bg-white rounded-lg shadow w-full">
      <h2 className="text-xl font-bold mb-4">Statut des Équipements</h2>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Quantité']}
              labelFormatter={(name) => `Type: ${name}`}
            />
            <Legend />
            <Bar 
              dataKey="en_service" 
              name="En service" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="en_reparation" 
              name="En réparation" 
              fill="#F59E0B" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="hors_service" 
              name="Hors service" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Visualisation du statut actuel des équipements (top 10 types)</p>
      </div>
    </div>
  );
};

export default EquipmentStatusChart;