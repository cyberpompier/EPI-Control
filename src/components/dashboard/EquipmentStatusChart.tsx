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

interface EquipmentStatusData {
  name: string;
  en_service: number;
  en_reparation: number;
  hors_service: number;
}

const EquipmentStatusChart = () => {
  const [chartData, setChartData] = useState<EquipmentStatusData[]>([]);

  useEffect(() => {
    // In a real app, this data would come from an API
    // For now, we'll use mock data
    const mockData: EquipmentStatusData[] = [
      { name: 'Casques', en_service: 45, en_reparation: 3, hors_service: 2 },
      { name: 'Gants', en_service: 120, en_reparation: 8, hors_service: 5 },
      { name: 'Vestes', en_service: 78, en_reparation: 4, hors_service: 3 },
      { name: 'Bottes', en_service: 65, en_reparation: 2, hors_service: 1 },
      { name: 'Lunettes', en_service: 95, en_reparation: 5, hors_service: 2 },
      { name: 'Harnais', en_service: 40, en_reparation: 1, hors_service: 0 },
    ];
    
    setChartData(mockData);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Statut des Équipements</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
        <p>Visualisation du statut actuel de tous les équipements</p>
      </div>
    </div>
  );
};

export default EquipmentStatusChart;